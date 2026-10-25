# Video Production Rules: Dark & Modern Trading Education (`rules.md`)

Dokumen ini adalah standar wajib dalam membangun komposisi video edukasi dan penjelasan strategi trading menggunakan React, TypeScript, dan Remotion. Semua komponen yang dibuat wajib mematuhi spesifikasi visual, teknis, dan animasi di bawah ini.

---

## 1. Spesifikasi Kanvas & Teknis (Canvas & Specs)

Setiap `<Composition>` di `src/Root.tsx` wajib menggunakan konfigurasi dasar berikut:

- **Resolusi & Rasio:** Landscape 16:9 Full HD (`width: 1920`, `height: 1080`).
- **Frame Rate:** `fps: 60` (Wajib 60fps agar pergerakan *chart*, *candlestick*, kursor indikator, dan transisi angka terlihat sangat mulus).
- **Safe Area (Batas Aman):**
  - *Padding* utama kanvas: `80px` (kiri/kanan) dan `64px` (atas/bawah).
  - **Zona Subtitle Bawah:** Area `180px` dari batas bawah layar dikhususkan untuk *subtitle* dinamis (kata per kata) dan narasi. Jangan menaruh label *chart* penting atau *watermark* di area tengah-bawah ini.

---

## 2. Identitas Visual: Dark & Modern Trading Theme

Gunakan palet warna gelap berkelas (*institutional dark mode* seperti TradingView / Bloomberg Terminal) agar grafik dan indikator menonjol dengan jelas:

- **Background Utama:**
  - Deep Obsidian: `#0A0E17` atau `#090D16`
  - Subtle Grid / Background Pattern: Garis grid tipis `1px` dengan warna `rgba(255, 255, 255, 0.04)` untuk memberi kesan *charting canvas*.
- **Surface / Card / Panel Indikator:**
  - Dark Slate: `rgba(17, 24, 39, 0.85)` dengan `backdropFilter: 'blur(12px)'`
  - Border Panel: `1px solid rgba(255, 255, 255, 0.1)`
- **Warna Semantik Trading (Wajib Konsisten):**
  - **Bullish / Buy / Profit / Long:** Emerald Neon `#10B981` (Glow: `rgba(16, 185, 129, 0.25)`)
  - **Bearish / Sell / Stop Loss / Short:** Crimson Rose `#F43F5E` (Glow: `rgba(244, 63, 94, 0.25)`)
  - **Neutral / Info / Entry / Support-Resistance:** Electric Cyan `#0EA5E9` atau Amber Gold `#F59E0B`
- **Warna Teks:**
  - Primary Text: `#F8FAFC`
  - Secondary / Muted Text: `#94A3B8`

---

## 3. Tipografi & Hierarki Teks

Muat semua font menggunakan `@remotion/google-fonts` di level modul:

- **Font Judul & Narasi Utama:** `Inter` atau `Plus Jakarta Sans` (Weights: `600`, `700`, `800`).
- **Font Angka, Harga, Rasio Risk/Reward, & Persentase:** `JetBrains Mono` (Weight: `700`) dengan properti CSS `fontVariantNumeric: 'tabular-nums'` agar angka tidak bergoyang saat beranimasi naik/turun.
- **Ukuran Teks Standar (1080p):**
  - **Judul Scene / Strategi:** `68px – 84px` (ExtraBold `800`, Line Height `1.1`)
  - **Sub-judul / Poin Strategi:** `40px – 48px` (Bold `700`)
  - **Label Harga / Indikator Chart:** `24px – 30px` (`JetBrains Mono`)
  - **Subtitle / Teks Narasi:** `44px – 52px` (ExtraBold `800`)

---

## 4. Aturan Animasi 60fps & Visualisasi Trading

Karena menggunakan **60fps** (`1 detik = 60 frame`), semua durasi frame harus dihitung berdasarkan kelipatan `fps`:

1. **Dilarang Menggunakan CSS Transitions / Keyframes:**
   - Semua gerakan wajib dihitung dari `useCurrentFrame()` dan `useVideoConfig()` memakai `spring()` atau `interpolate()`.
