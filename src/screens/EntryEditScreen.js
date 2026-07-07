import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, StyleSheet, Alert } from 'react-native';
import { useApp } from '../store/AppContext';
import { todayStr, nowTimeStr, isValidDateStr, isValidTimeStr } from '../utils/dates';
import { MAX_ENTRY_ML } from '../defaults';
import { colors } from '../theme';

// Add / Edit Water Entry screen. Route params are optional and safe:
// { entryId?: string, date?: string }
export default function EntryEditScreen({ route, navigation }) {
  const app = useApp();
  const entries = app?.entries ?? [];
  const entryId = route?.params?.entryId;
  const paramDate = route?.params?.date;
  const existing = entryId ? entries.find((item) => item?.id === entryId) : null;
  const isEdit = Boolean(entryId);

  const [date, setDate] = useState(
    existing?.date ?? (isValidDateStr(paramDate) ? paramDate : todayStr())
  );
  const [time, setTime] = useState(existing?.time ?? nowTimeStr());
  const [amount, setAmount] = useState(existing ? String(existing.amountMl) : '');
  const [label, setLabel] = useState(existing?.label ?? '');
  const [error, setError] = useState('');

  if (isEdit && !existing) {
    return (
      <View style={styles.missingWrap}>
        <Text style={styles.missingTitle}>Entry not found</Text>
        <Text style={styles.missingBody}>This water entry no longer exists.</Text>
        <TouchableOpacity style={styles.primaryButton} onPress={() => navigation?.goBack?.()}>
          <Text style={styles.primaryText}>Go back</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const onSave = () => {
    if (!isValidDateStr(date)) {
      setError('Please enter a valid date as YYYY-MM-DD.');
      return;
    }
    if (!isValidTimeStr(time)) {
      setError('Please enter a valid time as HH:mm.');
      return;
    }
    const n = Math.round(Number(amount));
    if (!String(amount).trim() || !Number.isFinite(n)) {
      setError('Please enter a number amount in ml.');
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
    let ok = false;
    if (isEdit) {
      ok = app?.updateEntry?.(entryId, { date, time, amountMl: n, label });
    } else {
      ok = app?.addEntry?.({ date, time, amountMl: n, label, source: 'custom', presetName: 'Custom' });
    }
    if (ok) {
      navigation?.goBack?.();
    } else {
      setError('Could not save this entry. Please check the values.');
    }
  };

  const onDelete = () => {
    Alert.alert('Delete entry?', 'This will remove this water entry.', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: () => {
          app?.deleteEntry?.(entryId);
          navigation?.goBack?.();
        },
      },
    ]);
  };

  return (
    <ScrollView style={styles.screen} contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
      <Text style={styles.heading}>{isEdit ? 'Edit water entry' : 'Add water entry'}</Text>
      {isEdit && existing?.presetName ? (
        <Text style={styles.hint}>Logged as: {existing.presetName}</Text>
      ) : null}

      <Text style={styles.label}>Date (YYYY-MM-DD)</Text>
      <TextInput
        style={styles.input}
        value={date}
        onChangeText={(v) => {
          setDate(v);
          setError('');
        }}
        placeholder="2026-07-06"
        placeholderTextColor={colors.textSoft}
        maxLength={10}
        autoCapitalize="none"
      />

      <Text style={styles.label}>Time (HH:mm)</Text>
      <TextInput
        style={styles.input}
        value={time}
        onChangeText={(v) => {
          setTime(v);
          setError('');
        }}
        placeholder="14:30"
        placeholderTextColor={colors.textSoft}
        maxLength={5}
        autoCapitalize="none"
      />

      <Text style={styles.label}>Amount (ml)</Text>
      <TextInput
        style={styles.input}
        value={amount}
        onChangeText={(v) => {
          setAmount(v);
          setError('');
        }}
        keyboardType="numeric"
        placeholder="250"
        placeholderTextColor={colors.textSoft}
        maxLength={5}
      />

      <Text style={styles.label}>Label (optional)</Text>
      <TextInput
        style={styles.input}
        value={label}
        onChangeText={setLabel}
        placeholder="e.g. Morning water"
        placeholderTextColor={colors.textSoft}
        maxLength={40}
      />

      {error ? <Text style={styles.error}>{error}</Text> : null}

      <TouchableOpacity style={styles.primaryButton} onPress={onSave}>
        <Text style={styles.primaryText}>Save Entry</Text>
      </TouchableOpacity>
      {isEdit ? (
        <TouchableOpacity style={styles.deleteButton} onPress={onDelete}>
          <Text style={styles.deleteText}>Delete Entry</Text>
        </TouchableOpacity>
      ) : null}
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
    marginBottom: 8,
  },
  hint: {
    fontSize: 13,
    color: colors.textSoft,
    marginBottom: 6,
  },
  label: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 5,
    marginTop: 10,
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
  deleteButton: {
    alignItems: 'center',
    paddingVertical: 14,
  },
  deleteText: {
    color: colors.danger,
    fontSize: 14,
    fontWeight: '700',
  },
  missingWrap: {
    flex: 1,
    backgroundColor: colors.background,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  missingTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.text,
  },
  missingBody: {
    fontSize: 14,
    color: colors.textSoft,
    marginTop: 4,
    marginBottom: 16,
  },
});
