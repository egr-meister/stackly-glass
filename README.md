# Stackly Glass

Stackly Glass is an offline manual water tracker for Android built with React Native and Expo. Instead of a bottle, ring, or dashboard, your day is a **vertical stack of glasses**: every glass you log is added to the stack, and the stack itself is your daily progress.

> **Stackly Glass is a manual water tracker. It does not detect drinking automatically and does not connect to Health Connect, Google Fit, sensors, or wearable devices.**

> **Stackly Glass uses in-app reminder cards only. It does not send system notifications.**

## Features

- One-tap **Add Glass** logging with the currently selected glass preset
- A growing **daily glass stack** as the main visual (latest glass on top)
- Four editable glass presets: Small Glass (150 ml), Regular Glass (250 ml), Large Glass (350 ml), Bottle (500 ml)
- Custom amount entries with optional labels, visually marked in the stack
- Daily goal (default 2000 ml) with remaining amount, progress percentage, and a calm "Goal reached" state
- Undo latest glass, edit/delete any entry, reset a day with confirmation
- History as a shelf of past daily stacks, with per-day detail
- Simple 7-day statistics (total, daily average, best day, goal days, entry count, plain-view bar row)
- Gentle in-app reminder cards based on today's progress and time of day
- 100% local storage via AsyncStorage — works fully in airplane mode

## Manual tracking disclaimer

Stackly Glass is a manual water tracker. **Water entries are added manually.** It does not detect drinking automatically and does not connect to Health Connect, Google Fit, sensors, or wearable devices. It makes no automatic water detection claims of any kind.

## Non-medical disclaimer

Stackly Glass is a practical wellness-style tracking utility. It is not a medical app, does not provide medical advice, does not diagnose dehydration or any condition, and the daily goal is only a personal tracking target.

## Offline-first: no internet, no permissions

- **No INTERNET permission** — the manifest blocks `android.permission.INTERNET` and the app works fully in airplane mode.
- **No runtime permissions** — no location, camera, microphone, contacts, storage, files, notifications, calendar, alarms, activity recognition, or body sensors.
- **No sensors**, **no Google Fit**, **no Health Connect**, **no wearable integration**.
- No backend, no Firebase, no ads, no analytics, no payments, no external APIs, no cloud sync, no accounts.

## How the app works

### Stacked glasses visual
The home screen's main element is a vertical stack of glasses. Each entry renders as a rounded glass with an aqua water fill and rim line. The stack grows upward through the day; the newest glass sits on top. With many glasses the stack compresses and summarizes older glasses so it always stays readable, and numeric values stay accurate above 100%.

### One-tap Add Glass
The large **Add Glass** button logs one entry using the active glass preset's amount, and the stack, total, remaining amount, and percentage all update immediately.

### Glass presets
Four presets are stored locally and shown as compact chips on the home screen. You can select the active glass, edit each preset's name and amount (1–5000 ml), and reset presets to defaults. **Preset changes apply to future entries only** — existing entries keep their original amount.

### Custom amount
Add any amount from 1 to 5000 ml with an optional label. Custom entries appear in the stack with a dashed rim, a lower fill, and a small dot mark.

### Daily goal
Default 2000 ml, editable from 1 to 10000 ml. Progress = daily total / goal. Invalid or missing values fall back to the default; the app never crashes on bad input.

### Goal reached
When the daily total reaches the goal, the app shows a calm "Goal reached" badge, the top glass gets a subtle accent, and any surplus shows as "+N ml above goal". No confetti, coins, prizes, or competitive mechanics.

### History
The History screen is a shelf of previous daily stacks: each card shows the date, total vs. goal, progress percentage, goal state, entry count, and a mini stack preview. Open any day to edit or delete entries or reset the day (with confirmation).

### Statistics
Last-7-days total, daily average, best day, goal days count, and glasses this week, plus a simple bar row built from plain React Native views. No chart library.

### In-app reminders
Reminder cards appear **only inside the app**, computed from today's progress and the current time when the home screen renders (late morning with no entries, afternoon below 50%, evening below goal). Master switch and per-period toggles live in Reminder Settings. **No notification permission is requested, and no system notifications are ever sent.** No `expo-notifications`, background tasks, alarm manager, calendar integration, FCM, or push tokens.

### Local storage
All data — water entries, daily goal, glass presets, selected glass, reminder settings, onboarding flag, and app settings — lives in AsyncStorage on the device. Loading merges stored data with safe defaults and tolerates empty storage, missing fields, and corrupted JSON, so the first render always works.

## Visual style: "Clean Stacked Glasses"

Warm white background, clear aqua glass fill, pale blue panels, muted teal controls, deep blue-gray text, soft gray dividers, and light glass outlines. Calm and practical — no medical, sports, casino, neon, mascot, or heavy-gradient styling.

### Daily Glass Stack layout uniqueness
The home screen is deliberately not a generic template: a compact header with title and settings icon, the glass stack side-by-side with compact progress info, one big Add Glass button, preset chips, and small secondary links. No mascot header, no circular/bottle/jar/tower/planet/map/drop-grid tracker, no spreadsheet log, no dashboard, and no vertical menu of identical buttons.

### App icon
Custom icon (no default Expo icon): a rounded pale-aqua square with a simple stack of three glasses with visible blue water fill. No text, no medical symbols, readable at small sizes.

### Splash screen
Custom splash (no default Expo splash): the centered stack-of-glasses mark with the app name "Stackly Glass" on a pale aqua background. Configured via the `expo-splash-screen` plugin with a light image asset.

## Getting started

### Scaffold reference
The project was created from the standard Expo template and then replaced with this source:

