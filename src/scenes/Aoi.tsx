import React from 'react';
import {AbsoluteFill} from 'remotion';
import {C, MONO, SANS, rgba} from '../lib/theme';
import {K} from '../lib/timeline';
import {useT} from '../lib/time';
import {Backdrop, Chip, Heading, InfoCard, Rise} from '../lib/ui';
import {ChartPanel, Window} from './common';
import {aoiIntro, breaker, fvgIllu, ifvgIllu, orderBlock} from '../data/illustrations';
import type {Illu} from '../lib/chart';

type Row = {code: string; sub: string; color: string; at: number; illu: Illu; t0: number; dur: number; chips: {at: number; text: string; color: string}[]};

const ROWS: Row[] = [
  {
    code: 'OB · ORDER BLOCK', sub: 'Candle terakhir yang berlawanan arah sebelum impulsif', color: C.em, at: K.ob, illu: orderBlock(), t0: K.ob + 0.2, dur: 2.9,
    chips: [
      {at: K.obAcc, text: 'AKUMULASI / DISTRIBUSI ORDER BESAR', color: C.em},
      {at: K.obFast, text: 'HARGA BERGERAK CEPAT', color: C.am},
    ],
  },
  {
    code: 'BB · BREAKER BLOCK', sub: 'OB yang gagal menahan harga → fungsinya berbalik', color: C.ro, at: K.bb, illu: breaker(), t0: K.bb + 0.2, dur: 2.6,
    chips: [{at: K.bbEx, text: 'OB PENAHAN TURUN → RESISTANCE KUAT', color: C.ro}],
  },
  {
    code: 'FVG · FAIR VALUE GAP', sub: 'Celah antara wick candle pertama & ketiga', color: C.sky, at: K.fvg, illu: fvgIllu(), t0: K.fvg + 0.2, dur: 7,
    chips: [{at: K.fvgBal, text: 'HARGA KEMBALI MENYEIMBANGKAN', color: C.sky}],
  },
  {
    code: 'IFVG · INVERSION FVG', sub: 'FVG tertembus penuh → berbalik fungsi', color: C.vi, at: K.ifvg, illu: ifvgIllu(), t0: K.ifvg + 0.1, dur: 3.4,
    chips: [{at: K.ifvgSbr, text: 'MIRIP KONSEP SBR', color: C.vi}],
  },
];

const AOI = aoiIntro();

const DefCard: React.FC<{at: number; color: string; head: string; body: string}> = ({at, color, head, body}) => (
  <Rise at={at} x={-40} y={0}>
    <div style={{width: 780, padding: '22px 30px', borderRadius: 22, background: C.card, border: `2px solid ${rgba(color, 0.8)}`}}>
      <div style={{fontFamily: MONO, fontWeight: 700, fontSize: 32, color}}>{head}</div>
      <div style={{fontFamily: SANS, fontWeight: 500, fontSize: 29, color: C.txt, marginTop: 6, lineHeight: 1.25}}>{body}</div>
    </div>
  </Rise>
);

export const Aoi: React.FC = () => {
  const t = useT();
  const END = K.S.outro + 1;
  return (
    <AbsoluteFill>
      <Backdrop />
      {t < K.aTypes - 0.1 ? (
        <Heading kicker="ISTILAH 2" title="AOI · Area of Interest" at={K.S.aoi + 0.2} color={C.am} />
      ) : (
        <Heading kicker="JENIS-JENIS" title="Jenis AOI" at={K.aTypes - 0.1} color={C.am} />
      )}

      <Window from={K.S.aoi} to={K.aTypes}>
        <div style={{position: 'absolute', left: 96, top: 210, display: 'flex', flexDirection: 'column', gap: 22}}>
          <DefCard at={K.aInst - 0.3} color={C.am} head="INSTITUSI & ALGORITMA" body="Tidak menaruh order sembarangan — selalu meninggalkan jejak" />
          <DefCard at={K.aImb - 0.3} color={C.sky} head="IMBALANCE / ORDER BESAR" body="Jejak ada di area ketidakseimbangan atau kumpulan pesanan besar" />
          <DefCard at={K.aArea - 0.2} color={C.em} head="AREA ITULAH AOI" body="Area of Interest — tempat harga cenderung bereaksi" />
        </div>
        <ChartPanel x={920} y={210} w={904} h={620} at={K.S.aoi + 0.4} title="AOI · AREA KETIDAKSEIMBANGAN" color={C.am} illu={AOI} t0={K.S.aoi + 0.8} dur={5} />
      </Window>

      <Window from={K.aTypes - 0.1} to={END}>
        <div style={{position: 'absolute', left: 96, top: 190, display: 'flex', flexDirection: 'column', gap: 20}}>
          {ROWS.map((r, i) => {
            const e = ROWS[i + 1]?.at ?? END;
            return (
              <Rise key={r.code} at={r.at - 0.1} x={-40} y={0}>
                <InfoCard title={r.code} sub={r.sub} color={r.color} active={t >= r.at && t < e ? 1 : 0} w={740} h={150} />
              </Rise>
            );
          })}
        </div>
        {ROWS.map((r, i) => {
          const e = ROWS[i + 1]?.at ?? END;
          return (
            <Window key={r.code} from={r.at} to={e}>
              <ChartPanel x={880} y={190} w={944} h={640} at={r.at} title={r.code} color={r.color} illu={r.illu} t0={r.t0} dur={r.dur} />
              <div style={{position: 'absolute', left: 880, top: 842, display: 'flex', gap: 14}}>
                {r.chips.map((c) => (
                  <Rise key={c.text} at={c.at - 0.2} y={14}>
                    <Chip text={c.text} color={c.color} size={22} />
                  </Rise>
                ))}
              </div>
            </Window>
          );
        })}
      </Window>
    </AbsoluteFill>
  );
};
