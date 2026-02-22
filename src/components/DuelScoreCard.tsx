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
      <Text style={styles.pts}>{s.pts}</Text>
      <View style={styles.statsRow}>
        <View style={styles.stat}>
          <Text style={[styles.statVal, { color: Colors.success }]}>{correct}</Text>
          <Text style={styles.statLbl}>{s.correctLabel}</Text>
        </View>
        <View style={styles.stat}>
          <Text style={[styles.statVal, { color: Colors.secondary }]}>{wrong}</Text>
          <Text style={styles.statLbl}>{s.errorsLabel}</Text>
        </View>
        <View style={styles.stat}>
          <Text style={[styles.statVal, { color: Colors.warn }]}>{maxStreak}</Text>
          <Text style={styles.statLbl}>{s.maxStreakLabel}</Text>
        </View>
      </View>
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
  pts: {
    fontSize: 11,
    color: '#aaa',
    marginBottom: 10,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
  },
  stat: {
    alignItems: 'center',
  },
  statVal: {
    fontSize: 16,
    fontWeight: '800',
  },
  statLbl: {
    fontSize: 9,
    color: Colors.muted,
    textTransform: 'uppercase',
    textAlign: 'center',
  },
});
