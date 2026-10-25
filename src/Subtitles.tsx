import React, {useMemo} from 'react';
import {C, SANS} from './lib/theme';
import {WORDS, Word} from './lib/words';
import {useT} from './lib/time';
import {smooth} from './lib/anim';

type Group = {words: Word[]; start: number; end: number; chars: number};

const clean = (s: string) => s.replace(/[“”"]/g, '');
const endsSentence = (s: string) => /[.?!:]["”)]?$/.test(s);

/** Script text → 5-7 word groups, split at sentence ends and commas where possible. */
const buildGroups = (): Group[] => {
  const sentences: Word[][] = [];
  let cur: Word[] = [];
  for (const w of WORDS) {
    cur.push(w);
    if (endsSentence(w.w)) {
      sentences.push(cur);
      cur = [];
    }
  }
  if (cur.length) sentences.push(cur);

  // merge very short sentences into the next one when the result still fits
  const merged: Word[][] = [];
  for (let i = 0; i < sentences.length; i++) {
    const s = sentences[i];
    if (s.length < 3 && i + 1 < sentences.length && s.length + sentences[i + 1].length <= 7) {
      sentences[i + 1] = [...s, ...sentences[i + 1]];
    } else {
      merged.push(s);
    }
  }

  const groups: Group[] = [];
  for (const s of merged) {
    const L = s.length;
    const parts = Math.max(1, Math.ceil(L / 7));
    const cuts: number[] = [0];
    for (let k = 1; k < parts; k++) {
      let c = Math.round((k * L) / parts);
      for (const d of [0, -1, 1, -2, 2]) {
        const j = c + d;
        if (j > cuts[cuts.length - 1] + 2 && j < L - 1 && /,$/.test(s[j - 1].w)) {
          c = j;
          break;
        }
      }
      cuts.push(c);
    }
    cuts.push(L);
    for (let k = 0; k < parts; k++) {
      const ws = s.slice(cuts[k], cuts[k + 1]);
      if (!ws.length) continue;
      groups.push({words: ws, start: ws[0].start, end: ws[ws.length - 1].end, chars: ws.map((w) => clean(w.w)).join(' ').length});
    }
  }
  return groups;
};

const GROUPS = buildGroups();

export const Subtitles: React.FC = () => {
  const t = useT();
  const groups = useMemo(() => GROUPS, []);

  // current group: last one that started (minus a tiny lead)
  let gi = -1;
  for (let i = 0; i < groups.length; i++) {
    if (t >= groups[i].start - 0.06) gi = i;
    else break;
  }
  if (gi < 0) return null;
  const g = groups[gi];
  const next = groups[gi + 1];
  const hideAt = next ? next.start - 0.06 : g.end + 0.5;
  if (t > Math.min(hideAt, g.end + 1.4)) return null;

  const fontSize = Math.max(38, Math.min(54, 1640 / (g.chars * 0.6)));
  const inT = smooth(t - (g.start - 0.06));

  return (
    <div style={{position: 'absolute', left: 0, right: 0, bottom: 72, display: 'flex', justifyContent: 'center', pointerEvents: 'none'}}>
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: fontSize * 0.3,
          padding: `${fontSize * 0.26}px ${fontSize * 0.7}px`,
          borderRadius: 26,
          background: 'rgba(10,14,23,0.82)',
          border: '1.5px solid rgba(255,255,255,0.10)',
          opacity: Math.min(1, inT * 2),
          translate: `0 ${(1 - inT) * 10}px`,
        }}>
        {g.words.map((w, i) => {
          const started = t >= w.start - 0.02;
          const nextStart = g.words[i + 1]?.start ?? Infinity;
          const active = started && t < nextStart - 0.02;
          const k = active ? smooth(t - w.start) : started ? 1 : 0;
          return (
            <span
              key={i}
              style={{
                display: 'inline-block',
                fontFamily: SANS,
                fontWeight: 700,
                fontSize,
                lineHeight: 1.15,
                whiteSpace: 'nowrap',
                color: active ? C.em : started ? C.txt : 'rgba(248,250,252,0.5)',
                scale: String(active ? 1 + 0.08 * k : 1),
                transformOrigin: '50% 60%',
              }}>
              {clean(w.w)}
            </span>
          );
        })}
      </div>
    </div>
  );
};
