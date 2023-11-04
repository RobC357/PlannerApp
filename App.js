// Imports
import React, { useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import { AntDesign } from '@expo/vector-icons';
import { StatusBar, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

// Import screens for landing page
import LandingPageScreen from './navigation/authentication/LandingPageScreen';
import LoginScreen from './navigation/authentication/LoginScreen';
import RegisterScreen from './navigation/authentication/RegisterScreen';

// Import screens for standalone screens
import ProfileScreen from './navigation/screens/ProfileScreen';
import SettingsScreen from './navigation/screens/SettingsScreen';

// Import screens for search stack
import SearchScreen from './navigation/search/SearchScreen';


// Import screens for saved data stack
import SavedEntriesScreen from './navigation/savedEntries/SavedEntriesScreen';


// Navigation stack and tab creation
const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

// ******************************** STACK SCREEN AREA *************************************

// Create the search stack
const SearchStack = () => {
  return (
    <Stack.Navigator screenOptions={{ animationEnabled: true, gestureEnabled: true, gestureDirection: 'horizontal' }}>
      <Stack.Screen name="Search" component={SearchScreen} options={{ headerLeft: () => null, title: '',}}/>
      
    </Stack.Navigator>
  );
};
// Create the data stack
const SavedEntriesStack = () => {
  return (
    <Stack.Navigator screenOptions={{ animationEnabled: true, gestureEnabled: true, gestureDirection: 'horizontal' }}>
      <Stack.Screen name="SavedEntries" component={SavedEntriesScreen} options={{ headerLeft: () => null, title: '',}}/>

    </Stack.Navigator>
  );
};
// Create the profile stack (for consistency)
const ProfileScreenStack = () => {
  return (
    <Stack.Navigator screenOptions={{ animationEnabled: true, gestureEnabled: true, gestureDirection: 'horizontal' }}>
      <Stack.Screen name="Profile" component={ProfileScreen} options={{ headerLeft: () => null, title: '',}}/>

    </Stack.Navigator>
  );
};
// Create the settings stack (for consistency)
const SettingsScreenStack = () => {
  return (
    <Stack.Navigator screenOptions={{ animationEnabled: true, gestureEnabled: true, gestureDirection: 'horizontal' }}>
      <Stack.Screen name="Settings" component={SettingsScreen} options={{ headerLeft: () => null, title: '',}}/>

    </Stack.Navigator>
  );
};

// App
const App = () => {
  const [userLoggedIn, setUserLoggedIn] = useState(false);

  return ( //  ************************** SAFE VIEW AND STATUSBAR ONLY WORK ON MOBILE. USING THIS ON WEB SHOWS NOTHING **************************
    //<SafeAreaView style={{ flex: 1 }}>
    //<StatusBar hidden={false} barStyle={'dark-content'} />
    <NavigationContainer>
      {userLoggedIn ? (
        <Tab.Navigator initialRouteName="SearchStack" screenOptions={{ headerShown: false }}>
          <Tab.Screen
            name="SearchStack"
            component={SearchStack}
            options={{
              tabBarShowLabel:false, tabBarIcon: ({ color, size }) => (
                <AntDesign name="search1" size={size} color={color} />
              ),
            }}
          />
          <Tab.Screen
            name="SavedEntriesStack"
            component={SavedEntriesStack}
            options={{
              tabBarShowLabel:false, tabBarIcon: ({ color, size }) => (
                <AntDesign name="book" size={size} color={color} />
              ),
            }}
          />
          <Tab.Screen
            name="ProfileScreenStack"
            component={ProfileScreenStack}
            options={{
              tabBarShowLabel:false, tabBarIcon: ({ color, size }) => (
                <AntDesign name="user" size={size} color={color} />
              ),
            }}
          />
          <Tab.Screen
            name="SettingsScreenStack"
            component={SettingsScreenStack}
            options={{
              tabBarShowLabel:false, tabBarIcon: ({ color, size }) => (
                <AntDesign name="setting" size={size} color={color} />
              ),
            }}
          />
        </Tab.Navigator>
      ) : (
        <Stack.Navigator initialRouteName="LandingPage" screenOptions={{ headerShown: false, animationEnabled: true}}>
          <Stack.Screen name="LandingPage">
          {props => <LandingPageScreen {...props} setUserLoggedIn={setUserLoggedIn} />}
        </Stack.Screen>
          <Stack.Screen name="Login" component={LoginScreen} />
          <Stack.Screen name="Register" component={RegisterScreen} />
        </Stack.Navigator>
      )}
    </NavigationContainer>
  //</SafeAreaView>
  );
};

export default App;