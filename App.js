import React, { useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import { AntDesign } from '@expo/vector-icons';

import HomeScreen from './navigation/screens/HomeScreen';
import SearchScreen from './navigation/screens/SearchScreen';
import ProfileScreen from './navigation/screens/ProfileScreen';
import SettingsScreen from './navigation/screens/SettingsScreen';
import SavedEntriesScreen from './navigation/screens/SavedEntriesScreen';

import LoginScreen from './navigation/screens/LoginScreen';
import RegisterScreen from './navigation/screens/RegisterScreen';

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

const App = () => {
  const [userLoggedIn, setUserLoggedIn] = useState(false);

  return (
    <NavigationContainer>
      {userLoggedIn ? (
        <Tab.Navigator initialRouteName="Search" screenOptions={{ headerShown: false }}>
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
      ) : (
        <Stack.Navigator initialRouteName="Home" screenOptions={{ headerShown: false }}>
          <Stack.Screen name="Home">
          {props => <HomeScreen {...props} setUserLoggedIn={setUserLoggedIn} />}
        </Stack.Screen>
          <Stack.Screen name="Login" component={LoginScreen} />
          <Stack.Screen name="Register" component={RegisterScreen} />
        </Stack.Navigator>
      )}
    </NavigationContainer>
  );
};

export default App;