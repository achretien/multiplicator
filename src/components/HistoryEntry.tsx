import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Colors, MODE_LABELS, useColors } from '../constants/theme';
import { HistoryEntry as HistoryEntryType, formatDate } from '../utils/storage';
import { getStrings } from '../constants/strings';

interface Props {
  entry: HistoryEntryType;
}

export default function HistoryEntryRow({ entry }: Props) {
  const s = getStrings();
  const colors = useColors();
  if (entry.type === 'duel') {
    const w = entry.winner === 'draw'
      ? s.historyDraw
      : entry.winner === 'child'
        ? s.historyChildWins
        : s.historyParentWins;
    return (
      <View style={[styles.entry, { borderColor: colors.border }]}>
        <Text style={styles.emoji}>{'\u2694\uFE0F'}</Text>
        <View style={styles.info}>
          <Text style={[styles.title, { color: colors.text }]}>{w}</Text>
          <Text style={[styles.detail, { color: colors.muted }]}>
            {'\u{1F476}'} {entry.child.score}{s.pts} {'\u00B7'} {'\u{1F468}'} {entry.parent.score}{s.pts} {'\u00B7'} {MODE_LABELS[entry.mode] || entry.mode}
          </Text>
          <Text style={[styles.date, { color: colors.lightMuted }]}>{formatDate(entry.date)}</Text>
        </View>
      </View>
    );
  }

  return (
    <View style={[styles.entry, { borderColor: colors.border }]}>
      <Text style={styles.emoji}>{entry.emoji}</Text>
      <View style={styles.info}>
        <Text style={[styles.title, { color: colors.text }]}>
          {'\u2B50'.repeat(entry.stars)} {s.historyCorrectCount(entry.correct, entry.totalQ)}
        </Text>
        <Text style={[styles.detail, { color: colors.muted }]}>
          {s.historyTables(entry.tables)} {'\u00B7'} {MODE_LABELS[entry.mode] || entry.mode}
        </Text>
        <Text style={[styles.date, { color: colors.lightMuted }]}>{formatDate(entry.date)}</Text>
      </View>
      <View style={styles.scoreWrap}>
        <Text style={[styles.score, { color: colors.primary }]}>{entry.score}</Text>
        <Text style={[styles.scoreLbl, { color: colors.lightMuted }]}>{s.pts}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  entry: {
    borderWidth: 2,
    borderColor: Colors.border,
    borderRadius: 14,
    padding: 12,
    paddingHorizontal: 16,
    marginBottom: 10,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  emoji: {
    fontSize: 28,
  },
  info: {
    flex: 1,
  },
  title: {
    fontWeight: '800',
    fontSize: 15,
  },
  detail: {
    fontSize: 13,
    color: '#666',
  },
  date: {
    fontSize: 11,
    color: Colors.lightMuted,
  },
  scoreWrap: {
    alignItems: 'flex-end',
  },
  score: {
    fontSize: 22,
    fontWeight: '800',
    color: Colors.primary,
  },
  scoreLbl: {
    fontSize: 10,
    color: Colors.lightMuted,
  },
});
