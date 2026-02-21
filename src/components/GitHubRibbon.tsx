import React from 'react';
import { Text, StyleSheet, Platform, Linking, TouchableOpacity } from 'react-native';
import { Colors } from '../constants/theme';
import { getStrings } from '../constants/strings';

const REPO_URL = 'https://github.com/achretien/multiplicator';

export default function GitHubRibbon() {
  if (Platform.OS !== 'web') return null;

  return (
    <TouchableOpacity
      onPress={() => Linking.openURL(REPO_URL)}
      style={styles.ribbon}
      activeOpacity={0.8}
    >
      <Text style={styles.text}>{getStrings().github}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  ribbon: {
    position: 'absolute',
    top: 0,
    right: 0,
    backgroundColor: Colors.primary,
    paddingVertical: 6,
    paddingHorizontal: 40,
    transform: [{ rotate: '45deg' }, { translateX: 30 }, { translateY: -10 }],
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
    zIndex: 999,
  },
  text: {
    color: 'white',
    fontSize: 12,
    fontWeight: '700',
    textAlign: 'center',
  },
});
