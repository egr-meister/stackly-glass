import React from 'react';
import { View, Text, TouchableOpacity, ScrollView, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useApp } from '../store/AppContext';
import GlassStack from '../components/GlassStack';
import PresetChips from '../components/PresetChips';
import ReminderCard from '../components/ReminderCard';
import { todayStr, formatDateLabel } from '../utils/dates';
import { entriesForDate, sortDayEntries, progressPercent } from '../utils/stats';
import { getReminderMessage } from '../utils/reminders';
import { colors } from '../theme';
import { defaultGlassPresets } from '../defaults';

export default function HomeScreen({ navigation }) {
  const app = useApp();
  const entries = app?.entries ?? [];
  const settings = app?.settings ?? {};
  const compact = settings?.compactMode === true;
  const date = todayStr();

  const dayEntries = sortDayEntries(entriesForDate(entries, date));
  const totalMl = dayEntries.reduce((sum, item) => sum + Math.max(0, Number(item?.amountMl ?? 0)), 0);
  const goalMl = Math.max(1, Number(settings?.dailyGoalMl ?? 2000) || 2000);
  const percent = progressPercent(totalMl, goalMl);
  const goalReached = totalMl >= goalMl;
  const remainingMl = goalMl - totalMl;
  const selectedGlass = app?.selectedGlass ?? defaultGlassPresets[1];
  const presets = Array.isArray(settings?.glassPresets) ? settings.glassPresets : defaultGlassPresets;
  const reminderMessage = getReminderMessage(totalMl, goalMl, dayEntries.length, settings?.reminders);

  return (
    <SafeAreaView style={styles.safe} edges={['top', 'left', 'right']}>
      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        {/* Compact header: title left, settings right */}
        <View style={styles.header}>
          <View>
            <Text style={styles.appTitle}>Stackly Glass</Text>
            <Text style={styles.appSubtitle}>Manual water tracker</Text>
          </View>
          <TouchableOpacity
            style={styles.settingsButton}
            onPress={() => navigation?.navigate?.('Settings')}
            accessibilityRole="button"
            accessibilityLabel="Settings"
          >
            <Text style={styles.settingsIcon}>⚙</Text>
          </TouchableOpacity>
        </View>
        <Text style={styles.dateLabel}>{formatDateLabel(date)}</Text>

        {/* Stack + info side by side: the "Daily Glass Stack" layout */}
        <View style={styles.mainRow}>
          <View style={styles.stackColumn}>
            <GlassStack entries={dayEntries} goalReached={goalReached} compact={compact} />
          </View>
          <View style={styles.infoColumn}>
            <View style={styles.infoBlock}>
              <Text style={styles.infoValue}>{totalMl} ml</Text>
              <Text style={styles.infoLabel}>Today</Text>
            </View>
            <View style={styles.infoBlock}>
              <Text style={styles.infoValue}>{goalMl} ml</Text>
              <Text style={styles.infoLabel}>Goal</Text>
            </View>
            <View style={styles.infoBlock}>
              {goalReached ? (
                <>
                  <Text style={[styles.infoValue, styles.infoSuccess]}>
                    {remainingMl < 0 ? `+${Math.abs(remainingMl)} ml` : 'Done'}
                  </Text>
                  <Text style={[styles.infoLabel, styles.infoSuccess]}>
                    {remainingMl < 0 ? 'above goal' : 'Goal reached'}
                  </Text>
                </>
              ) : (
                <>
                  <Text style={styles.infoValue}>{remainingMl} ml</Text>
                  <Text style={styles.infoLabel}>left</Text>
                </>
              )}
            </View>
            <View style={styles.infoBlock}>
              <Text style={styles.infoValue}>{goalReached ? 'Goal reached' : `${percent}%`}</Text>
              <Text style={styles.infoLabel}>{goalReached ? `${percent}% complete` : 'complete'}</Text>
            </View>
            <View style={styles.infoBlock}>
              <Text style={styles.infoValue}>
                {dayEntries.length} {dayEntries.length === 1 ? 'glass' : 'glasses'}
              </Text>
              <Text style={styles.infoLabel}>
                {selectedGlass?.name ?? 'Regular Glass'} · {Math.max(0, Number(selectedGlass?.amountMl ?? 0))} ml each
              </Text>
            </View>
          </View>
        </View>

        <ReminderCard message={reminderMessage} />

        {/* Primary one-tap action */}
        <TouchableOpacity
          style={styles.addButton}
          onPress={() => app?.addGlass?.()}
          accessibilityRole="button"
        >
          <Text style={styles.addButtonText}>Add Glass</Text>
          <Text style={styles.addButtonSub}>
            +{Math.max(0, Number(selectedGlass?.amountMl ?? 0))} ml · {selectedGlass?.name ?? 'Regular Glass'}
          </Text>
        </TouchableOpacity>
        <Text style={styles.tapHint}>Tap Add Glass to grow the stack</Text>

        <PresetChips
          presets={presets}
          selectedId={settings?.selectedGlassId}
          onSelect={(id) => app?.setSelectedGlass?.(id)}
        />

        {/* Secondary actions */}
        <View style={styles.secondaryRow}>
          <TouchableOpacity
            style={styles.secondaryButton}
            onPress={() => navigation?.navigate?.('CustomAmount')}
          >
            <Text style={styles.secondaryText}>Custom amount</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.secondaryButton, dayEntries.length === 0 && styles.secondaryDisabled]}
            disabled={dayEntries.length === 0}
            onPress={() => app?.undoLastToday?.()}
          >
            <Text style={[styles.secondaryText, dayEntries.length === 0 && styles.secondaryTextDisabled]}>
              Undo last glass
            </Text>
          </TouchableOpacity>
        </View>

        <View style={styles.footerRow}>
          <TouchableOpacity onPress={() => navigation?.navigate?.('DayDetail', { date })}>
            <Text style={styles.footerLink}>Today's entries</Text>
          </TouchableOpacity>
          <Text style={styles.footerDot}>·</Text>
          <TouchableOpacity onPress={() => navigation?.navigate?.('History')}>
            <Text style={styles.footerLink}>History</Text>
          </TouchableOpacity>
          <Text style={styles.footerDot}>·</Text>
          <TouchableOpacity onPress={() => navigation?.navigate?.('Statistics')}>
            <Text style={styles.footerLink}>Statistics</Text>
          </TouchableOpacity>
        </View>

        <Text style={styles.manualNote}>Water entries are added manually.</Text>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scroll: {
    paddingHorizontal: 18,
    paddingBottom: 28,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 8,
  },
  appTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: colors.text,
  },
  appSubtitle: {
    fontSize: 12,
    color: colors.textSoft,
    marginTop: 1,
  },
  settingsButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.panelSoft,
    borderWidth: 1,
    borderColor: colors.divider,
    alignItems: 'center',
    justifyContent: 'center',
  },
  settingsIcon: {
    fontSize: 20,
    color: colors.text,
  },
  dateLabel: {
    fontSize: 13,
    color: colors.textSoft,
    marginTop: 6,
    marginBottom: 8,
  },
  mainRow: {
    flexDirection: 'row',
    backgroundColor: colors.panelSoft,
    borderWidth: 1,
    borderColor: colors.divider,
    borderRadius: 16,
    paddingVertical: 12,
    paddingHorizontal: 10,
    minHeight: 300,
  },
  stackColumn: {
    flex: 1.15,
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  infoColumn: {
    flex: 1,
    justifyContent: 'center',
    paddingLeft: 10,
    borderLeftWidth: 1,
    borderLeftColor: colors.divider,
  },
  infoBlock: {
    marginVertical: 6,
  },
  infoValue: {
    fontSize: 17,
    fontWeight: '700',
    color: colors.text,
  },
  infoLabel: {
    fontSize: 12,
    color: colors.textSoft,
  },
  infoSuccess: {
    color: colors.success,
  },
  addButton: {
    backgroundColor: colors.teal,
    borderRadius: 16,
    paddingVertical: 15,
    alignItems: 'center',
    marginTop: 10,
  },
  addButtonText: {
    color: colors.white,
    fontSize: 19,
    fontWeight: '700',
  },
  addButtonSub: {
    color: '#DFF1F4',
    fontSize: 12,
    marginTop: 2,
  },
  tapHint: {
    textAlign: 'center',
    fontSize: 12,
    color: colors.textSoft,
    marginTop: 6,
    marginBottom: 10,
  },
  secondaryRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 10,
    marginTop: 14,
  },
  secondaryButton: {
    borderWidth: 1,
    borderColor: colors.teal,
    borderRadius: 14,
    paddingHorizontal: 16,
    paddingVertical: 9,
    backgroundColor: colors.white,
  },
  secondaryDisabled: {
    borderColor: colors.divider,
    backgroundColor: colors.panelSoft,
  },
  secondaryText: {
    color: colors.teal,
    fontWeight: '600',
    fontSize: 13,
  },
  secondaryTextDisabled: {
    color: colors.textSoft,
  },
  footerRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 16,
    gap: 8,
  },
  footerLink: {
    color: colors.tealDark,
    fontSize: 14,
    fontWeight: '600',
  },
  footerDot: {
    color: colors.textSoft,
  },
  manualNote: {
    textAlign: 'center',
    fontSize: 11,
    color: colors.textSoft,
    marginTop: 14,
  },
});
