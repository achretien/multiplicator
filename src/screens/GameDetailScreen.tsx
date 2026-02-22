import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { Colors, BorderRadius, Spacing, MODE_LABELS } from '../constants/theme';
import { getStrings } from '../constants/strings';
import { QuestionResult, formatDate } from '../utils/storage';
import AppHeader from '../components/AppHeader';
import { RootStackParamList } from '../../App';

type NavProp = NativeStackNavigationProp<RootStackParamList>;
type RouteProps = RouteProp<RootStackParamList, 'GameDetail'>;

function QuestionRow({ result, index }: { result: QuestionResult; index: number }) {
  const s = getStrings();
  const isTimeout = result.given === -1;

  return (
    <View style={[styles.row, result.correct ? styles.rowCorrect : styles.rowWrong]}>
      <Text style={styles.rowNum}>{index + 1}</Text>
      <View style={styles.rowCenter}>
        <Text style={styles.rowQuestion}>
          {result.a} × {result.b} = ?
        </Text>
        <View style={styles.rowAnswers}>
          {isTimeout ? (
            <Text style={styles.rowTimeout}>{s.gameDetailTimeout} Temps écoulé</Text>
          ) : (
            <Text style={[styles.rowGiven, !result.correct && styles.rowGivenWrong]}>
              {result.given}
              {!result.correct && (
                <Text style={styles.rowCorrectAns}> → {result.ans}</Text>
              )}
            </Text>
          )}
        </View>
      </View>
      <View style={styles.rowRight}>
        <Text style={styles.rowIcon}>{result.correct ? '✅' : '❌'}</Text>
        <Text style={styles.rowTime}>{result.elapsed.toFixed(1)}s</Text>
      </View>
    </View>
  );
}

export default function GameDetailScreen() {
  const nav = useNavigation<NavProp>();
  const route = useRoute<RouteProps>();
  const { entry } = route.params;
  const s = getStrings();

  const questions: QuestionResult[] | undefined =
    entry.type === 'solo'
      ? entry.questions
      : undefined;

  return (
    <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.card}>
        <AppHeader compact />
        <Text style={styles.title}>{s.gameDetailTitle}</Text>
        <Text style={styles.meta}>
          {entry.type === 'duel' ? '⚔️ Duel' : '🚀 Solo'}{' · '}
          {MODE_LABELS[entry.mode] || entry.mode}{' · '}
          {formatDate(entry.date)}
        </Text>

        {!questions ? (
          <Text style={styles.noData}>{s.gameDetailNoData}</Text>
        ) : (
          <View style={styles.list}>
            {questions.map((q, i) => (
              <QuestionRow key={i} result={q} index={i} />
            ))}
          </View>
        )}

        <TouchableOpacity style={styles.btnBack} onPress={() => nav.goBack()} activeOpacity={0.7}>
          <Text style={styles.btnBackText}>{s.menu}</Text>
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
  title: {
    fontSize: 22,
    fontWeight: '800',
    color: Colors.primary,
    marginBottom: 4,
  },
  meta: {
    fontSize: 13,
    color: Colors.muted,
    marginBottom: 20,
  },
  noData: {
    textAlign: 'center',
    color: Colors.lightMuted,
    padding: 32,
    fontSize: 15,
    lineHeight: 24,
  },
  list: {
    gap: 8,
    marginBottom: 20,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: BorderRadius.sm,
    paddingVertical: 10,
    paddingHorizontal: 12,
    gap: 10,
  },
  rowCorrect: {
    backgroundColor: '#f0fdf4',
    borderWidth: 1.5,
    borderColor: '#86efac',
  },
  rowWrong: {
    backgroundColor: '#fff1f2',
    borderWidth: 1.5,
    borderColor: '#fda4af',
  },
  rowNum: {
    width: 22,
    fontSize: 12,
    fontWeight: '700',
    color: Colors.muted,
    textAlign: 'center',
  },
  rowCenter: {
    flex: 1,
  },
  rowQuestion: {
    fontSize: 15,
    fontWeight: '700',
    color: Colors.text,
  },
  rowAnswers: {
    marginTop: 2,
  },
  rowGiven: {
    fontSize: 13,
    fontWeight: '600',
    color: Colors.success,
  },
  rowGivenWrong: {
    color: Colors.secondary,
  },
  rowCorrectAns: {
    fontSize: 13,
    color: Colors.success,
    fontWeight: '700',
  },
  rowTimeout: {
    fontSize: 13,
    color: Colors.secondary,
    fontWeight: '600',
  },
  rowRight: {
    alignItems: 'flex-end',
    gap: 2,
  },
  rowIcon: {
    fontSize: 16,
  },
  rowTime: {
    fontSize: 11,
    color: Colors.muted,
    fontWeight: '600',
  },
  btnBack: {
    width: '100%',
    padding: 12,
    backgroundColor: '#f0f0f0',
    borderRadius: BorderRadius.md,
    alignItems: 'center',
  },
  btnBackText: {
    color: Colors.text,
    fontSize: 16,
    fontWeight: '700',
  },
});
