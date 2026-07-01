# Mobile App Setup & Build Guide

## Prerequisites
- Node.js 18+ installed
- EAS CLI: `npm install -g eas-cli`
- Expo CLI: `npm install -g expo-cli`
- Android Studio (for local testing) or use EAS Build

## Development Setup

### 1. Install Dependencies
```bash
cd mobile
npm install
```

### 2. Start Development Server
```bash
npm run start
```

Then:
- **Android**: Press `a` to open in Android emulator
- **iOS**: Press `i` to open in iOS simulator
- **Web**: Press `w` to open in browser

## Building Production APK

### Option 1: EAS Build (Recommended - Cloud Build)
```bash
eas build --platform android --type release
```

### Option 2: Local Build
```bash
npm run prebuild
eas build --local --platform android
```

### Option 3: Direct Gradle Build
```bash
npm run prebuild
cd android
./gradlew bundleRelease  # For App Bundle
./gradlew assembleRelease  # For APK
```

## Optimization Applied
✅ ProGuard code minification enabled  
✅ Resource shrinking enabled  
✅ Lean builds enabled (smaller native code)  
✅ R8 compiler optimization  
✅ Unnecessary permissions removed  

## Expected APK Size
- **Optimized Release APK**: ~45-60 MB
- **With Assets**: ~50-70 MB

## Troubleshooting Metro Connection Error
If you see "Could not connect to development server":

1. **Kill existing Metro processes**:
   ```bash
   lsof -ti:8081 | xargs kill -9  # macOS/Linux
   ```

2. **Clear cache**:
   ```bash
   expo start --clear
   ```

3. **Check emulator/device connection**:
   ```bash
   adb devices
   ```

4. **Forward port** (physical device on same WiFi):
   ```bash
   adb reverse tcp:8081 tcp:8081
   ```

## API Configuration
The app connects to: `https://psychologistai.mi-emaehf.workers.dev`

This is configured in `app.json` under `extra.apiUrl`

## Output Files
After build completes:
- **APK**: `android/app/build/outputs/apk/release/app-release.apk`
- **AAB**: `android/app/build/outputs/bundle/release/app-release.aab` (for Play Store)
