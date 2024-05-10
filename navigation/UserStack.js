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
import MapScreen from './screens/MapScreen';

import FlightScreen from './screens/FlightScreen';
import FlightDetails from './screens/FlightDetails';

import HotelScreen from './screens/HotelScreen';
import HotelDetails from './screens/HotelDetails';

// Import screens for search stack
import SearchScreen from './search/SearchScreen';

// Import screens for saved data stack
import SavedEntriesScreen from './savedEntries/SavedEntriesScreen';
import ChatLogDetails from './savedEntries/ChatLogDetails';
import HotelLogDetails from './savedEntries/HotelLogDetails';


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
      <Stack.Screen name="ChatLogDetails" component={ChatLogDetails} options={{ title: '', }} />
      <Stack.Screen name="HotelLogDetails" component={HotelLogDetails} options={{ title: '', }} />
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
// Map Screen
const MapScreenStack = () => {
  return (
    <Stack.Navigator screenOptions={{ animationEnabled: true, gestureEnabled: true, gestureDirection: 'horizontal' }}>
      <Stack.Screen name="MapScreen" component={MapScreen} options={{ headerLeft: () => null, title: '', }} />

    </Stack.Navigator>
  );
};
// Screeen for flights
const FlightScreenStack = () => {
  return (
    <Stack.Navigator screenOptions={{ animationEnabled: true, gestureEnabled: true, gestureDirection: 'horizontal' }}>
      <Stack.Screen name="Flights" component={FlightScreen} options={{ headerLeft: () => null, title: '', }} />
      <Stack.Screen name="FlightDetails" component={FlightDetails} options={{ title: '', }} />
    </Stack.Navigator>
  );
};
// Screeen for hotels
const HotelScreenStack = () => {
  return (
    <Stack.Navigator screenOptions={{ animationEnabled: true, gestureEnabled: true, gestureDirection: 'horizontal' }}>
      <Stack.Screen name="Hotels" component={HotelScreen} options={{ headerLeft: () => null, title: '', }} />
      <Stack.Screen name="HotelDetails" component={HotelDetails} options={{ title: '', }} />
    </Stack.Navigator>
  );
};
export default function UserStack() {
  return (
    <React.Fragment>
      <StatusBar barStyle="dark-content" />
      <NavigationContainer>
        <Tab.Navigator initialRouteName="SearchStack" screenOptions={{ headerShown: false, animationEnabled: true , tabBarActiveTintColor: 'dodgerblue', tabBarInactiveTintColor: 'grey',}}>
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
          {
            <Tab.Screen
              name="MapScreenStack"
              component={MapScreenStack}
              options={{
                tabBarShowLabel:false, tabBarIcon: ({ color, size }) => (
                  <FontAwesome5 name="map" size={size} color={color} solid={false} />
                ),
              }}
            />
          }
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
            name="HotelScreenStack"
            component={HotelScreenStack}
            options={{
              tabBarShowLabel: false, tabBarIcon: ({ color, size }) => (
                <AntDesign name="home" size={size} color={color} />
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
        </Tab.Navigator>
      </NavigationContainer>
    </React.Fragment>
  );
}