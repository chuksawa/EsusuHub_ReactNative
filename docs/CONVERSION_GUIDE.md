# React Native Conversion Guide

This document provides guidance for completing the conversion from React web to React Native.

## Architecture Overview

The application has been converted to React Native with the following structure:

### Navigation
- **Stack Navigator**: Handles authentication and main app navigation
- **Tab Navigator**: Bottom tabs for Home, Groups, and History
- **Screen-based routing**: Each screen is a separate component

### State Management
- Currently using React hooks (useState, useEffect)
- Consider adding Redux or Zustand for complex state if needed

### Styling
- Theme-based system with colors, spacing, and typography
- StyleSheet API instead of CSS classes
- Consistent design tokens across the app

## Converting Remaining Screens

### 1. Groups Screen
**Location**: `src/screens/groups/GroupsScreen.tsx`

**Web Reference**: `src/pages/groups/page.tsx`

**Key Conversions**:
- Replace `<div>` with `<View>`
- Replace `<button>` with `<TouchableOpacity>` or `<Button>` component
- Convert Tailwind classes to StyleSheet
- Use `FlatList` for group lists instead of `.map()`
- Replace `navigate()` with `navigation.navigate()`

**Example**:
```tsx
// Web
<div className="bg-white rounded-2xl p-6">
  {groups.map(group => (
    <button onClick={() => navigate('/group/' + group.id)}>
      {group.name}
    </button>
  ))}
</div>

// React Native
<Card>
  <FlatList
    data={groups}
    renderItem={({item}) => (
      <TouchableOpacity onPress={() => navigation.navigate('GroupDetail', {groupId: item.id})}>
        <Text>{item.name}</Text>
      </TouchableOpacity>
    )}
  />
</Card>
```

### 2. Payment Screen
**Location**: `src/screens/payment/PaymentScreen.tsx`

**Web Reference**: `src/pages/payment/page.tsx`

**Key Features to Implement**:
- Group selection (use Picker or custom dropdown)
- Amount input with currency formatting
- Payment method selection (radio buttons)
- Form validation
- Integration with payment API

**Components Needed**:
- Custom Picker component
- Currency input component
- Radio button group

### 3. Profile Screen
**Location**: `src/screens/profile/ProfileScreen.tsx`

**Web Reference**: `src/pages/profile/page.tsx`

**Key Features**:
- Profile image with image picker
- Edit profile form
- Settings sections
- Modal components for edit forms

**Libraries Needed**:
- `react-native-image-picker` for photo selection
- Modal component for overlays

### 4. Banking Screen
**Location**: `src/screens/banking/BankingScreen.tsx`

**Web Reference**: `src/pages/banking/page.tsx`

**Key Features**:
- Tab navigation (Overview, Accounts, Transactions, Services)
- Account cards
- Transaction lists
- Forms for transfers, deposits, withdrawals

**Components Needed**:
- Tab component or use React Navigation tabs
- Transaction list item component
- Form modals

## Common Conversion Patterns

### 1. HTML Elements to React Native

| Web | React Native |
|-----|--------------|
| `<div>` | `<View>` |
| `<span>`, `<p>` | `<Text>` |
| `<button>` | `<TouchableOpacity>` or `<Button>` |
| `<input>` | `<TextInput>` or `<Input>` component |
| `<img>` | `<Image>` |
| `<ul>`, `<li>` | `<FlatList>` or `<ScrollView>` with `<View>` |
| `<a>` | `<TouchableOpacity>` with `navigation.navigate()` |

### 2. Styling Conversion

**Web (Tailwind)**:
```tsx
<div className="bg-white rounded-2xl p-6 shadow-sm">
```

**React Native**:
```tsx
<View style={styles.card}>
// styles.ts
const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.text.white,
    borderRadius: borderRadius.lg,
    padding: spacing.md,
    shadowColor: colors.gray[900],
    shadowOffset: {width: 0, height: 1},
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
});
```

### 3. Navigation

**Web**:
```tsx
const navigate = useNavigate();
navigate('/payment', {state: {groupId: '1'}});
```

**React Native**:
```tsx
const navigation = useNavigation();
navigation.navigate('Payment', {groupId: '1'});
```

### 4. Icons

**Web**:
```tsx
<i className="ri-user-line"></i>
```

**React Native**:
```tsx
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
<Icon name="account-outline" size={24} color={colors.primary[600]} />
```

### 5. Forms and Inputs

**Web**:
```tsx
<input
  type="email"
  value={email}
  onChange={(e) => setEmail(e.target.value)}
/>
```

**React Native**:
```tsx
<Input
  label="Email"
  value={email}
  onChangeText={setEmail}
  keyboardType="email-address"
/>
```

### 6. Modals

**Web**:
```tsx
{showModal && (
  <div className="fixed inset-0 bg-black/50">
    <div className="bg-white rounded-2xl">...</div>
  </div>
)}
```

**React Native**:
```tsx
import {Modal} from 'react-native';

<Modal
  visible={showModal}
  transparent
  animationType="slide">
  <View style={styles.modalOverlay}>
    <View style={styles.modalContent}>...</View>
  </View>
</Modal>
```

### 7. Lists

**Web**:
```tsx
{items.map(item => (
  <div key={item.id}>{item.name}</div>
))}
```

**React Native**:
```tsx
<FlatList
  data={items}
  keyExtractor={item => item.id}
  renderItem={({item}) => <Text>{item.name}</Text>}
/>
```

## Platform-Specific Considerations

### iOS
- Safe area handling (use `SafeAreaView` or `react-native-safe-area-context`)
- Status bar styling
- Keyboard avoiding views
- Image picker permissions

### Android
- Back button handling
- Hardware back button navigation
- Status bar styling
- Permissions for camera/storage

## Testing Checklist

For each converted screen:
- [ ] Renders correctly on iOS
- [ ] Renders correctly on Android
- [ ] Navigation works
- [ ] Forms submit correctly
- [ ] Images load properly
- [ ] Lists scroll smoothly
- [ ] Modals display correctly
- [ ] Keyboard handling works
- [ ] Error states display
- [ ] Loading states display

## Performance Tips

1. **Use FlatList** for long lists instead of ScrollView with map
2. **Memoize components** with React.memo for expensive renders
3. **Use useCallback** for event handlers passed to children
4. **Optimize images** - use appropriate sizes and formats
5. **Lazy load** screens if using many routes

## Next Steps

1. Complete remaining screen implementations
2. Add error boundaries
3. Implement offline support
4. Add analytics
5. Set up CI/CD
6. Prepare for app store submission

## Resources

- [React Native Docs](https://reactnative.dev/docs/getting-started)
- [React Navigation](https://reactnavigation.org/docs/getting-started)
- [React Native Vector Icons](https://oblador.github.io/react-native-vector-icons/)

