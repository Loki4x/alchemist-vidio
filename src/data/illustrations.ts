import {C} from '../lib/theme';
import {Ann, Illu, ohlc, seq, withHL} from '../lib/chart';
import {K} from '../lib/timeline';

const {em: EM, ro: RO, cy: SKY, am: AM, vi: VI} = C;

/**
 * Every MSNR POI sits on the CLOSE of the previous candle (= open of the next one),
 * at the edge of the body. Never on a wick, never on the open alone.
 * seq(closes): candle i opens at closes[i], closes at closes[i+1].
 */

// ───────────────── POI types ─────────────────
export const classicV = (): Illu => ({
  cs: withHL(seq([68, 64, 60, 56, 52, 47, 41, 46, 51, 56, 59, 62]), {6: {l: 33}}),
  yMin: 28, yMax: 74, extra: 2,
  ann: [
    {k: 'line', from: 5, p: 41, color: EM, label: 'CLASSIC V · POI', at: K.vValley, dy: -14},
    {k: 'ring', i: 5, p: 41, color: EM, at: K.vValley + 0.4},
    {k: 'tag', i: 4.6, p: 37, text: 'CLOSE', color: EM, at: K.vValley + 0.9, size: 22, anchor: 'end'},
    {k: 'tag', i: 6, p: 30, text: 'BUKAN DI EKOR', color: AM, at: K.vLetter, size: 22},
  ],
});

export const classicA = (): Illu => ({
  cs: withHL(seq([38, 42, 46, 51, 56, 62, 57, 52, 47, 43, 40, 37]), {5: {h: 70}}),
  yMin: 30, yMax: 76, extra: 2,
  ann: [
    {k: 'line', from: 4, p: 62, color: RO, label: 'CLASSIC A · POI', at: K.aPeak, dy: -14},
    {k: 'ring', i: 4, p: 62, color: RO, at: K.aPeak + 0.4},
    {k: 'tag', i: 3.6, p: 68, text: 'CLOSE', color: RO, at: K.aPeak + 0.9, size: 22, anchor: 'end'},
    {k: 'tag', i: 5, p: 72.5, text: 'BUKAN DI EKOR', color: AM, at: K.aLetter, size: 22},
  ],
});

export const sbr = (): Illu => ({
  cs: withHL(seq([60, 56, 52, 50, 55, 59, 56, 52, 49, 45, 42, 46, 49.5, 44, 40]), {11: {h: 50.8}}),
  yMin: 34, yMax: 66, extra: 2,
  ann: [
    {k: 'line', from: 2, p: 50, color: EM, label: 'SUPPORT 50', at: K.sbrOld, dy: -14, flipAt: K.sbrNow, flipColor: RO, flipLabel: 'RESISTANCE BARU'},
    {k: 'tag', i: 7.5, p: 46, text: 'DITEMBUS', color: AM, at: K.sbrBroken, size: 22},
    {k: 'ring', i: 11, p: 50, color: RO, at: K.sbrNow + 0.8},
    {k: 'arrow', i: 13, p0: 49, p1: 40, color: RO, at: K.sbrNow + 1.6},
  ],
});

export const rbs = (): Illu => ({
  cs: withHL(seq([50, 55, 60, 56, 52, 57, 61.5, 66, 69, 63, 60.2, 66, 71]), {9: {l: 59.2}}),
  yMin: 44, yMax: 76, extra: 2,
  ann: [
    {k: 'line', from: 1, p: 60, color: RO, label: 'RESISTANCE 60', at: K.rbsOld, dy: 30, flipAt: K.rbsNow, flipColor: EM, flipLabel: 'SUPPORT BARU'},
    {k: 'tag', i: 6, p: 64.5, text: 'DITEMBUS', color: AM, at: K.rbsBroken, size: 22},
    {k: 'ring', i: 9, p: 60, color: EM, at: K.rbsNow + 0.8},
    {k: 'arrow', i: 11, p0: 61, p1: 71, color: EM, at: K.rbsNow + 1.6},
  ],
});

export const qm = (): Illu => ({
  cs: withHL(seq([46, 52, 58, 53, 49, 55, 61, 55, 50, 46, 52, 57.8, 51, 46, 42]), {10: {h: 59.2}}),
  yMin: 36, yMax: 66, extra: 2,
  ann: [
    {k: 'tag', i: 1, p: 63, text: 'LS', color: SKY, at: K.qmPattern, size: 22},
    {k: 'tag', i: 5, p: 65.5, text: 'HEAD', color: AM, at: K.qmManip, size: 22},
    {k: 'line', from: 3, to: 9, p: 49, color: SKY, dash: true, at: K.qmShift - 0.6},
    {k: 'tag', i: 8, p: 42, text: 'MSS / CHoCH', color: SKY, at: K.qmShift, size: 22},
    {k: 'line', from: 1, p: 58, color: EM, label: 'QM · POI', at: K.qmShift + 1.2, dy: -14},
    {k: 'ring', i: 10, p: 58, color: EM, at: K.qmShift + 2.2},
    {k: 'arrow', i: 12, p0: 52, p1: 44, color: RO, at: K.qmShift + 2.8},
  ],
});

