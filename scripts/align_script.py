#!/usr/bin/env python3
"""Map the written script onto ASR word timestamps.

The subtitle text always comes from script/naskah.txt (correct spelling); the TIMES
come from the recogniser. A monotonic DP aligns script tokens to runs of 1-4 ASR words
(handles split/merged words and spelled-out acronyms). Script tokens the recogniser
missed are interpolated between their anchored neighbours.

Usage: align_script.py [asr.json] [out.json]
Writes out.json only when enough of the script was anchored; otherwise exits 2 and
leaves the previous (fallback) timing untouched.
"""
import json
import os
import re
import sys

from functools import lru_cache

import numpy as np

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
ASR = sys.argv[1] if len(sys.argv) > 1 else f"{ROOT}/work/asr.json"
OUT = sys.argv[2] if len(sys.argv) > 2 else f"{ROOT}/src/data/words.json"
SCRIPT = f"{ROOT}/script/naskah.txt"
MIN_ANCHORED = 0.70


def norm(s):
    return re.sub(r"[^a-z0-9]", "", s.lower())


@lru_cache(maxsize=None)
def lev(a, b):
    if a == b:
        return 0
    if not a or not b:
        return max(len(a), len(b))
    prev = list(range(len(b) + 1))
    for i, ca in enumerate(a, 1):
        cur = [i]
        for j, cb in enumerate(b, 1):
            cur.append(min(prev[j] + 1, cur[j - 1] + 1, prev[j - 1] + (ca != cb)))
        prev = cur
    return prev[-1]


def dist(a, b):
    """normalised edit distance 0..1 (0 identical)."""
    if not a and not b:
        return 0.0
    return lev(a, b) / max(len(a), len(b))


def weight(tok):
    letters = re.sub(r"[^A-Za-z]", "", tok)
    if len(letters) >= 2 and letters.isupper():
        return float(len(letters))
    return max(1.0, float(len(re.findall(r"[aeiouAEIOU]+", letters))))


def main():
    text = open(SCRIPT, encoding="utf-8").read().replace("]", "")
    tokens = re.findall(r"\S+", text)
    S = [norm(t) for t in tokens]
    asr = [a for a in json.load(open(ASR, encoding="utf-8")) if norm(a["word"])]
    A = [norm(a["word"]) for a in asr]
    n, m = len(S), len(A)
    print(f"script tokens {n}, asr words {m}", file=sys.stderr)

    MAXA, SKIP_S, SKIP_A = 4, 0.95, 0.75
    INF = 1e18
    dp = np.full((n + 1, m + 1), INF)
    bp = {}
    dp[0, 0] = 0.0
    # allow free leading/trailing ASR junk by pricing skips normally
    BAND = 70  # script and recogniser never drift further apart than this many words
    for i in range(n + 1):
        centre = int(i * m / max(n, 1))
        for j in range(max(0, centre - BAND), min(m, centre + BAND) + 1):
            cur = dp[i, j]
            if cur >= INF:
                continue
            if j < m and cur + SKIP_A < dp[i, j + 1]:
                dp[i, j + 1] = cur + SKIP_A
                bp[(i, j + 1)] = (i, j, "a")
            if i < n:
                if cur + SKIP_S < dp[i + 1, j]:
                    dp[i + 1, j] = cur + SKIP_S
                    bp[(i + 1, j)] = (i, j, "s")
                # script token i  <->  ASR words j..j+k-1
                cat = ""
                for k in range(1, MAXA + 1):
                    if j + k > m:
                        break
                    cat += A[j + k - 1]
                    c = dist(S[i], cat) + 0.12 * (k - 1)
                    if c < 0.85 and cur + c < dp[i + 1, j + k]:
                        dp[i + 1, j + k] = cur + c
                        bp[(i + 1, j + k)] = (i, j, ("m", k))
                # script tokens i,i+1  <->  one ASR word
                if i + 1 < n and j < m:
                    c = dist(S[i] + S[i + 1], A[j]) + 0.12
                    if c < 0.85 and cur + c < dp[i + 2, j + 1]:
                        dp[i + 2, j + 1] = cur + c
                        bp[(i + 2, j + 1)] = (i, j, ("two", 1))

    # backtrack
    anchors = {}  # script idx -> (start, end, dist)
    i, j = n, m
    while (i, j) in bp:
        pi, pj, kind = bp[(i, j)]
        if isinstance(kind, tuple):
            tag, k = kind
            st, en = asr[pj]["start"], asr[pj + k - 1]["end"]
            if tag == "m":
                anchors[pi] = (st, en, dist(S[pi], "".join(A[pj:pj + k])))
            else:  # two script tokens share one ASR word: split its span by weight
                w0, w1 = weight(tokens[pi]), weight(tokens[pi + 1])
                mid = st + (en - st) * w0 / (w0 + w1)
                anchors[pi] = (st, mid, 0.3)
                anchors[pi + 1] = (mid, en, 0.3)
        i, j = pi, pj

    good = sum(1 for v in anchors.values() if v[2] <= 0.5)
    frac = good / n
    print(f"anchored {len(anchors)}/{n}; good matches {good} ({frac:.0%})", file=sys.stderr)

    # fill unanchored runs by syllable weight between anchored neighbours
    starts = [None] * n
    ends = [None] * n
    for k, (st, en, _) in anchors.items():
        starts[k], ends[k] = st, en
    idx = 0
    audio_end = asr[-1]["end"]
    while idx < n:
        if starts[idx] is not None:
            idx += 1
            continue
        j0 = idx
        while idx < n and starts[idx] is None:
            idx += 1
        run = list(range(j0, idx))
        t_a = ends[j0 - 1] if j0 > 0 else 0.0
        t_b = starts[idx] if idx < n else audio_end
        need = 0.11 * len(run)
        if t_b - t_a < need:  # not enough room: borrow from neighbours
            extra = (need - (t_b - t_a)) / 2
            t_a, t_b = max(0.0, t_a - extra), t_b + extra
        ws = np.array([weight(tokens[k]) for k in run])
        cum = np.concatenate([[0], np.cumsum(ws)]) / ws.sum()
        for r, k in enumerate(run):
            starts[k] = t_a + (t_b - t_a) * cum[r]
            ends[k] = t_a + (t_b - t_a) * cum[r + 1]

    # enforce monotonic, positive durations
    out = []
    prev_end = 0.0
    for k in range(n):
        st = max(starts[k], prev_end - 0.0)
        en = max(ends[k], st + 0.06)
        out.append({"w": tokens[k], "start": round(float(st), 3), "end": round(float(en), 3)})
        prev_end = en
    # trim overlaps: a word ends no later than the next starts
    for k in range(n - 1):
        if out[k]["end"] > out[k + 1]["start"]:
            out[k]["end"] = out[k + 1]["start"]
        if out[k]["end"] <= out[k]["start"]:
            out[k]["end"] = round(out[k]["start"] + 0.05, 3)
            out[k + 1]["start"] = max(out[k + 1]["start"], out[k]["end"])

    if frac < MIN_ANCHORED:
        print(f"only {frac:.0%} of the script matched (< {MIN_ANCHORED:.0%}); keeping previous timing", file=sys.stderr)
        sys.exit(2)
    json.dump(out, open(OUT, "w", encoding="utf-8"), ensure_ascii=False, indent=0)
    print(f"wrote {OUT}: {len(out)} words, last end {out[-1]['end']:.2f}s", file=sys.stderr)


if __name__ == "__main__":
    main()
