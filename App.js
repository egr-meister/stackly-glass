import React, { useEffect } from 'react';
import { NavigationContainer, DefaultTheme } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { StatusBar } from 'expo-status-bar';
import * as SplashScreen from 'expo-splash-screen';

import { AppProvider, useApp } from './src/store/AppContext';
import { colors } from './src/theme';

import OnboardingScreen from './src/screens/OnboardingScreen';
import HomeScreen from './src/screens/HomeScreen';
import CustomAmountScreen from './src/screens/CustomAmountScreen';
import EntryEditScreen from './src/screens/EntryEditScreen';
import DayDetailScreen from './src/screens/DayDetailScreen';
import HistoryScreen from './src/screens/HistoryScreen';
import StatisticsScreen from './src/screens/StatisticsScreen';
import GlassPresetsScreen from './src/screens/GlassPresetsScreen';
import ReminderSettingsScreen from './src/screens/ReminderSettingsScreen';
import GoalSettingsScreen from './src/screens/GoalSettingsScreen';
import SettingsScreen from './src/screens/SettingsScreen';

SplashScreen.preventAutoHideAsync().catch(() => {});

const Stack = createNativeStackNavigator();

// Extend DefaultTheme (never build a navigation theme from scratch) so
// theme.fonts and every required field stay defined.
const navTheme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    background: colors.background,
    card: colors.background,
    primary: colors.teal,
    text: colors.text,
    border: colors.divider,
  },
};

function RootNavigator() {
  const app = useApp();
  const ready = app?.ready === true;

  useEffect(() => {
    if (ready) {
      SplashScreen.hideAsync().catch(() => {});
    }
  }, [ready]);

  if (!ready) return null;

  const initialRoute = app?.settings?.onboardingCompleted === true ? 'Home' : 'Onboarding';

  return (
    <Stack.Navigator
      initialRouteName={initialRoute}
      screenOptions={{
        headerStyle: { backgroundColor: colors.background },
        headerTintColor: colors.text,
        headerTitleStyle: { fontWeight: '600' },
        headerShadowVisible: false,
        contentStyle: { backgroundColor: colors.background },
      }}
    >
      <Stack.Screen name="Onboarding" component={OnboardingScreen} options={{ headerShown: false }} />
      <Stack.Screen name="Home" component={HomeScreen} options={{ headerShown: false }} />
      <Stack.Screen name="CustomAmount" component={CustomAmountScreen} options={{ title: 'Custom Amount' }} />
      <Stack.Screen name="EntryEdit" component={EntryEditScreen} options={{ title: 'Water Entry' }} />
      <Stack.Screen name="DayDetail" component={DayDetailScreen} options={{ title: 'Day Detail' }} />
      <Stack.Screen name="History" component={HistoryScreen} options={{ title: 'History' }} />
      <Stack.Screen name="Statistics" component={StatisticsScreen} options={{ title: 'Statistics' }} />
      <Stack.Screen name="GlassPresets" component={GlassPresetsScreen} options={{ title: 'Glass Presets' }} />
      <Stack.Screen
        name="ReminderSettings"
        component={ReminderSettingsScreen}
        options={{ title: 'Reminders' }}
      />
      <Stack.Screen name="GoalSettings" component={GoalSettingsScreen} options={{ title: 'Daily Goal' }} />
      <Stack.Screen name="Settings" component={SettingsScreen} options={{ title: 'Settings' }} />
    </Stack.Navigator>
  );
}

export default function App() {
  return (
    <AppProvider>
      <NavigationContainer theme={navTheme}>
        <StatusBar style="dark" backgroundColor={colors.background} />
        <RootNavigator />
      </NavigationContainer>
    </AppProvider>
  );
}
