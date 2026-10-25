# Video Metode Alchemist (Remotion)

Video edukasi MSNR · ICT · SMC · LIT, dengan POI (Classic A/V, SBR, RBS, QM, OCL) dan AOI (OB, BB, FVG, IFVG).

- 1920×1080, 60 fps, tema gelap sesuai `RULES.md`
- Subtitle kata-per-kata dari naskah, waktunya dari **speech recognition** pada voice over (`public/vo.mp3`)
- Semua visual dikunci ke kalimat narasi (`src/lib/timeline.ts`), bukan ke perkiraan waktu
- Semua POI MSNR ditandai di **close candle sebelumnya** (tepi body), bukan ekor dan bukan open saja
- Label perubahan struktur di QM: **MSS / CHoCH**

## Render (tanpa laptop)

Buka tab **Actions → Render video Alchemist → Run workflow**. Setelah selesai (± 40–90 menit),
video ada di **Releases** (file `Alchemist.mp4`) dan di bagian *Artifacts* pada run tersebut.

## Render lokal

```bash
npm install
npm run studio   # pratinjau
npm run render   # out/Alchemist.mp4
```

## Ganti naskah / voice over

1. Ganti `public/vo.mp3` dan `script/naskah.txt`
2. `python scripts/transcribe.py && python scripts/align_script.py` (butuh `faster-whisper`)
3. Sesuaikan frasa pemicu di `src/lib/timeline.ts` bila kalimat berubah
4. Ubah `VO_END` di `src/lib/consts.ts` sesuai durasi baru
