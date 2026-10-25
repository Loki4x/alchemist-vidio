#!/usr/bin/env python3
"""Real speech recognition with word timestamps (runs on the CI runner, CPU only).

Output: work/asr.json   [{"word": str, "start": sec, "end": sec, "prob": float}, ...]
"""
import json
import os
import sys
import time

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
VO = f"{ROOT}/public/vo.mp3"
OUT = f"{ROOT}/work/asr.json"
MODEL = os.environ.get("WHISPER_MODEL", "medium")

from faster_whisper import WhisperModel  # noqa: E402

os.makedirs(f"{ROOT}/work", exist_ok=True)
t0 = time.time()
print(f"loading faster-whisper '{MODEL}' (cpu, int8)", flush=True)
model = WhisperModel(MODEL, device="cpu", compute_type="int8", cpu_threads=os.cpu_count() or 2)

# glossary nudges the decoder toward the trading jargon used in the script
prompt = (
    "Metode Alchemist: MSNR, ICT, SMC, LIT, POI, AOI, Order Block, Breaker Block, "
    "Fair Value Gap, FVG, IFVG, Quasimodo, Classic A, Classic V, SBR, RBS, QM, OCL, "
    "Malaysian Support and Resistance, kill zones, liquidity, structure."
)
segments, info = model.transcribe(
    VO,
    language="id",
    word_timestamps=True,
    beam_size=5,
    vad_filter=False,
    condition_on_previous_text=False,
    initial_prompt=prompt,
)
words = []
for seg in segments:
    for w in seg.words or []:
        words.append({"word": w.word.strip(), "start": round(w.start, 3), "end": round(w.end, 3), "prob": round(w.probability, 3)})
    print(f"  {seg.end:7.1f}s  {seg.text.strip()[:70]}", flush=True)

json.dump(words, open(OUT, "w", encoding="utf-8"), ensure_ascii=False, indent=0)
print(f"{len(words)} words in {time.time() - t0:.0f}s -> {OUT}", flush=True)
if len(words) < 300:
    print("too few words recognised", file=sys.stderr)
    sys.exit(1)
