import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Modal } from 'react-native';
import { Colors, BorderRadius } from '../constants/theme';

interface Props {
  visible: boolean;
  onQuit: () => void;
  onContinue: () => void;
}

export default function QuitModal({ visible, onQuit, onContinue }: Props) {
  return (
    <Modal visible={visible} transparent animationType="fade">
      <View style={styles.overlay}>
        <View style={styles.card}>
          <Text style={styles.emoji}>{'\u{1F3F3}\uFE0F'}</Text>
          <Text style={styles.title}>Abandonner ?</Text>
          <Text style={styles.sub}>Ta progression sera perdue.</Text>
          <TouchableOpacity style={styles.quitBtn} onPress={onQuit} activeOpacity={0.7}>
            <Text style={styles.quitBtnText}>Oui, abandonner</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.continueBtn} onPress={onContinue} activeOpacity={0.7}>
            <Text style={styles.continueBtnText}>Continuer {'\u00E0'} jouer</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  card: {
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 28,
    paddingHorizontal: 24,
    maxWidth: 320,
    width: '100%',
    alignItems: 'center',
  },
  emoji: {
    fontSize: 40,
    marginBottom: 8,
  },
  title: {
    fontSize: 19,
    fontWeight: '800',
    color: Colors.text,
    marginBottom: 8,
  },
  sub: {
    color: Colors.muted,
    fontSize: 14,
    marginBottom: 24,
  },
  quitBtn: {
    width: '100%',
    padding: 14,
    backgroundColor: Colors.secondary,
    borderRadius: BorderRadius.sm,
    alignItems: 'center',
    marginBottom: 10,
  },
  quitBtnText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '800',
  },
  continueBtn: {
    width: '100%',
    padding: 12,
    backgroundColor: '#f0f0f0',
    borderRadius: BorderRadius.sm,
    alignItems: 'center',
  },
  continueBtnText: {
    color: Colors.text,
    fontSize: 16,
    fontWeight: '700',
  },
});
