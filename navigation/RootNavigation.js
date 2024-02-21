import React, { useState, useEffect } from 'react';
import { ActivityIndicator, View, LogBox } from 'react-native';
import { useAuthentication } from '../services/useAuthentication.js';
import UserStack from './UserStack';
import LoginStack from './LoginStack';

export default function RootNavigation() 
{
  LogBox.ignoreLogs(['Warning: ...']); // Ignore log notification by message DEBUG
  LogBox.ignoreAllLogs(); //Ignore all log notifications DEBUG

  const { user } = useAuthentication();
  const [loading, setLoading] = useState(true);

  useEffect(() => {

    const authenticationCheck = async () => {
      await new Promise((resolve) => setTimeout(resolve, 1000));

      setLoading(false);
    };

    authenticationCheck();
  }, []);

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  return user ? <UserStack /> : <LoginStack />;
}
