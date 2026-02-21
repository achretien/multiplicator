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

export function getResultData(correct: number, totalQ: number) {
  const pct = correct / totalQ;
  let emoji: string, title: string, sub: string;
  if (pct >= 0.9) {
    emoji = '\u{1F3C6}'; title = 'Incroyable !'; sub = 'Tu es un champion des tables !';
  } else if (pct >= 0.7) {
    emoji = '\u{1F31F}'; title = 'Tr\u00E8s bien !'; sub = 'Continue comme \u00E7a !';
  } else if (pct >= 0.5) {
    emoji = '\u{1F44D}'; title = 'Bien jou\u00E9 !'; sub = "Encore un peu d'entra\u00EEnement !";
  } else {
    emoji = '\u{1F4AA}'; title = 'Courage !'; sub = 'Pratique encore, tu vas y arriver !';
  }
  const stars = pct >= 0.9 ? 3 : pct >= 0.7 ? 2 : 1;
  return { emoji, title, sub, stars };
}

const CORRECT_MESSAGES = [
  '\u2B50 Excellent !',
  '\u{1F389} Parfait !',
  '\u{1F525} Super !',
  '\u{1F4AA} Bravo !',
];

export function getRandomCorrectMessage(): string {
  return CORRECT_MESSAGES[Math.floor(Math.random() * CORRECT_MESSAGES.length)];
}
