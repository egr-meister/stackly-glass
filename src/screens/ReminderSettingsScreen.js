import React from 'react';
import { View, Text, Switch, ScrollView, StyleSheet } from 'react-native';
import { useApp } from '../store/AppContext';
import { defaultReminderSettings } from '../defaults';
import { colors } from '../theme';

export default function ReminderSettingsScreen() {
  const app = useApp();
  const reminders = app?.settings?.reminders ?? defaultReminderSettings;

  const setField = (field, value) => {
    app?.setReminders?.({ ...reminders, [field]: value === true });
  };

  const rows = [
    { key: 'enabled', label: 'Reminders enabled', hint: 'Master switch for all in-app reminder cards.' },
    { key: 'morningEnabled', label: 'Morning reminder', hint: 'If nothing is logged by late morning.' },
    { key: 'afternoonEnabled', label: 'Afternoon reminder', hint: 'If progress is below half after 16:00.' },
    { key: 'eveningEnabled', label: 'Evening reminder', hint: 'If the goal is not reached in the evening.' },
  ];

  return (
    <ScrollView style={styles.screen} contentContainerStyle={styles.content}>
      <View style={styles.noteCard}>
        <Text style={styles.noteText}>
          These are in-app reminder cards only. They do not send phone notifications, and they only
          appear while Stackly Glass is open.
        </Text>
      </View>

      {rows.map((row) => (
        <View key={row.key} style={styles.row}>
          <View style={styles.rowText}>
            <Text style={styles.rowLabel}>{row.label}</Text>
            <Text style={styles.rowHint}>{row.hint}</Text>
          </View>
          <Switch
            value={reminders?.[row.key] === true}
            onValueChange={(v) => setField(row.key, v)}
            trackColor={{ false: colors.divider, true: colors.water }}
            thumbColor={reminders?.[row.key] === true ? colors.teal : colors.white}
            disabled={row.key !== 'enabled' && reminders?.enabled !== true}
          />
        </View>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    padding: 18,
  },
  noteCard: {
    backgroundColor: colors.panel,
    borderWidth: 1,
    borderColor: colors.outline,
    borderRadius: 12,
    padding: 14,
    marginBottom: 14,
  },
  noteText: {
    fontSize: 13,
    color: colors.text,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.divider,
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 12,
    marginBottom: 8,
  },
  rowText: {
    flex: 1,
    paddingRight: 10,
  },
  rowLabel: {
    fontSize: 15,
    fontWeight: '600',
    color: colors.text,
  },
  rowHint: {
    fontSize: 12,
    color: colors.textSoft,
    marginTop: 2,
  },
});
