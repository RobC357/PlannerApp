import React from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';

const SearchScreen = () => {
  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text>Search Screen</Text>
      {
        <Text>maybe have a built in stack in here for the gpt queries</Text>
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

export default SearchScreen;
