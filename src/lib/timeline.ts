import {TT} from './words';
import {FPS, VO_END} from './consts';

// ---- scene boundaries & in-scene cues, all taken from the real word timings ----
const S = {
  hook: 0,
  merge: TT('Di sinilah metode Alchemist'),
  methods: TT('Ada empat metode'),
  intro: TT('Banyak trader terjebak'),
  focus: TT('MSNR bukan sekadar'),
  poi: TT('Sebelum masuk lebih jauh'),
  aoi: TT('Istilah kedua adalah AOI'),
  outro: TT('Jadi MSNR mengajak kita'),
};

const methodsP1 = TT('Pertama MSNR', S.methods);
const methodsP2 = TT('Kedua ICT', methodsP1);
const methodsP3 = TT('Ketiga SMC', methodsP2);
const methodsP4 = TT('Keempat LIT', methodsP3);
const methodsAll = TT('Keempat metode ini saling melengkapi', methodsP4);

const focusThree = TT('tiga hal', S.focus);
const focusP1 = TT('Pertama melihat', focusThree);
const focusP2 = TT('Kedua menemukan', focusP1);
const focusP3 = TT('Ketiga menghindari', focusP2);

const poiTypes = TT('Ada beberapa jenis POI', S.poi);
const tyA = TT('Resistance Classic A', poiTypes);
const tyV = TT('Support Classic V', tyA);
const tySBR = TT('SBR Support Become Resistance', tyV);
const tyRBS = TT('RBS Resistance Become Support', tySBR);
const tyQM = TT('QM Quasimodo', tyRBS);
const tyOCL = TT('OCL Open Close Level', tyQM);

const aoiTypes = TT('Jenis-jenis AOI antara lain', S.aoi);
const ob = TT('Order Block OB', aoiTypes);
const bb = TT('Breaker Block BB', ob);
const fvg = TT('FVG Fair Value Gap', bb);
const ifvg = TT('IFVG Inversion Fair Value Gap', fvg);