2. **Preset Fisika `spring()` (60fps):**
   - **Smooth UI & Chart Reveal (Tanpa pantulan berlebih):** `{ damping: 200, stiffness: 120, mass: 1 }`
   - **Pop-up Sinyal Buy/Sell atau Badge:** `{ damping: 14, stiffness: 180, mass: 0.8 }`
   - **Staggering (Muncul Berurutan):** Beri jeda `6` sampai `10` frame (`0.1 – 0.16` detik pada 60fps) antar item dalam daftar aturan trading.
3. **Animasi Elemen Trading:**
   - **Candlestick & Garis Indikator (EMA/RSI/MACD):** Animasikan kemunculan dari kiri ke kanan menggunakan `interpolate()` dengan `Easing.out(Easing.cubic)`.
   - **Zona Profit & Stop Loss (Risk-to-Reward Box):** Animasikan tinggi kotak (`scaleY`) dari garis *Entry* menuju *Take Profit* (hijau transparan) dan *Stop Loss* (merah transparan).
   - **Sorotan (Highlight Callout):** Saat narasi membahas area *Break of Structure (BOS)*, *Order Block*, atau *Support/Resistance*, tampilkan lingkaran/kotak *pulse* atau panah beranimasi di titik tersebut.

---

## 5. Subtitle Dinamis (TikTok-Style Word-by-Word) & Voiceover

Setiap video penjelasan memiliki *Voiceover (VO)* dan teks narasi yang muncul kata demi kata:

- **Sinkronisasi Audio & Teks:**
  - Gunakan `<Audio>` dari `remotion` untuk *Voiceover* dengan volume `1.0`.
  - Jika memakai musik latar (*background music*), kunci volumenya di `0.12 – 0.18` agar suara penjelasan strategi tetap jernih.
- **Gaya Visual Subtitle (Word-by-Word Highlight):**
  - Gunakan `@remotion/captions` (`createTikTokStyleCaptions`) atau array *timestamp* kata (`startMs`, `endMs`).
  - Tampilkan maksimal **5 hingga 7 kata** per halaman baris di bagian bawah layar (`bottom: 72px`).
  - **Kata yang sedang diucapkan (Active Word):** Beri warna aksen terang (`#10B981` untuk konteks *bullish*/positif, `#38BDF8` untuk umum, atau `#F59E0B` untuk kata kunci penting), sedikit membesar (`scale(1.08)`), dan bayangan teks (`textShadow: '0 4px 16px rgba(0,0,0,0.8)'`).
  - **Kata lainnya dalam kalimat:** Warna `#F8FAFC` (sudah diucapkan) atau `rgba(248, 250, 252, 0.45)` (belum diucapkan) di dalam kapsul latar gelap semi-transparan (`rgba(10, 14, 23, 0.75)`).

---

## 6. Struktur Alur Video Edukasi Trading

Susun komponen video menggunakan `<TransitionSeries>` (`@remotion/transitions`) dengan alur standar berikut:

1. **Hook & Nama Strategi (`0 – 4 detik` / `0 – 240 frame`):**
   - Langsung tampilkan pergerakan *chart* atau hasil *setup* di frame `0` (jangan biarkan layar kosong/hitam).
   - Judul besar permasalahan atau nama strategi (contoh: *"Strategi Smart Money Concept: Entry Akurat di Timeframe 15M"*).
2. **Syarat & Indikator (`4 – 15 detik`):**
   - Tampilkan *checklist* syarat validasi *setup* satu per satu (misal: 1. Identifikasi Tren, 2. Tunggu *Pullback* ke Area *Demand*, 3. Konfirmasi *Candlestick*).
3. **Bedah Grafik / Studi Kasus (`15 detik – Selesai`):**
   - Tampilkan simulasi grafik langkah demi langkah: titik *Entry*, letak *Stop Loss*, rasio *Risk:Reward* (misal `1:3`), dan pergerakan harga menyentuh *Take Profit*.
4. **Ringkasan / Disclaimer Singkat (3 Detik Terakhir):**
   - Ringkasan aturan disiplin (*Risk Management*) dan *closing*.
