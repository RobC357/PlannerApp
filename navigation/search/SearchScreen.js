import React from 'react';
import { View, Text, ScrollView, Button, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';

const SearchScreen = () => {
 
  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text>Search Screen (where you do the gpt commands) </Text>

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