import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';
import { Colors, BorderRadius } from '../constants/theme';

interface Props {
  value: number;
  selected: boolean;
  onPress: () => void;
}

export default function TableButton({ value, selected, onPress }: Props) {
  return (
    <TouchableOpacity
      style={[styles.btn, selected && styles.selected]}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <Text style={[styles.text, selected && styles.selectedText]}>{value}</Text>
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
