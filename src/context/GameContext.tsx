import React, { createContext, useContext, useState, useCallback, useRef, useEffect } from 'react';
import { Question, genQuestions, genChoices, computeScore, getRandomCorrectMessage, getResultData } from '../utils/gameLogic';
import { saveGame, loadConfig, saveConfig, SoloHistoryEntry, HistoryEntry, QuestionResult } from '../utils/storage';
import { getStrings } from '../constants/strings';

export interface DuelPlayerResult {
  score: number;
  correct: number;
  wrong: number;
  maxStreak: number;
  questions: QuestionResult[];
}

interface GameState {
  selectedTables: number[];
  selectedMode: 'qcm' | 'input';
  selectedTimer: number;
  totalQ: number;
  isDuel: boolean;
  duelPlayerIdx: number;
  duelResults: DuelPlayerResult[];
  questions: Question[];
  qi: number;
  score: number;
  correct: number;
  wrong: number;
  streak: number;
  maxStreak: number;
  answered: boolean;
  feedback: string;
  feedbackType: 'correct' | 'wrong' | '';
  choices: number[];
  lastEntry: HistoryEntry | null;
}

interface GameContextType extends GameState {
  toggleTable: (t: number) => void;
  setMode: (m: 'qcm' | 'input') => void;
  setTimer: (t: number) => void;
  setTotalQ: (q: number) => void;
  initRound: () => void;
  handleAnswer: (isCorrect: boolean, ans: number, elapsed?: number, given?: number) => void;
  nextQuestion: () => boolean;
  endRound: () => Promise<void>;
  setLastEntry: (entry: HistoryEntry | null) => void;
  setIsDuel: (v: boolean) => void;
  setDuelPlayerIdx: (v: number) => void;
  resetDuel: () => void;
  currentQuestion: Question | null;
}

const GameContext = createContext<GameContextType | null>(null);

export function useGame(): GameContextType {
  const ctx = useContext(GameContext);
  if (!ctx) throw new Error('useGame must be inside GameProvider');
  return ctx;
}

