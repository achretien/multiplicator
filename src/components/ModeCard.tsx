import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';
import { Colors, BorderRadius, useColors } from '../constants/theme';

interface Props {
  icon: string;
  name: string;
  selected: boolean;
  onPress: () => void;
}

export default function ModeCard({ icon, name, selected, onPress }: Props) {
  const colors = useColors();
  return (
    <TouchableOpacity
      style={[
        styles.card,
        { backgroundColor: colors.card, borderColor: colors.border },
        selected && { borderColor: colors.primary, backgroundColor: colors.surfaceSelected },
      ]}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <Text style={styles.icon}>{icon}</Text>
      <Text style={[styles.name, { color: colors.text }]}>{name}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    borderWidth: 2,
    borderColor: '#ddd',
    borderRadius: BorderRadius.md,
    paddingVertical: 12,
    paddingHorizontal: 6,
    alignItems: 'center',
    backgroundColor: 'white',
    flex: 1,
  },
  selected: {
    borderColor: Colors.primary,
    backgroundColor: '#f0eeff',
  },
  icon: {
    fontSize: 28,
  },
  name: {
    fontSize: 12,
    fontWeight: '700',
    color: Colors.text,
    marginTop: 4,
    textAlign: 'center',
  },
});