```bash
npx create-expo-app stackly-glass
```

### Install dependencies
All packages are installed through Expo so versions match the SDK:

```bash
npm install
npx expo install --fix
```

Direct dependencies (all installed via `npx expo install <package>`):
`expo`, `expo-status-bar`, `expo-splash-screen`, `expo-build-properties`, `@react-native-async-storage/async-storage`, `@react-navigation/native`, `@react-navigation/native-stack`, `react-native-screens`, `react-native-safe-area-context`, `react`, `react-native`.

### Run locally

```bash
npx expo start --android
```

## Building for Android

### 1. Generate a PKCS12 release keystore
Release builds must be signed with a real PKCS12 keystore, never a debug key:

```bash
keytool -genkeypair -v -storetype PKCS12 -keystore stackly-glass-release-key.p12 -alias stackly_glass_key -keyalg RSA -keysize 2048 -validity 10000
```

Use the **same password for the keystore and the key**. Keep the file out of the repository (`.gitignore` already excludes `*.p12`, `*.jks`, `*.keystore`).

### 2. Add GitHub Secrets
In your repository settings, add:

| Secret | Value |
| --- | --- |
| `ANDROID_KEYSTORE_BASE64` | `base64 -w0 stackly-glass-release-key.p12` output |
| `ANDROID_KEYSTORE_PASSWORD` | keystore password |
| `ANDROID_KEY_ALIAS` | `stackly_glass_key` |
| `ANDROID_KEY_PASSWORD` | same as the keystore password |

Keystore files and passwords are provided **only** through GitHub Secrets and are never committed.

### 3. GitHub Actions
`.github/workflows/android-build.yml` runs on every push to `main`:

1. Installs Node.js 20 and JDK 17, runs `npm install`.
2. Pre-flight checks: `npx expo install --fix`, `npx expo-doctor`, `npx expo install --check`.
3. Installs Android SDK Platform 35 and Build Tools 35.0.0 via `sdkmanager`.
4. Decodes the keystore from `ANDROID_KEYSTORE_BASE64`.
5. Runs `npx expo prebuild --platform android` and then `node scripts/enable-release-signing.js`, which makes the `release` buildType use `signingConfigs.release` (PKCS12, credentials from environment), explicitly overriding the default Expo/React Native debug signing.
6. Builds the signed release APK (`assembleRelease`) and AAB (`bundleRelease`).
7. **Verifies the APK signature** with `apksigner verify --print-certs`, prints the certificate to the logs, and **fails the build if the certificate contains `CN=Android Debug`** — so a debug-signed artifact can never ship.
8. Uploads the APK and AAB as workflow artifacts.

CI builds and signs only; it does not run emulator smoke tests.

### 4. Local release build (optional)

```bash
npx expo prebuild --platform android
node scripts/enable-release-signing.js
export ANDROID_KEYSTORE_PATH=/absolute/path/stackly-glass-release-key.p12
export ANDROID_KEYSTORE_PASSWORD=yourpassword
export ANDROID_KEY_ALIAS=stackly_glass_key
export ANDROID_KEY_PASSWORD=yourpassword
cd android && ./gradlew assembleRelease bundleRelease
```

## Google Play compatibility

- **Upload the `.aab` only** (`android/app/build/outputs/bundle/release/app-release.aab`). The APK is for device testing.
- **Android API 35**: `compileSdkVersion 35` and `targetSdkVersion 35` are pinned via `expo-build-properties` (never 34), with `minSdkVersion 24` for React Native 0.79.
- **16 KB page sizes**: the Expo SDK 53 / React Native 0.79 toolchain builds native libraries compatible with Android 15+ 16 KB memory page sizes, and no old native libraries are added.
- **Signing**: release artifacts are PKCS12-signed and CI rejects debug certificates, avoiding Play rejections for debug-signed builds.
- **Permissions**: no unexpected permissions; `android.permission.INTERNET` is explicitly blocked in `app.json`.

## Release optimization (R8 / Proguard)

Verify a **non-minified** release first (the default generated Gradle config uses):

```gradle
minifyEnabled false
shrinkResources false
```

Only after the non-minified release launches cleanly, enable in `android/app/build.gradle`:

```gradle
minifyEnabled true
shrinkResources true
proguardFiles getDefaultProguardFile('proguard-android-optimize.txt'), 'proguard-rules.pro'
```

Then re-test launch on a device. Standard Android R8 only — no third-party obfuscation libraries.

## Local launch verification checklist

CI build success is not proof the app launches. Before release:

```bash
adb install android/app/build/outputs/apk/release/app-release.apk
adb logcat
```

Confirm there are no errors such as: `Cannot find native module`, `Module has not been registered`, `Invariant Violation`, `theme.fonts.regular is undefined`, AsyncStorage JSON parse crash, missing route params crash, invalid date/time/number crash, selected glass preset crash, glass stack rendering crash, statistics calculation crash, or signature misconfiguration.

Then walk through: first launch with empty storage → complete onboarding → add one glass → add multiple glasses → change active preset → add glass after preset change → edit a preset amount → add custom amount → undo latest glass → edit entry → delete entry → reset selected day → check goal reached state → check stack growth → open History → open Statistics → check in-app reminders → reset all local data → relaunch → launch in airplane mode.

Optional permission check (confirm `android.permission.INTERNET` is **not** present):

```bash
aapt dump permissions app-release.apk
```

## Privacy note

Stackly Glass stores water entries, goals, glass presets, reminders, history, statistics, and settings only on this device. No account, no ads, no analytics, no internet connection, no sensors, no Google Fit, no Health Connect, no wearable integration, and no notification permission.
