import React, { useState } from 'react';
import { Text, TextInput, TouchableOpacity, ScrollView, StyleSheet } from 'react-native';
import { useApp } from '../store/AppContext';
import { DEFAULT_GOAL_ML, MAX_GOAL_ML } from '../defaults';
import { colors } from '../theme';

export default function GoalSettingsScreen() {
  const app = useApp();
  const currentGoal = Math.max(1, Number(app?.settings?.dailyGoalMl ?? DEFAULT_GOAL_ML) || DEFAULT_GOAL_ML);
  const [goal, setGoal] = useState(String(currentGoal));
  const [error, setError] = useState('');
  const [saved, setSaved] = useState(false);

  const onSave = () => {
    const n = Math.round(Number(goal));
    if (!goal.trim() || !Number.isFinite(n)) {
      setError('Please enter a number, for example 2000.');
      return;
    }
    if (n <= 0) {
      setError('Goal must be greater than 0.');
      return;
    }
    if (n > MAX_GOAL_ML) {
      setError(`Goal should not exceed ${MAX_GOAL_ML} ml.`);
      return;
    }
    app?.setGoal?.(n);
    setError('');
    setSaved(true);
  };

  const onReset = () => {
    setGoal(String(DEFAULT_GOAL_ML));
    app?.setGoal?.(DEFAULT_GOAL_ML);
    setError('');
    setSaved(true);
  };

  return (
    <ScrollView style={styles.screen} contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
      <Text style={styles.heading}>Daily water goal</Text>
      <Text style={styles.hint}>
        Your goal is a personal tracking target, not medical advice. Default is {DEFAULT_GOAL_ML} ml.
      </Text>

      <Text style={styles.label}>Goal (ml)</Text>
      <TextInput
        style={styles.input}
        value={goal}
        onChangeText={(v) => {
          setGoal(v);
          setError('');
          setSaved(false);
        }}
        keyboardType="numeric"
        placeholder="2000"
        placeholderTextColor={colors.textSoft}
        maxLength={5}
      />

      {error ? <Text style={styles.error}>{error}</Text> : null}
      {saved && !error ? <Text style={styles.savedText}>Goal saved.</Text> : null}

      <TouchableOpacity style={styles.saveButton} onPress={onSave}>
        <Text style={styles.saveText}>Save Goal</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.resetButton} onPress={onReset}>
        <Text style={styles.resetText}>Reset to default ({DEFAULT_GOAL_ML} ml)</Text>
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
    padding: 20,
  },
  heading: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.text,
  },
  hint: {
    fontSize: 13,
    color: colors.textSoft,
    marginTop: 4,
    marginBottom: 14,
  },
  label: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 5,
  },
  input: {
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.outline,
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 10,
    fontSize: 16,
    color: colors.text,
  },
  error: {
    color: colors.danger,
    fontSize: 13,
    marginTop: 10,
  },
  savedText: {
    color: colors.success,
    fontSize: 13,
    marginTop: 10,
  },
  saveButton: {
    backgroundColor: colors.teal,
    borderRadius: 14,
    paddingVertical: 14,
    alignItems: 'center',
    marginTop: 18,
  },
  saveText: {
    color: colors.white,
    fontSize: 16,
    fontWeight: '700',
  },
  resetButton: {
    alignItems: 'center',
    paddingVertical: 14,
  },
  resetText: {
    color: colors.textSoft,
    fontSize: 13,
    fontWeight: '600',
  },
});
