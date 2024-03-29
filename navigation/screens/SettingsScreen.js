import React from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';
import { Button } from 'react-native-elements';
import { getAuth, onAuthStateChanged } from 'firebase/auth';

const auth = getAuth();

const SettingsScreen = () => {
  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text>Settings Screen (maybe change some app settings here? like dark mode or other things.)
        {'\n'} Can remove if needed </Text>
        <Button title="Sign Out!" style={styles.button} onPress={() => auth.signOut()} />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default SettingsScreen;
