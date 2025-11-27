# EsusuHub React Native

A modern React Native mobile application for managing Esusu savings groups, built with TypeScript, React Navigation, and Zustand.

## 📱 Features

- **Authentication**: Secure JWT-based authentication with token refresh
- **Groups Management**: Create, join, and manage savings groups
- **Payments**: Process payments with Stripe integration
- **Notifications**: Push notifications and in-app notifications
- **Offline Support**: Caching and offline queue for seamless experience
- **Deep Linking**: Navigate directly to specific screens via URLs
- **Image Upload**: Avatar and image upload with optimization
- **Performance**: Optimized with performance monitoring and caching

## 🚀 Getting Started

### Prerequisites

- Node.js >= 18
- React Native CLI
- Android Studio (for Android development)
- Xcode (for iOS development, macOS only)
- Java Development Kit (JDK) 11 or higher

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd EsusuHub_ReactNative
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **iOS Setup** (macOS only)
   ```bash
   cd ios
   pod install
   cd ..
   ```

4. **Configure environment variables**
   ```bash
   cp .env.example .env
   ```
   
   Edit `.env` with your configuration:
   ```env
   API_BASE_URL=https://api.esusuhub.com/api
   STRIPE_PUBLISHABLE_KEY=pk_test_...
   SUPABASE_URL=https://...
   SUPABASE_ANON_KEY=...
   ```

5. **Start Metro bundler**
   ```bash
   npm start
   ```

6. **Run on device/emulator**
   ```bash
   # Android
   npm run android
   
   # iOS
   npm run ios
   ```

## 📁 Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── Button.tsx
│   ├── Input.tsx
│   ├── Card.tsx
│   ├── LoadingSkeleton.tsx
│   ├── ErrorDisplay.tsx
│   └── OptimizedImage.tsx
├── screens/            # Screen components
│   ├── auth/          # Authentication screens
│   ├── home/          # Home screen
│   ├── groups/        # Groups screens
│   ├── payment/       # Payment screen
│   ├── profile/      # Profile screen
│   └── notifications/ # Notifications screen
├── navigation/        # Navigation configuration
├── services/          # API services
│   ├── api/           # API client
│   ├── auth/         # Auth service
│   ├── groups/       # Groups service
│   ├── payments/     # Payments service
│   ├── user/          # User service
│   ├── notifications/ # Notifications service
│   ├── cache/         # Cache service
│   ├── offline/       # Offline service
│   ├── image/         # Image upload service
│   └── deepLinking/   # Deep linking service
├── stores/            # Zustand state stores
│   ├── authStore.ts
│   ├── userStore.ts
│   ├── groupsStore.ts
│   ├── paymentsStore.ts
│   └── notificationsStore.ts
├── types/             # TypeScript type definitions
├── utils/             # Utility functions
│   ├── errorHandler.ts
│   ├── logger.ts
│   ├── performanceMonitor.ts
│   ├── memoryManager.ts
│   └── tokenManager.ts
├── hooks/             # Custom React hooks
├── theme/             # Theme configuration
└── config/            # Configuration files
```

## 🛠️ Development

### Available Scripts

- `npm start` - Start Metro bundler
- `npm run android` - Run on Android
- `npm run ios` - Run on iOS
- `npm test` - Run tests
- `npm run test:watch` - Run tests in watch mode
- `npm run test:coverage` - Run tests with coverage
- `npm run lint` - Run ESLint
- `npm run type-check` - Run TypeScript type checking
- `npm run bundle:analyze` - Analyze bundle size

### Code Style

This project uses:
- **ESLint** for code linting
- **Prettier** for code formatting
- **TypeScript** for type safety

### Testing

Run tests:
```bash
npm test
```

Run tests with coverage:
```bash
npm run test:coverage
```

## 📦 Building for Production

### Android

1. **Generate a keystore** (if you don't have one)
   ```bash
   keytool -genkeypair -v -storetype PKCS12 -keystore my-release-key.keystore -alias my-key-alias -keyalg RSA -keysize 2048 -validity 10000
   ```

2. **Configure signing** in `android/app/build.gradle`

3. **Build APK**
   ```bash
   cd android
   ./gradlew assembleRelease
   ```

4. **Build AAB** (for Play Store)
   ```bash
   ./gradlew bundleRelease
   ```

### iOS

1. **Configure signing** in Xcode

2. **Build for App Store**
   ```bash
   cd ios
   xcodebuild -workspace EsusuHub.xcworkspace -scheme EsusuHub -configuration Release archive
   ```

## 🔧 Configuration

### Environment Variables

Create a `.env` file in the root directory:

```env
# API Configuration
API_BASE_URL=https://api.esusuhub.com/api

# Stripe
STRIPE_PUBLISHABLE_KEY=pk_live_...

# Supabase (if used)
SUPABASE_URL=https://...
SUPABASE_ANON_KEY=...

# Environment
NODE_ENV=production
```

### Deep Linking

The app supports deep linking with the scheme `esusuhub://`:

- `esusuhub://home` - Home screen
- `esusuhub://groups` - Groups list
- `esusuhub://group/123` - Group detail
- `esusuhub://groups/create` - Create group
- `esusuhub://payment?groupId=123` - Payment screen
- `esusuhub://profile` - Profile screen
- `esusuhub://notifications` - Notifications

## 🧪 Testing

### Unit Tests

Tests are located in `__tests__/` directory:

- Component tests: `__tests__/components/`
- Service tests: `__tests__/services/`
- Store tests: `__tests__/stores/`
- Utility tests: `__tests__/utils/`

### Integration Tests

Integration tests are in `__tests__/integration/`

## 📊 Performance

### Monitoring

The app includes performance monitoring:

```typescript
import {performanceMonitor} from './utils/performanceMonitor';

// Measure operation
await performanceMonitor.measure('fetchGroups', async () => {
  return await groupsService.getMyGroups();
});

// Get summary
const summary = performanceMonitor.getSummary();
```

### Bundle Analysis

Analyze bundle size:
```bash
npm run bundle:analyze
npm run bundle:size
```

## 🔐 Security

- **Secure Storage**: Tokens stored using `react-native-secure-key-store`
- **HTTPS Only**: All API calls use HTTPS
- **Token Refresh**: Automatic token refresh on expiration
- **Input Validation**: All inputs validated before submission

## 📱 Platform Support

- **Android**: API 21+ (Android 5.0+)
- **iOS**: iOS 13.0+

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License.

## 📞 Support

For support, email support@esusuhub.com or open an issue in the repository.

## 🙏 Acknowledgments

- React Native team
- React Navigation
- Zustand
- All contributors

---

**Built with ❤️ by the EsusuHub team**

