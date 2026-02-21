import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useNavigation } from '@react-navigation/native';
import { LinearGradient } from 'expo-linear-gradient';
import { Colors, BorderRadius, Spacing } from '../constants/theme';
import { getStrings } from '../constants/strings';
import { useGame } from '../context/GameContext';
import AppHeader from '../components/AppHeader';
import TableButton from '../components/TableButton';
import ModeCard from '../components/ModeCard';
import GitHubRibbon from '../components/GitHubRibbon';
import { RootStackParamList } from '../../App';

type NavProp = NativeStackNavigationProp<RootStackParamList>;

function getModes() {
  const s = getStrings();
  return [
    { key: 'qcm' as const, icon: '\u{1F518}', name: s.modeQcm },
    { key: 'input' as const, icon: '\u270F\uFE0F', name: s.modeInput },
    { key: 'timer' as const, icon: '\u23F1\uFE0F', name: s.modeTimer },
  ];
}

const QUESTION_COUNTS = [
  { value: 10, icon: '\u{1F3AF}' },
  { value: 20, icon: '\u{1F3AF}\u{1F3AF}' },
  { value: 30, icon: '\u{1F3C6}' },
];

export default function MenuScreen() {
  const nav = useNavigation<NavProp>();
  const { selectedTables, selectedMode, totalQ, toggleTable, setMode, setTotalQ, setIsDuel, resetDuel, initRound } = useGame();
  const s = getStrings();
  const MODES = getModes();

  const startSolo = () => {
    setIsDuel(false);
    resetDuel();
    initRound();
    nav.navigate('Game');
  };

  const startDuel = () => {
    setIsDuel(true);
    resetDuel();
    nav.navigate('Handover');
  };

  return (
    <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
      <View style={[styles.card, { overflow: 'hidden' }]}>
        <GitHubRibbon />
        <AppHeader />
        <Text style={styles.sub}>{s.appSubtitle}</Text>

        <Text style={styles.label}>{s.tablesToReview}</Text>
        <View style={styles.tableGrid}>
          <View style={styles.tableRow}>
            {[1, 2, 3, 4, 5].map((i) => (
              <TableButton key={i} value={i} selected={selectedTables.includes(i)} onPress={() => toggleTable(i)} />
            ))}
          </View>
          <View style={styles.tableRow}>
            {[6, 7, 8, 9, 10].map((i) => (
              <TableButton key={i} value={i} selected={selectedTables.includes(i)} onPress={() => toggleTable(i)} />
            ))}
          </View>
        </View>

        <Text style={styles.label}>{s.gameMode}</Text>
        <View style={styles.modeGrid}>
          {MODES.map((m) => (
            <ModeCard
              key={m.key}
              icon={m.icon}
              name={m.name}
              selected={selectedMode === m.key}
              onPress={() => setMode(m.key)}
            />
          ))}
        </View>

        <Text style={styles.label}>{s.questionCount}</Text>
        <View style={[styles.modeGrid, { marginBottom: 20 }]}>
          {QUESTION_COUNTS.map((q) => (
            <ModeCard
              key={q.value}
              icon={q.icon}
              name={String(q.value)}
              selected={totalQ === q.value}
              onPress={() => setTotalQ(q.value)}
            />
          ))}
        </View>

        <TouchableOpacity onPress={startSolo} activeOpacity={0.8} style={{ marginBottom: 12 }}>
          <LinearGradient
            colors={[Colors.primary, '#a78bfa']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.btnStart}
          >
            <Text style={styles.btnStartText}>{s.playSolo}</Text>
          </LinearGradient>
        </TouchableOpacity>

        <TouchableOpacity onPress={startDuel} activeOpacity={0.8} style={{ marginBottom: 12 }}>
          <LinearGradient
            colors={[Colors.secondary, '#ffa07a']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.btnStart}
          >
            <Text style={styles.btnStartText}>{s.playDuel}</Text>
          </LinearGradient>
        </TouchableOpacity>

        <TouchableOpacity style={styles.btnSecondary} onPress={() => nav.navigate('History')} activeOpacity={0.7}>
          <Text style={styles.btnSecondaryText}>{s.historyButton}</Text>
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
  sub: {
    textAlign: 'center',
    color: Colors.muted,
    marginBottom: 24,
  },
  label: {
    fontWeight: '700',
    color: '#555',
    marginBottom: 10,
    fontSize: 13,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  tableGrid: {
    gap: 8,
    marginBottom: 20,
  },
  tableRow: {
    flexDirection: 'row',
    gap: 8,
  },
  modeGrid: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 20,
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
