import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, StyleSheet, Alert } from 'react-native';
import { useApp } from '../store/AppContext';
import { defaultGlassPresets, MAX_ENTRY_ML } from '../defaults';
import { colors } from '../theme';

export default function GlassPresetsScreen() {
  const app = useApp();
  const settings = app?.settings ?? {};
  const presets = Array.isArray(settings?.glassPresets) ? settings.glassPresets : defaultGlassPresets;

  const [drafts, setDrafts] = useState(() => {
    const map = {};
    for (const preset of presets) {
      map[preset?.id] = { name: preset?.name ?? '', amount: String(preset?.amountMl ?? '') };
    }
    return map;
  });
  const [errors, setErrors] = useState({});
  const [saved, setSaved] = useState(false);

  const setDraft = (id, field, value) => {
    setDrafts((prev) => ({ ...prev, [id]: { ...(prev?.[id] ?? {}), [field]: value } }));
    setErrors((prev) => ({ ...prev, [id]: '' }));
    setSaved(false);
  };

  const onSave = () => {
    const nextErrors = {};
    const nextPresets = [];
    for (const def of defaultGlassPresets) {
      const draft = drafts?.[def.id] ?? {};
      const name = String(draft?.name ?? '').trim();
      const n = Math.round(Number(draft?.amount));
      if (!name) {
        nextErrors[def.id] = 'Name must not be empty.';
        continue;
      }
      if (!String(draft?.amount ?? '').trim() || !Number.isFinite(n)) {
        nextErrors[def.id] = 'Please enter a number amount in ml.';
        continue;
      }
      if (n <= 0) {
        nextErrors[def.id] = 'Amount must be greater than 0.';
        continue;
      }
      if (n > MAX_ENTRY_ML) {
        nextErrors[def.id] = `Amount must not exceed ${MAX_ENTRY_ML} ml.`;
        continue;
      }
      nextPresets.push({ id: def.id, name, amountMl: n, updatedAt: '' });
    }
    if (Object.keys(nextErrors).length > 0) {
      setErrors(nextErrors);
      return;
    }
    app?.updatePresets?.(nextPresets);
    setSaved(true);
  };

  const onReset = () => {
    Alert.alert('Reset presets?', 'This restores the default glass names and amounts.', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Reset',
        onPress: () => {
          app?.resetPresets?.();
          const map = {};
          for (const preset of defaultGlassPresets) {
            map[preset.id] = { name: preset.name, amount: String(preset.amountMl) };
          }
          setDrafts(map);
          setErrors({});
          setSaved(false);
        },
      },
    ]);
  };

  return (
    <ScrollView style={styles.screen} contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
      <Text style={styles.note}>Preset changes apply to future entries only.</Text>

      {defaultGlassPresets.map((def) => {
        const draft = drafts?.[def.id] ?? { name: '', amount: '' };
        const active = settings?.selectedGlassId === def.id;
        return (
          <View key={def.id} style={[styles.card, active && styles.cardActive]}>
            <View style={styles.cardHeader}>
              <Text style={styles.cardTitle}>{def.name}</Text>
              <TouchableOpacity
                style={[styles.selectButton, active && styles.selectButtonActive]}
                onPress={() => app?.setSelectedGlass?.(def.id)}
              >
                <Text style={[styles.selectText, active && styles.selectTextActive]}>
                  {active ? 'Active glass' : 'Set active'}
                </Text>
              </TouchableOpacity>
            </View>
            <Text style={styles.fieldLabel}>Name</Text>
            <TextInput
              style={styles.input}
              value={draft.name}
              onChangeText={(v) => setDraft(def.id, 'name', v)}
              maxLength={30}
              placeholder={def.name}
              placeholderTextColor={colors.textSoft}
            />
            <Text style={styles.fieldLabel}>Amount (ml)</Text>
            <TextInput
              style={styles.input}
              value={draft.amount}
              onChangeText={(v) => setDraft(def.id, 'amount', v)}
              keyboardType="numeric"
              maxLength={5}
              placeholder={String(def.amountMl)}
              placeholderTextColor={colors.textSoft}
            />
            {errors?.[def.id] ? <Text style={styles.error}>{errors[def.id]}</Text> : null}
          </View>
        );
      })}

      {saved ? <Text style={styles.savedText}>Presets saved.</Text> : null}

      <TouchableOpacity style={styles.saveButton} onPress={onSave}>
        <Text style={styles.saveText}>Save Presets</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.resetButton} onPress={onReset}>
        <Text style={styles.resetText}>Reset presets to defaults</Text>
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
  note: {
    fontSize: 13,
    color: colors.textSoft,
    marginBottom: 12,
    textAlign: 'center',
  },
  card: {
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.divider,
    borderRadius: 14,
    padding: 14,
    marginBottom: 10,
  },
  cardActive: {
    borderColor: colors.teal,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  cardTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: colors.text,
  },
  selectButton: {
    borderWidth: 1,
    borderColor: colors.outline,
    borderRadius: 12,
    paddingHorizontal: 10,
    paddingVertical: 4,
    backgroundColor: colors.chipBg,
  },
  selectButtonActive: {
    backgroundColor: colors.teal,
    borderColor: colors.tealDark,
  },
  selectText: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.text,
  },
  selectTextActive: {
    color: colors.white,
  },
  fieldLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.textSoft,
    marginTop: 6,
    marginBottom: 4,
  },
  input: {
    backgroundColor: colors.background,
    borderWidth: 1,
    borderColor: colors.outline,
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 8,
    fontSize: 15,
    color: colors.text,
  },
  error: {
    color: colors.danger,
    fontSize: 12,
    marginTop: 6,
  },
  savedText: {
    color: colors.success,
    fontSize: 13,
    textAlign: 'center',
    marginBottom: 6,
  },
  saveButton: {
    backgroundColor: colors.teal,
    borderRadius: 14,
    paddingVertical: 13,
    alignItems: 'center',
    marginTop: 4,
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
