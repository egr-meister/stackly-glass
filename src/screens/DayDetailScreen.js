import React from 'react';
import { View, Text, TouchableOpacity, ScrollView, StyleSheet, Alert } from 'react-native';
import { useApp } from '../store/AppContext';
import MiniStack from '../components/MiniStack';
import { todayStr, formatDateLabel, isValidDateStr } from '../utils/dates';
import { entriesForDate, sortDayEntries, progressPercent } from '../utils/stats';
import { colors } from '../theme';

export default function DayDetailScreen({ route, navigation }) {
  const app = useApp();
  const entries = app?.entries ?? [];
  const settings = app?.settings ?? {};
  const paramDate = route?.params?.date;
  const date = isValidDateStr(paramDate) ? paramDate : todayStr();

  const dayEntries = sortDayEntries(entriesForDate(entries, date));
  const totalMl = dayEntries.reduce((sum, item) => sum + Math.max(0, Number(item?.amountMl ?? 0)), 0);
  const goalMl = Math.max(1, Number(settings?.dailyGoalMl ?? 2000) || 2000);
  const percent = progressPercent(totalMl, goalMl);
  const reachedGoal = totalMl >= goalMl;

  const onResetDay = () => {
    Alert.alert('Reset this day?', 'This will remove all water entries for the selected day.', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Reset', style: 'destructive', onPress: () => app?.resetDay?.(date) },
    ]);
  };

  const onDeleteEntry = (id) => {
    Alert.alert('Delete entry?', 'This will remove this water entry.', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Delete', style: 'destructive', onPress: () => app?.deleteEntry?.(id) },
    ]);
  };

  return (
    <ScrollView style={styles.screen} contentContainerStyle={styles.content}>
      <View style={styles.headerCard}>
        <MiniStack count={dayEntries.length} reachedGoal={reachedGoal} />
        <View style={styles.headerInfo}>
          <Text style={styles.dateText}>{formatDateLabel(date)}</Text>
          <Text style={styles.totalText}>
            {totalMl} ml of {goalMl} ml
          </Text>
          <Text style={[styles.percentText, reachedGoal && styles.percentReached]}>
            {reachedGoal ? `Goal reached · ${percent}%` : `${percent}% complete`}
          </Text>
          <Text style={styles.countText}>
            {dayEntries.length} {dayEntries.length === 1 ? 'entry' : 'entries'}
          </Text>
        </View>
      </View>

      <TouchableOpacity
        style={styles.addButton}
        onPress={() => navigation?.navigate?.('EntryEdit', { date })}
      >
        <Text style={styles.addButtonText}>Add entry to this day</Text>
      </TouchableOpacity>

      {dayEntries.length === 0 ? (
        <Text style={styles.empty}>No water entries for this day.</Text>
      ) : (
        dayEntries.map((entry) => (
          <View key={entry?.id} style={styles.entryRow}>
            <View style={styles.entryLeft}>
              <Text style={styles.entryTime}>{entry?.time ?? '--:--'}</Text>
              <Text style={styles.entryAmount}>{Math.max(0, Number(entry?.amountMl ?? 0))} ml</Text>
              <Text style={styles.entryMeta} numberOfLines={1}>
                {entry?.label ? entry.label : entry?.presetName || 'Water'}
                {entry?.source === 'custom' ? ' · custom' : ''}
              </Text>
            </View>
            <View style={styles.entryActions}>
              <TouchableOpacity
                style={styles.entryButton}
                onPress={() => navigation?.navigate?.('EntryEdit', { entryId: entry?.id })}
              >
                <Text style={styles.entryButtonText}>Edit</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.entryButton} onPress={() => onDeleteEntry(entry?.id)}>
                <Text style={[styles.entryButtonText, styles.entryDelete]}>Delete</Text>
              </TouchableOpacity>
            </View>
          </View>
        ))
      )}

      <TouchableOpacity style={styles.resetButton} onPress={onResetDay}>
        <Text style={styles.resetText}>Reset day</Text>
      </TouchableOpacity>
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
    paddingBottom: 32,
  },
  headerCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.panelSoft,
    borderWidth: 1,
    borderColor: colors.divider,
    borderRadius: 14,
    padding: 14,
    gap: 12,
  },
  headerInfo: {
    flex: 1,
  },
  dateText: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.text,
  },
  totalText: {
    fontSize: 14,
    color: colors.text,
    marginTop: 3,
  },
  percentText: {
    fontSize: 13,
    color: colors.textSoft,
    marginTop: 2,
  },
  percentReached: {
    color: colors.success,
    fontWeight: '700',
  },
  countText: {
    fontSize: 12,
    color: colors.textSoft,
    marginTop: 2,
  },
  addButton: {
    borderWidth: 1,
    borderColor: colors.teal,
    borderRadius: 12,
    paddingVertical: 11,
    alignItems: 'center',
    marginTop: 12,
    marginBottom: 12,
    backgroundColor: colors.white,
  },
  addButtonText: {
    color: colors.teal,
    fontWeight: '700',
    fontSize: 14,
  },
  empty: {
    textAlign: 'center',
    color: colors.textSoft,
    fontSize: 14,
    marginVertical: 20,
  },
  entryRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.divider,
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 10,
    marginBottom: 8,
  },
  entryLeft: {
    flex: 1,
  },
  entryTime: {
    fontSize: 12,
    color: colors.textSoft,
  },
  entryAmount: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.text,
    marginTop: 1,
  },
  entryMeta: {
    fontSize: 12,
    color: colors.textSoft,
    marginTop: 1,
  },
  entryActions: {
    flexDirection: 'row',
    gap: 8,
  },
  entryButton: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
    backgroundColor: colors.panelSoft,
    borderWidth: 1,
    borderColor: colors.divider,
  },
  entryButtonText: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.tealDark,
  },
  entryDelete: {
    color: colors.danger,
  },
  resetButton: {
    alignItems: 'center',
    paddingVertical: 14,
    marginTop: 10,
  },
  resetText: {
    color: colors.danger,
    fontWeight: '700',
    fontSize: 14,
  },
});
