import React from 'react';
import {AbsoluteFill} from 'remotion';
import {C, METHODS, MONO, SANS, rgba} from '../lib/theme';
import {K} from '../lib/timeline';
import {useT} from '../lib/time';
import {clamp, lerp, pop, smooth} from '../lib/anim';
import {Backdrop, Heading, Rise} from '../lib/ui';

const CX = 960;
const CY = 430;
const START = [
  {x: 330, y: 300},
  {x: 1590, y: 300},
  {x: 330, y: 590},
  {x: 1590, y: 590},
];
const hex = (r: number) =>
  Array.from({length: 6}, (_, i) => {
    const a = (Math.PI / 3) * i - Math.PI / 6;
    return `${CX + r * Math.cos(a)},${CY + r * Math.sin(a)}`;
  }).join(' ');

export const Merge: React.FC = () => {
  const t = useT();
  const fly = smooth(t - K.mergeMix);
  const chipOpacity = clamp(smooth(t - (K.S.merge + 0.5)) * 2) * (1 - clamp((t - K.mergeOne) / 0.35));
  const hp = clamp(pop(t - K.mergeOne), 0, 1.15);
  return (
    <AbsoluteFill>
      <Backdrop />
      <Heading kicker="DI SINILAH" title="Metode Alchemist hadir" at={K.S.merge + 0.2} color={C.em} />
      {METHODS.map((m, i) => {
        const x = lerp(START[i].x, CX, fly);
        const y = lerp(START[i].y, CY, fly);
        const idle = (1 - fly) * Math.sin(t * 2 + i * 1.7) * 10;
        return (
          <div
            key={m.code}
            style={{
              position: 'absolute',
              left: x - 130,
              top: y - 45 + idle,
              width: 260,
              height: 90,
              borderRadius: 45,
              border: `3px solid ${m.color}`,
              background: rgba(m.color, 0.16),
              color: m.color,
              fontFamily: MONO,
              fontWeight: 700,
              fontSize: 42,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              opacity: chipOpacity,
              scale: String(lerp(1, 0.55, fly)),
            }}>
            {m.code}
          </div>
        );
      })}
      <svg width={1920} height={1080} style={{position: 'absolute', left: 0, top: 0, opacity: clamp(hp * 3), scale: String(hp), transformOrigin: `${CX}px ${CY}px`}}>
        <polygon points={hex(235)} fill={rgba(C.em, 0.07)} stroke={rgba(C.em, 0.4)} strokeWidth={2} />
        <polygon points={hex(195)} fill={rgba(C.em, 0.16)} stroke={C.em} strokeWidth={5} />
        <text x={CX} y={CY + 14} textAnchor="middle" fill={C.txt} fontFamily={SANS} fontWeight={800} fontSize={44} letterSpacing={2}>ALCHEMIST</text>
        <text x={CX} y={CY + 62} textAnchor="middle" fill={C.em} fontFamily={MONO} fontWeight={700} fontSize={22}>4 METODE · 1 ANALISA</text>
      </svg>
      <Rise at={K.mergeFlow - 0.2} y={30} style={{position: 'absolute', left: 0, right: 0, top: 700, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 22}}>
        <div style={{display: 'flex', alignItems: 'center', gap: 18}}>
          {METHODS.map((m, i) => (
            <React.Fragment key={m.code}>
              <div style={{fontFamily: MONO, fontWeight: 700, fontSize: 34, color: m.color, padding: '10px 26px', border: `2px solid ${m.color}`, borderRadius: 999, background: rgba(m.color, 0.12)}}>{m.code}</div>
              {i < 3 && <div style={{fontFamily: MONO, fontWeight: 700, fontSize: 36, color: C.mut}}>→</div>}
            </React.Fragment>
          ))}
        </div>
        <div style={{fontFamily: SANS, fontWeight: 800, fontSize: 50, color: C.txt, letterSpacing: 1}}>SATU ALUR ANALISA YANG UTUH</div>
      </Rise>
    </AbsoluteFill>
  );
};
