import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, Alert, Platform } from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useNavigation } from '@react-navigation/native';
import { Colors, BorderRadius, Spacing } from '../constants/theme';
import { getStrings } from '../constants/strings';
import { loadHistory, clearHistoryStorage, HistoryEntry } from '../utils/storage';
import HistoryEntryRow from '../components/HistoryEntry';
import AppHeader from '../components/AppHeader';
import { RootStackParamList } from '../../App';

type NavProp = NativeStackNavigationProp<RootStackParamList>;

export default function HistoryScreen() {
  const nav = useNavigation<NavProp>();
  const [history, setHistory] = useState<HistoryEntry[]>([]);

  useEffect(() => {
    loadHistory().then(setHistory);
  }, []);

  const s = getStrings();

  const handleClear = useCallback(() => {
    const doClear = async () => {
      await clearHistoryStorage();
      setHistory([]);
    };
    if (Platform.OS === 'web') {
      if (window.confirm(s.historyClearConfirm)) {
        doClear();
      }
    } else {
      Alert.alert(
        s.historyClearTitle,
        s.historyClearConfirm,
        [
          { text: s.historyCancel, style: 'cancel' },
          { text: s.historyClearAction, style: 'destructive', onPress: doClear },
        ]
      );
    }
  }, [s]);

  return (
    <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.card}>
        <AppHeader compact />
        <Text style={styles.title}>{s.historyTitle}</Text>
        <Text style={styles.sub}>{s.historySub}</Text>

        {history.length === 0 ? (
          <Text style={styles.empty}>{s.historyEmpty}</Text>
        ) : (
          <>
            {history.map((e, i) => (
              <TouchableOpacity key={i} onPress={() => nav.navigate('GameDetail', { entry: e })} activeOpacity={0.7}>
                <HistoryEntryRow entry={e} />
              </TouchableOpacity>
            ))}
            <TouchableOpacity style={styles.btnClear} onPress={handleClear} activeOpacity={0.7}>
              <Text style={styles.btnClearText}>{s.historyClear}</Text>
            </TouchableOpacity>
          </>
        )}

        <TouchableOpacity style={styles.btnSecondary} onPress={() => nav.goBack()} activeOpacity={0.7}>
          <Text style={styles.btnSecondaryText}>{s.menu}</Text>
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
    fontSize: 24,
    fontWeight: '800',
    color: Colors.primary,
    marginBottom: 4,
  },
  sub: {
    color: Colors.muted,
    fontSize: 14,
    marginBottom: 20,
  },
  empty: {
    textAlign: 'center',
    color: Colors.lightMuted,
    padding: 32,
    fontSize: 16,
  },
  btnClear: {
    width: '100%',
    padding: 10,
    backgroundColor: '#fff0f3',
    borderWidth: 2,
    borderColor: Colors.secondary,
    borderRadius: BorderRadius.sm,
    alignItems: 'center',
    marginTop: 8,
  },
  btnClearText: {
    color: Colors.secondary,
    fontSize: 14,
    fontWeight: '700',
  },
  btnSecondary: {
    width: '100%',
    padding: 12,
    backgroundColor: '#f0f0f0',
    borderRadius: BorderRadius.md,
    alignItems: 'center',
    marginTop: 10,
  },
  btnSecondaryText: {
    color: Colors.text,
    fontSize: 16,
    fontWeight: '700',
  },
});
