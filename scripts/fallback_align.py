#!/usr/bin/env python3
"""Fallback word timing without ASR.

Silence gaps in the voice-over split it into speech chunks; a monotonic DP maps
contiguous groups of script words onto those chunks (syllable-weighted), then the
word boundaries inside each chunk are snapped to local energy valleys.

Output: src/data/words.json   [{"w": str, "start": sec, "end": sec}, ...]
"""
import json
import os
import re
import subprocess
import sys

import numpy as np
from scipy import signal
from scipy.io import wavfile

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
VO = f"{ROOT}/public/vo.mp3"
SCRIPT = f"{ROOT}/script/naskah.txt"
OUT = f"{ROOT}/src/data/words.json"
WORK = f"{ROOT}/work"
os.makedirs(WORK, exist_ok=True)


def run(cmd):
    return subprocess.run(cmd, capture_output=True, text=True)


def duration():
    r = run(["ffprobe", "-v", "error", "-show_entries", "format=duration", "-of", "csv=p=0", VO])
    return float(r.stdout.strip())


def detect_gaps():
    r = run(["ffmpeg", "-hide_banner", "-nostats", "-i", VO, "-af", "silencedetect=noise=-33dB:d=0.12", "-f", "null", "-"])
    gaps, start = [], None
    for line in r.stderr.splitlines():
        m = re.search(r"silence_start: ([\d.]+)", line)
        if m:
            start = float(m.group(1))
        m = re.search(r"silence_end: ([\d.]+) \| silence_duration: ([\d.]+)", line)
        if m and start is not None:
            gaps.append((start, float(m.group(1)), float(m.group(2))))
            start = None
    return gaps


def weight(tok):
    letters = re.sub(r"[^A-Za-z]", "", tok)
    if len(letters) >= 2 and letters.isupper():
        return float(len(letters))  # acronyms are spelled letter by letter
    return max(1.0, float(len(re.findall(r"[aeiouAEIOU]+", letters))))


def main():
    total = duration()
    text = open(SCRIPT, encoding="utf-8").read().replace("]", "")
    tokens = re.findall(r"\S+", text)
    W = np.array([weight(t) for t in tokens])
    CUM = np.concatenate([[0.0], np.cumsum(W)])
    STRONG = np.array([bool(re.search(r"[.:?!]$|[.:?!][\"”)]$", t)) for t in tokens])
    WEAK = np.array([bool(re.search(r",$", t)) for t in tokens])

    gaps = detect_gaps()
    chunks, cur = [], 0.0
    for s, e, _ in gaps:
        if s - cur > 0.05:
            chunks.append((cur, s))
        cur = e
    if total - cur > 0.05:
        chunks.append((cur, total))
    gap_after = []
    for i in range(len(chunks)):
        g = None
        for s, e, d in gaps:
            if abs(s - chunks[i][1]) < 0.02:
                g = d
        gap_after.append(g)

    dur = np.array([b - a for a, b in chunks])
    nc, nw = len(chunks), len(tokens)
    rate = dur.sum() / CUM[-1]
    print(f"chunks={nc} words={nw} sec/weight={rate:.3f}", file=sys.stderr)

    MAXW, INF = 30, 1e18
    dp = np.full((nc + 1, nw + 1), INF)
    bp = np.zeros((nc + 1, nw + 1), dtype=int)
    dp[0, 0] = 0.0
    for i in range(1, nc + 1):
        d_i, g = dur[i - 1], gap_after[i - 1]
        for k in range(i, nw + 1):
            best, arg = INF, -1
            for kp in range(max(i - 1, k - MAXW), k):
                prev = dp[i - 1, kp]
                if prev >= INF:
                    continue
                exp = rate * (CUM[k] - CUM[kp])
                sigma = 0.25 * d_i + 0.25
                c = ((d_i - exp) / sigma) ** 2
                last = k - 1
                if g is not None:
                    if STRONG[last]:
                        c += 0.0 if g >= 0.25 else 1.2
                    elif WEAK[last]:
                        c += 0.0 if g >= 0.15 else 0.6
                    else:
                        c += 1.0 + (2.5 if g >= 0.4 else 0.0)
                if prev + c < best:
                    best, arg = prev + c, kp
            dp[i, k], bp[i, k] = best, arg
    assert dp[nc, nw] < INF, "alignment failed"
    cuts, k = [nw], nw
    for i in range(nc, 0, -1):
        k = bp[i, k]
        cuts.append(k)
    cuts = cuts[::-1]

    words = []
    for i, (a, b) in enumerate(chunks):
        lo, hi = cuts[i], cuts[i + 1]
        span = CUM[hi] - CUM[lo]
        t = a
        for j in range(lo, hi):
            wd = (b - a) * W[j] / span
            words.append({"w": tokens[j], "start": round(float(t), 3), "end": round(float(t + wd), 3)})
            t += wd

    # ---- snap inner boundaries to energy valleys --------------------------------
    wav = f"{WORK}/vo16.wav"
    run(["ffmpeg", "-y", "-loglevel", "error", "-i", VO, "-ac", "1", "-ar", "16000", wav])
    sr, x = wavfile.read(wav)
    x = x.astype(np.float32) / 32768
    b, a = signal.butter(4, [250, 3500], btype="band", fs=sr)
    env = np.abs(signal.hilbert(signal.filtfilt(b, a, x)))
    bl, al = signal.butter(2, 9, btype="low", fs=sr)
    em = signal.filtfilt(bl, al, env)[::80]
    fs = sr / 80
    shifts = []
    for i, (a0, b0) in enumerate(chunks):
        lo, hi = cuts[i], cuts[i + 1]
        if hi - lo < 2:
            continue
        mx = em[int(a0 * fs): int(b0 * fs) + 1].max() + 1e-9
        prev = a0
        for j in range(lo + 1, hi):
            t = words[j]["start"]
            w0, w1 = max(a0 + 0.05, t - 0.14), min(b0 - 0.05, t + 0.14)
            i0, i1 = int(w0 * fs), int(w1 * fs)
            if i1 <= i0 + 2:
                continue
            win = em[i0:i1] / mx
            ts = np.arange(i0, i1) / fs
            tn = float(ts[int(np.argmin(win + 0.9 * np.abs(ts - t)))])
            tn = max(tn, prev + 0.09)
            shifts.append(tn - t)
            words[j]["start"] = round(tn, 3)
            words[j - 1]["end"] = round(tn, 3)
            prev = tn
    s = np.array(shifts) if shifts else np.zeros(1)
    print(f"snapped {len(shifts)} boundaries, mean |shift| {np.abs(s).mean():.3f}s", file=sys.stderr)

    os.makedirs(os.path.dirname(OUT), exist_ok=True)
    json.dump(words, open(OUT, "w", encoding="utf-8"), ensure_ascii=False, indent=0)
    json.dump(words, open(f"{ROOT}/src/data/words.fallback.json", "w", encoding="utf-8"), ensure_ascii=False, indent=0)
    print(f"wrote {OUT} ({len(words)} words, end {words[-1]['end']:.2f}s)", file=sys.stderr)


if __name__ == "__main__":
    main()
