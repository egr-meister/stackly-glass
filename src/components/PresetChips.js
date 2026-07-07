import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { colors } from '../theme';

// Compact preset chips: the core glass-size mechanic, always one tap away.
export default function PresetChips({ presets, selectedId, onSelect }) {
  const list = Array.isArray(presets) ? presets : [];
  return (
    <View style={styles.row}>
      {list.map((preset) => {
        const active = preset?.id === selectedId;
        return (
          <TouchableOpacity
            key={preset?.id ?? preset?.name}
            style={[styles.chip, active && styles.chipActive]}
            onPress={() => onSelect?.(preset?.id)}
            accessibilityRole="button"
          >
            <Text style={[styles.chipName, active && styles.chipTextActive]} numberOfLines={1}>
              {preset?.name ?? ''}
            </Text>
            <Text style={[styles.chipMl, active && styles.chipTextActive]}>
              {Math.max(0, Number(preset?.amountMl ?? 0))} ml
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: 8,
  },
  chip: {
    backgroundColor: colors.chipBg,
    borderWidth: 1,
    borderColor: colors.outline,
    borderRadius: 16,
    paddingHorizontal: 12,
    paddingVertical: 6,
    alignItems: 'center',
    minWidth: 74,
  },
  chipActive: {
    backgroundColor: colors.teal,
    borderColor: colors.tealDark,
  },
  chipName: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.text,
  },
  chipMl: {
    fontSize: 11,
    color: colors.textSoft,
    marginTop: 1,
  },
  chipTextActive: {
    color: colors.white,
  },
});
