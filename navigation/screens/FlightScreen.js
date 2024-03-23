import React, { useState } from 'react';
import { View, Text, ScrollView, StyleSheet, ActivityIndicator, TextInput, Button } from 'react-native';

const FlightSearch = () => {
  const [loading, setLoading] = useState(false);
  const [flights, setFlights] = useState([]);
  const [location, setLocation] = useState('');

  const searchFlights = async () => {
    setLoading(true);
    try {
      const response = await fetch(`https://your-api-url/search?location=${location}`);
      const data = await response.json();
      setFlights(data.flights);
    } catch (error) {
      console.error('Error fetching flights:', error);
    }
    setLoading(false);
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <TextInput
        style={styles.input}
        placeholder="Enter location"
        value={location}
        onChangeText={(text) => setLocation(text)}
      />
      <Button title="Search Flights" onPress={searchFlights} />
      {loading ? (
        <ActivityIndicator size="large" color="#0000ff" />
      ) : (
        <View>
          {flights.length > 0 ? (
            flights.map((flight) => (
              <Text key={flight.id}>{flight.time} - {flight.destination}</Text>
            ))
          ) : (
            <Text>No flights found</Text>
          )}
        </View>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 16,
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 16,
    paddingHorizontal: 8,
  },
});

export default FlightSearch;
