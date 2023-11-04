import React from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';

const SavedEntriesScreen = () => {
  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text>Saved Entries Screen (where you store saved responses from gpt) </Text>

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
