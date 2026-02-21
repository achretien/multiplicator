import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, Alert, Platform } from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useNavigation } from '@react-navigation/native';
import { Colors, BorderRadius, Spacing } from '../constants/theme';
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

  const handleClear = useCallback(() => {
    const doClear = async () => {
      await clearHistoryStorage();
      setHistory([]);
    };
    if (Platform.OS === 'web') {
      if (window.confirm("Effacer tout l'historique ?")) {
        doClear();
      }
    } else {
      Alert.alert(
        'Effacer l\'historique',
        "Effacer tout l'historique ?",
        [
          { text: 'Annuler', style: 'cancel' },
          { text: 'Effacer', style: 'destructive', onPress: doClear },
        ]
      );
    }
  }, []);

  return (
    <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.card}>
        <AppHeader compact />
        <Text style={styles.title}>{'\u{1F4DC}'} Historique</Text>
        <Text style={styles.sub}>Toutes tes parties sauvegard{'\u00E9'}es</Text>

        {history.length === 0 ? (
          <Text style={styles.empty}>
            {'\u{1F634}'} Aucune partie enregistr{'\u00E9'}e{'\n'}Joue ta premi{'\u00E8'}re partie !
          </Text>
        ) : (
          <>
            {history.map((e, i) => (
              <HistoryEntryRow key={i} entry={e} />
            ))}
            <TouchableOpacity style={styles.btnClear} onPress={handleClear} activeOpacity={0.7}>
              <Text style={styles.btnClearText}>{'\u{1F5D1}\uFE0F'} Effacer l'historique</Text>
            </TouchableOpacity>
          </>
        )}

        <TouchableOpacity style={styles.btnSecondary} onPress={() => nav.goBack()} activeOpacity={0.7}>
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
