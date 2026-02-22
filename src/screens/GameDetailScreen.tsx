import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { Colors, BorderRadius, Spacing, MODE_LABELS, PLAYERS } from '../constants/theme';
import { getStrings } from '../constants/strings';
import { QuestionResult, formatDate } from '../utils/storage';
import AppHeader from '../components/AppHeader';
import { RootStackParamList } from '../../App';

type NavProp = NativeStackNavigationProp<RootStackParamList>;
type RouteProps = RouteProp<RootStackParamList, 'GameDetail'>;

// ─── Solo row ────────────────────────────────────────────────────────────────

function SoloRow({ result, index }: { result: QuestionResult; index: number }) {
  const s = getStrings();
  const isTimeout = result.given === -1;
  return (
    <View style={[styles.row, result.correct ? styles.rowCorrect : styles.rowWrong]}>
      <Text style={styles.rowNum}>{index + 1}</Text>
      <View style={styles.rowCenter}>
        <Text style={styles.rowQuestion}>
          {result.a} × {result.b} ={' '}
          {isTimeout ? (
            <Text style={styles.rowTimeout}>{s.gameDetailTimeout}</Text>
          ) : (
            <Text style={[styles.rowGiven, !result.correct && styles.rowGivenWrong]}>
              {result.given}
              {!result.correct && <Text style={styles.rowCorrectAns}> → {result.ans}</Text>}
            </Text>
          )}
        </Text>
      </View>
      <View style={styles.rowRight}>
        <Text style={styles.rowIcon}>{result.correct ? '✅' : '❌'}</Text>
        <Text style={styles.rowTime}>{result.elapsed.toFixed(1)}s</Text>
      </View>
    </View>
  );
}

// ─── Duel cell ───────────────────────────────────────────────────────────────

function DuelCell({ result, fastest }: { result: QuestionResult; fastest?: boolean }) {
  const s = getStrings();
  const isTimeout = result.given === -1;
  return (
    <View style={[styles.cell, result.correct ? styles.cellCorrect : styles.cellWrong, fastest && styles.cellFastest]}>
      <Text style={styles.cellQuestion} numberOfLines={1}>
        {result.a}×{result.b}={' '}
        {isTimeout ? (
          <Text style={styles.cellTimeout}>{s.gameDetailTimeout}</Text>
        ) : (
          <Text style={[styles.cellGiven, !result.correct && styles.cellGivenWrong]}>
            {result.given}
            {!result.correct && <Text style={styles.cellCorrectAns}> →{result.ans}</Text>}
          </Text>
        )}
      </Text>
      <View style={styles.cellMeta}>
        <Text style={styles.cellIcon}>{result.correct ? '✅' : '❌'}</Text>
        <Text style={styles.cellTime}>{fastest ? '⚡' : ''}{result.elapsed.toFixed(1)}s</Text>
      </View>
    </View>
  );
}

function DuelTableRow({ childResult, parentResult, index }: {
  childResult?: QuestionResult;
  parentResult?: QuestionResult;
  index: number;
}) {
  const childFastest = !!(childResult && parentResult && childResult.elapsed < parentResult.elapsed);
  const parentFastest = !!(childResult && parentResult && parentResult.elapsed < childResult.elapsed);

  return (
    <View style={styles.duelRow}>
      <View style={styles.rowNumWrap}>
        <Text style={styles.rowNum}>{index + 1}</Text>
      </View>
      <View style={styles.cellWrap}>
        {childResult ? <DuelCell result={childResult} fastest={childFastest} /> : <View style={styles.cellEmpty} />}
      </View>
      <View style={styles.cellWrap}>
        {parentResult ? <DuelCell result={parentResult} fastest={parentFastest} /> : <View style={styles.cellEmpty} />}
      </View>
    </View>
  );
}

// ─── Screen ──────────────────────────────────────────────────────────────────

