import * as React from 'react';
import { View, Text, useColorScheme } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import {Appearance} from 'react-native';
import { AntDesign } from '@expo/vector-icons';

import HomeScreen from './navigation/screens/HomeScreen';
import SearchScreen from './navigation/screens/SearchScreen';
import ProfileScreen from './navigation/screens/ProfileScreen';
import SettingsScreen from './navigation/screens/SettingsScreen';
import SavedEntriesScreen from './navigation/screens/SavedEntriesScreen';

const Tab = createBottomTabNavigator();

function App() {
  return (
    <NavigationContainer>
      <Tab.Navigator>
        <Tab.Screen
          name="Home"
          component={HomeScreen}
          options={{
            tabBarIcon: ({ color, size }) => (
              <AntDesign name="home" size={size} color={color} />
            ),
          }}
        />
        <Tab.Screen
          name="Search"
          component={SearchScreen}
          options={{
            tabBarIcon: ({ color, size }) => (
              <AntDesign name="search1" size={size} color={color} />
            ),
          }}
        />
        <Tab.Screen
          name="Saved Entries"
          component={SavedEntriesScreen}
          options={{
            tabBarIcon: ({ color, size }) => (
              <AntDesign name="book" size={size} color={color} />
            ),
          }}
        />
        <Tab.Screen
          name="Profile"
          component={ProfileScreen}
          options={{
            tabBarIcon: ({ color, size }) => (
              <AntDesign name="user" size={size} color={color} />
            ),
          }}
        />
        <Tab.Screen
          name="Settings"
          component={SettingsScreen}
          options={{
            tabBarIcon: ({ color, size }) => (
              <AntDesign name="setting" size={size} color={color} />
            ),
          }}
        />
      </Tab.Navigator>
    </NavigationContainer>
  );
}

export default App;