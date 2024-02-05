import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { AntDesign } from '@expo/vector-icons';
import { StatusBar, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

// Import screens for landing page
import LandingPageScreen from './authentication/LandingPageScreen';
import LoginScreen from './authentication/LoginScreen';
import RegisterScreen from './authentication/RegisterScreen';

const Stack = createStackNavigator();

export default function LoginStack() {
  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false, animationEnabled: true}}>
        <Stack.Screen name="LandingPage" component={LandingPageScreen} />
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="Register" component={RegisterScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}