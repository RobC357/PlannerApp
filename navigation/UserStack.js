import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { AntDesign } from '@expo/vector-icons';
import { FontAwesome5 } from '@expo/vector-icons';
import { StatusBar, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

// Import screens for standalone screens
import ProfileScreen from './screens/ProfileScreen';
import SettingsScreen from './screens/SettingsScreen';

import FlightScreen from './screens/FlightScreen';
import FlightSearch from './screens/FlightSearch';

// Import screens for search stack
import SearchScreen from './search/SearchScreen';

// Import screens for saved data stack
import SavedEntriesScreen from './savedEntries/SavedEntriesScreen';

import { useAuthentication } from '../services/useAuthentication.js';

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();


// Create the search stack
const SearchStack = () => {
  const { user } = useAuthentication();
  return (
    <Stack.Navigator screenOptions={{ animationEnabled: true, gestureEnabled: true, gestureDirection: 'horizontal' }}>
      <Stack.Screen name="Search" component={SearchScreen} options={{ headerLeft: () => null, title: '', }} />

    </Stack.Navigator>
  );
};
// Create the data stack
const SavedEntriesStack = () => {
  return (
    <Stack.Navigator screenOptions={{ animationEnabled: true, gestureEnabled: true, gestureDirection: 'horizontal' }}>
      <Stack.Screen name="SavedEntries" component={SavedEntriesScreen} options={{ headerLeft: () => null, title: '', }} />

    </Stack.Navigator>
  );
};
// Create the profile stack (for consistency)
const ProfileScreenStack = () => {
  return (
    <Stack.Navigator screenOptions={{ animationEnabled: true, gestureEnabled: true, gestureDirection: 'horizontal' }}>
      <Stack.Screen name="Profile" component={ProfileScreen} options={{ headerLeft: () => null, title: '', }} />

    </Stack.Navigator>
  );
};
// Defunct?
const SettingsScreenStack = () => {
  return (
    <Stack.Navigator screenOptions={{ animationEnabled: true, gestureEnabled: true, gestureDirection: 'horizontal' }}>
      <Stack.Screen name="Settings" component={SettingsScreen} options={{ headerLeft: () => null, title: '', }} />

    </Stack.Navigator>
  );
};
// Screeen for flights
const FlightScreenStack = () => {
  return (
    <Stack.Navigator screenOptions={{ animationEnabled: true, gestureEnabled: true, gestureDirection: 'horizontal' }}>
      <Stack.Screen name="Flights" component={FlightScreen} options={{ headerLeft: () => null, title: '', }} />
      <Stack.Screen name="FlightSearch" component={FlightSearch} options={{ title: '', }} />
    </Stack.Navigator>
  );
};
export default function UserStack() {
  return (
    <NavigationContainer>
      <Tab.Navigator initialRouteName="SearchStack" screenOptions={{ headerShown: false, animationEnabled: true }}>
        <Tab.Screen
          name="SearchStack"
          component={SearchStack}
          options={{
            tabBarShowLabel: false, tabBarIcon: ({ color, size }) => (
              <AntDesign name="search1" size={size} color={color} />
            ),
          }}
        />
        <Tab.Screen
          name="SavedEntriesStack"
          component={SavedEntriesStack}
          options={{
            tabBarShowLabel: false, tabBarIcon: ({ color, size }) => (
              <AntDesign name="book" size={size} color={color} />
            ),
          }}
        />
        <Tab.Screen
          name="FlightScreenStack"
          component={FlightScreenStack}
          options={{
            tabBarShowLabel: false,
            tabBarIcon: ({ color, size }) => (
              <FontAwesome5 name="plane" size={size} color={color} solid={false} />
            ),
          }}
        />
        <Tab.Screen
          name="ProfileScreenStack"
          component={ProfileScreenStack}
          options={{
            tabBarShowLabel: false, tabBarIcon: ({ color, size }) => (
              <AntDesign name="user" size={size} color={color} />
            ),
          }}
        />

        {/* Kinda defunct lets see for now
          <Tab.Screen
            name="SettingsScreenStack"
            component={SettingsScreenStack}
            options={{
              tabBarShowLabel:false, tabBarIcon: ({ color, size }) => (
                <AntDesign name="setting" size={size} color={color} />
              ),
            }}
          />
          */}
      </Tab.Navigator>
    </NavigationContainer>
  );
}