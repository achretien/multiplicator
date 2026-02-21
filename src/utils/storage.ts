import AsyncStorage from '@react-native-async-storage/async-storage';

const HISTORY_KEY = 'tables-history';
const CONFIG_KEY = 'tables-config';
const MAX_ENTRIES = 50;

export interface GameConfig {
  selectedTables: number[];
  selectedMode: 'qcm' | 'input' | 'timer';
  totalQ: number;
}

export async function loadConfig(): Promise<GameConfig | null> {
  try {
    const raw = await AsyncStorage.getItem(CONFIG_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export async function saveConfig(config: GameConfig): Promise<void> {
  try {
    await AsyncStorage.setItem(CONFIG_KEY, JSON.stringify(config));
  } catch (e) {
    console.error(e);
  }
}

export interface SoloHistoryEntry {
  date: string;
  type: 'solo';
  score: number;
  correct: number;
  wrong: number;
  maxStreak: number;
  totalQ: number;
  mode: string;
  tables: number[];
  emoji: string;
  stars: number;
}

export interface DuelHistoryEntry {
  date: string;
  type: 'duel';
  totalQ: number;
  mode: string;
  tables: number[];
  winner: 'child' | 'papa' | 'draw';
  child: { score: number; correct: number; wrong: number };
  papa: { score: number; correct: number; wrong: number };
  emoji: string;
  stars: number;
}

export type HistoryEntry = SoloHistoryEntry | DuelHistoryEntry;

export async function loadHistory(): Promise<HistoryEntry[]> {
  try {
    const raw = await AsyncStorage.getItem(HISTORY_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export async function saveGame(entry: HistoryEntry): Promise<void> {
  try {
    const h = await loadHistory();
    h.unshift(entry);
    if (h.length > MAX_ENTRIES) h.pop();
    await AsyncStorage.setItem(HISTORY_KEY, JSON.stringify(h));
  } catch (e) {
    console.error(e);
  }
}

export async function clearHistoryStorage(): Promise<void> {
  try {
    await AsyncStorage.removeItem(HISTORY_KEY);
  } catch (e) {
    console.error(e);
  }
}

export function formatDate(iso: string): string {
  const d = new Date(iso);
  return (
    d.toLocaleDateString('fr-FR', { day: '2-digit', month: 'short', year: 'numeric' }) +
    ' \u00E0 ' +
    d.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })
  );
}
