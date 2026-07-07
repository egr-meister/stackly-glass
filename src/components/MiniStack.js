import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors } from '../theme';

// Tiny stack preview used on history cards and day detail. Latest on top.
export default function MiniStack({ count, reachedGoal }) {
  const n = Math.max(0, Number(count) || 0);
  const visible = Math.min(n, 6);
  const extra = n - visible;
  const rows = [];
  for (let i = 0; i < visible; i += 1) {
    rows.push(
      <View
        key={`mini_${i}`}
        style={[styles.miniGlass, i === 0 && reachedGoal && styles.miniGlassGoal]}
      />
    );
  }
  return (
    <View style={styles.wrap}>
      {extra > 0 ? <Text style={styles.extra}>+{extra}</Text> : null}
      {n === 0 ? <View style={styles.empty} /> : rows}
      <View style={styles.shelf} />
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    alignItems: 'center',
    justifyContent: 'flex-end',
    width: 44,
  },
  miniGlass: {
    width: 26,
    height: 9,
    marginBottom: 2,
    backgroundColor: colors.water,
    borderWidth: 1,
    borderColor: colors.outline,
    borderBottomLeftRadius: 4,
    borderBottomRightRadius: 4,
  },
  miniGlassGoal: {
    backgroundColor: colors.waterDeep,
    borderColor: colors.success,
  },
  empty: {
    width: 26,
    height: 9,
    marginBottom: 2,
    borderWidth: 1,
    borderStyle: 'dashed',
    borderColor: colors.outline,
    borderBottomLeftRadius: 4,
    borderBottomRightRadius: 4,
  },
  extra: {
    fontSize: 9,
    color: colors.textSoft,
    marginBottom: 2,
  },
  shelf: {
    width: 34,
    height: 2,
    borderRadius: 1,
    backgroundColor: colors.divider,
    marginTop: 1,
  },
});
