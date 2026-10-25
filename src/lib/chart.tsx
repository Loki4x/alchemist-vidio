import React from 'react';
import {C, MONO, rgba} from './theme';
import {clamp, lerp, pop, smooth} from './anim';
import {useT} from './time';

export type Candle = {o: number; h: number; l: number; c: number};

/** Candles from consecutive closes: candle i opens at closes[i] and closes at closes[i+1]. */
export const seq = (closes: number[]): Candle[] =>
  closes.slice(0, -1).map((o, i) => {
    const c = closes[i + 1];
    const up = 0.7 + ((i * 7 + 3) % 5) * 0.32;
    const dn = 0.7 + ((i * 11 + 1) % 5) * 0.32;
    return {o, c, h: Math.max(o, c) + up, l: Math.min(o, c) - dn};
  });

export const withHL = (cs: Candle[], over: Record<number, Partial<Candle>>): Candle[] =>
  cs.map((c, i) => ({...c, ...(over[i] ?? {})}));

/** [open, high, low, close] rows → candles */
export const ohlc = (rows: number[][]): Candle[] => rows.map(([o, h, l, c]) => ({o, h, l, c}));

type Base = {at: number; delay?: number; until?: number};
export type Ann =
  | (Base & {k: 'line'; from: number; to?: number; p: number; color: string; dash?: boolean; label?: string; dy?: number; lend?: boolean; flipAt?: number; flipColor?: string; flipLabel?: string})
  | (Base & {k: 'box'; from: number; to?: number; lo: number; hi: number; color: string; label?: string; right?: boolean; flipAt?: number; flipColor?: string; flipLabel?: string})
  | (Base & {k: 'ring'; i: number; p: number; color: string; r?: number})
  | (Base & {k: 'arrow'; i: number; p0: number; p1: number; color: string; i1?: number})
  | (Base & {k: 'tag'; i: number; p: number; text: string; color: string; size?: number; anchor?: 'start' | 'middle' | 'end'});

export type Illu = {cs: Candle[]; yMin: number; yMax: number; ann: Ann[]; extra?: number};

type Props = {
  illu: Illu;
  w: number;
  h: number;
  /** absolute time the first candle starts to appear */
  t0: number;
  /** seconds over which all candles appear */
  dur: number;
  /** pop-in everything after this time instead of per annotation (optional) */
  fade?: number;
};

