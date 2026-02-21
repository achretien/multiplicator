import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Colors, MODE_LABELS } from '../constants/theme';
import { HistoryEntry as HistoryEntryType, formatDate } from '../utils/storage';

interface Props {
  entry: HistoryEntryType;
}

export default function HistoryEntryRow({ entry }: Props) {
  if (entry.type === 'duel') {
    const w = entry.winner === 'draw'
      ? '\u00C9galit\u00E9 \u{1F91D}'
      : entry.winner === 'child'
        ? '\u{1F476} Enfant gagne \u{1F3C6}'
        : '\u{1F468} Papa gagne \u{1F3C6}';
    return (
      <View style={styles.entry}>
        <Text style={styles.emoji}>{'\u2694\uFE0F'}</Text>
        <View style={styles.info}>
          <Text style={styles.title}>{w}</Text>
          <Text style={styles.detail}>
            {'\u{1F476}'} {entry.child.score}pts {'\u00B7'} {'\u{1F468}'} {entry.papa.score}pts {'\u00B7'} {MODE_LABELS[entry.mode] || entry.mode}
          </Text>
          <Text style={styles.date}>{formatDate(entry.date)}</Text>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.entry}>
      <Text style={styles.emoji}>{entry.emoji}</Text>
      <View style={styles.info}>
        <Text style={styles.title}>
          {'\u2B50'.repeat(entry.stars)} {entry.correct}/{entry.totalQ} bonnes
        </Text>
        <Text style={styles.detail}>
          Tables : {entry.tables.join(', ')} {'\u00B7'} {MODE_LABELS[entry.mode] || entry.mode}
        </Text>
        <Text style={styles.date}>{formatDate(entry.date)}</Text>
      </View>
      <View style={styles.scoreWrap}>
        <Text style={styles.score}>{entry.score}</Text>
        <Text style={styles.scoreLbl}>pts</Text>
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
