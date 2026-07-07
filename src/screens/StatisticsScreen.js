import React from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';
import { useApp } from '../store/AppContext';
import { buildWeeklyStats, formatLiters } from '../utils/stats';
import { shortDayLabel, formatDateLabel, todayStr } from '../utils/dates';
import { colors } from '../theme';

const BAR_MAX_HEIGHT = 90;

export default function StatisticsScreen() {
  const app = useApp();
  const entries = app?.entries ?? [];
  const goalMl = Math.max(1, Number(app?.settings?.dailyGoalMl ?? 2000) || 2000);
  const stats = buildWeeklyStats(entries, goalMl);
  const days = Array.isArray(stats?.days) ? stats.days : [];
  const maxTotal = Math.max(goalMl, ...days.map((d) => d?.totalMl ?? 0), 1);
  const today = todayStr();

  const rows = [
    { label: 'This week', value: formatLiters(stats?.totalMl ?? 0) },
    { label: 'Daily average', value: formatLiters(stats?.averageMl ?? 0) },
    {
      label: 'Best day',
      value: stats?.bestDayDate
        ? `${formatLiters(stats.bestDayTotalMl)} · ${formatDateLabel(stats.bestDayDate)}`
        : 'No entries yet',
    },
    { label: 'Goal days', value: `${stats?.goalDaysCount ?? 0} of 7` },
    { label: 'Glasses this week', value: String(stats?.entriesCount ?? 0) },
  ];

  return (
    <ScrollView style={styles.screen} contentContainerStyle={styles.content}>
      <Text style={styles.heading}>Last 7 days</Text>

      {/* Simple weekly bar row built from plain views */}
      <View style={styles.chartCard}>
        <View style={styles.barsRow}>
          {days.map((day) => {
            const total = Math.max(0, Number(day?.totalMl ?? 0));
            const height = Math.max(4, Math.round((total / maxTotal) * BAR_MAX_HEIGHT));
            const reached = total >= goalMl;
            const isToday = day?.date === today;
            return (
              <View key={day?.date} style={styles.barCol}>
                <Text style={styles.barValue}>{total > 0 ? `${(total / 1000).toFixed(1)}` : ''}</Text>
                <View
                  style={[
                    styles.bar,
                    { height },
                    reached && styles.barReached,
                    isToday && styles.barToday,
                  ]}
                />
                <Text style={[styles.barLabel, isToday && styles.barLabelToday]}>
                  {shortDayLabel(day?.date)}
                </Text>
              </View>
            );
          })}
        </View>
        <Text style={styles.chartNote}>Bars show liters per day. Darker bars reached the goal.</Text>
      </View>

      {rows.map((row) => (
        <View key={row.label} style={styles.summaryRow}>
          <Text style={styles.summaryLabel}>{row.label}</Text>
          <Text style={styles.summaryValue}>{row.value}</Text>
        </View>
      ))}

      <Text style={styles.note}>
        Statistics are based only on entries you added manually on this device.
      </Text>
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
  heading: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 10,
  },
  chartCard: {
    backgroundColor: colors.panelSoft,
    borderWidth: 1,
    borderColor: colors.divider,
    borderRadius: 14,
    padding: 14,
    marginBottom: 14,
  },
  barsRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    height: BAR_MAX_HEIGHT + 34,
  },
  barCol: {
    alignItems: 'center',
    flex: 1,
    justifyContent: 'flex-end',
  },
  barValue: {
    fontSize: 10,
    color: colors.textSoft,
    marginBottom: 2,
  },
  bar: {
    width: 18,
    borderRadius: 5,
    backgroundColor: colors.water,
    borderWidth: 1,
    borderColor: colors.outline,
  },
  barReached: {
    backgroundColor: colors.waterDeep,
    borderColor: colors.success,
  },
  barToday: {
    borderColor: colors.tealDark,
  },
  barLabel: {
    fontSize: 11,
    color: colors.textSoft,
    marginTop: 4,
  },
  barLabelToday: {
    color: colors.tealDark,
    fontWeight: '700',
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.divider,
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 12,
    marginBottom: 8,
  },
  summaryLabel: {
    fontSize: 14,
    color: colors.textSoft,
  },
  summaryValue: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.text,
    flexShrink: 1,
    textAlign: 'right',
  },
  note: {
    fontSize: 12,
    color: colors.textSoft,
    textAlign: 'center',
    marginTop: 10,
  },
});
