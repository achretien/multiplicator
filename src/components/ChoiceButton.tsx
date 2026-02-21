import React, { useRef, useEffect } from 'react';
import { TouchableOpacity, Text, StyleSheet, Animated } from 'react-native';
import { Colors, BorderRadius } from '../constants/theme';

interface Props {
  value: number;
  status: 'default' | 'correct' | 'wrong';
  disabled: boolean;
  onPress: () => void;
}

export default function ChoiceButton({ value, status, disabled, onPress }: Props) {
  const scale = useRef(new Animated.Value(0.8)).current;
  const opacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.spring(scale, {
      toValue: 1,
      friction: 5,
      useNativeDriver: true,
    }).start();
    Animated.timing(opacity, {
      toValue: 1,
      duration: 200,
      useNativeDriver: true,
    }).start();
  }, []);

  const bgColor =
    status === 'correct' ? Colors.success :
    status === 'wrong' ? Colors.secondary :
    'white';

  const borderColor =
    status === 'correct' ? Colors.success :
    status === 'wrong' ? Colors.secondary :
    Colors.border;

  const textColor = status !== 'default' ? 'white' : Colors.text;

  return (
    <Animated.View style={{ transform: [{ scale }], opacity, width: '48%' }}>
      <TouchableOpacity
        style={[styles.btn, { backgroundColor: bgColor, borderColor }]}
        onPress={onPress}
        disabled={disabled}
        activeOpacity={0.7}
      >
        <Text style={[styles.text, { color: textColor }]}>{value}</Text>
      </TouchableOpacity>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  btn: {
    padding: 18,
    borderWidth: 3,
    borderRadius: BorderRadius.lg,
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    fontSize: 24,
    fontWeight: '800',
  },
});
