import React from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';

const SavedEntriesScreen = () => {
  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text>Saved Entries Screen</Text>
      {
        <Text>show the saved request from search here, maybe add stack to show more details?</Text>
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

export default SavedEntriesScreen;
