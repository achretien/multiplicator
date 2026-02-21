import React from 'react';
import { Text, StyleSheet } from 'react-native';

interface Props {
  stars: number;
}

export default function StarsRow({ stars }: Props) {
  return (
    <Text style={styles.row}>
      {'\u2B50'.repeat(stars)}
    </Text>
  );
}

const styles = StyleSheet.create({
  row: {
    textAlign: 'center',
    fontSize: 32,
    marginBottom: 20,
  },
});
