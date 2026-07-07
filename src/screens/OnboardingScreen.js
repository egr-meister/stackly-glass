import React from 'react';
import { View, Text, TouchableOpacity, ScrollView, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useApp } from '../store/AppContext';
import { colors } from '../theme';

const POINTS = [
  { title: 'Stack your daily glasses.', body: 'Every glass you add appears in a vertical stack that grows through the day.' },
  { title: 'One tap adds your selected glass.', body: 'The big Add Glass button logs your current glass size instantly.' },
  { title: 'Change glass sizes anytime.', body: 'Pick between Small Glass, Regular Glass, Large Glass, and Bottle presets, or edit them.' },
  { title: 'Manual tracking only. No sensors, no account, no internet.', body: 'Stackly Glass is a manual water tracker. It does not detect drinking automatically and does not connect to Health Connect, Google Fit, sensors, or wearable devices.' },
  { title: 'Reminders appear only inside the app.', body: 'Gentle reminder cards show on the home screen while the app is open. No phone notifications.' },
  { title: 'Everything stays on your device.', body: 'Entries, goals, presets, history, and settings are stored locally. Works fully in airplane mode.' },
];

export default function OnboardingScreen({ navigation }) {
  const app = useApp();

  const finish = () => {
    app?.completeOnboarding?.();
    if (navigation?.canGoBack?.()) {
      navigation.goBack();
    } else {
      navigation?.replace?.('Home');
    }
  };

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        {/* Small stacked-glasses mark */}
        <View style={styles.mark}>
          <View style={[styles.markGlass, { width: 54 }]} />
          <View style={[styles.markGlass, { width: 62 }]} />
          <View style={[styles.markGlass, { width: 70 }]} />
          <View style={styles.markShelf} />
        </View>
        <Text style={styles.title}>Stackly Glass</Text>
        <Text style={styles.subtitle}>A calm, offline stack of your daily water glasses.</Text>

        {POINTS.map((point) => (
          <View key={point.title} style={styles.point}>
            <Text style={styles.pointTitle}>{point.title}</Text>
            <Text style={styles.pointBody}>{point.body}</Text>
          </View>
        ))}

        <TouchableOpacity style={styles.primaryButton} onPress={finish}>
          <Text style={styles.primaryText}>Start Stacking</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.skipButton} onPress={finish}>
          <Text style={styles.skipText}>Skip</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scroll: {
    padding: 24,
    paddingBottom: 40,
  },
  mark: {
    alignItems: 'center',
    marginTop: 12,
    marginBottom: 12,
  },
  markGlass: {
    height: 20,
    marginBottom: 3,
    backgroundColor: colors.water,
    borderWidth: 2,
    borderColor: colors.outline,
    borderBottomLeftRadius: 8,
    borderBottomRightRadius: 8,
  },
  markShelf: {
    width: 86,
    height: 4,
    borderRadius: 2,
    backgroundColor: colors.divider,
    marginTop: 4,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: colors.text,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 14,
    color: colors.textSoft,
    textAlign: 'center',
    marginTop: 4,
    marginBottom: 18,
  },
  point: {
    backgroundColor: colors.panelSoft,
    borderWidth: 1,
    borderColor: colors.divider,
    borderRadius: 12,
    padding: 14,
    marginBottom: 10,
  },
  pointTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: colors.text,
  },
  pointBody: {
    fontSize: 13,
    color: colors.textSoft,
    marginTop: 3,
  },
  primaryButton: {
    backgroundColor: colors.teal,
    borderRadius: 16,
    paddingVertical: 15,
    alignItems: 'center',
    marginTop: 12,
  },
  primaryText: {
    color: colors.white,
    fontSize: 17,
    fontWeight: '700',
  },
  skipButton: {
    alignItems: 'center',
    paddingVertical: 14,
  },
  skipText: {
    color: colors.textSoft,
    fontSize: 14,
    fontWeight: '600',
  },
});
