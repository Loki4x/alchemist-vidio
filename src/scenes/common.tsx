import React from 'react';
import {C, MONO, SANS, rgba} from '../lib/theme';
import {clamp, smooth} from '../lib/anim';
import {useT} from '../lib/time';
import {CandleChart, Illu} from '../lib/chart';
import {Panel} from '../lib/ui';

/** Show children only while from ≤ t ≤ to, fading at both edges. */
export const Window: React.FC<{from: number; to: number; children?: React.ReactNode}> = ({from, to, children}) => {
  const t = useT();
  if (t < from - 0.02 || t > to + 0.35) return null;
  const o = clamp((t - from) / 0.3 + 0.05) * clamp((to + 0.3 - t) / 0.3);
  return <div style={{position: 'absolute', left: 0, top: 0, right: 0, bottom: 0, opacity: o}}>{children}</div>;
};

export const ChartPanel: React.FC<{
  x: number; y: number; w: number; h: number; at: number; title: string; color: string; illu: Illu; t0: number; dur: number;
}> = ({x, y, w, h, at, title, color, illu, t0, dur}) => (
  <Panel x={x} y={y} w={w} h={h} at={at}>
    <div style={{position: 'absolute', left: 34, top: 20, fontFamily: MONO, fontWeight: 700, fontSize: 26, color, letterSpacing: 2}}>{title}</div>
    <div style={{position: 'absolute', left: 28, top: 72}}>
      <CandleChart illu={illu} w={w - 56} h={h - 100} t0={t0} dur={dur} />
    </div>
  </Panel>
);

/** Activity bars across the day with highlighted kill zones. */
const ACT = [20, 24, 30, 22, 18, 26, 36, 62, 86, 96, 72, 46, 50, 66, 92, 100, 84, 56, 36, 26, 20, 18, 22, 24];
export const KillZones: React.FC<{w: number; h: number; t0: number; label: number}> = ({w, h, t0, label}) => {
  const t = useT();
  const slot = w / ACT.length;
  const zone = (i: number) => (i >= 7 && i <= 10) || (i >= 13 && i <= 16);
  const base = h - 70;
  return (
    <svg width={w} height={h} style={{overflow: 'visible'}}>
      <line x1={0} x2={w} y1={base} y2={base} stroke="rgba(255,255,255,0.2)" strokeWidth={2} />
      {ACT.map((v, i) => {
        const g = smooth(t - (t0 + i * 0.05));
        const hz = zone(i) ? clamp(smooth(t - label)) : 0;
        const col = hz > 0.05 ? C.am : C.mut;
        const bh = (v / 100) * (base - 40) * g;
        return <rect key={i} x={i * slot + slot * 0.14} y={base - bh} width={slot * 0.72} height={bh} rx={6} fill={col} opacity={hz > 0.05 ? 0.95 : 0.4} />;
      })}
      <text x={0} y={h - 22} fill={C.mut} fontFamily={MONO} fontWeight={700} fontSize={24}>WAKTU →</text>
      <text x={w} y={h - 22} textAnchor="end" fill={C.mut} fontFamily={MONO} fontWeight={700} fontSize={24}>AKTIVITAS PASAR ↑</text>
      <g opacity={smooth(t - label)}>
        <text x={8.5 * slot} y={52} textAnchor="middle" fill={C.am} fontFamily={MONO} fontWeight={700} fontSize={30}>KILL ZONE</text>
        <text x={14.5 * slot} y={52} textAnchor="middle" fill={C.am} fontFamily={MONO} fontWeight={700} fontSize={30}>KILL ZONE</text>
      </g>
    </svg>
  );
};

export const BigStatement: React.FC<{text: string; color: string; size?: number}> = ({text, color, size = 54}) => (
  <div style={{fontFamily: SANS, fontWeight: 800, fontSize: size, color, lineHeight: 1.2, textAlign: 'center', textShadow: `0 0 40px ${rgba(color, 0.35)}`}}>{text}</div>
);
