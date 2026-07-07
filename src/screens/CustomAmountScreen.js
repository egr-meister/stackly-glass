import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, StyleSheet } from 'react-native';
import { useApp } from '../store/AppContext';
import { MAX_ENTRY_ML } from '../defaults';
import { colors } from '../theme';

export default function CustomAmountScreen({ navigation }) {
  const app = useApp();
  const [amount, setAmount] = useState('');
  const [label, setLabel] = useState('');
  const [error, setError] = useState('');

  const onAdd = () => {
    const n = Math.round(Number(amount));
    if (!amount.trim() || !Number.isFinite(n)) {
      setError('Please enter a number, for example 180.');
      return;
    }
    if (n <= 0) {
      setError('Amount must be greater than 0.');
      return;
    }
    if (n > MAX_ENTRY_ML) {
      setError('Amount is too large for one entry.');
      return;
    }
    const ok = app?.addEntry?.({
      amountMl: n,
      label,
      source: 'custom',
      presetName: 'Custom',
    });
    if (ok) {
      navigation?.goBack?.();
    } else {
      setError('Could not add this entry. Please check the amount.');
    }
  };

  return (
    <ScrollView style={styles.screen} contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
      <Text style={styles.heading}>Custom amount</Text>
      <Text style={styles.hint}>Add any amount of water to today, for example "Add 180 ml".</Text>

      <Text style={styles.label}>Amount (ml)</Text>
      <TextInput
        style={styles.input}
        value={amount}
        onChangeText={(v) => {
          setAmount(v);
          setError('');
        }}
        keyboardType="numeric"
        placeholder="180"
        placeholderTextColor={colors.textSoft}
        maxLength={5}
      />

      <Text style={styles.label}>Label (optional)</Text>
      <TextInput
        style={styles.input}
        value={label}
        onChangeText={setLabel}
        placeholder="e.g. Tea, Lunch water"
        placeholderTextColor={colors.textSoft}
        maxLength={40}
      />

      {error ? <Text style={styles.error}>{error}</Text> : null}

      <TouchableOpacity style={styles.primaryButton} onPress={onAdd}>
        <Text style={styles.primaryText}>Add Water</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.cancelButton} onPress={() => navigation?.goBack?.()}>
        <Text style={styles.cancelText}>Cancel</Text>
      </TouchableOpacity>

      <Text style={styles.note}>
        Custom entries appear in the stack with a dashed rim and a small dot mark.
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
    marginTop: 8,
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
  primaryButton: {
    backgroundColor: colors.teal,
    borderRadius: 14,
    paddingVertical: 14,
    alignItems: 'center',
    marginTop: 18,
  },
  primaryText: {
    color: colors.white,
    fontSize: 16,
    fontWeight: '700',
  },
  cancelButton: {
    alignItems: 'center',
    paddingVertical: 13,
  },
  cancelText: {
    color: colors.textSoft,
    fontSize: 14,
    fontWeight: '600',
  },
  note: {
    fontSize: 12,
    color: colors.textSoft,
    textAlign: 'center',
    marginTop: 8,
  },
});
