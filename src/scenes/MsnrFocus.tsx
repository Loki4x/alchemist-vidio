import React from 'react';
import {AbsoluteFill} from 'remotion';
import {C, MONO, SANS, rgba} from '../lib/theme';
import {K} from '../lib/timeline';
import {useT} from '../lib/time';
import {clamp, smooth} from '../lib/anim';
import {Backdrop, Check, Chip, Heading, Pop, Rise} from '../lib/ui';
import {ChartPanel} from './common';
import {extremeBounce} from '../data/illustrations';

const ILLU = extremeBounce();

export const MsnrFocus: React.FC = () => {
  const t = useT();
  const rr = smooth(t - K.fRisk);
  return (
    <AbsoluteFill>
      <Backdrop />
      <Heading kicker="FOKUS UTAMA" title="Extreme Bounce Points" at={K.S.focus + 0.2} color={C.sky} />
      <ChartPanel x={96} y={200} w={1000} h={640} at={K.S.focus + 0.4} title="TITIK PANTULAN EKSTREM" color={C.sky} illu={ILLU} t0={K.S.focus + 0.8} dur={5} />
      <Pop at={K.fGray} style={{position: 'absolute', left: 140, top: 842}}>
        <Chip text="AREA ABU-ABU" color={C.mut} size={26} />
      </Pop>
      <Pop at={K.fSharp} style={{position: 'absolute', left: 470, top: 842}}>
        <Chip text="TITIK TUNGGAL TAJAM" color={C.sky} size={26} solid />
      </Pop>
      <div style={{position: 'absolute', left: 1130, top: 200, display: 'flex', flexDirection: 'column', gap: 20}}>
        <Rise at={K.fThree - 0.1} y={10}>
          <div style={{fontFamily: MONO, fontWeight: 700, fontSize: 26, letterSpacing: 4, color: C.mut}}>3 MANFAAT</div>
        </Rise>
        <Check n={1} at={K.f1} color={C.em} text="Melihat level penolakan harga yang sesungguhnya" />
        <Check n={2} at={K.f2} color={C.sky} text="Titik entry sangat presisi, risiko terukur" />
        <Check n={3} at={K.f3} color={C.am} text="Tidak bingung di mana harga akan bereaksi" />
        <div style={{opacity: clamp(rr * 2), translate: `0 ${(1 - rr) * 20}px`, width: 740, marginTop: 6}}>
          <div style={{display: 'flex', alignItems: 'center', gap: 18, fontFamily: MONO, fontWeight: 700, fontSize: 26, color: C.txt}}>
            <span style={{color: C.mut}}>RISK : REWARD</span>
            <span style={{color: C.em, fontSize: 34}}>1 : 3</span>
          </div>
          <div style={{display: 'flex', height: 56, marginTop: 12, borderRadius: 14, overflow: 'hidden', width: 740}}>
            <div style={{width: 185 * rr, background: rgba(C.ro, 0.9), display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: MONO, fontWeight: 700, fontSize: 26, color: C.bg}}>{rr > 0.6 ? 'RISIKO' : ''}</div>
            <div style={{width: 555 * rr, background: rgba(C.em, 0.9), display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: MONO, fontWeight: 700, fontSize: 26, color: C.bg}}>{rr > 0.6 ? 'POTENSI PROFIT' : ''}</div>
          </div>
        </div>
      </div>
      <div style={{position: 'absolute', left: 1140, top: 910, fontFamily: SANS, color: 'transparent'}} />
    </AbsoluteFill>
  );
};
