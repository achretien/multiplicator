import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useNavigation } from '@react-navigation/native';
import { LinearGradient } from 'expo-linear-gradient';
import { Colors, BorderRadius, Spacing, PLAYERS, useColors } from '../constants/theme';
import { getStrings } from '../constants/strings';
import AppHeader from '../components/AppHeader';
import { useGame } from '../context/GameContext';
import { RootStackParamList } from '../../App';

type NavProp = NativeStackNavigationProp<RootStackParamList>;

export default function HandoverScreen() {
  const nav = useNavigation<NavProp>();
  const { duelPlayerIdx, initRound } = useGame();

  const s = getStrings();
  const colors = useColors();
  const player = PLAYERS[duelPlayerIdx];
  const subText = duelPlayerIdx === 0
    ? s.handoverYourTurn
    : s.handoverPassTablet(player.name);

  const gradientEnd = duelPlayerIdx === 0 ? '#a78bfa' : '#ffa07a';

  const beginTurn = () => {
    initRound();
    nav.navigate('Game');
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.bg }]}>
      <View style={[styles.card, { backgroundColor: colors.card }]}>
        <AppHeader compact />
        <Text style={styles.emoji}>{player.emoji}</Text>
        <Text style={[styles.name, { color: colors.text }]}>{player.name}</Text>
        <Text style={[styles.sub, { color: colors.muted }]}>{subText}</Text>
        <TouchableOpacity onPress={beginTurn} activeOpacity={0.8}>
          <LinearGradient
            colors={[player.color, gradientEnd]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.btn}
          >
            <Text style={styles.btnText}>{s.handoverGo} {'\u{1F680}'}</Text>
          </LinearGradient>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: Spacing.lg,
    backgroundColor: Colors.bg,
  },
  card: {
    backgroundColor: Colors.card,
    borderRadius: BorderRadius.card,
    padding: 28,
    paddingHorizontal: 24,
    width: '100%',
    maxWidth: 480,
    alignItems: 'center',
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.12,
    shadowRadius: 32,
    elevation: 8,
  },
  emoji: {
    fontSize: 56,
    textAlign: 'center',
    marginBottom: 8,
  },
  name: {
    fontSize: 32,
    fontWeight: '900',
    textAlign: 'center',
    color: Colors.text,
    marginBottom: 6,
  },
  sub: {
    textAlign: 'center',
    color: Colors.muted,
    marginBottom: 28,
    fontSize: 16,
  },
  btn: {
    width: '100%',
    padding: 18,
    borderRadius: BorderRadius.lg,
    alignItems: 'center',
    minWidth: 280,
  },
  btnText: {
    color: 'white',
    fontSize: 20,
    fontWeight: '800',
  },
});
