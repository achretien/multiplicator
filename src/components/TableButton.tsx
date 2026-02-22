import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';
import { Colors, BorderRadius, useColors } from '../constants/theme';

interface Props {
  value: number;
  selected: boolean;
  onPress: () => void;
}

export default function TableButton({ value, selected, onPress }: Props) {
  const colors = useColors();
  return (
    <TouchableOpacity
      style={[
        styles.btn,
        { backgroundColor: colors.card, borderColor: colors.border },
        selected && { borderColor: colors.primary, backgroundColor: colors.surfaceSelected },
      ]}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <Text style={[styles.text, { color: selected ? colors.primary : colors.text }]}>{value}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  btn: {
    paddingVertical: 10,
    borderWidth: 2,
    borderColor: '#ddd',
    borderRadius: BorderRadius.sm,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'white',
    flex: 1,
  },
  selected: {
    borderColor: Colors.primary,
    backgroundColor: '#f0eeff',
  },
  text: {
    fontSize: 17,
    fontWeight: '700',
    color: Colors.text,
  },
  selectedText: {
    color: Colors.primary,
  },
});
