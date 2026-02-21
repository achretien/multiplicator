import React, { useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useNavigation } from '@react-navigation/native';
import { LinearGradient } from 'expo-linear-gradient';
import { Colors, BorderRadius, Spacing, PLAYERS } from '../constants/theme';
import { useGame } from '../context/GameContext';
import { saveGame, DuelHistoryEntry } from '../utils/storage';
import DuelScoreCard from '../components/DuelScoreCard';
import AppHeader from '../components/AppHeader';
import { RootStackParamList } from '../../App';

type NavProp = NativeStackNavigationProp<RootStackParamList>;

export default function DuelResultScreen() {
  const nav = useNavigation<NavProp>();
  const { duelResults, resetDuel, setIsDuel, setDuelPlayerIdx, selectedMode, selectedTables, totalQ } = useGame();

  const child = duelResults[0];
  const papa = duelResults[1];

  useEffect(() => {
    if (child && papa) {
      const childWins = child.score > papa.score;
      const draw = child.score === papa.score;
      const entry: DuelHistoryEntry = {
        date: new Date().toISOString(),
        type: 'duel',
        totalQ,
        mode: selectedMode,
        tables: [...selectedTables].sort((a, b) => a - b),
        winner: draw ? 'draw' : (childWins ? 'child' : 'papa'),
        child: { score: child.score, correct: child.correct, wrong: child.wrong },
        papa: { score: papa.score, correct: papa.correct, wrong: papa.wrong },
        emoji: draw ? '\u{1F91D}' : '\u{1F3C6}',
        stars: draw ? 2 : 3,
      };
      saveGame(entry);
    }
  }, [child, papa, selectedMode, selectedTables, totalQ]);

  if (!child || !papa) return null;

  const childWins = child.score > papa.score;
  const draw = child.score === papa.score;
  const winner = draw ? null : (childWins ? PLAYERS[0] : PLAYERS[1]);

  const bannerColors: [string, string] = draw
    ? ['#a78bfa', '#ffa07a']
    : [winner!.color, childWins ? '#a78bfa' : '#ffa07a'];

  const rematch = () => {
    setIsDuel(true);
    resetDuel();
    setDuelPlayerIdx(0);
    nav.replace('Handover');
  };

  return (
    <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.card}>
        <AppHeader compact />
        <LinearGradient
          colors={bannerColors}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.banner}
        >
          <Text style={styles.trophy}>
            {draw ? '\u{1F91D}' : '\u{1F3C6}'}
          </Text>
          <Text style={styles.winnerName}>
            {draw ? '\u00C9galit\u00E9 !' : `${winner!.emoji} ${winner!.name}`}
          </Text>
          <Text style={styles.winnerSub}>
            {draw ? "Vous \u00EAtes aussi forts l'un que l'autre !" : 'a remport\u00E9 le duel !'}
          </Text>
        </LinearGradient>

        <View style={styles.scores}>
          {PLAYERS.map((p, i) => {
            const r = duelResults[i];
            const isWinner = !draw && winner === p;
            return (
              <DuelScoreCard
                key={p.key}
                emoji={p.emoji}
                name={p.name}
                score={r.score}
                correct={r.correct}
                wrong={r.wrong}
                maxStreak={r.maxStreak}
                color={p.color}
                isWinner={isWinner}
              />
            );
          })}
        </View>

        <TouchableOpacity onPress={rematch} activeOpacity={0.8} style={{ marginBottom: 12 }}>
          <LinearGradient
            colors={[Colors.secondary, '#ffa07a']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.btnDuel}
          >
            <Text style={styles.btnDuelText}>{'\u2694\uFE0F'} Revanche !</Text>
          </LinearGradient>
        </TouchableOpacity>

        <TouchableOpacity style={styles.btnSecondary} onPress={() => nav.popToTop()} activeOpacity={0.7}>
          <Text style={styles.btnSecondaryText}>{'\u{1F3E0}'} Menu</Text>
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
  banner: {
    borderRadius: 18,
    padding: 20,
    alignItems: 'center',
    marginBottom: 20,
  },
  trophy: {
    fontSize: 56,
  },
  winnerName: {
    fontSize: 32,
    fontWeight: '900',
    color: 'white',
  },
  winnerSub: {
    color: 'rgba(255,255,255,0.85)',
    fontSize: 15,
    marginTop: 4,
  },
  scores: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 20,
  },
  btnDuel: {
    width: '100%',
    padding: 16,
    borderRadius: BorderRadius.lg,
    alignItems: 'center',
  },
  btnDuelText: {
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
