import React from 'react';
import {AbsoluteFill} from 'remotion';
import {C, MONO, SANS, rgba} from '../lib/theme';
import {K} from '../lib/timeline';
import {useT} from '../lib/time';
import {Backdrop, Rise} from '../lib/ui';
import {ChartPanel} from './common';
import {introIllu} from '../data/illustrations';
import {Heading} from '../lib/ui';

const ILLU = introIllu();

const Note: React.FC<{at: number; color: string; title: string; sub: string}> = ({at, color, title, sub}) => (
  <Rise at={at} x={40} y={0}>
    <div style={{width: 640, padding: '24px 30px', borderRadius: 22, background: C.card, border: `2px solid ${rgba(color, 0.8)}`}}>
      <div style={{fontFamily: MONO, fontWeight: 700, fontSize: 32, color}}>{title}</div>
      <div style={{fontFamily: SANS, fontWeight: 500, fontSize: 28, color: C.mut, marginTop: 8, lineHeight: 1.25}}>{sub}</div>
    </div>
  </Rise>
);

export const MsnrIntro: React.FC = () => {
  const t = useT();
  const named = t >= K.iName - 0.2;
  return (
    <AbsoluteFill>
      <Backdrop />
      {!named ? (
        <Heading kicker="CARA KONVENSIONAL" title="Menebak-nebak area yang lebar" at={K.S.intro + 0.2} color={C.ro} />
      ) : (
        <Heading kicker="METODE MSNR" title="Malaysian Support & Resistance" at={K.iName - 0.2} color={C.sky} />
      )}
      <ChartPanel x={96} y={200} w={1060} h={640} at={K.S.intro + 0.4} title="BTC / USD · 1H" color={C.mut} illu={ILLU} t0={K.S.intro + 0.8} dur={5.5} />
      <div style={{position: 'absolute', left: 1200, top: 230, display: 'flex', flexDirection: 'column', gap: 26}}>
        <Note at={K.iWide} color={C.ro} title="AREA LEBAR & TIDAK PASTI" sub="Support dan resistance yang ditandai asal luas" />
        <Note at={K.iSpecific} color={C.am} title="JEJAK SANGAT SPESIFIK" sub="Setiap penolakan harga meninggalkan satu titik" />
        <Note at={K.iName + 0.4} color={C.sky} title="PETA HARGA PRESISI" sub="Berdasarkan struktur pasar yang sebenarnya" />
      </div>
    </AbsoluteFill>
  );
};
