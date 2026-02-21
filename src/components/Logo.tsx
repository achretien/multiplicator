import React from 'react';
import { View, StyleSheet } from 'react-native';
import Svg, { Rect, Text as SvgText, Line, LinearGradient, Stop, Defs } from 'react-native-svg';

export default function Logo() {
  return (
    <View style={styles.container}>
      <Svg width={72} height={72} viewBox="0 0 72 72">
        <Defs>
          <LinearGradient id="logoGrad" x1="0" y1="0" x2="72" y2="72" gradientUnits="userSpaceOnUse">
            <Stop offset="0%" stopColor="#6c63ff" />
            <Stop offset="100%" stopColor="#a78bfa" />
          </LinearGradient>
        </Defs>
        <Rect width={72} height={72} rx={18} fill="url(#logoGrad)" />
        <SvgText
          x={36} y={30}
          textAnchor="middle"
          fontSize={18}
          fontWeight="900"
          fill="white"
          dy={0}
        >
          8 × 7
        </SvgText>
        <Line x1={14} y1={40} x2={58} y2={40} stroke="rgba(255,255,255,0.4)" strokeWidth={1.5} />
        <SvgText
          x={36} y={58}
          textAnchor="middle"
          fontSize={18}
          fontWeight="900"
          fill="#ffd166"
        >
          = ?
        </SvgText>
      </Svg>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    marginBottom: 8,
  },
});
