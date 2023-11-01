import React from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';

const SettingsScreen = () => {
  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text>Settings Screen</Text>
      {
        <Text>could remove if needed, in case we want added functionality within the app</Text>
      }
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
