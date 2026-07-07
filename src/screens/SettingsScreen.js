import React from 'react';
import { View, Text, Switch, TouchableOpacity, ScrollView, StyleSheet, Alert } from 'react-native';
import { useApp } from '../store/AppContext';
import { todayStr } from '../utils/dates';
import { colors } from '../theme';

export default function SettingsScreen({ navigation }) {
  const app = useApp();
  const settings = app?.settings ?? {};

  const onResetToday = () => {
    Alert.alert('Reset this day?', 'This will remove all water entries for the selected day.', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Reset', style: 'destructive', onPress: () => app?.resetDay?.(todayStr()) },
    ]);
  };

  const onDeleteAllRecords = () => {
    Alert.alert('Delete all water records?', 'This removes every water entry. Settings and presets are kept.', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Delete all', style: 'destructive', onPress: () => app?.deleteAllEntries?.() },
    ]);
  };

  const onResetAll = () => {
    Alert.alert('Reset all local data?', 'This removes all entries, presets, goals, and settings.', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Reset everything', style: 'destructive', onPress: () => app?.resetAll?.() },
    ]);
  };

  const LinkRow = ({ label, hint, onPress }) => (
    <TouchableOpacity style={styles.row} onPress={onPress}>
      <View style={styles.rowText}>
        <Text style={styles.rowLabel}>{label}</Text>
        {hint ? <Text style={styles.rowHint}>{hint}</Text> : null}
      </View>
      <Text style={styles.chevron}>›</Text>
    </TouchableOpacity>
  );

  return (
    <ScrollView style={styles.screen} contentContainerStyle={styles.content}>
      <Text style={styles.section}>Tracking</Text>
      <LinkRow
        label="Daily goal"
        hint={`${Math.max(1, Number(settings?.dailyGoalMl ?? 2000) || 2000)} ml`}
        onPress={() => navigation?.navigate?.('GoalSettings')}
      />
      <LinkRow
        label="Glass presets"
        hint="Names, amounts, active glass"
        onPress={() => navigation?.navigate?.('GlassPresets')}
      />
      <LinkRow
        label="Reminders"
        hint="In-app reminder cards"
        onPress={() => navigation?.navigate?.('ReminderSettings')}
      />

      <Text style={styles.section}>Appearance</Text>
      <View style={styles.row}>
        <View style={styles.rowText}>
          <Text style={styles.rowLabel}>Compact mode</Text>
          <Text style={styles.rowHint}>Smaller glasses in the stack.</Text>
        </View>
        <Switch
          value={settings?.compactMode === true}
          onValueChange={(v) => app?.setCompactMode?.(v)}
          trackColor={{ false: colors.divider, true: colors.water }}
          thumbColor={settings?.compactMode === true ? colors.teal : colors.white}
        />
      </View>

      <Text style={styles.section}>Onboarding</Text>
      <LinkRow
        label="Show onboarding again"
        onPress={() => navigation?.navigate?.('Onboarding')}
      />

      <Text style={styles.section}>Data</Text>
      <LinkRow label="Reset today's entries" hint="Removes today's glasses only" onPress={onResetToday} />
      <LinkRow label="Delete all water records" hint="Keeps settings and presets" onPress={onDeleteAllRecords} />
      <LinkRow label="Reset all local data" hint="Full reset of this app" onPress={onResetAll} />

      <Text style={styles.section}>About</Text>
      <View style={styles.aboutCard}>
        <Text style={styles.aboutTitle}>Stackly Glass 1.0.0</Text>
        <Text style={styles.aboutBody}>
          An offline manual water tracker built around a visual stack of glasses.
        </Text>
        <Text style={styles.aboutHeading}>Manual tracking</Text>
        <Text style={styles.aboutBody}>
          Stackly Glass is a manual water tracker. It does not detect drinking automatically and does
          not connect to Health Connect, Google Fit, sensors, or wearable devices. Water entries are
          added manually. This app does not provide medical advice.
        </Text>
        <Text style={styles.aboutHeading}>Privacy</Text>
        <Text style={styles.aboutBody}>
          Stackly Glass stores water entries, goals, glass presets, reminders, history, statistics,
          and settings only on this device. No account, no ads, no analytics, no internet connection,
          no sensors, no Google Fit, no Health Connect, no wearable integration, and no notification
          permission.
        </Text>
      </View>
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
    paddingBottom: 36,
  },
  section: {
    fontSize: 12,
    fontWeight: '700',
    color: colors.textSoft,
    textTransform: 'uppercase',
    letterSpacing: 0.6,
    marginTop: 14,
    marginBottom: 6,
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
  chevron: {
    fontSize: 20,
    color: colors.textSoft,
  },
  aboutCard: {
    backgroundColor: colors.panelSoft,
    borderWidth: 1,
    borderColor: colors.divider,
    borderRadius: 12,
    padding: 14,
  },
  aboutTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: colors.text,
  },
  aboutHeading: {
    fontSize: 13,
    fontWeight: '700',
    color: colors.text,
    marginTop: 10,
  },
  aboutBody: {
    fontSize: 13,
    color: colors.textSoft,
    marginTop: 3,
    lineHeight: 18,
  },
});
