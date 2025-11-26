# EsusuHub React Native Application

This is the React Native mobile application for EsusuHub, converted from the React web application.

## 🚀 Getting Started

### Prerequisites

- Node.js (v18 or higher)
- React Native CLI
- Xcode (for iOS development on macOS)
- Android Studio (for Android development)
- CocoaPods (for iOS dependencies)

### Installation

1. **Install dependencies:**
   ```bash
   npm install
   # or
   yarn install
   ```

2. **Install iOS dependencies (macOS only):**
   ```bash
   cd ios && pod install && cd ..
   ```

3. **Link native dependencies:**
   ```bash
   npx react-native link
   ```

### Running the App

**iOS:**
```bash
npm run ios
# or
npx react-native run-ios
```

**Android:**
```bash
npm run android
# or
npx react-native run-android
```

**Start Metro bundler:**
```bash
npm start
```

## 📁 Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── Button.tsx
│   ├── Input.tsx
│   └── Card.tsx
├── navigation/         # Navigation configuration
│   └── AppNavigator.tsx
├── screens/            # Screen components
│   ├── auth/
│   │   ├── LoginScreen.tsx
│   │   └── RegisterScreen.tsx
│   ├── home/
│   │   └── HomeScreen.tsx
│   ├── groups/
│   ├── payment/
│   ├── profile/
│   ├── banking/
│   └── ...
├── services/           # Business logic and API
│   ├── api/
│   │   └── apiClient.ts
│   └── storage/
│       └── secureStorage.ts
└── theme/             # Design system
    ├── colors.ts
    ├── spacing.ts
    └── typography.ts
```

## 🔧 Key Features

### Navigation
- React Navigation v6 with Stack and Tab navigators
- Authentication flow handling
- Deep linking support ready

### Authentication
- Secure storage for tokens and user data
- Login/Register screens implemented
- Session management

### API Integration
- Centralized API client with error handling
- Network connectivity checking
- Automatic token injection

### Styling
- Theme-based design system
- Consistent colors, spacing, and typography
- Reusable components

## 📱 Platform-Specific Setup

### iOS Configuration

1. **Update Info.plist** (ios/EsusuHub/Info.plist):
   ```xml
   <key>NSPhotoLibraryUsageDescription</key>
   <string>We need access to your photos to upload profile pictures</string>
   <key>NSCameraUsageDescription</key>
   <string>We need access to your camera to take profile pictures</string>
   ```

2. **Configure App Transport Security** if needed for local development

### Android Configuration

1. **Update AndroidManifest.xml** (android/app/src/main/AndroidManifest.xml):
   ```xml
   <uses-permission android:name="android.permission.INTERNET" />
   <uses-permission android:name="android.permission.CAMERA" />
   <uses-permission android:name="android.permission.READ_EXTERNAL_STORAGE" />
   ```

2. **Update build.gradle** for minimum SDK version (recommended: 23+)

## 🔐 Environment Variables

Create a `.env` file in the root directory:

```
API_BASE_URL=http://localhost:5166/api
SUPABASE_URL=your_supabase_url
SUPABASE_ANON_KEY=your_supabase_key
STRIPE_PUBLISHABLE_KEY=your_stripe_key
```

Use `react-native-config` package to access these variables.

## 📦 Dependencies

### Core
- `react-native`: 0.73.0
- `react`: 18.2.0
- `@react-navigation/native`: Navigation library
- `react-native-screens`: Native screen components
- `react-native-gesture-handler`: Gesture handling

### Storage & Security
- `@react-native-async-storage/async-storage`: Async storage
- `react-native-secure-key-store`: Secure key storage

### UI & Icons
- `react-native-vector-icons`: Icon library
- `react-native-linear-gradient`: Gradient backgrounds
- `react-native-svg`: SVG support

### Backend Integration
- `@supabase/supabase-js`: Supabase client
- `@stripe/stripe-react-native`: Stripe payments

## 🛠️ Development

### Type Checking
```bash
npm run type-check
```

### Linting
```bash
npm run lint
```

### Testing
```bash
npm test
```

## 📝 Next Steps

### Completed ✅
- [x] Project structure setup
- [x] Navigation configuration
- [x] Theme system
- [x] Core components (Button, Input, Card)
- [x] Authentication screens (Login, Register)
- [x] Home screen with basic UI
- [x] API client and secure storage services

### To Complete 🚧
- [ ] Complete all screen implementations
- [ ] Integrate with backend API
- [ ] Add image picker for profile pictures
- [ ] Implement payment flow with Stripe
- [ ] Add push notifications
- [ ] Implement offline support
- [ ] Add error boundaries
- [ ] Complete i18n integration
- [ ] Add unit and integration tests
- [ ] Performance optimization
- [ ] App store deployment setup

## 🔄 Converting from Web to Native

### Key Differences

1. **Styling**: Use `StyleSheet` instead of Tailwind classes
2. **Navigation**: React Navigation instead of React Router
3. **Storage**: AsyncStorage/SecureStorage instead of localStorage
4. **Components**: React Native components (View, Text, etc.) instead of HTML
5. **Icons**: Vector icons instead of RemixIcon classes
6. **Images**: Image component with URI instead of img tags

### Conversion Checklist

For each web component:
- [ ] Replace HTML elements with React Native components
- [ ] Convert Tailwind classes to StyleSheet
- [ ] Replace `useNavigate` with `useNavigation`
- [ ] Update image sources to use Image component
- [ ] Replace icon classes with vector icons
- [ ] Update form inputs to use Input component
- [ ] Replace modals with React Native Modal component
- [ ] Update localStorage calls to SecureStorageService

## 📚 Resources

- [React Native Documentation](https://reactnative.dev/)
- [React Navigation](https://reactnavigation.org/)
- [React Native Vector Icons](https://github.com/oblador/react-native-vector-icons)
- [Supabase React Native](https://supabase.com/docs/guides/getting-started/tutorials/with-expo-react-native)

## 🤝 Contributing

1. Follow the existing code structure
2. Use TypeScript for type safety
3. Follow the theme system for styling
4. Write meaningful commit messages
5. Test on both iOS and Android

## 📄 License

[Your License Here]

---

**Note**: This is a converted React Native application. Some features from the web version may need additional implementation for mobile platforms.

