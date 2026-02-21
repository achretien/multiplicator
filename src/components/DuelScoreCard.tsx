import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Colors } from '../constants/theme';
import { getStrings } from '../constants/strings';

interface Props {
  emoji: string;
  name: string;
  score: number;
  correct: number;
  wrong: number;
  maxStreak: number;
  color: string;
  isWinner: boolean;
}

export default function DuelScoreCard({ emoji, name, score, correct, wrong, maxStreak, color, isWinner }: Props) {
  const s = getStrings();
  return (
    <View style={[styles.card, isWinner && styles.winnerCard]}>
      <Text style={styles.emoji}>{emoji}</Text>
      <Text style={styles.name}>{name}{isWinner ? ' \u{1F3C6}' : ''}</Text>
      <Text style={[styles.score, { color }]}>{score}</Text>
      <Text style={styles.detail}>{s.pts} \u00B7 \u2705{correct} \u274C{wrong}</Text>
      <Text style={styles.detail}>{s.maxStreakCard(maxStreak)}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    flex: 1,
    borderRadius: 16,
    padding: 16,
    alignItems: 'center',
    borderWidth: 3,
    borderColor: Colors.border,
    backgroundColor: 'white',
  },
  winnerCard: {
    borderColor: Colors.warn,
    backgroundColor: '#fffbe6',
  },
  emoji: {
    fontSize: 32,
  },
  name: {
    fontSize: 13,
    fontWeight: '700',
    color: '#666',
    marginVertical: 4,
  },
  score: {
    fontSize: 32,
    fontWeight: '900',
  },
  detail: {
    fontSize: 11,
    color: '#999',
  },
});
