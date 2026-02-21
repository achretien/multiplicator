import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Svg, { Rect, Text as SvgText, Line } from 'react-native-svg';
import { Colors } from '../constants/theme';
import Logo from './Logo';

interface Props {
  compact?: boolean;
}

function SmallLogo() {
  return (
    <Svg width={36} height={36} viewBox="0 0 72 72">
      <Rect width={72} height={72} rx={18} fill="#6c63ff" />
      <SvgText x={36} y={30} textAnchor="middle" fontSize={18} fontWeight="900" fill="white" dy={0}>8 × 7</SvgText>
      <Line x1={14} y1={40} x2={58} y2={40} stroke="rgba(255,255,255,0.4)" strokeWidth={1.5} />
      <SvgText x={36} y={58} textAnchor="middle" fontSize={18} fontWeight="900" fill="#ffd166">= ?</SvgText>
    </Svg>
  );
}

export default function AppHeader({ compact }: Props) {
  if (compact) {
    return (
      <View style={styles.compactContainer}>
        <SmallLogo />
        <Text style={styles.compactTitle}>Multiplicator</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Logo />
      <Text style={styles.title}>Multiplicator</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    marginBottom: 16,
  },
  title: {
    fontSize: 28,
    fontWeight: '800',
    textAlign: 'center',
    color: Colors.primary,
  },
  compactContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    marginBottom: 16,
  },
  compactTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: Colors.primary,
  },
});
