import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Colors, useColors } from '../constants/theme';

interface Props {
  timeLeft: number;
  totalTime: number;
}

export default function TimerBar({ timeLeft, totalTime }: Props) {
  const colors = useColors();
  const pct = (timeLeft / totalTime) * 100;

  return (
    <View style={styles.wrap}>
      <View style={[styles.bar, { backgroundColor: colors.border }]}>
        <View style={[styles.fill, { width: `${pct}%` }]} />
      </View>
      <Text style={[styles.text, { color: colors.muted }]}>{Math.ceil(timeLeft)}s</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    width: '100%',
    marginBottom: 16,
  },
  bar: {
    width: '100%',
    height: 12,
    backgroundColor: Colors.border,
    borderRadius: 99,
    overflow: 'hidden',
  },
  fill: {
    height: '100%',
    borderRadius: 99,
    backgroundColor: Colors.success,
  },
  text: {
    textAlign: 'center',
    fontSize: 13,
    color: Colors.muted,
    marginTop: 4,
  },
});