export default function GameDetailScreen() {
  const nav = useNavigation<NavProp>();
  const route = useRoute<RouteProps>();
  const { entry } = route.params;
  const s = getStrings();

  const isDuel = entry.type === 'duel';
  const maxLen = isDuel
    ? Math.max(entry.child.questions?.length ?? 0, entry.parent.questions?.length ?? 0)
    : 0;

  return (
    <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.card}>
        <AppHeader compact />
        <Text style={styles.title}>{s.gameDetailTitle}</Text>
        <Text style={styles.meta}>
          {isDuel ? '⚔️ Duel' : '🚀 Solo'}{' · '}
          {MODE_LABELS[entry.mode] || entry.mode}{' · '}
          {formatDate(entry.date)}
        </Text>

        {isDuel ? (
          <>
            {/* En-tête joueurs */}
            <View style={styles.duelHeader}>
              <View style={styles.rowNumSpacer} />
              <Text style={[styles.duelPlayerLabel, { color: PLAYERS[0].color }]}>
                {PLAYERS[0].emoji} {PLAYERS[0].name}
              </Text>
              <Text style={[styles.duelPlayerLabel, { color: PLAYERS[1].color }]}>
                {PLAYERS[1].emoji} {PLAYERS[1].name}
              </Text>
            </View>

            {maxLen === 0 ? (
              <Text style={styles.noData}>{s.gameDetailNoData}</Text>
            ) : (
              <View style={styles.duelList}>
                {Array.from({ length: maxLen }, (_, i) => (
                  <DuelTableRow
                    key={i}
                    index={i}
                    childResult={entry.child.questions?.[i]}
                    parentResult={entry.parent.questions?.[i]}
                  />
                ))}
              </View>
            )}
          </>
        ) : (
          !entry.questions?.length ? (
            <Text style={styles.noData}>{s.gameDetailNoData}</Text>
          ) : (
            <View style={styles.list}>
              {entry.questions.map((q, i) => (
                <SoloRow key={i} result={q} index={i} />
              ))}
            </View>
          )
        )}

        <TouchableOpacity style={styles.btnBack} onPress={() => nav.goBack()} activeOpacity={0.7}>
          <Text style={styles.btnBackText}>← Retour</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

// ─── Styles ──────────────────────────────────────────────────────────────────

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
    paddingHorizontal: 20,
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
    marginBottom: 16,
  },
  noData: {
    textAlign: 'center',
    color: Colors.lightMuted,
    padding: 32,
    fontSize: 15,
    lineHeight: 24,
  },

  // ── Solo ──
  list: {
    gap: 8,
    marginBottom: 16,
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
    width: 20,
    fontSize: 11,
    fontWeight: '700',
    color: Colors.muted,
    textAlign: 'center',
  },
  rowNumSpacer: {
    width: 20,
  },
  rowCenter: {
    flex: 1,
  },
  rowQuestion: {
    fontSize: 15,
    fontWeight: '700',
    color: Colors.text,
  },
  rowGiven: {
    fontSize: 15,
    fontWeight: '700',
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
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  rowIcon: {
    fontSize: 14,
  },
  rowTime: {
    fontSize: 11,
    color: Colors.muted,
    fontWeight: '600',
  },

  // ── Duel ──
  duelHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
    gap: 6,
  },
  duelPlayerLabel: {
    flex: 1,
    fontSize: 13,
    fontWeight: '800',
    textAlign: 'center',
  },
  duelList: {
    gap: 6,
    marginBottom: 16,
  },
  duelRow: {
    flexDirection: 'row',
    alignItems: 'stretch',
    gap: 6,
  },
  rowNumWrap: {
    width: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cellWrap: {
    flex: 1,
  },
  cellEmpty: {
    flex: 1,
  },
  cell: {
    flex: 1,
    borderRadius: 10,
    paddingVertical: 6,
    paddingHorizontal: 8,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  cellCorrect: {
    backgroundColor: '#f0fdf4',
    borderWidth: 1.5,
    borderColor: '#86efac',
  },
  cellWrong: {
    backgroundColor: '#fff1f2',
    borderWidth: 1.5,
    borderColor: '#fda4af',
  },
  cellFastest: {
    borderWidth: 2,
    borderColor: Colors.warn,
  },
  cellQuestion: {
    flex: 1,
    fontSize: 12,
    fontWeight: '700',
    color: Colors.text,
  },
  cellGiven: {
    fontSize: 12,
    fontWeight: '700',
    color: Colors.success,
  },
  cellGivenWrong: {
    color: Colors.secondary,
  },
  cellCorrectAns: {
    fontSize: 11,
    color: Colors.success,
    fontWeight: '700',
  },
  cellTimeout: {
    fontSize: 12,
    color: Colors.secondary,
  },
  cellMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
  },
  cellIcon: {
    fontSize: 11,
  },
  cellTime: {
    fontSize: 11,
    color: Colors.muted,
    fontWeight: '600',
  },

  // ── Bouton ──
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
