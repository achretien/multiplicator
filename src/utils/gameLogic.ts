export interface Question {
  a: number;
  b: number;
  ans: number;
}

export function rnd(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

export function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export function genQuestions(selectedTables: number[], totalQ: number): Question[] {
  let pool: Question[] = [];
  selectedTables.forEach((a) => {
    for (let b = 1; b <= 10; b++) {
      pool.push({ a, b, ans: a * b });
    }
  });
  pool = shuffle(pool);
  const qs: Question[] = [];
  let i = 0;
  while (qs.length < totalQ) {
    qs.push(pool[i % pool.length]);
    if (i % pool.length === pool.length - 1) {
      pool = shuffle(pool);
    }
    i++;
  }
  return qs;
}

export function genChoices(ans: number): number[] {
  const s = new Set<number>([ans]);
  while (s.size < 4) {
    const v = ans + rnd(-20, 20);
    if (v > 0 && v !== ans) s.add(v);
  }
  return shuffle([...s]);
}

export function computeScore(currentScore: number, streak: number): number {
  return currentScore + Math.max(10, 10 + streak * 2);
}

import { getStrings } from '../constants/strings';

export function getResultData(correct: number, totalQ: number) {
  const s = getStrings();
  const pct = correct / totalQ;
  const tier = pct >= 0.9 ? s.resultTier1 : pct >= 0.7 ? s.resultTier2 : pct >= 0.5 ? s.resultTier3 : s.resultTier4;
  const stars = pct >= 0.9 ? 3 : pct >= 0.7 ? 2 : 1;
  return { ...tier, stars };
}

export function getRandomCorrectMessage(): string {
  const msgs = getStrings().correctMessages;
  return msgs[Math.floor(Math.random() * msgs.length)];
}
