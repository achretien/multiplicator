import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Colors, useColors } from '../constants/theme';
import { getStrings } from '../constants/strings';

interface Props {
  questionNum: number;
  totalQ: number;
  score: number;
  streak: number;
  playerBadge?: { emoji: string; name: string; color: string } | null;
}

export default function HUD({ questionNum, totalQ, score, streak, playerBadge }: Props) {
  const s = getStrings();
  const colors = useColors();
  return (
    <View style={styles.hud}>
      <View style={styles.item}>
        <Text style={[styles.val, { color: colors.primary }]}>{questionNum}/{totalQ}</Text>
        <Text style={[styles.lbl, { color: colors.muted }]}>{s.hudQuestion}</Text>
      </View>
      {playerBadge && (
        <View style={styles.item}>
          <View style={[styles.badge, { backgroundColor: playerBadge.color }]}>
            <Text style={styles.badgeText}>{playerBadge.emoji} {playerBadge.name}</Text>
          </View>
        </View>
      )}
      <View style={styles.item}>
        <Text style={[styles.val, { color: colors.primary }]}>{score}</Text>
        <Text style={[styles.lbl, { color: colors.muted }]}>{s.hudScore}</Text>
      </View>
      <View style={styles.item}>
        <Text style={[styles.val, { color: colors.primary }]}>{'\u{1F525}'}{streak}</Text>
        <Text style={[styles.lbl, { color: colors.muted }]}>{s.hudStreak}</Text>
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