export function GameProvider({ children }: { children: React.ReactNode }) {
  const [selectedTables, setSelectedTables] = useState<number[]>([1, 2, 3, 4, 5, 6, 7, 8, 9, 10]);
  const [selectedMode, setSelectedMode] = useState<'qcm' | 'input'>('qcm');
  const [selectedTimer, setSelectedTimer] = useState<number>(0);
  const [totalQ, setTotalQ] = useState(20);
  const [isDuel, setIsDuel] = useState(false);
  const [duelPlayerIdx, setDuelPlayerIdx] = useState(0);
  const [duelResults, setDuelResults] = useState<DuelPlayerResult[]>([]);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [qi, setQi] = useState(0);
  const [score, setScore] = useState(0);
  const [correct, setCorrect] = useState(0);
  const [wrong, setWrong] = useState(0);
  const [streak, setStreak] = useState(0);
  const [maxStreak, setMaxStreak] = useState(0);
  const [answered, setAnswered] = useState(false);
  const [feedback, setFeedback] = useState('');
  const [feedbackType, setFeedbackType] = useState<'correct' | 'wrong' | ''>('');
  const [choices, setChoices] = useState<number[]>([]);
  const [lastEntry, setLastEntry] = useState<HistoryEntry | null>(null);

  // Load saved config on mount
  useEffect(() => {
    loadConfig().then((config) => {
      if (config) {
        setSelectedTables(config.selectedTables);
        const rawMode = config.selectedMode as string;
        const mode: 'qcm' | 'input' = rawMode === 'input' ? 'input' : 'qcm';
        setSelectedMode(mode);
        setSelectedTimer(config.selectedTimer ?? 0);
        setTotalQ(config.totalQ);
      }
    });
  }, []);

  // Persist config when it changes
  useEffect(() => {
    saveConfig({ selectedTables, selectedMode, selectedTimer, totalQ });
  }, [selectedTables, selectedMode, selectedTimer, totalQ]);

  const scoreRef = useRef(0);
  const correctRef = useRef(0);
  const wrongRef = useRef(0);
  const streakRef = useRef(0);
  const maxStreakRef = useRef(0);
  const questionsRef = useRef<Question[]>([]);
  const qiRef = useRef(0);
  const questionResultsRef = useRef<QuestionResult[]>([]);

  const toggleTable = useCallback((t: number) => {
    setSelectedTables((prev) => {
      if (prev.includes(t)) {
        if (prev.length > 1) return prev.filter((x) => x !== t);
        return prev;
      }
      return [...prev, t];
    });
  }, []);

  const setMode = useCallback((m: 'qcm' | 'input') => {
    setSelectedMode(m);
  }, []);

  const setTimer = useCallback((t: number) => {
    setSelectedTimer(t);
  }, []);

  const initRound = useCallback(() => {
    const qs = genQuestions(selectedTables, totalQ);
    setQuestions(qs);
    setQi(0);
    setScore(0);
    setCorrect(0);
    setWrong(0);
    setStreak(0);
    setMaxStreak(0);
    setAnswered(false);
    setFeedback('');
    setFeedbackType('');
    scoreRef.current = 0;
    correctRef.current = 0;
    wrongRef.current = 0;
    streakRef.current = 0;
    maxStreakRef.current = 0;
    questionsRef.current = qs;
    qiRef.current = 0;
    questionResultsRef.current = [];
    if (qs.length > 0) {
      setChoices(genChoices(qs[0].ans));
    }
  }, [selectedTables, totalQ]);

  const handleAnswer = useCallback((isCorrect: boolean, ans: number, elapsed?: number, given?: number) => {
    const q = questionsRef.current[qiRef.current];
    if (q) {
      questionResultsRef.current = [...questionResultsRef.current, {
        a: q.a, b: q.b, ans,
        given: given ?? -1,
        elapsed: elapsed ?? 0,
        correct: isCorrect,
      }];
    }
    setAnswered(true);
    if (isCorrect) {
      const newStreak = streakRef.current + 1;
      const newScore = computeScore(scoreRef.current, streakRef.current, elapsed ?? 0);
      const newCorrect = correctRef.current + 1;
      const newMaxStreak = Math.max(maxStreakRef.current, newStreak);
      scoreRef.current = newScore;
      correctRef.current = newCorrect;
      streakRef.current = newStreak;
      maxStreakRef.current = newMaxStreak;
      setScore(newScore);
      setCorrect(newCorrect);
      setStreak(newStreak);
      setMaxStreak(newMaxStreak);
      setFeedback(getRandomCorrectMessage());
      setFeedbackType('correct');
    } else {
      const newWrong = wrongRef.current + 1;
      wrongRef.current = newWrong;
      streakRef.current = 0;
      setWrong(newWrong);
      setStreak(0);
      setFeedback(getStrings().wrongAnswer(ans));
      setFeedbackType('wrong');
    }
  }, []);

  const nextQuestion = useCallback((): boolean => {
    const nextIdx = qi + 1;
    if (nextIdx >= totalQ) {
      return false;
    }
    qiRef.current = nextIdx;
    setQi(nextIdx);
    setAnswered(false);
    setFeedback('');
    setFeedbackType('');
    setQuestions((prev) => {
      if (prev[nextIdx]) {
        setChoices(genChoices(prev[nextIdx].ans));
      }
      return prev;
    });
    return true;
  }, [qi, totalQ]);

  const endRound = useCallback(async () => {
    if (isDuel) {
      const result: DuelPlayerResult = {
        score: scoreRef.current,
        correct: correctRef.current,
        wrong: wrongRef.current,
        maxStreak: maxStreakRef.current,
        questions: [...questionResultsRef.current],
      };
      setDuelResults((prev) => [...prev, result]);
    } else {
      const rd = getResultData(correctRef.current, totalQ);
      const modeLabel = selectedTimer > 0 ? `${selectedMode}+${selectedTimer}s` : selectedMode;
      const entry: SoloHistoryEntry = {
        date: new Date().toISOString(),
        type: 'solo',
        score: scoreRef.current,
        correct: correctRef.current,
        wrong: wrongRef.current,
        maxStreak: maxStreakRef.current,
        totalQ,
        mode: modeLabel,
        tables: [...selectedTables].sort((a, b) => a - b),
        emoji: rd.emoji,
        stars: rd.stars,
        questions: [...questionResultsRef.current],
      };
      setLastEntry(entry);
      await saveGame(entry);
    }
  }, [isDuel, totalQ, selectedMode, selectedTimer, selectedTables]);

  const resetDuel = useCallback(() => {
    setDuelResults([]);
    setDuelPlayerIdx(0);
  }, []);

  const currentQuestion = questions[qi] ?? null;

  return (
    <GameContext.Provider
      value={{
        selectedTables, selectedMode, selectedTimer, totalQ, isDuel, duelPlayerIdx, duelResults,
        questions, qi, score, correct, wrong, streak, maxStreak, answered,
        feedback, feedbackType, choices, currentQuestion, lastEntry,
        toggleTable, setMode, setTimer, setTotalQ, initRound, handleAnswer, nextQuestion,
        endRound, setLastEntry, setIsDuel, setDuelPlayerIdx, resetDuel,
      }}
    >
      {children}
    </GameContext.Provider>
  );
}
