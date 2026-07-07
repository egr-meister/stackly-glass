import React from 'react';
import { View, Text, TouchableOpacity, FlatList, StyleSheet } from 'react-native';
import { useApp } from '../store/AppContext';
import MiniStack from '../components/MiniStack';
import { formatDateLabel } from '../utils/dates';
import { buildDailySummaries } from '../utils/stats';
import { colors } from '../theme';

// History: a shelf of previous glass stacks, newest first.
export default function HistoryScreen({ navigation }) {
  const app = useApp();
  const entries = app?.entries ?? [];
  const goalMl = Math.max(1, Number(app?.settings?.dailyGoalMl ?? 2000) || 2000);
  const summaries = buildDailySummaries(entries, goalMl);

  const renderItem = ({ item }) => (
    <TouchableOpacity
      style={styles.card}
      onPress={() => navigation?.navigate?.('DayDetail', { date: item?.date })}
      accessibilityRole="button"
    >
      <MiniStack count={item?.entriesCount ?? 0} reachedGoal={item?.reachedGoal === true} />
      <View style={styles.cardInfo}>
        <Text style={styles.cardDate}>{formatDateLabel(item?.date)}</Text>
        <Text style={styles.cardTotal}>
          {item?.totalMl ?? 0} ml of {item?.goalMl ?? goalMl} ml
        </Text>
        <Text style={styles.cardMeta}>
          {item?.progressPercent ?? 0}% · {item?.entriesCount ?? 0}{' '}
          {(item?.entriesCount ?? 0) === 1 ? 'entry' : 'entries'}
        </Text>
      </View>
      <View style={styles.cardRight}>
        {item?.reachedGoal ? (
          <View style={styles.goalBadge}>
            <Text style={styles.goalBadgeText}>Goal ✓</Text>
          </View>
        ) : null}
        <Text style={styles.openText}>Open ›</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.screen}>
      <FlatList
        data={summaries}
        keyExtractor={(item, index) => item?.date ?? `day_${index}`}
        renderItem={renderItem}
        contentContainerStyle={styles.list}
        ListEmptyComponent={
          <View style={styles.emptyWrap}>
            <Text style={styles.emptyTitle}>No glass history yet.</Text>
            <Text style={styles.emptyBody}>Days with water entries will appear here as small stacks.</Text>
          </View>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: colors.background,
  },
  list: {
    padding: 18,
    paddingBottom: 32,
  },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.divider,
    borderRadius: 14,
    padding: 14,
    marginBottom: 10,
    gap: 12,
  },
  cardInfo: {
    flex: 1,
  },
  cardDate: {
    fontSize: 15,
    fontWeight: '700',
    color: colors.text,
  },
  cardTotal: {
    fontSize: 13,
    color: colors.text,
    marginTop: 2,
  },
  cardMeta: {
    fontSize: 12,
    color: colors.textSoft,
    marginTop: 2,
  },
  cardRight: {
    alignItems: 'flex-end',
    gap: 6,
  },
  goalBadge: {
    backgroundColor: colors.successSoft,
    borderWidth: 1,
    borderColor: colors.success,
    borderRadius: 10,
    paddingHorizontal: 8,
    paddingVertical: 2,
  },
  goalBadgeText: {
    fontSize: 11,
    fontWeight: '700',
    color: colors.success,
  },
  openText: {
    fontSize: 13,
    color: colors.tealDark,
    fontWeight: '600',
  },
  emptyWrap: {
    alignItems: 'center',
    marginTop: 60,
    paddingHorizontal: 24,
  },
  emptyTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.text,
  },
  emptyBody: {
    fontSize: 13,
    color: colors.textSoft,
    textAlign: 'center',
    marginTop: 4,
  },
});