export const ocl = (): Illu => ({
  cs: withHL(seq([56, 52, 48, 55, 60, 58, 62, 59, 54, 50, 48.2, 53, 58]), {9: {l: 47.6}}),
  yMin: 40, yMax: 68, extra: 2,
  ann: [
    {k: 'line', from: 1, p: 48, color: SKY, label: 'OC LEVEL', at: K.oclPrecise, dy: 32},
    {k: 'tag', i: 1, p: 43.2, text: 'CLOSE', color: RO, at: K.oclClose - 0.3, size: 22, anchor: 'end'},
    {k: 'tag', i: 2, p: 43.2, text: 'OPEN', color: EM, at: K.oclOpen, size: 22, anchor: 'start'},
    {k: 'ring', i: 9, p: 48, color: SKY, at: K.oclClose + 1.2},
  ],
});

// ───────────────── AOI ─────────────────
export const aoiIntro = (): Illu => ({
  cs: seq([50, 49, 48.5, 49.4, 48.2, 56, 64, 68, 63, 58, 53, 49.2, 54, 60, 66]),
  yMin: 40, yMax: 76, extra: 2,
  ann: [
    {k: 'box', from: 0, to: 4, lo: 46.4, hi: 51, color: AM, label: 'AOI', at: K.aInst},
    {k: 'arrow', i: 6, p0: 56, p1: 70, color: EM, at: K.aImb},
    {k: 'tag', i: 7, p: 73, text: 'IMPULSIF', color: EM, at: K.aImb + 0.5, size: 22},
    {k: 'ring', i: 10, p: 50, color: AM, at: K.aArea + 1},
  ],
});

export const orderBlock = (): Illu => ({
  cs: ohlc([
    [60, 60.6, 56.6, 57], [57, 59, 56.5, 58.5], [58.5, 59, 53.5, 54], [54, 56, 53.2, 55.5], [55.5, 56, 50.5, 51],
    [51, 51.5, 48, 48.5], [48.5, 58.5, 48.3, 58], [58, 63.8, 57.8, 63.5], [63.5, 64.5, 61.5, 62], [62, 62.5, 58, 58.5],
    [58.5, 59, 51.8, 52], [52, 52.6, 48.8, 50], [50, 55.5, 49.6, 55], [55, 61.4, 54.8, 61],
  ]),
  yMin: 40, yMax: 68, extra: 2,
  ann: [
    {k: 'ring', i: 5, p: 50, color: AM, at: K.obOpp, r: 34},
    {k: 'line', from: 1, to: 7, p: 59, color: SKY, dash: true, at: K.obBreak},
    {k: 'tag', i: 8, p: 66, text: 'BOS', color: SKY, at: K.obBos, size: 24},
    {k: 'box', from: 5, lo: 48, hi: 51.5, color: EM, label: 'ORDER BLOCK', right: true, at: K.obAcc - 1.5},
    {k: 'ring', i: 11, p: 49, color: EM, at: K.obFast + 0.8},
  ],
});

export const breaker = (): Illu => ({
  cs: ohlc([
    [58, 58.5, 54.5, 55], [55, 55.6, 52, 52.5], [52.5, 53, 49, 49.5], [49.5, 55.6, 49.2, 55], [55, 57.5, 54.7, 57],
    [57, 57.4, 52.6, 53], [53, 53.6, 50.2, 51], [51, 51.8, 50, 50.5], [50.5, 51, 43.4, 44], [44, 44.6, 39.6, 40],
    [40, 43.6, 39.7, 43], [43, 47.5, 42.8, 47], [47, 51.6, 46.8, 50.4], [50.4, 50.8, 44.6, 45], [45, 45.6, 40.6, 41],
  ]),
  yMin: 34, yMax: 62, extra: 2,
  ann: [
    {k: 'box', from: 2, lo: 49, hi: 53, color: EM, label: 'ORDER BLOCK', right: true, at: K.bb + 1.0, flipAt: K.bbFlip, flipColor: RO, flipLabel: 'BREAKER BLOCK'},
    {k: 'arrow', i: 8, p0: 49, p1: 41, color: RO, at: K.bbPen},
    {k: 'tag', i: 9, p: 36.5, text: 'TEMBUS', color: RO, at: K.bbPen + 0.5, size: 22},
    {k: 'ring', i: 12, p: 51.6, color: RO, at: K.bbRes},
  ],
});

