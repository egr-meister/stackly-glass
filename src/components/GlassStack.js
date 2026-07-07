import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors } from '../theme';

// The signature Stackly visual: a vertical stack of glasses that grows
// upward through the day. Latest glass on top. Plain React Native views.

function Glass({ entry, isTop, goalReached, height, compact }) {
  const isCustom = entry?.source === 'custom';
  const amount = Math.max(0, Number(entry?.amountMl ?? 0));
  const fillPercent = isCustom ? '62%' : '78%';
  return (
    <View
      style={[
        styles.glass,
        { height },
        isCustom && styles.glassCustom,
        isTop && goalReached && styles.glassGoal,
      ]}
    >
      <View
        style={[
          styles.water,
          { height: fillPercent },
          isCustom && styles.waterCustom,
          isTop && goalReached && styles.waterGoal,
        ]}
      />
      <View style={styles.rim} />
      <View style={styles.labelWrap} pointerEvents="none">
        <Text style={[styles.labelText, compact && styles.labelTextCompact]} numberOfLines={1}>
          {amount} ml{isCustom ? ' · custom' : ''}
        </Text>
      </View>
      {isCustom ? <View style={styles.customDot} /> : null}
    </View>
  );
}

export default function GlassStack({ entries, goalReached, compact }) {
  const list = Array.isArray(entries) ? entries : [];
  const count = list.length;

  if (count === 0) {
    return (
      <View style={styles.container}>
        <View style={styles.emptyGlass}>
          <View style={styles.emptyRim} />
        </View>
        <Text style={styles.emptyTitle}>No glasses added today.</Text>
        <Text style={styles.emptyHint}>Tap Add Glass to start your stack.</Text>
      </View>
    );
  }

  const maxVisible = compact ? 8 : 12;
  const visible = list.slice(-maxVisible); // newest kept
  const hiddenCount = count - visible.length;
  const glassHeight = count <= 5 ? 46 : count <= 8 ? 38 : compact ? 26 : 30;
  const reversed = visible.slice().reverse(); // newest first (top of stack)

  return (
    <View style={styles.container}>
      {goalReached ? (
        <View style={styles.goalBadge}>
          <Text style={styles.goalBadgeText}>Goal reached</Text>
        </View>
      ) : null}
      <View style={styles.stack}>
        {reversed.map((entry, index) => (
          <Glass
            key={entry?.id ?? `glass_${index}`}
            entry={entry}
            isTop={index === 0}
            goalReached={goalReached}
            height={glassHeight}
            compact={glassHeight < 34}
          />
        ))}
      </View>
      {hiddenCount > 0 ? (
        <Text style={styles.hiddenText}>+{hiddenCount} earlier below</Text>
      ) : null}
      <View style={styles.shelf} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'flex-end',
    paddingVertical: 8,
  },
  stack: {
    flexDirection: 'column',
    alignItems: 'center',
  },
  glass: {
    width: 132,
    marginBottom: 3,
    borderWidth: 2,
    borderColor: colors.outline,
    borderTopWidth: 0,
    borderBottomLeftRadius: 14,
    borderBottomRightRadius: 14,
    borderTopLeftRadius: 4,
    borderTopRightRadius: 4,
    backgroundColor: colors.white,
    overflow: 'hidden',
    justifyContent: 'flex-end',
  },
  glassCustom: {
    borderStyle: 'dashed',
    width: 120,
  },
  glassGoal: {
    borderColor: colors.success,
  },
  rim: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 3,
    backgroundColor: colors.outline,
    borderRadius: 2,
  },
  water: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: colors.water,
  },
  waterCustom: {
    backgroundColor: colors.waterCustom,
  },
  waterGoal: {
    backgroundColor: colors.waterDeep,
  },
  labelWrap: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    alignItems: 'center',
    justifyContent: 'center',
  },
  labelText: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.text,
  },
  labelTextCompact: {
    fontSize: 10,
  },
  customDot: {
    position: 'absolute',
    top: 7,
    right: 7,
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: colors.teal,
  },
  goalBadge: {
    backgroundColor: colors.successSoft,
    borderWidth: 1,
    borderColor: colors.success,
    borderRadius: 14,
    paddingHorizontal: 12,
    paddingVertical: 4,
    marginBottom: 8,
  },
  goalBadgeText: {
    color: colors.success,
    fontWeight: '700',
    fontSize: 13,
  },
  hiddenText: {
    marginTop: 4,
    fontSize: 11,
    color: colors.textSoft,
  },
  shelf: {
    marginTop: 6,
    width: 168,
    height: 4,
    borderRadius: 2,
    backgroundColor: colors.divider,
  },
  emptyGlass: {
    width: 132,
    height: 64,
    borderWidth: 2,
    borderStyle: 'dashed',
    borderColor: colors.outline,
    borderTopWidth: 0,
    borderBottomLeftRadius: 14,
    borderBottomRightRadius: 14,
    marginBottom: 12,
  },
  emptyRim: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 3,
    backgroundColor: colors.outline,
    opacity: 0.6,
  },
  emptyTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 2,
  },
  emptyHint: {
    fontSize: 12,
    color: colors.textSoft,
  },
});
