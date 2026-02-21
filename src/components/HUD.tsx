import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Colors } from '../constants/theme';

interface Props {
  questionNum: number;
  totalQ: number;
  score: number;
  streak: number;
  playerBadge?: { emoji: string; name: string; color: string } | null;
}

export default function HUD({ questionNum, totalQ, score, streak, playerBadge }: Props) {
  return (
    <View style={styles.hud}>
      <View style={styles.item}>
        <Text style={styles.val}>{questionNum}/{totalQ}</Text>
        <Text style={styles.lbl}>QUESTION</Text>
      </View>
      {playerBadge && (
        <View style={styles.item}>
          <View style={[styles.badge, { backgroundColor: playerBadge.color }]}>
            <Text style={styles.badgeText}>{playerBadge.emoji} {playerBadge.name}</Text>
          </View>
        </View>
      )}
      <View style={styles.item}>
        <Text style={styles.val}>{score}</Text>
        <Text style={styles.lbl}>SCORE</Text>
      </View>
      <View style={styles.item}>
        <Text style={styles.val}>{'\u{1F525}'}{streak}</Text>
        <Text style={styles.lbl}>S\u00C9RIE</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  hud: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
    marginBottom: 16,
    paddingHorizontal: 4,
  },
  item: {
    alignItems: 'center',
  },
  val: {
    fontSize: 22,
    fontWeight: '800',
    color: Colors.primary,
  },
  lbl: {
    fontSize: 10,
    color: Colors.muted,
    textTransform: 'uppercase',
  },
  badge: {
    paddingVertical: 4,
    paddingHorizontal: 14,
    borderRadius: 99,
  },
  badgeText: {
    fontSize: 13,
    fontWeight: '800',
    color: 'white',
  },
});
