import React, { useState, useEffect, useRef, useCallback } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useNavigation } from '@react-navigation/native';
import { Colors, BorderRadius, Spacing, PLAYERS } from '../constants/theme';
import { getStrings } from '../constants/strings';
import { useGame } from '../context/GameContext';
import HUD from '../components/HUD';
import ProgressBar from '../components/ProgressBar';
import ChoiceButton from '../components/ChoiceButton';
import Numpad from '../components/Numpad';
import TimerBar from '../components/TimerBar';
import QuitModal from '../components/QuitModal';
import AppHeader from '../components/AppHeader';
import { RootStackParamList } from '../../App';

type NavProp = NativeStackNavigationProp<RootStackParamList>;

export default function GameScreen() {
  const nav = useNavigation<NavProp>();
  const game = useGame();
  const {
    qi, totalQ, score, streak, selectedMode, selectedTimer, isDuel, duelPlayerIdx,
    currentQuestion, answered, feedback, feedbackType, choices,
    handleAnswer, nextQuestion, endRound,
    setDuelPlayerIdx,
  } = game;

  const [choiceStatuses, setChoiceStatuses] = useState<Record<number, 'default' | 'correct' | 'wrong'>>({});
  const [inputValue, setInputValue] = useState('');
  const [inputStatus, setInputStatus] = useState<'' | 'correct' | 'wrong'>('');
  const [timerLeft, setTimerLeft] = useState(selectedTimer || 10);
  const [showQuit, setShowQuit] = useState(false);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const answeredRef = useRef(false);
  const questionStartRef = useRef<number>(Date.now());
  const [choiceKey, setChoiceKey] = useState(0);

  const clearTimer = useCallback(() => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  }, []);

  const finishRound = useCallback(async () => {
    await endRound();
    if (isDuel) {
      if (duelPlayerIdx === 0) {
        setDuelPlayerIdx(1);
        nav.replace('Handover');
      } else {
        setTimeout(() => nav.replace('DuelResult'), 50);
      }
    } else {
      nav.replace('Result');
    }
  }, [endRound, isDuel, duelPlayerIdx, nav, setDuelPlayerIdx]);

  const advance = useCallback(() => {
    const hasMore = nextQuestion();
    if (!hasMore) {
      finishRound();
    }
  }, [nextQuestion, finishRound]);

  const advanceRef = useRef(advance);
  useEffect(() => { advanceRef.current = advance; }, [advance]);

  // Reset UI per question — synchronous setState is intentional here to reset on question change
  useEffect(() => {
    setChoiceStatuses({}); // eslint-disable-line react-hooks/set-state-in-effect
    setInputValue('');
    setInputStatus('');
    setTimerLeft(selectedTimer || 10);
    answeredRef.current = false;
    questionStartRef.current = Date.now();
    setChoiceKey((k) => k + 1);

    if (selectedTimer > 0 && currentQuestion) {
      clearTimer();
      let left = selectedTimer;
      setTimerLeft(selectedTimer);
      timerRef.current = setInterval(() => {
        left -= 0.1;
        if (left <= 0) {
          left = 0;
          setTimerLeft(0);
          clearTimer();
          if (!answeredRef.current) {
            answeredRef.current = true;
            handleAnswer(false, currentQuestion.ans);
            setChoiceStatuses((prev) => ({ ...prev, [currentQuestion.ans]: 'correct' }));
            setInputStatus('wrong');
            setTimeout(() => advanceRef.current(), 1800);
          }
        } else {
          setTimerLeft(left);
        }
      }, 100);
    }

    return () => clearTimer();
  }, [qi]); // eslint-disable-line react-hooks/exhaustive-deps

  const onChoicePress = useCallback((val: number) => {
    if (answeredRef.current || !currentQuestion) return;
    answeredRef.current = true;
    clearTimer();
    const elapsed = (Date.now() - questionStartRef.current) / 1000;
    const ans = currentQuestion.ans;
    const isCorrect = val === ans;

    const newStatuses: Record<number, 'default' | 'correct' | 'wrong'> = {};
    if (isCorrect) {
      newStatuses[val] = 'correct';
    } else {
      newStatuses[val] = 'wrong';
      newStatuses[ans] = 'correct';
    }
    setChoiceStatuses(newStatuses);
    handleAnswer(isCorrect, ans, elapsed);
    setTimeout(() => advanceRef.current(), 1400);
  }, [currentQuestion, handleAnswer, clearTimer]);

  const onNumpadPress = useCallback((digit: string) => {
    setInputValue((prev) => {
      if (prev.length >= 3) return prev;
      return prev + digit;
    });
  }, []);

  const onNumpadDelete = useCallback(() => {
    setInputValue((prev) => prev.slice(0, -1));
  }, []);

  const onInputValidate = useCallback(() => {
    if (answeredRef.current || !currentQuestion) return;
    const val = parseInt(inputValue);
    if (isNaN(val)) return;
    answeredRef.current = true;
    clearTimer();
    const elapsed = (Date.now() - questionStartRef.current) / 1000;
    const ans = currentQuestion.ans;
    const isCorrect = val === ans;
    setInputStatus(isCorrect ? 'correct' : 'wrong');
    handleAnswer(isCorrect, ans, elapsed);
    setTimeout(() => advanceRef.current(), 1400);
  }, [inputValue, currentQuestion, handleAnswer, clearTimer]);

  const playerBadge = isDuel
    ? { emoji: PLAYERS[duelPlayerIdx].emoji, name: PLAYERS[duelPlayerIdx].name, color: PLAYERS[duelPlayerIdx].color }
    : null;

  if (!currentQuestion) {
    return (
      <View style={styles.container}>
        <View style={styles.inner}>
          <AppHeader compact />
        </View>
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.inner}>
        <AppHeader compact />
        <HUD
          questionNum={qi + 1}
          totalQ={totalQ}
          score={score}
          streak={streak}
          playerBadge={playerBadge}
        />
        <ProgressBar current={qi} total={totalQ} />

        <View style={styles.card}>
          <Text style={styles.qLabel}>{getStrings().questionLabel(qi + 1)}</Text>
          <Text style={styles.question}>
            <Text style={styles.highlight}>{currentQuestion.a}</Text>
            {' \u00D7 '}
            <Text style={styles.highlight}>{currentQuestion.b}</Text>
            {' = ?'}
          </Text>

          {selectedTimer > 0 && (
            <TimerBar timeLeft={timerLeft} totalTime={selectedTimer} />
          )}

          {selectedMode === 'qcm' && (
            <View style={styles.choicesGrid}>
              {choices.map((c) => (
                <ChoiceButton
                  key={`${choiceKey}-${c}`}
                  value={c}
                  status={choiceStatuses[c] || 'default'}
                  disabled={answered}
                  onPress={() => onChoicePress(c)}
                />
              ))}
            </View>
          )}

          {selectedMode === 'input' && (
            <View style={styles.inputWrap}>
              <View style={[
                styles.inputField,
                inputStatus === 'correct' && styles.inputCorrect,
                inputStatus === 'wrong' && styles.inputWrong,
              ]}>
                <Text style={styles.inputText}>{inputValue || ' '}</Text>
              </View>
              <Numpad onPress={onNumpadPress} onDelete={onNumpadDelete} />
              <TouchableOpacity
                style={[styles.btnOk, inputValue === '' && styles.btnOkDisabled]}
                onPress={onInputValidate}
                disabled={inputValue === '' || answered}
                activeOpacity={0.7}
              >
                <Text style={styles.btnOkText}>{getStrings().validate}</Text>
              </TouchableOpacity>
            </View>
          )}

          <Text style={[styles.feedback, feedbackType === 'correct' ? styles.feedbackCorrect : styles.feedbackWrong]}>
            {feedback || ' '}
          </Text>
        </View>

        <TouchableOpacity style={styles.abandonBtn} onPress={() => setShowQuit(true)} activeOpacity={0.7}>
          <Text style={styles.abandonText}>{getStrings().abandon}</Text>
        </TouchableOpacity>

        <QuitModal
          visible={showQuit}
          onQuit={() => {
            clearTimer();
            setShowQuit(false);
            nav.popToTop();
          }}
          onContinue={() => setShowQuit(false)}
        />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: Spacing.lg,
    backgroundColor: Colors.bg,
  },
  inner: {
    width: '100%',
    maxWidth: 480,
    alignItems: 'center',
  },
  card: {
    backgroundColor: Colors.card,
    borderRadius: BorderRadius.card,
    padding: 28,
    paddingHorizontal: 24,
    width: '100%',
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.12,
    shadowRadius: 32,
    elevation: 8,
  },
  qLabel: {
    textAlign: 'center',
    fontSize: 13,
    color: Colors.muted,
    marginBottom: 8,
  },
  question: {
    textAlign: 'center',
    fontSize: 40,
    fontWeight: '900',
    color: Colors.text,
    marginBottom: 24,
    letterSpacing: 2,
  },
  highlight: {
    color: Colors.primary,
  },
  choicesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    justifyContent: 'center',
  },
  inputWrap: {
    gap: 10,
  },
  inputField: {
    width: '100%',
    padding: 16,
    borderWidth: 3,
    borderColor: Colors.border,
    borderRadius: BorderRadius.lg,
    backgroundColor: 'white',
    alignItems: 'center',
  },
  inputCorrect: {
    borderColor: Colors.success,
    backgroundColor: '#eaffef',
  },
  inputWrong: {
    borderColor: Colors.secondary,
    backgroundColor: '#fff0f3',
  },
  inputText: {
    fontSize: 28,
    fontWeight: '800',
    color: Colors.text,
  },
  btnOk: {
    width: '100%',
    padding: 16,
    backgroundColor: Colors.primary,
    borderRadius: BorderRadius.lg,
    alignItems: 'center',
  },
  btnOkDisabled: {
    opacity: 0.35,
  },
  btnOkText: {
    color: 'white',
    fontSize: 19,
    fontWeight: '800',
  },
  feedback: {
    textAlign: 'center',
    fontSize: 17,
    fontWeight: '700',
    marginTop: 16,
    minHeight: 32,
  },
  feedbackCorrect: {
    color: Colors.success,
  },
  feedbackWrong: {
    color: Colors.secondary,
  },
  abandonBtn: {
    marginTop: 16,
    paddingVertical: 10,
    paddingHorizontal: 28,
    borderWidth: 2,
    borderColor: '#ddd',
    borderRadius: 99,
    backgroundColor: 'white',
  },
  abandonText: {
    color: Colors.muted,
    fontSize: 13,
    fontWeight: '700',
  },
});