export const K = {
  S,
  // hook
  hookMulti: TT('beberapa metode trading sekaligus'),
  hookConfused: TT('bingung cara menyatukannya'),
  hookA: TT('Satu metode bilang begini'),
  hookB: TT('metode lain bilang begitu'),
  // merge
  mergeMix: TT('mencampurkan beberapa metode', S.merge),
  mergeOne: TT('satu padu', S.merge),
  mergeFlow: TT('satu alur analisa yang utuh', S.merge),
  // methods
  m1: methodsP1,
  m2: methodsP2,
  m3: methodsP3,
  m4: methodsP4,
  mAll: methodsAll,
  mFirst: TT('kita mulai dari yang pertama', methodsAll),
  mKill: TT('waktu-waktu tertentu', methodsP2),
  m1Precise: TT('titik harga presisi', methodsP1),
  m1Reject: TT('menolak dengan kuat', methodsP1),
  m1Entry: TT('peluang entry', methodsP1),
  m3Dir: TT('arah besar pergerakan harga', methodsP3),
  m3Change: TT('kapan struktur itu berubah', methodsP3),
  m4Liq: TT('di mana likuiditas berkumpul', methodsP4),
  m4Struct: TT('berhubungan dengan struktur pasar', methodsP4),
  // intro
  iWide: TT('area support dan resistance yang lebar', S.intro),
  iSpecific: TT('jejak yang sangat spesifik', S.intro),
  iName: TT('Malaysian Support and Resistance', S.intro),
  iPrecise: TT('secara presisi', S.intro),
  // focus
  fExtreme: TT('titik-titik pantulan ekstrem', S.focus),
  fGray: TT('area abu-abu', S.focus),
  fSharp: TT('titik-titik harga tunggal', S.focus),
  fThree: focusThree,
  f1: focusP1,
  f2: focusP2,
  f3: focusP3,
  fRisk: TT('risiko yang terukur', focusP2),
  // POI terms
  tPoi: TT('Istilah pertama adalah POI', S.poi),
  tDef: TT('jejak ekstrem yang ditinggalkan', S.poi),
  tPoint: TT('satu titik harga pasti', S.poi),
  tMemory: TT('benturan keras inilah', S.poi),
  tTypes: poiTypes,
  tyA, tyV, tySBR, tyRBS, tyQM, tyOCL,
  // AOI terms
  aInst: TT('institusi besar dan algoritma', S.aoi),
  aImb: TT('ketidakseimbangan imbalance', S.aoi),
  aArea: TT('Area inilah yang kita sebut AOI', S.aoi),
  aTypes: aoiTypes,
  ob, bb, fvg, ifvg,
  obOpp: TT('berlawanan arah', ob),
  obImpulse: TT('pergerakan impulsif', ob),
  obBreak: TT('merusak struktur pasar', ob),
  obBos: TT('break of structure', ob),
  obAcc: TT('mengakumulasi atau mendistribusikan', ob),
  obFast: TT('harga bergerak cepat', ob),
  bbFail: TT('gagal menahan harga', bb),
  bbPen: TT('tertembus oleh pergerakan impulsif', bb),
  bbFlip: TT('fungsinya berbalik arah', bb),
  bbEx: TT('Misalnya OB penahan', bb),
  bbRes: TT('menjadi resistance kuat', bb),
  fvgGap: TT('celah kosong', fvg),
  fvgThree: TT('tiga susunan candlestick', fvg),
  fvgWick1: TT('sumbu wick candle pertama', fvg),
  fvgWick3: TT('candle ketiga', fvg),
  fvgBal: TT('menyeimbangkan', fvg),
  ifvgFail: TT('gagal menahan harga', ifvg),
  ifvgPen: TT('tertembus sepenuhnya', ifvg),
  ifvgFlip: TT('berubah sifat', ifvg),
  ifvgSbr: TT('support become resistance', ifvg),
  // closing
  cMsnr: TT('MSNR mengajak kita', S.outro),
  cPoint: TT('titik-titik harga yang presisi', S.outro),
  cPoi: TT('POI dan AOI', S.outro),
  cRead: TT('membaca pasar dengan lebih tajam', S.outro),
  // POI type sub-cues
  aPeak: TT('titik puncak tajam', tyA),
  aLetter: TT('huruf A', tyA),
  vValley: TT('titik lembah tajam', tyV),
  vLetter: TT('huruf V', tyV),
  sbrOld: TT('level support lama', tySBR),
  sbrBroken: TT('sudah ditembus', tySBR),
  sbrNow: TT('bertindak sebagai resistance baru', tySBR),
  rbsOld: TT('level resistance lama', tyRBS),
  rbsBroken: TT('sudah ditembus', tyRBS),
  rbsNow: TT('menjadi support baru', tyRBS),
  qmPattern: TT('pola struktur harga', tyQM),
  qmManip: TT('manipulasi', tyQM),
  qmShift: TT('pergeseran struktur pasar', tyQM),
  oclPrecise: TT('level harga presisi', tyOCL),
  oclOpen: TT('titik pembukaan', tyOCL),
  oclClose: TT('penutupan', tyOCL),
};

/** Scene start frames (clamped, strictly increasing). */
export const SCENE_ORDER = ['hook', 'merge', 'methods', 'intro', 'focus', 'poi', 'aoi', 'outro'] as const;
export type SceneKey = (typeof SCENE_ORDER)[number];

const LEAD = 0.18; // a scene starts slightly before its first spoken word so the fade lands on it
export const SCENE_FRAMES: Record<SceneKey, number> = (() => {
  const out = {} as Record<SceneKey, number>;
  let prev = -1;
  SCENE_ORDER.forEach((k, idx) => {
    let f = idx === 0 ? 0 : Math.round(Math.max(0, S[k] - LEAD) * FPS);
    if (f <= prev) f = prev + 60;
    out[k] = f;
    prev = f;
  });
  return out;
})();