export const fvgIllu = (): Illu => ({
  cs: ohlc([
    [48, 49.4, 47.7, 49], [49, 50.4, 48.8, 50], [50, 52.6, 49.8, 52], [52, 61.6, 51.8, 61], [61, 63.5, 59.3, 63],
    [63, 64.8, 62.6, 64.5], [64.5, 65, 61.6, 62], [62, 62.4, 57.6, 58.5], [58.5, 59, 54.5, 55], [55, 60.8, 54.8, 60.5],
    [60.5, 66.2, 60.2, 66],
  ]),
  yMin: 42, yMax: 70, extra: 3,
  ann: [
    {k: 'line', from: 2, to: 5, p: 52.6, color: AM, dash: true, label: 'wick 1', at: K.fvgWick1, dy: 30, lend: true},
    {k: 'line', from: 4, to: 7, p: 59.3, color: AM, dash: true, label: 'wick 3', at: K.fvgWick3, dy: 30},
    {k: 'box', from: 2, to: 8, lo: 52.6, hi: 59.3, color: SKY, label: 'FVG', at: K.fvgGap},
    {k: 'ring', i: 8, p: 54.5, color: SKY, at: K.fvgBal},
    {k: 'arrow', i: 9, p0: 50, p1: 66, color: EM, at: K.fvgBal + 0.9},
  ],
});

export const ifvgIllu = (): Illu => ({
  cs: ohlc([
    [48, 49.4, 47.7, 49], [49, 50.4, 48.8, 50], [50, 52.6, 49.8, 52], [52, 61.6, 51.8, 61], [61, 63.5, 59.3, 63],
    [63, 63.6, 59.8, 60.5], [60.5, 61, 56.6, 57], [57, 57.4, 50.6, 51.5], [51.5, 52, 46.4, 47], [47, 49.6, 46.6, 49],
    [49, 53.3, 48.8, 52.4], [52.4, 52.8, 47.8, 48.5], [48.5, 49, 43.6, 44],
  ]),
  yMin: 38, yMax: 68, extra: 3,
  ann: [
    {k: 'box', from: 2, lo: 52.6, hi: 59.3, color: SKY, label: 'FVG', right: true, at: K.ifvg + 1.2, flipAt: K.ifvgFlip, flipColor: RO, flipLabel: 'IFVG'},
    {k: 'arrow', i: 7, p0: 60, p1: 48, color: RO, at: K.ifvgPen},
    {k: 'tag', i: 8, p: 42, text: 'TEMBUS PENUH', color: RO, at: K.ifvgPen + 0.5, size: 22},
    {k: 'ring', i: 10, p: 53.3, color: RO, at: K.ifvgSbr},
  ],
});

// ───────────────── previews of the four methods ─────────────────
export const msnrPreview = (): Illu => ({
  cs: seq([50, 55, 61, 67, 72, 76, 74, 70, 64, 58, 53, 50, 55, 62, 70, 76.2, 75, 71, 66]),
  yMin: 44, yMax: 84, extra: 1,
  ann: [
    {k: 'line', from: 4, p: 76, color: SKY, label: 'POI', at: K.m1Precise, dy: -14},
    {k: 'ring', i: 14, p: 76, color: AM, at: K.m1Reject},
    {k: 'tag', i: 16, p: 81, text: 'ENTRY', color: EM, at: K.m1Entry, size: 22},
  ],
});

export const smcPreview = (): Illu => ({
  cs: seq([30, 38, 46, 41, 50, 58, 52, 60, 68, 61, 55, 49, 43, 39, 34]),
  yMin: 22, yMax: 76, extra: 1,
  ann: [
    {k: 'tag', i: 1, p: 51, text: 'HH', color: EM, at: K.m3Dir, size: 20},
    {k: 'tag', i: 4, p: 62.5, text: 'HH', color: EM, at: K.m3Dir + 0.5, size: 20},
    {k: 'tag', i: 7, p: 72, text: 'HH', color: EM, at: K.m3Dir + 1.0, size: 20},
    {k: 'tag', i: 2, p: 36, text: 'HL', color: SKY, at: K.m3Dir + 0.25, size: 20},
    {k: 'tag', i: 5, p: 47, text: 'HL', color: SKY, at: K.m3Dir + 0.75, size: 20},
    {k: 'line', from: 5, to: 11, p: 52, color: AM, dash: true, at: K.m3Change - 0.5},
    {k: 'tag', i: 11, p: 44, text: 'MSS / CHoCH', color: AM, at: K.m3Change, size: 20},
  ],
});

