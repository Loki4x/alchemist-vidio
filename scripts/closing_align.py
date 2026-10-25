#!/usr/bin/env python3
"""Timing for the closing paragraph (script/penutup.txt) - no audio yet, so the timing is
estimated from the narrator's own pace (sec per syllable-weight measured on the main VO).
Writes src/data/closing.json. If a recording of the closing is added, replace this file's output."""
import json, os, re, sys
ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
VO_END = 341.733878
GAP = 0.9  # silence between the last spoken word of the lesson and the closing

def weight(tok):
    letters = re.sub(r"[^A-Za-z]", "", tok)
    if len(letters) >= 2 and letters.isupper():
        return float(len(letters))
    return max(1.0, float(len(re.findall(r"[aeiouAEIOU]+", letters))))

main = json.load(open(f"{ROOT}/src/data/words.fallback.json"))
speech = sum(w["end"] - w["start"] for w in main)
rate = speech / sum(weight(w["w"]) for w in main)
toks = re.findall(r"\S+", open(f"{ROOT}/script/penutup.txt", encoding="utf-8").read())
t = VO_END + GAP
out = []
for tok in toks:
    d = max(0.14, weight(tok) * rate)
    out.append({"w": tok, "start": round(t, 3), "end": round(t + d, 3)})
    t += d + (0.45 if re.search(r"[.!?]$", tok) else 0.16 if tok.endswith(",") else 0.0)
json.dump(out, open(f"{ROOT}/src/data/closing.json", "w", encoding="utf-8"), ensure_ascii=False, indent=0)
print(f"rate {rate:.3f}s/weight; {len(out)} words; closing {out[0]['start']:.2f}-{out[-1]['end']:.2f}s")
