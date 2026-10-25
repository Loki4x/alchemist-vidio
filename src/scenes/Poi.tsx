import React from 'react';
import {AbsoluteFill} from 'remotion';
import {C, MONO, SANS, rgba} from '../lib/theme';
import {K} from '../lib/timeline';
import {useT} from '../lib/time';
import {Backdrop, Chip, Heading, InfoCard, Rise} from '../lib/ui';
import {ChartPanel, Window} from './common';
import {classicA, classicV, ocl, poiDef, qm, rbs, sbr} from '../data/illustrations';

type Row = {code: string; sub: string; color: string; at: number; illu: ReturnType<typeof classicA>; first: number};

const ROWS: Row[] = [
  {code: 'CLASSIC A', sub: 'Resistance · puncak tajam seperti huruf A', color: C.ro, at: K.tyA, illu: classicA(), first: K.aPeak},
  {code: 'CLASSIC V', sub: 'Support · lembah tajam seperti huruf V', color: C.em, at: K.tyV, illu: classicV(), first: K.vValley},
  {code: 'SBR', sub: 'Support lama ditembus → jadi resistance', color: C.am, at: K.tySBR, illu: sbr(), first: K.sbrOld},
  {code: 'RBS', sub: 'Resistance lama ditembus → jadi support', color: C.sky, at: K.tyRBS, illu: rbs(), first: K.rbsOld},
  {code: 'QM · QUASIMODO', sub: 'Pergeseran struktur harga (MSS / CHoCH)', color: C.vi, at: K.tyQM, illu: qm(), first: K.qmPattern},
  {code: 'OCL', sub: 'Level dari open & close candle', color: C.cy, at: K.tyOCL, illu: ocl(), first: K.oclPrecise},
];

const DEF = poiDef();

const DefCard: React.FC<{at: number; color: string; head: string; body: string}> = ({at, color, head, body}) => (
  <Rise at={at} x={-40} y={0}>
    <div style={{width: 760, padding: '22px 30px', borderRadius: 22, background: C.card, border: `2px solid ${rgba(color, 0.8)}`}}>
      <div style={{fontFamily: MONO, fontWeight: 700, fontSize: 32, color}}>{head}</div>
      <div style={{fontFamily: SANS, fontWeight: 500, fontSize: 29, color: C.txt, marginTop: 6, lineHeight: 1.25}}>{body}</div>
    </div>
  </Rise>
);

export const Poi: React.FC = () => {
  const t = useT();
  return (
    <AbsoluteFill>
      <Backdrop />
      {t < K.tTypes - 0.1 ? (
        <Heading kicker="ISTILAH 1" title="POI · Point of Interest" at={K.S.poi + 0.2} color={C.sky} />
      ) : (
        <Heading kicker="JENIS-JENIS" title="Jenis POI" at={K.tTypes - 0.1} color={C.sky} />
      )}

      <Window from={K.S.poi} to={K.tTypes}>
        <div style={{position: 'absolute', left: 96, top: 200, display: 'flex', flexDirection: 'column', gap: 22}}>
          <DefCard at={K.tPoi} color={C.sky} head="POI = POINT OF INTEREST" body="Jejak ekstrem yang ditinggalkan pasar" />
          <DefCard at={K.tDef} color={C.am} head="BUKAN AREA LEBAR YANG DIARSIR" body="Satu titik harga pasti tempat harga ditolak kuat lalu berbalik arah" />
          <DefCard at={K.tMemory - 0.5} color={C.em} head="“MEMORI” BENTURAN KERAS" body="Itulah yang membuat titik ini menarik sebagai peluang entry di masa depan" />
        </div>
        <ChartPanel x={920} y={200} w={904} h={640} at={K.tPoi} title="POI · SATU TITIK PASTI" color={C.sky} illu={DEF} t0={K.tPoi + 0.4} dur={4.5} />
      </Window>

      <Window from={K.tTypes - 0.1} to={K.S.aoi}>
        <div style={{position: 'absolute', left: 96, top: 196, display: 'flex', flexDirection: 'column', gap: 10}}>
          {ROWS.map((r, i) => {
            const end = ROWS[i + 1]?.at ?? K.S.aoi;
            const active = t >= r.at && t < end ? 1 : 0;
            return (
              <Rise key={r.code} at={r.at - 0.1} x={-40} y={0}>
                <InfoCard title={r.code} sub={r.sub} color={r.color} active={active} w={740} h={104} />
              </Rise>
            );
          })}
        </div>
        {ROWS.map((r, i) => {
          const end = ROWS[i + 1]?.at ?? K.S.aoi;
          const dur = Math.max(2.4, r.first - r.at + 0.6);
          return (
            <Window key={r.code} from={r.at} to={end}>
              <ChartPanel x={880} y={196} w={944} h={620} at={r.at} title={r.code} color={r.color} illu={r.illu} t0={r.at + 0.1} dur={dur} />
            </Window>
          );
        })}
        <Window from={K.tyA} to={K.S.aoi}>
          <Rise at={K.tyA + 0.5} style={{position: 'absolute', left: 880, top: 828}}>
            <Chip text="POI = CLOSE CANDLE SEBELUMNYA · BUKAN EKOR" color={C.am} size={24} />
          </Rise>
        </Window>
      </Window>
    </AbsoluteFill>
  );
};
