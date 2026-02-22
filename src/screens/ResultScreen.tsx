import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useNavigation } from '@react-navigation/native';
import { LinearGradient } from 'expo-linear-gradient';
import { Colors, BorderRadius, Spacing, useColors } from '../constants/theme';
import { getStrings } from '../constants/strings';
import { useGame } from '../context/GameContext';
import { getResultData } from '../utils/gameLogic';
import StarsRow from '../components/StarsRow';
import AppHeader from '../components/AppHeader';
import { RootStackParamList } from '../../App';

type NavProp = NativeStackNavigationProp<RootStackParamList>;

export default function ResultScreen() {
  const nav = useNavigation<NavProp>();
  const { score, correct, wrong, maxStreak, totalQ, initRound, setIsDuel, resetDuel, lastEntry } = useGame();

  const { emoji, title, sub, stars } = getResultData(correct, totalQ);
  const s = getStrings();
  const colors = useColors();

  const replay = () => {
    setIsDuel(false);
    resetDuel();
    initRound();
    nav.replace('Game');
  };

  return (
    <ScrollView contentContainerStyle={[styles.container, { backgroundColor: colors.bg }]} showsVerticalScrollIndicator={false}>
      <View style={[styles.card, { backgroundColor: colors.card }]}>
        <AppHeader compact />
        <Text style={styles.emoji}>{emoji}</Text>
        <Text style={[styles.title, { color: colors.primary }]}>{title}</Text>
        <Text style={[styles.sub, { color: colors.muted }]}>{sub}</Text>
        <Text style={[styles.scoreBig, { color: colors.primary }]}>{score}</Text>
        <Text style={[styles.scoreLabel, { color: colors.lightMuted }]}>{s.points}</Text>
        <StarsRow stars={stars} />

        <View style={styles.statsRow}>
          <View style={styles.stat}>
            <Text style={[styles.statVal, { color: Colors.success }]}>{correct}</Text>
            <Text style={[styles.statLbl, { color: colors.muted }]}>{s.correctLabel}</Text>
          </View>
          <View style={styles.stat}>
            <Text style={[styles.statVal, { color: Colors.secondary }]}>{wrong}</Text>
            <Text style={[styles.statLbl, { color: colors.muted }]}>{s.errorsLabel}</Text>
          </View>
          <View style={styles.stat}>
            <Text style={[styles.statVal, { color: Colors.warn }]}>{maxStreak}</Text>
            <Text style={[styles.statLbl, { color: colors.muted }]}>{s.maxStreakLabel}</Text>
          </View>
        </View>

        <TouchableOpacity onPress={replay} activeOpacity={0.8} style={{ marginBottom: 12 }}>
          <LinearGradient
            colors={[Colors.primary, '#a78bfa']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.btnStart}
          >
            <Text style={styles.btnStartText}>{s.replay}</Text>
          </LinearGradient>
        </TouchableOpacity>

        {lastEntry && (
          <TouchableOpacity
            style={[styles.btnSecondary, { marginBottom: 10, backgroundColor: colors.btnSecondary }]}
            onPress={() => nav.navigate('GameDetail', { entry: lastEntry })}
            activeOpacity={0.7}
          >
            <Text style={[styles.btnSecondaryText, { color: colors.text }]}>{s.detailButton}</Text>
          </TouchableOpacity>
        )}

        <TouchableOpacity style={[styles.btnSecondary, { backgroundColor: colors.btnSecondary }]} onPress={() => nav.popToTop()} activeOpacity={0.7}>
          <Text style={[styles.btnSecondaryText, { color: colors.text }]}>{s.menu}</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
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
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.12,
    shadowRadius: 32,
    elevation: 8,
  },
  emoji: {
    fontSize: 64,
    textAlign: 'center',
    marginBottom: 8,
  },
  title: {
    fontSize: 24,
    fontWeight: '800',
    textAlign: 'center',
    color: Colors.primary,
    marginBottom: 4,
  },
  sub: {
    textAlign: 'center',
    color: Colors.muted,
    marginBottom: 20,
  },
  scoreBig: {
    fontSize: 64,
    fontWeight: '900',
    color: Colors.primary,
    textAlign: 'center',
  },
  scoreLabel: {
    fontSize: 16,
    color: Colors.lightMuted,
    textAlign: 'center',
    marginBottom: 20,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 24,
  },
  stat: {
    alignItems: 'center',
  },
  statVal: {
    fontSize: 24,
    fontWeight: '800',
  },
  statLbl: {
    fontSize: 11,
    color: Colors.muted,
    textTransform: 'uppercase',
  },
  btnStart: {
    width: '100%',
    padding: 16,
    borderRadius: BorderRadius.lg,
    alignItems: 'center',
  },
  btnStartText: {
    color: 'white',
    fontSize: 19,
    fontWeight: '800',
  },
  btnSecondary: {
    width: '100%',
    padding: 12,
    backgroundColor: '#f0f0f0',
    borderRadius: BorderRadius.md,
    alignItems: 'center',
  },
  btnSecondaryText: {
    color: Colors.text,
    fontSize: 16,
    fontWeight: '700',
  },
});
