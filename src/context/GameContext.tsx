import React, { createContext, useContext, useState, useCallback, useRef, useEffect } from 'react';
import { Question, genQuestions, genChoices, computeScore, getRandomCorrectMessage, getResultData } from '../utils/gameLogic';
import { saveGame, loadConfig, saveConfig, SoloHistoryEntry } from '../utils/storage';

export interface DuelPlayerResult {
  score: number;
  correct: number;
  wrong: number;
  maxStreak: number;
}

interface GameState {
  selectedTables: number[];
  selectedMode: 'qcm' | 'input' | 'timer';
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
}

interface GameContextType extends GameState {
  toggleTable: (t: number) => void;
  setMode: (m: 'qcm' | 'input' | 'timer') => void;
  setTotalQ: (q: number) => void;
  initRound: () => void;
  handleAnswer: (isCorrect: boolean, ans: number) => void;
  nextQuestion: () => boolean;
  endRound: () => Promise<void>;
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
  const [selectedMode, setSelectedMode] = useState<'qcm' | 'input' | 'timer'>('qcm');
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

  // Load saved config on mount
  useEffect(() => {
    loadConfig().then((config) => {
      if (config) {
        setSelectedTables(config.selectedTables);
        setSelectedMode(config.selectedMode);
        setTotalQ(config.totalQ);
      }
    });
  }, []);

  // Persist config when it changes
  useEffect(() => {
    saveConfig({ selectedTables, selectedMode, totalQ });
  }, [selectedTables, selectedMode, totalQ]);

  const scoreRef = useRef(0);
  const correctRef = useRef(0);
  const wrongRef = useRef(0);
  const streakRef = useRef(0);
  const maxStreakRef = useRef(0);

  const toggleTable = useCallback((t: number) => {
    setSelectedTables((prev) => {
      if (prev.includes(t)) {
        if (prev.length > 1) return prev.filter((x) => x !== t);
        return prev;
      }
      return [...prev, t];
    });
  }, []);

  const setMode = useCallback((m: 'qcm' | 'input' | 'timer') => {
    setSelectedMode(m);
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
    if (qs.length > 0) {
      setChoices(genChoices(qs[0].ans));
    }
  }, [selectedTables, totalQ]);

  const handleAnswer = useCallback((isCorrect: boolean, ans: number) => {
    setAnswered(true);
    if (isCorrect) {
      const newStreak = streakRef.current + 1;
      const newScore = computeScore(scoreRef.current, streakRef.current);
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
      setFeedback('\u274C La r\u00E9ponse \u00E9tait ' + ans);
      setFeedbackType('wrong');
    }
  }, []);

  const nextQuestion = useCallback((): boolean => {
    const nextIdx = qi + 1;
    if (nextIdx >= totalQ) {
      return false;
    }
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
      };
      setDuelResults((prev) => [...prev, result]);
    } else {
      const rd = getResultData(correctRef.current, totalQ);
      const entry: SoloHistoryEntry = {
        date: new Date().toISOString(),
        type: 'solo',
        score: scoreRef.current,
        correct: correctRef.current,
        wrong: wrongRef.current,
        maxStreak: maxStreakRef.current,
        totalQ,
        mode: selectedMode,
        tables: [...selectedTables].sort((a, b) => a - b),
        emoji: rd.emoji,
        stars: rd.stars,
      };
      await saveGame(entry);
    }
  }, [isDuel, totalQ, selectedMode, selectedTables]);

  const resetDuel = useCallback(() => {
    setDuelResults([]);
    setDuelPlayerIdx(0);
  }, []);

  const currentQuestion = questions[qi] ?? null;

  return (
    <GameContext.Provider
      value={{
        selectedTables, selectedMode, totalQ, isDuel, duelPlayerIdx, duelResults,
        questions, qi, score, correct, wrong, streak, maxStreak, answered,
        feedback, feedbackType, choices, currentQuestion,
        toggleTable, setMode, setTotalQ, initRound, handleAnswer, nextQuestion,
        endRound, setIsDuel, setDuelPlayerIdx, resetDuel,
      }}
    >
      {children}
    </GameContext.Provider>
  );
}
