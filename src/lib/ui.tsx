import React from 'react';
import {AbsoluteFill} from 'remotion';
import {C, MONO, SANS, rgba} from './theme';
import {clamp, pop, smooth} from './anim';
import {useT} from './time';

export const Backdrop: React.FC = () => (
  <AbsoluteFill style={{background: C.bg}}>
    <style>{'*, *::before, *::after { box-sizing: border-box; }'}</style>
    <AbsoluteFill
      style={{
        background:
          'radial-gradient(900px 600px at 15% 10%, rgba(14,165,233,0.10), transparent 70%), radial-gradient(900px 700px at 90% 95%, rgba(16,185,129,0.09), transparent 70%)',
      }}
    />
    <AbsoluteFill
      style={{
        backgroundImage:
          'linear-gradient(rgba(255,255,255,0.025) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.025) 1px, transparent 1px)',
        backgroundSize: '80px 80px',
      }}
    />
  </AbsoluteFill>
);

/** Fade + rise in at absolute time `at`. */
export const Rise: React.FC<{at: number; y?: number; x?: number; style?: React.CSSProperties; children?: React.ReactNode}> = ({at, y = 28, x = 0, style, children}) => {
  const t = useT();
  const g = smooth(t - at);
  return (
    <div style={{opacity: clamp(g * 1.6), translate: `${(1 - g) * x}px ${(1 - g) * y}px`, ...style}}>{children}</div>
  );
};

/** Springy pop-in (signals, badges). */
export const Pop: React.FC<{at: number; style?: React.CSSProperties; children?: React.ReactNode}> = ({at, style, children}) => {
  const t = useT();
  const g = pop(t - at);
  return <div style={{opacity: clamp(g * 3), scale: String(clamp(g, 0, 1.2)), ...style}}>{children}</div>;
};

export const Heading: React.FC<{kicker: string; title: string; at?: number; color?: string; x?: number; y?: number}> = ({kicker, title, at = 0, color = C.cy, x = 96, y = 64}) => (
  <Rise at={at} style={{position: 'absolute', left: x, top: y}}>
    <div style={{fontFamily: MONO, fontWeight: 700, fontSize: 24, letterSpacing: 6, color}}>{kicker}</div>
    <div style={{fontFamily: SANS, fontWeight: 800, fontSize: 62, color: C.txt, marginTop: 6, letterSpacing: -1}}>{title}</div>
  </Rise>
);

export const Panel: React.FC<{x: number; y: number; w: number; h: number; at?: number; children?: React.ReactNode; style?: React.CSSProperties}> = ({x, y, w, h, at = 0, children, style}) => (
  <Rise at={at} y={20} style={{position: 'absolute', left: x, top: y, width: w, height: h}}>
    <div style={{position: 'absolute', inset: 0, borderRadius: 28, background: C.card, border: `1.5px solid ${C.border}`, ...style}}>{children}</div>
  </Rise>
);

export const Chip: React.FC<{text: string; color: string; size?: number; solid?: boolean}> = ({text, color, size = 34, solid}) => (
  <div
    style={{
      display: 'inline-block',
      padding: `${size * 0.32}px ${size * 0.75}px`,
      borderRadius: 999,
      fontFamily: MONO,
      fontWeight: 700,
      fontSize: size,
      color: solid ? C.bg : color,
      background: solid ? color : rgba(color, 0.14),
      border: `2px solid ${color}`,
      whiteSpace: 'nowrap',
    }}>
    {text}
  </div>
);

/** A method / term card with accent bar; `active` 0..1 brightens it. */
export const InfoCard: React.FC<{title: string; sub: string; color: string; active?: number; w?: number; h?: number; tag?: string}> = ({title, sub, color, active = 1, w = 760, h = 150, tag}) => (
  <div
    style={{
      position: 'relative',
      width: w,
      height: h,
      borderRadius: 22,
      background: active > 0.5 ? C.cardHi : C.card,
      border: `2px solid ${active > 0.5 ? color : C.border}`,
      boxShadow: active > 0.5 ? `0 0 38px ${rgba(color, 0.25)}` : 'none',
      overflow: 'hidden',
    }}>
    <div style={{position: 'absolute', left: 0, top: 0, bottom: 0, width: 10, background: color, opacity: 0.35 + 0.65 * active}} />
    {tag && (
      <div style={{position: 'absolute', right: 24, top: 18, fontFamily: MONO, fontWeight: 700, fontSize: 22, color, opacity: 0.9}}>{tag}</div>
    )}
    <div style={{position: 'absolute', left: 38, top: 0, bottom: 0, right: 24, display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: h < 120 ? 2 : 8}}>
      <div style={{fontFamily: MONO, fontWeight: 700, fontSize: h < 120 ? 32 : 40, color}}>{title}</div>
      <div style={{fontFamily: SANS, fontWeight: 500, fontSize: h < 120 ? 23 : 27, color: C.mut, lineHeight: 1.2}}>{sub}</div>
    </div>
  </div>
);

export const Check: React.FC<{text: string; at: number; color: string; n: number}> = ({text, at, color, n}) => (
  <Rise at={at} x={-40} y={0}>
    <div style={{display: 'flex', alignItems: 'center', gap: 24, padding: '22px 30px', borderRadius: 20, background: C.card, border: `2px solid ${rgba(color, 0.7)}`, width: 740}}>
      <div style={{width: 64, height: 64, borderRadius: 32, background: color, color: C.bg, fontFamily: MONO, fontWeight: 700, fontSize: 36, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0}}>{n}</div>
      <div style={{fontFamily: SANS, fontWeight: 600, fontSize: 31, color: C.txt, lineHeight: 1.25}}>{text}</div>
    </div>
  </Rise>
);
