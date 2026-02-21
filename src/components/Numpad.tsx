import React from 'react';
import { View, TouchableOpacity, Text, StyleSheet } from 'react-native';
import { Colors, BorderRadius } from '../constants/theme';

interface Props {
  onPress: (digit: string) => void;
  onDelete: () => void;
}

export default function Numpad({ onPress, onDelete }: Props) {
  const digits = ['1', '2', '3', '4', '5', '6', '7', '8', '9'];

  return (
    <View style={styles.grid}>
      {digits.map((d) => (
        <TouchableOpacity
          key={d}
          style={styles.btn}
          onPress={() => onPress(d)}
          activeOpacity={0.6}
        >
          <Text style={styles.text}>{d}</Text>
        </TouchableOpacity>
      ))}
      <TouchableOpacity
        style={[styles.btn, styles.zero]}
        onPress={() => onPress('0')}
        activeOpacity={0.6}
      >
        <Text style={styles.text}>0</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={[styles.btn, styles.del]}
        onPress={onDelete}
        activeOpacity={0.6}
      >
        <Text style={[styles.text, styles.delText]}>{'\u232B'}</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginTop: 4,
  },
  btn: {
    width: '31%',
    padding: 14,
    borderWidth: 2,
    borderColor: Colors.border,
    borderRadius: BorderRadius.md,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'white',
  },
  zero: {
    width: '64%',
  },
  del: {
    backgroundColor: '#fff0f3',
    borderColor: '#ffd6e0',
  },
  text: {
    fontSize: 22,
    fontWeight: '800',
    color: Colors.text,
  },
  delText: {
    color: Colors.secondary,
  },
});
