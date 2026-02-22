export const Colors = {
  primary: '#6c63ff',
  secondary: '#ff6584',
  success: '#43d48a',
  warn: '#ffd166',
  bg: '#f0f4ff',
  card: '#ffffff',
  text: '#2d2d4e',
  child: '#6c63ff',
  parent: '#ff6584',
  border: '#e0e0f0',
  muted: '#888',
  lightMuted: '#aaa',
};

export const Spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  xxl: 24,
  xxxl: 28,
};

export const FontSize = {
  xs: 10,
  sm: 12,
  md: 14,
  base: 16,
  lg: 18,
  xl: 22,
  xxl: 28,
  huge: 48,
};

export const BorderRadius = {
  sm: 12,
  md: 14,
  lg: 16,
  xl: 20,
  card: 24,
  pill: 99,
};

import { getStrings } from './strings';

export const PLAYERS = [
  { key: 'child' as const, name: getStrings().playerChild, emoji: '\u{1F476}', color: Colors.child },
  { key: 'parent' as const, name: getStrings().playerParent, emoji: '\u{1F468}', color: Colors.parent },
];

export const MODE_LABELS: Record<string, string> = {
  qcm: getStrings().modeQcm,
  input: getStrings().modeInput,
  timer: 'Chrono', // kept for backward compatibility with old history entries
};
