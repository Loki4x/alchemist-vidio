export const W = 1920;
export const H = 1080;
export const FPS = 60;

/** Voice-over length (ffprobe); the closing paragraph is part of the recording. */
export const VO_END = 341.733878;
export const OUTRO = 3.2;
export const TOTAL = VO_END + OUTRO;
export const TOTAL_FRAMES = Math.round(TOTAL * FPS);

/** Crossfade between scenes, in frames (0.35 s at 60 fps). */
export const FADE_FRAMES = 21;