export const CandleChart: React.FC<Props> = ({illu, w, h, t0, dur}) => {
  const t = useT();
  const {cs, yMin, yMax, ann} = illu;
  const n = cs.length + (illu.extra ?? 0);
  const slot = w / n;
  const padY = 26;
  const X = (i: number) => (i + 0.5) * slot;
  const Y = (p: number) => padY + (1 - (p - yMin) / (yMax - yMin)) * (h - padY * 2);
  const step = dur / cs.length;
  const bw = slot * 0.58;

  const renderAnn = (a: Ann, idx: number): React.ReactNode => {
    const s = t - a.at - (a.delay ?? 0);
    if (s <= 0) return null;
        const g = smooth(s);
        if (a.k === 'line') {
          const x1 = X(a.from) - slot * 0.45;
          const x2 = a.to === undefined ? w : X(a.to) + slot * 0.45;
          const flipped = a.flipAt !== undefined && t >= a.flipAt;
          const col = flipped && a.flipColor ? a.flipColor : a.color;
          const label = flipped && a.flipLabel ? a.flipLabel : a.label;
          const y = Y(a.p);
          const pp = flipped ? clamp(pop(t - (a.flipAt ?? 0)), 0, 1.3) : 1;
          const atEnd = a.to === undefined || !!a.lend;
          const labelX = atEnd ? (a.to === undefined ? w - 8 : x2 - 6) : x1 + 6;
          return (
            <g key={idx}>
              <line x1={x1} x2={lerp(x1, x2, g)} y1={y} y2={y} stroke={col} strokeWidth={flipped ? 4 : 3} strokeDasharray={a.dash ? '12 9' : undefined} />
              {label && (
                <text x={labelX} y={y + (a.dy ?? -12)} textAnchor={atEnd ? 'end' : 'start'} fill={col} fontFamily={MONO} fontWeight={700} fontSize={22} opacity={g} style={{transformOrigin: `${labelX}px ${y}px`, scale: String(0.9 + 0.1 * pp)}}>
                  {label}
                </text>
              )}
            </g>
          );
        }
        if (a.k === 'box') {
          const x1 = X(a.from) - slot * 0.5;
          const x2 = a.to === undefined ? w : X(a.to) + slot * 0.5;
          const flipped = a.flipAt !== undefined && t >= a.flipAt;
          const col = flipped && a.flipColor ? a.flipColor : a.color;
          const label = flipped && a.flipLabel ? a.flipLabel : a.label;
          const yt = Y(a.hi);
          const yb = Y(a.lo);
          const pp = flipped ? clamp(pop(t - (a.flipAt ?? 0)), 0, 1.25) : 1;
          const lx = a.right ? x2 - 8 : x1 + 10;
          return (
            <g key={idx}>
              <rect x={x1} y={yt} width={Math.max(2, (x2 - x1) * g)} height={yb - yt} rx={4} fill={rgba(col, 0.2)} stroke={col} strokeWidth={2.5} />
              {label && (
                <text
                  x={lx}
                  y={yt - 10}
                  textAnchor={a.right ? 'end' : 'start'}
                  fill={col}
                  fontFamily={MONO}
                  fontWeight={700}
                  fontSize={24}
                  opacity={g}
                  style={{transformOrigin: `${lx}px ${yt}px`, scale: String(0.9 + 0.1 * pp)}}>
                  {label}
                </text>
              )}
            </g>
          );
        }
        if (a.k === 'ring') {
          const r = (a.r ?? 28) * clamp(pop(s), 0, 1.2);
          const pulse = 1 + 0.08 * Math.sin(s * 5);
          return <circle key={idx} cx={X(a.i)} cy={Y(a.p)} r={r * pulse} fill="none" stroke={a.color} strokeWidth={4} opacity={0.95} />;
        }
        if (a.k === 'arrow') {
          const x0 = X(a.i);
          const x1 = X(a.i1 ?? a.i);
          const y0 = Y(a.p0);
          const y1 = Y(a.p1);
          const ex = lerp(x0, x1, g);
          const ey = lerp(y0, y1, g);
          const ang = Math.atan2(y1 - y0, x1 - x0);
          const hs = 18;
          const p1 = [ex - hs * Math.cos(ang - 0.45), ey - hs * Math.sin(ang - 0.45)];
          const p2 = [ex - hs * Math.cos(ang + 0.45), ey - hs * Math.sin(ang + 0.45)];
          return (
            <g key={idx} opacity={clamp(g * 2)}>
              <line x1={x0} y1={y0} x2={ex} y2={ey} stroke={a.color} strokeWidth={6} strokeLinecap="round" />
              <path d={`M ${ex} ${ey} L ${p1[0]} ${p1[1]} L ${p2[0]} ${p2[1]} Z`} fill={a.color} />
            </g>
          );
        }
        // tag
        const size = a.size ?? 24;
        const tw = a.text.length * size * 0.62 + 24;
        const th = size + 18;
        const cx = X(a.i);
        const cy = Y(a.p);
        const sc = clamp(pop(s), 0, 1.15);
        const off = a.anchor === 'end' ? -tw : a.anchor === 'start' ? 0 : -tw / 2;
        return (
          <g key={idx} opacity={clamp(g * 2)} style={{transformOrigin: `${cx}px ${cy}px`, scale: String(sc)}}>
            <rect x={cx + off} y={cy - th / 2} width={tw} height={th} rx={th / 2} fill="rgba(10,14,23,0.92)" stroke={a.color} strokeWidth={2.5} />
            <text x={cx + off + tw / 2} y={cy + size * 0.35} textAnchor="middle" fill={a.color} fontFamily={MONO} fontWeight={700} fontSize={size}>
              {a.text}
            </text>
          </g>
        );
  };

  return (
    <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`} style={{overflow: 'visible'}}>
      {[0.2, 0.4, 0.6, 0.8].map((g) => (
        <line key={g} x1={0} x2={w} y1={h * g} y2={h * g} stroke="rgba(255,255,255,0.05)" strokeWidth={1} />
      ))}
      {cs.map((c, i) => {
        const a = smooth(t - (t0 + i * step));
        if (a <= 0.001) return null;
        const bull = c.c >= c.o;
        const col = bull ? C.em : C.ro;
        const top = Y(Math.max(c.o, c.c));
        const bot = Y(Math.min(c.o, c.c));
        const mid = (top + bot) / 2;
        const sy = (v: number) => lerp(mid, v, a);
        return (
          <g key={i} opacity={clamp(a * 1.4)}>
            <line x1={X(i)} x2={X(i)} y1={sy(Y(c.h))} y2={sy(Y(c.l))} stroke={col} strokeWidth={3} strokeLinecap="round" />
            <rect x={X(i) - bw / 2} y={sy(top)} width={bw} height={Math.max(4, sy(bot) - sy(top))} rx={3} fill={col} />
          </g>
        );
      })}
      {ann.map((a, idx) => {
        const fo = a.until === undefined ? 1 : 1 - smooth(t - a.until);
        if (fo <= 0.01) return null;
        return (
          <g key={idx} opacity={fo}>
            {renderAnn(a, idx)}
          </g>
        );
      })}
    </svg>
  );
};
