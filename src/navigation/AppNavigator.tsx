import React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

// Screens
import LoginScreen from '../screens/auth/LoginScreen';
import RegisterScreen from '../screens/auth/RegisterScreen';
import HomeScreen from '../screens/home/HomeScreen';
import GroupsScreen from '../screens/groups/GroupsScreen';
import GroupDetailScreen from '../screens/groups/GroupDetailScreen';
import CreateGroupScreen from '../screens/groups/CreateGroupScreen';
import PaymentScreen from '../screens/payment/PaymentScreen';
import ProfileScreen from '../screens/profile/ProfileScreen';
import BankingScreen from '../screens/banking/BankingScreen';
import NotificationsScreen from '../screens/notifications/NotificationsScreen';
import AdminScreen from '../screens/admin/AdminScreen';
import LoadingScreen from '../components/LoadingScreen';

import {colors} from '../theme/colors';
import {useAuthStore} from '../stores';
import {initializeAuth} from '../utils/authHelpers';
import {deepLinkingService, DeepLinkData} from '../services/deepLinking/deepLinkingService';

export type RootStackParamList = {
  Auth: undefined;
  Main: undefined;
  Login: undefined;
  Register: undefined;
  GroupDetail: {groupId: string};
  CreateGroup: undefined;
  Payment: {groupId?: string; groupName?: string; monthlyContribution?: number};
  Admin: {groupId: string};
};

export type MainTabParamList = {
  Home: undefined;
  Groups: undefined;
  History: undefined;
};

const Stack = createStackNavigator<RootStackParamList>();
const Tab = createBottomTabNavigator<MainTabParamList>();

// Main Tab Navigator
function MainTabs() {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: colors.primary[600],
        tabBarInactiveTintColor: colors.gray[500],
        tabBarStyle: {
          borderTopWidth: 1,
          borderTopColor: colors.gray[200],
          paddingBottom: 8,
          paddingTop: 8,
          height: 60,
        },
      }}>
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{
          tabBarLabel: 'Home',
          tabBarIcon: ({color, size}) => (
            <Icon name="view-dashboard" size={size} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="Groups"
        component={GroupsScreen}
        options={{
          tabBarLabel: 'Groups',
          tabBarIcon: ({color, size}) => (
            <Icon name="account-group" size={size} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="History"
        component={HomeScreen} // Using HomeScreen with history tab for now
        options={{
          tabBarLabel: 'History',
          tabBarIcon: ({color, size}) => (
            <Icon name="history" size={size} color={color} />
          ),
        }}
      />
    </Tab.Navigator>
  );
}

// Root Navigator
export default function AppNavigator() {
  const {isAuthenticated, isLoading} = useAuthStore();
  const navigationRef = React.useRef<any>(null);

  React.useEffect(() => {
    // Only initialize auth once on mount, not when isAuthenticated changes
    initializeAuth();
    deepLinkingService.initialize();

    // Listen for deep links
    const unsubscribe = deepLinkingService.addListener((data: DeepLinkData) => {
      handleDeepLink(data);
    });

    return unsubscribe;
  }, []); // Empty dependency array - only run once

  const handleDeepLink = (data: DeepLinkData) => {
    if (!navigationRef.current) {
      return;
    }

    const navigation = navigationRef.current;

    try {
      switch (data.screen) {
        case 'GroupDetail':
          if (data.params?.groupId) {
            navigation.navigate('GroupDetail', {groupId: data.params.groupId});
          }
          break;
        case 'CreateGroup':
          navigation.navigate('CreateGroup');
          break;
        case 'Payment':
          navigation.navigate('Payment', {
            groupId: data.params?.groupId,
            groupName: data.params?.groupName,
            monthlyContribution: data.params?.monthlyContribution,
          });
          break;
        case 'Profile':
          navigation.navigate('Profile');
          break;
        case 'Notifications':
          navigation.navigate('Notifications');
          break;
        case 'Groups':
          navigation.navigate('Main', {screen: 'Groups'});
          break;
        case 'Home':
          navigation.navigate('Main', {screen: 'Home'});
          break;
        default:
          navigation.navigate('Main', {screen: 'Home'});
      }
    } catch (error) {
      console.error('Error handling deep link navigation', error);
    }
  };

  if (isLoading) {
    return <LoadingScreen />;
  }

  // Deep linking configuration
  const linking = {
    prefixes: ['esusuhub://', 'https://esusuhub.com', 'https://www.esusuhub.com'],
    config: {
      screens: {
        Main: {
          screens: {
            Home: 'home',
            Groups: 'groups',
            History: 'history',
          },
        },
        GroupDetail: 'group/:groupId',
        CreateGroup: 'groups/create',
        Payment: 'payment',
        Profile: 'profile',
        Notifications: 'notifications',
        Login: 'login',
        Register: 'register',
      },
    },
  };

  return (
    <NavigationContainer ref={navigationRef} linking={linking}>
      <Stack.Navigator
        screenOptions={{
          headerShown: false,
          cardStyle: {backgroundColor: colors.background.light},
        }}>
        {!isAuthenticated ? (
          <>
            <Stack.Screen name="Login" component={LoginScreen} />
            <Stack.Screen name="Register" component={RegisterScreen} />
          </>
        ) : (
          <>
            <Stack.Screen name="Main" component={MainTabs} />
            <Stack.Screen
              name="GroupDetail"
              component={GroupDetailScreen}
              options={{
                headerShown: true,
                title: 'Group Details',
                headerStyle: {
                  backgroundColor: colors.primary[600],
                },
                headerTintColor: colors.text.white,
              }}
            />
            <Stack.Screen
              name="CreateGroup"
              component={CreateGroupScreen}
              options={{
                headerShown: true,
                title: 'Create Group',
                headerStyle: {
                  backgroundColor: colors.primary[600],
                },
                headerTintColor: colors.text.white,
              }}
            />
            <Stack.Screen
              name="Payment"
              component={PaymentScreen}
              options={{
                headerShown: true,
                title: 'Make Payment',
                headerStyle: {
                  backgroundColor: colors.primary[600],
                },
                headerTintColor: colors.text.white,
              }}
            />
            <Stack.Screen
              name="Profile"
              component={ProfileScreen}
              options={{
                headerShown: true,
                title: 'Profile',
                headerStyle: {
                  backgroundColor: colors.primary[600],
                },
                headerTintColor: colors.text.white,
              }}
            />
            <Stack.Screen
              name="Banking"
              component={BankingScreen}
              options={{
                headerShown: true,
                title: 'EsusuBank',
                headerStyle: {
                  backgroundColor: colors.blue[600],
                },
                headerTintColor: colors.text.white,
              }}
            />
            <Stack.Screen
              name="Notifications"
              component={NotificationsScreen}
              options={{
                headerShown: true,
                title: 'Notifications',
                headerStyle: {
                  backgroundColor: colors.primary[600],
                },
                headerTintColor: colors.text.white,
              }}
            />
            <Stack.Screen
              name="Admin"
              component={AdminScreen}
              options={{
                headerShown: true,
                title: 'Group Admin',
                headerStyle: {
                  backgroundColor: colors.primary[600],
                },
                headerTintColor: colors.text.white,
              }}
            />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}

