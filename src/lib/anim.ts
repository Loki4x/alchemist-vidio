import {spring} from 'remotion';
import {FPS} from './consts';

export const clamp = (x: number, a = 0, b = 1): number => (x < a ? a : x > b ? b : x);
export const lerp = (a: number, b: number, t: number): number => a + (b - a) * t;
export const eo = (x: number): number => 1 - Math.pow(1 - clamp(x), 3);
export const eio = (x: number): number => {
  const v = clamp(x);
  return v < 0.5 ? 4 * v * v * v : 1 - Math.pow(-2 * v + 2, 3) / 2;
};
/** progress 0..1 of a window that starts at t0 and lasts d seconds. */
export const prog = (t: number, t0: number, d: number): number => clamp((t - t0) / d);
/** 1 inside [t0, t1], easing in/out over f seconds at both edges. */
export const win = (t: number, t0: number, t1: number, f = 0.3): number => clamp((t - t0) / f) * clamp((t1 - t) / f);

type SpringConfig = {damping: number; stiffness: number; mass: number};

const TABLE_SECONDS = 12;
const tables = new Map<string, number[]>();

const tableFor = (config: SpringConfig): number[] => {
  const key = `${config.damping}/${config.stiffness}/${config.mass}`;
  let table = tables.get(key);
  if (!table) {
    table = [];
    for (let f = 0; f <= TABLE_SECONDS * FPS; f++) {
      table.push(spring({frame: f, fps: FPS, config}));
    }
    tables.set(key, table);
  }
  return table;
};

/** Remotion spring() sampled from a lookup table, `sec` = seconds since the trigger. */
const springAt = (sec: number, config: SpringConfig): number => {
  if (sec <= 0) return 0;
  const f = sec * FPS;
  const table = tableFor(config);
  if (f >= table.length - 1) return 1;
  const i = Math.floor(f);
  return lerp(table[i], table[i + 1], f - i);
};

/** Smooth UI / chart reveal, no bounce (RULES.md). */
export const smooth = (sec: number): number => springAt(sec, {damping: 200, stiffness: 120, mass: 1});
/** Pop-up for signals and badges (RULES.md). */
export const pop = (sec: number): number => springAt(sec, {damping: 14, stiffness: 180, mass: 0.8});
