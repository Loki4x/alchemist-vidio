import React from 'react';
import {AbsoluteFill} from 'remotion';
import {C, METHODS, MONO, SANS, rgba} from '../lib/theme';
import {K} from '../lib/timeline';
import {Backdrop, Chip, Heading, Pop, Rise} from '../lib/ui';

export const Outro: React.FC = () => {
  const s = K.S.outro;
  return (
    <AbsoluteFill>
      <Backdrop />
      <Heading kicker="RINGKASAN" title="Alchemist = MSNR + ICT + SMC + LIT" at={s + 0.1} color={C.em} />
      <div style={{position: 'absolute', left: 115, top: 230, display: 'flex', gap: 30}}>
        {METHODS.map((m, i) => (
          <Rise key={m.code} at={s + 0.3 + i * 0.15}>
            <div style={{width: 400, height: 220, borderRadius: 26, background: C.card, border: `2px solid ${rgba(m.color, 0.8)}`, position: 'relative', overflow: 'hidden'}}>
              <div style={{position: 'absolute', left: 0, right: 0, top: 0, height: 10, background: m.color}} />
              <div style={{position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 12}}>
                <div style={{fontFamily: MONO, fontWeight: 700, fontSize: 64, color: m.color}}>{m.code}</div>
                <div style={{fontFamily: SANS, fontWeight: 600, fontSize: 28, color: C.txt}}>{m.role}</div>
              </div>
            </div>
          </Rise>
        ))}
      </div>
      <Rise at={K.cMsnr} style={{position: 'absolute', left: 0, right: 0, top: 490, display: 'flex', justifyContent: 'center', gap: 24, alignItems: 'center'}}>
        <Chip text="BERHENTI MENEBAK AREA LEBAR" color={C.ro} size={30} />
        <span style={{fontFamily: MONO, fontWeight: 700, fontSize: 34, color: C.mut}}>→</span>
        <Pop at={K.cPoint - 0.2}>
          <Chip text="FOKUS TITIK HARGA PRESISI" color={C.sky} size={30} solid />
        </Pop>
      </Rise>
      <div style={{position: 'absolute', left: 0, right: 0, top: 590, display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 22}}>
        <Rise at={K.cPoi - 0.4}>
          <div style={{fontFamily: SANS, fontWeight: 700, fontSize: 32, color: C.mut}}>PAHAMI DULU</div>
        </Rise>
        <Pop at={K.cPoi}><Chip text="POI" color={C.sky} size={36} solid /></Pop>
        <Pop at={K.cPoi + 0.45}><Chip text="AOI" color={C.am} size={36} solid /></Pop>
        <Rise at={K.cPoi + 0.9}>
          <div style={{fontFamily: SANS, fontWeight: 700, fontSize: 32, color: C.mut}}>= fondasi membaca pasar</div>
        </Rise>
      </div>
      <Rise at={K.cRead + 0.4} style={{position: 'absolute', left: 0, right: 0, top: 720, display: 'flex', justifyContent: 'center'}}>
        <div style={{padding: '14px 32px', borderRadius: 18, border: `2px solid ${C.am}`, background: rgba(C.am, 0.1), fontFamily: SANS, fontWeight: 600, fontSize: 27, color: C.txt, textAlign: 'center'}}>
          Konten edukasi, bukan saran investasi. Selalu terapkan manajemen risiko.
        </div>
      </Rise>
    </AbsoluteFill>
  );
};
