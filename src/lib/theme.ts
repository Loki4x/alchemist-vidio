import {loadFont as loadInter} from '@remotion/google-fonts/Inter';
import {loadFont as loadJetBrains} from '@remotion/google-fonts/JetBrainsMono';

const inter = loadInter('normal', {weights: ['500', '600', '700', '800'], subsets: ['latin']});
const jetbrains = loadJetBrains('normal', {weights: ['700'], subsets: ['latin']});

export const SANS = inter.fontFamily;
export const MONO = jetbrains.fontFamily;

/** Palette from RULES.md (institutional dark mode). */
export const C = {
  bg: '#0A0E17',
  card: 'rgba(17, 24, 39, 0.85)',
  cardHi: 'rgba(24, 35, 56, 0.92)',
  border: 'rgba(255, 255, 255, 0.10)',
  em: '#10B981',
  ro: '#F43F5E',
  cy: '#0EA5E9',
  sky: '#38BDF8',
  am: '#F59E0B',
  vi: '#A78BFA',
  txt: '#F8FAFC',
  mut: '#94A3B8',
} as const;

export const rgba = (hex: string, alpha: number): string => {
  const n = parseInt(hex.replace('#', ''), 16);
  return `rgba(${(n >> 16) & 255}, ${(n >> 8) & 255}, ${n & 255}, ${alpha})`;
};

export const METHODS = [
  {code: 'MSNR', role: 'Entry POI', color: C.sky},
  {code: 'ICT', role: 'Kill Zones', color: C.am},
  {code: 'SMC', role: 'Structure', color: C.em},
  {code: 'LIT', role: 'Liquidity & Structure', color: C.vi},
] as const;
