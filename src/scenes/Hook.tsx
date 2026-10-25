import React, {useMemo} from 'react';
import {AbsoluteFill} from 'remotion';
import {C, METHODS, MONO, SANS, rgba} from '../lib/theme';
import {K} from '../lib/timeline';
import {useT} from '../lib/time';
import {clamp, pop, prog, smooth} from '../lib/anim';
import {Backdrop, Chip, Heading, Panel, Pop} from '../lib/ui';

const PW = 1664;
const PH = 560;
const N = 240;

const series = (() => {
  const price: number[] = [];
  for (let i = 0; i < N; i++) {
    price.push(300 + 120 * Math.sin(i * 0.045) + 70 * Math.sin(i * 0.13 + 1) + 34 * Math.sin(i * 0.31 + 2) - i * 0.25);
  }
  const ma = (win: number) => price.map((_, i) => {
    let s = 0;
    let c = 0;
    for (let k = Math.max(0, i - win); k <= i; k++) { s += price[k]; c++; }
    return s / c;
  });
  const path = (a: number[]) => a.map((v, i) => `${i === 0 ? 'M' : 'L'} ${(i / (N - 1)) * PW} ${v}`).join(' ');
  return {price: path(price), a: path(ma(14)), b: path(ma(46))};
})();

const CHIP_POS = [
  {x: 260, y: 90},
  {x: 640, y: 420},
  {x: 1020, y: 70},
  {x: 1330, y: 400},
];

export const Hook: React.FC = () => {
  const t = useT();
  const draw = prog(t, 0.6, 6.5);
  const dim = 1 - 0.55 * smooth(t - K.hookConfused);
  const wob = Math.sin((t - K.hookConfused) * 9) * 3;
  return (
    <AbsoluteFill>
      <Backdrop />
      <Heading kicker="HALO, TEMAN-TEMAN!" title="Pernah belajar banyak metode sekaligus?" at={0.2} />
      <Panel x={128} y={210} w={1664} h={620} at={0.4}>
        <svg width={PW} height={PH} style={{position: 'absolute', left: 0, top: 30, opacity: dim}}>
          <path d={series.price} fill="none" stroke={C.txt} strokeWidth={4} strokeLinejoin="round" pathLength={1} strokeDasharray="1" strokeDashoffset={1 - draw} />
          <path d={series.a} fill="none" stroke={C.cy} strokeWidth={3} pathLength={1} strokeDasharray="1" strokeDashoffset={1 - clamp(draw * 1.2 - 0.1)} />
          <path d={series.b} fill="none" stroke={C.am} strokeWidth={3} pathLength={1} strokeDasharray="1" strokeDashoffset={1 - clamp(draw * 1.2 - 0.2)} />
        </svg>
        {METHODS.map((m, i) => (
          <Pop key={m.code} at={K.hookMulti + i * 0.42} style={{position: 'absolute', left: CHIP_POS[i].x, top: CHIP_POS[i].y + 40}}>
            <Chip text={m.code} color={m.color} size={40} />
          </Pop>
        ))}
        <Pop at={K.hookA} style={{position: 'absolute', left: 120, top: 520}}>
          <Chip text="METODE A: ▲ BELI!" color={C.em} size={34} solid />
        </Pop>
        <Pop at={K.hookB} style={{position: 'absolute', right: 120, top: 520}}>
          <Chip text="METODE B: ▼ JUAL!" color={C.ro} size={34} solid />
        </Pop>
        <div
          style={{
            position: 'absolute',
            left: 0,
            right: 0,
            top: 190,
            display: 'flex',
            justifyContent: 'center',
            opacity: clamp(pop(t - K.hookConfused) * 3),
            scale: String(clamp(pop(t - K.hookConfused), 0, 1.2)),
            rotate: `${wob}deg`,
          }}>
          <div style={{fontFamily: SANS, fontWeight: 800, fontSize: 150, color: C.am, textShadow: `0 0 60px ${rgba(C.am, 0.5)}`, letterSpacing: -2}}>BINGUNG?</div>
        </div>
      </Panel>
      <div style={{position: 'absolute', left: 128, top: 850, fontFamily: MONO, fontWeight: 700, fontSize: 22, color: C.mut, opacity: smooth(t - 1)}} />
    </AbsoluteFill>
  );
};
