# Deployment Guide

## Prerequisites

- Node.js >= 18
- React Native CLI
- Android Studio (for Android)
- Xcode (for iOS, macOS only)
- Code signing certificates

## Environment Setup

1. **Copy environment file**
   ```bash
   cp .env.example .env
   ```

2. **Configure environment variables**
   - `API_BASE_URL`: Production API URL
   - `STRIPE_PUBLISHABLE_KEY`: Stripe publishable key
   - Other service keys as needed

## Android Deployment

### 1. Generate Signing Key

```bash
keytool -genkeypair -v -storetype PKCS12 \
  -keystore my-release-key.keystore \
  -alias my-key-alias \
  -keyalg RSA -keysize 2048 -validity 10000
```

### 2. Configure Gradle

Edit `android/gradle.properties`:

```properties
MYAPP_RELEASE_STORE_FILE=my-release-key.keystore
MYAPP_RELEASE_KEY_ALIAS=my-key-alias
MYAPP_RELEASE_STORE_PASSWORD=*****
MYAPP_RELEASE_KEY_PASSWORD=*****
```

Edit `android/app/build.gradle`:

```gradle
android {
    ...
    signingConfigs {
        release {
            if (project.hasProperty('MYAPP_RELEASE_STORE_FILE')) {
                storeFile file(MYAPP_RELEASE_STORE_FILE)
                storePassword MYAPP_RELEASE_STORE_PASSWORD
                keyAlias MYAPP_RELEASE_KEY_ALIAS
                keyPassword MYAPP_RELEASE_KEY_PASSWORD
            }
        }
    }
    buildTypes {
        release {
            ...
            signingConfig signingConfigs.release
        }
    }
}
```

### 3. Build Release APK

```bash
cd android
./gradlew assembleRelease
```

APK location: `android/app/build/outputs/apk/release/app-release.apk`

### 4. Build Release AAB (for Play Store)

```bash
cd android
./gradlew bundleRelease
```

AAB location: `android/app/build/outputs/bundle/release/app-release.aab`

### 5. Upload to Play Store

1. Go to [Google Play Console](https://play.google.com/console)
2. Create new app or select existing
3. Upload AAB file
4. Complete store listing
5. Submit for review

## iOS Deployment

### 1. Configure Signing

1. Open `ios/EsusuHub.xcworkspace` in Xcode
2. Select project in navigator
3. Go to "Signing & Capabilities"
4. Select your team
5. Enable "Automatically manage signing"

### 2. Update Version

Edit `ios/EsusuHub/Info.plist`:
- `CFBundleShortVersionString`: Version (e.g., "1.0.0")
- `CFBundleVersion`: Build number (e.g., "1")

### 3. Build Archive

```bash
cd ios
xcodebuild -workspace EsusuHub.xcworkspace \
  -scheme EsusuHub \
  -configuration Release \
  archive \
  -archivePath build/EsusuHub.xcarchive
```

### 4. Export IPA

1. Open Xcode
2. Window > Organizer
3. Select archive
4. Distribute App
5. Choose distribution method (App Store, Ad Hoc, Enterprise)
6. Follow prompts

### 5. Upload to App Store

1. Use Xcode Organizer or Transporter app
2. Upload IPA to App Store Connect
3. Complete app information in App Store Connect
4. Submit for review

## CI/CD Deployment

### GitHub Actions

The project includes GitHub Actions workflows:

- **CI**: Runs on every push/PR
  - Linting
  - Type checking
  - Tests
  - Build verification

- **Release**: Runs on version tags
  - Builds release APK/AAB for Android
  - Builds release IPA for iOS
  - Uploads artifacts

### Manual Release

1. **Update version**
   ```bash
   npm version patch  # or minor, major
   ```

2. **Create tag**
   ```bash
   git tag v1.0.0
   git push origin v1.0.0
   ```

3. **GitHub Actions will automatically build and release**

## Environment-Specific Builds

### Development
```bash
npm run android -- --variant=debug
npm run ios -- --configuration Debug
```

### Staging
```bash
# Set NODE_ENV=staging in .env
npm run android -- --variant=release
npm run ios -- --configuration Release
```

### Production
```bash
# Set NODE_ENV=production in .env
# Follow deployment steps above
```

## Troubleshooting

### Android Build Issues

**Issue**: `SDK location not found`
```bash
export ANDROID_HOME=$HOME/Library/Android/sdk
export PATH=$PATH:$ANDROID_HOME/tools
export PATH=$PATH:$ANDROID_HOME/platform-tools
```

**Issue**: `Gradle build failed`
```bash
cd android
./gradlew clean
./gradlew assembleRelease
```

### iOS Build Issues

**Issue**: `Pod install failed`
```bash
cd ios
pod deintegrate
pod install
```

**Issue**: `Code signing error`
- Check signing configuration in Xcode
- Ensure certificates are valid
- Update provisioning profiles

## Post-Deployment

1. **Monitor crash reports**
   - Firebase Crashlytics
   - Sentry
   - App Store Connect

2. **Monitor analytics**
   - User engagement
   - Performance metrics
   - Error rates

3. **Update documentation**
   - Release notes
   - API changes
   - Known issues

## Rollback Procedure

### Android
1. Upload previous AAB version
2. Submit for review
3. Notify users if needed

### iOS
1. Revert to previous build in App Store Connect
2. Submit for review
3. Notify users if needed

## Security Checklist

- [ ] Environment variables secured
- [ ] API keys not in code
- [ ] Signing keys secured
- [ ] HTTPS only for API calls
- [ ] Token storage secure
- [ ] No sensitive data in logs
- [ ] ProGuard/R8 enabled (Android)
- [ ] Code obfuscation enabled

