import raw from '../data/words.json';
import closing from '../data/closing.json';

export type Word = {w: string; start: number; end: number};

export const WORDS: Word[] = [...(raw as Word[]), ...(closing as Word[])];

export const norm = (s: string): string => s.toLowerCase().replace(/[^a-z0-9]/g, '');

// token list without empty tokens (pure punctuation), with a map back to WORDS
const tokens: string[] = [];
const origin: number[] = [];
WORDS.forEach((word, i) => {
  const n = norm(word.w);
  if (n) {
    tokens.push(n);
    origin.push(i);
  }
});

/**
 * Start time (seconds) of the first occurrence of `phrase` at or after `after`.
 * Never throws: a missing phrase is logged and answered with `after + 0.5`, so one
 * script edit cannot crash a 40-minute render.
 */
export const TT = (phrase: string, after = 0): number => {
  const parts = phrase.split(/\s+/).map(norm).filter(Boolean);
  for (let i = 0; i + parts.length <= tokens.length; i++) {
    if (WORDS[origin[i]].start < after) continue;
    let ok = true;
    for (let k = 0; k < parts.length; k++) {
      if (tokens[i + k] !== parts[k]) {
        ok = false;
        break;
      }
    }
    if (ok) return WORDS[origin[i]].start;
  }
  // eslint-disable-next-line no-console
  console.warn(`[words] phrase not found after ${after.toFixed(2)}s: "${phrase}"`);
  return after + 0.5;
};

/** End time of the last word of the first occurrence of `phrase`. */
export const TE = (phrase: string, after = 0): number => {
  const parts = phrase.split(/\s+/).map(norm).filter(Boolean);
  for (let i = 0; i + parts.length <= tokens.length; i++) {
    if (WORDS[origin[i]].start < after) continue;
    let ok = true;
    for (let k = 0; k < parts.length; k++) {
      if (tokens[i + k] !== parts[k]) {
        ok = false;
        break;
      }
    }
    if (ok) return WORDS[origin[i + parts.length - 1]].end;
  }
  // eslint-disable-next-line no-console
  console.warn(`[words] phrase end not found after ${after.toFixed(2)}s: "${phrase}"`);
  return after + 1;
};
