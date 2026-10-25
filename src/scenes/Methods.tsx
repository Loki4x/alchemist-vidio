import React from 'react';
import {AbsoluteFill} from 'remotion';
import {C, METHODS, MONO, SANS, rgba} from '../lib/theme';
import {K} from '../lib/timeline';
import {useT} from '../lib/time';
import {smooth} from '../lib/anim';
import {Backdrop, Chip, Heading, InfoCard, Panel, Rise} from '../lib/ui';
import {ChartPanel, KillZones, Window} from './common';
import {litPreview, msnrPreview, smcPreview} from '../data/illustrations';

const CUES = [K.m1, K.m2, K.m3, K.m4];
const SUBS = ['Titik presisi tempat harga menolak', 'Waktu pasar paling aktif', 'Arah besar & perubahan struktur', 'Likuiditas & hubungannya dengan struktur'];
const ROLES = ['ENTRY POI', 'KILL ZONES', 'STRUCTURE', 'LIQUIDITY & STRUCTURE'];
const ILLUS = [msnrPreview(), null, smcPreview(), litPreview()];

export const Methods: React.FC = () => {
  const t = useT();
  const allOn = t >= K.mAll;
  return (
    <AbsoluteFill>
      <Backdrop />
      <Heading kicker="4 METODE" title="Masing-masing punya peran" at={K.S.methods + 0.2} />
      <div style={{position: 'absolute', left: 96, top: 190, display: 'flex', flexDirection: 'column', gap: 22}}>
        {METHODS.map((m, i) => {
          const next = CUES[i + 1] ?? K.mAll;
          const active = allOn ? 0.8 : t >= CUES[i] && t < next ? 1 : 0;
          return (
            <Rise key={m.code} at={CUES[i] - 0.1} x={-50} y={0}>
              <InfoCard title={m.code} sub={SUBS[i]} color={m.color} active={active} w={720} h={150} tag={ROLES[i]} />
            </Rise>
          );
        })}
      </div>
      {METHODS.map((m, i) => {
        const to = CUES[i + 1] ?? K.mAll;
        return (
          <Window key={m.code} from={CUES[i]} to={to}>
            {ILLUS[i] ? (
              <ChartPanel x={880} y={190} w={944} h={666} at={CUES[i]} title={`${m.code} · ${ROLES[i]}`} color={m.color} illu={ILLUS[i]!} t0={CUES[i] + 1.4} dur={4.5} />
            ) : (
              <Panel x={880} y={190} w={944} h={666} at={CUES[i]}>
                <div style={{position: 'absolute', left: 34, top: 20, fontFamily: MONO, fontWeight: 700, fontSize: 26, color: m.color, letterSpacing: 2}}>ICT · KILL ZONES</div>
                <div style={{position: 'absolute', left: 40, top: 100}}>
                  <KillZones w={864} h={520} t0={CUES[i] + 0.8} label={K.mKill} />
                </div>
              </Panel>
            )}
          </Window>
        );
      })}
      <Window from={K.mAll} to={K.S.intro + 1}>
        <Panel x={880} y={190} w={944} h={666} at={K.mAll}>
          <div style={{position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 36}}>
            <div style={{display: 'flex', gap: 16, alignItems: 'center'}}>
              {METHODS.map((m, i) => (
                <React.Fragment key={m.code}>
                  <Chip text={m.code} color={m.color} size={34} />
                  {i < 3 && <span style={{fontFamily: MONO, fontSize: 34, color: C.mut}}>+</span>}
                </React.Fragment>
              ))}
            </div>
            <div style={{fontFamily: SANS, fontWeight: 800, fontSize: 48, color: C.txt}}>SALING MELENGKAPI</div>
            <Rise at={K.mFirst - 0.2}>
              <div style={{display: 'flex', alignItems: 'center', gap: 20, padding: '20px 36px', borderRadius: 24, border: `3px solid ${C.sky}`, background: rgba(C.sky, 0.14), boxShadow: `0 0 ${30 + 14 * Math.sin((t - K.mFirst) * 5)}px ${rgba(C.sky, 0.4)}`}}>
                <span style={{fontFamily: MONO, fontWeight: 700, fontSize: 40, color: C.sky}}>MULAI DARI: MSNR</span>
                <span style={{fontFamily: SANS, fontWeight: 600, fontSize: 28, color: C.txt, opacity: smooth(t - K.mFirst)}}>titik entry</span>
              </div>
            </Rise>
          </div>
        </Panel>
      </Window>
    </AbsoluteFill>
  );
};
