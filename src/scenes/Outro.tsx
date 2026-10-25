import React from 'react';
import {AbsoluteFill} from 'remotion';
import {C, METHODS, MONO, SANS, rgba} from '../lib/theme';
import {K} from '../lib/timeline';
import {Backdrop, Heading, Rise} from '../lib/ui';

export const Outro: React.FC = () => {
  const s = K.S.outro;
  return (
    <AbsoluteFill>
      <Backdrop />
      <Heading kicker="RINGKASAN" title="Alchemist = MSNR + ICT + SMC + LIT" at={s + 0.1} color={C.em} />
      <div style={{position: 'absolute', left: 115, top: 270, display: 'flex', gap: 30}}>
        {METHODS.map((m, i) => (
          <Rise key={m.code} at={s + 0.3 + i * 0.15}>
            <div style={{width: 400, height: 280, borderRadius: 26, background: C.card, border: `2px solid ${rgba(m.color, 0.8)}`, position: 'relative', overflow: 'hidden'}}>
              <div style={{position: 'absolute', left: 0, right: 0, top: 0, height: 10, background: m.color}} />
              <div style={{position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 14}}>
                <div style={{fontFamily: MONO, fontWeight: 700, fontSize: 70, color: m.color}}>{m.code}</div>
                <div style={{fontFamily: SANS, fontWeight: 600, fontSize: 30, color: C.txt}}>{m.role}</div>
              </div>
            </div>
          </Rise>
        ))}
      </div>
      <Rise at={s + 1.0} style={{position: 'absolute', left: 0, right: 0, top: 650, display: 'flex', justifyContent: 'center'}}>
        <div style={{padding: '26px 44px', borderRadius: 24, border: `2px solid ${C.am}`, background: rgba(C.am, 0.1), fontFamily: SANS, fontWeight: 600, fontSize: 36, color: C.txt, textAlign: 'center', lineHeight: 1.3}}>
          Konten edukasi, bukan saran investasi.
          <br />
          Selalu terapkan manajemen risiko.
        </div>
      </Rise>
    </AbsoluteFill>
  );
};
