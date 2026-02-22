import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Colors, useColors } from '../constants/theme';

interface Props {
  current: number;
  total: number;
}

export default function ProgressBar({ current, total }: Props) {
  const colors = useColors();
  const pct = total > 0 ? (current / total) * 100 : 0;

  return (
    <View style={[styles.bar, { backgroundColor: colors.border }]}>
      <View style={[styles.fill, { width: `${pct}%` }]} />
    </View>
  );
}

const styles = StyleSheet.create({
  bar: {
    width: '100%',
    height: 8,
    backgroundColor: Colors.border,
    borderRadius: 99,
    marginBottom: 20,
    overflow: 'hidden',
  },
  fill: {
    height: '100%',
    backgroundColor: Colors.primary,
    borderRadius: 99,
  },
});