export const litPreview = (): Illu => ({
  cs: withHL(seq([40, 46, 52, 60, 66, 62, 57, 52, 58, 64, 66.5, 61, 56, 62, 66.2, 70.5, 60, 52, 46, 40]), {14: {h: 73}}),
  yMin: 32, yMax: 80, extra: 1,
  ann: [
    {k: 'line', from: 3, to: 15, p: 66, color: VI, dash: true, label: 'EQUAL HIGHS', at: K.m4Liq, dy: -12},
    {k: 'ring', i: 14, p: 73, color: AM, at: K.m4Liq + 1.2},
    {k: 'tag', i: 12, p: 77, text: 'SWEEP', color: AM, at: K.m4Liq + 1.5, size: 20},
    {k: 'arrow', i: 16, p0: 68, p1: 46, color: RO, at: K.m4Struct},
    {k: 'tag', i: 17, p: 40, text: 'MSS / CHoCH', color: RO, at: K.m4Struct + 0.6, size: 20},
  ],
});

// ───────────────── MSNR concept scenes ─────────────────
/** Wide, uncertain S/R zones (conventional way). */
export const wideZones = (): Illu => ({
  cs: seq([50, 55, 61, 67, 72, 70, 64, 58, 53, 55, 61, 67, 71.5, 68, 62, 57, 54, 58]),
  yMin: 44, yMax: 80, extra: 1,
  ann: [
    {k: 'box', from: 0, lo: 64.5, hi: 75, color: C.mut, label: 'area lebar (bukan POI)', at: K.iWide},
    {k: 'box', from: 0, lo: 47, hi: 57, color: C.mut, label: 'area lebar (bukan POI)', at: K.iWide + 0.8},
  ],
});

/** The same chart collapsed into precise lines. */
export const sharpPoints = (): Illu => ({
  cs: seq([50, 55, 61, 67, 72, 70, 64, 58, 53, 55, 61, 67, 71.5, 68, 62, 57, 54, 58]),
  yMin: 44, yMax: 80, extra: 1,
  ann: [
    {k: 'line', from: 4, p: 72, color: RO, label: '72.00', at: K.iSpecific, dy: -12},
    {k: 'line', from: 8, p: 53, color: EM, label: '53.00', at: K.iSpecific + 0.6, dy: 28},
    {k: 'ring', i: 11, p: 72, color: RO, at: K.iName + 1.2},
  ],
});

export const extremeBounce = (): Illu => ({
  cs: seq([48, 53, 58, 64, 70, 66, 60, 55, 50, 56, 62, 68, 73, 70, 64, 58, 52, 47]),
  yMin: 40, yMax: 80, extra: 1,
  ann: [
    {k: 'ring', i: 4, p: 70, color: RO, at: K.fExtreme, r: 30},
    {k: 'ring', i: 7, p: 50, color: EM, at: K.fExtreme + 0.7, r: 30},
    {k: 'ring', i: 11, p: 73, color: RO, at: K.fExtreme + 1.4, r: 30},
    {k: 'line', from: 4, p: 70, color: RO, dash: true, at: K.fSharp},
    {k: 'line', from: 7, p: 50, color: EM, dash: true, at: K.fSharp + 0.4},
  ],
});

export type {Ann};

/** Conventional wide zones that collapse into precise lines. */
export const introIllu = (): Illu => {
  const w = wideZones();
  const s = sharpPoints();
  return {...s, ann: [...w.ann.map((a) => ({...a, until: K.iSpecific - 0.1})), ...s.ann]};
};

/** POI definition: one precise rejection point with "memory". */
export const poiDef = (): Illu => ({
  cs: seq([50, 56, 62, 68, 64, 58, 52, 57, 63, 68.2, 66, 60]),
  yMin: 44, yMax: 76, extra: 2,
  ann: [
    {k: 'line', from: 2, p: 68, color: RO, label: 'POI', at: K.tPoint, dy: -14},
    {k: 'tag', i: 4, p: 72.5, text: 'REJECTION KUAT', color: AM, at: K.tPoint + 0.6, size: 22},
    {k: 'ring', i: 8, p: 68, color: RO, at: K.tMemory + 0.6},
    {k: 'arrow', i: 9, p0: 67, p1: 56, color: RO, at: K.tMemory + 1.4},
  ],
});
