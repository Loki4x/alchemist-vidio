export const W = 1920;
export const H = 1080;
export const FPS = 60;

import closing from '../data/closing.json';

/** Voice-over length (ffprobe). The closing paragraph is timed after it (see data/closing.json). */
export const VO_END = 341.733878;
export const OUTRO = 3.2;
export const CLOSING_END = (closing as {end: number}[])[closing.length - 1].end;
export const TOTAL = CLOSING_END + OUTRO;
export const TOTAL_FRAMES = Math.round(TOTAL * FPS);

/** Crossfade between scenes, in frames (0.35 s at 60 fps). */
export const FADE_FRAMES = 21;
