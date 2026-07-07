import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors } from '../theme';

// Gentle in-app reminder card. Only rendered while the app is open.
export default function ReminderCard({ message }) {
  if (!message) return null;
  return (
    <View style={styles.card}>
      <Text style={styles.title}>Gentle reminder</Text>
      <Text style={styles.message}>{message}</Text>
      <Text style={styles.note}>In-app card only — not a phone notification.</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.reminderBg,
    borderWidth: 1,
    borderColor: colors.reminderBorder,
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 10,
    marginVertical: 8,
  },
  title: {
    fontSize: 12,
    fontWeight: '700',
    color: colors.textSoft,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  message: {
    fontSize: 14,
    color: colors.text,
    marginTop: 3,
  },
  note: {
    fontSize: 11,
    color: colors.textSoft,
    marginTop: 4,
  },
});
