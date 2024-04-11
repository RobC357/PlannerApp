import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, StyleSheet, ActivityIndicator, TextInput, Button, TouchableOpacity, Dimensions, Image } from 'react-native';
import axios from 'axios';

const FlightSearch = ({ navigation }) => {
  const [loading, setLoading] = useState(false);
  const [flights, setFlights] = useState([]);
  const [location, setLocation] = useState('');
  const [departureDate, setDepartureDate] = useState(new Date().toISOString().split('T')[0]);
  const [cardWidth, setCardWidth] = useState(null);

  useEffect(() => {
    const screenWidth = Dimensions.get('window').width;
    const calculatedCardWidth = (screenWidth - 80) / 2; // Adjust the margin for cards
    setCardWidth(calculatedCardWidth);
  }, []);

  const grabLocation = async () => {
    try {
      const options = {
        method: 'GET',
        url: 'https://skyscanner80.p.rapidapi.com/api/v1/flights/auto-complete',
        params: {
          query: location,
          market: 'US',
          locale: 'en-US'
        },
        headers: {
          'X-RapidAPI-Key': 'c4ab59ba67msh30bf32c9634bce8p11773fjsnd9392a95ec11',
          'X-RapidAPI-Host': 'skyscanner80.p.rapidapi.com'
        }
      };
      
      const response = await axios.request(options);
      console.log(response.data);
    } catch (error) {
      console.error('Error fetching location:', error);
    }
  };

  const searchFlights = async () => {
    setLoading(true);
    try {
      const options = {
        method: 'GET',
        url: 'https://skyscanner80.p.rapidapi.com/api/v1/flights/search-everywhere',
        params: {
          fromId: 'eyJzIjoiVFlPQSIsImUiOiIyNzU0MjA4OSIsImgiOiIyNzU0MjA4OSIsInAiOiJDSVRZIn0=',
          departDate: departureDate,
          adults: '1',
          currency: 'USD',
          market: 'US',
          locale: 'en-US'
        },
        headers: {
          'X-RapidAPI-Key': 'c4ab59ba67msh30bf32c9634bce8p11773fjsnd9392a95ec11',
          'X-RapidAPI-Host': 'skyscanner80.p.rapidapi.com'
        }
      };
      
      const response = await axios.request(options);
      //console.log(response.data.data.everywhereDestination.results);
      setFlights(response.data.data.everywhereDestination.results);
    } catch (error) {
      console.error('Error fetching flights:', error);
    }
    setLoading(false);
  };

  const goToFlightDetails = (destination) => {
    navigation.navigate('FlightDetails', { destination });
  };

  const renderFlightCard = ({ item }) => (
    <TouchableOpacity onPress={() => goToFlightDetails(item)}>
      <View style={[styles.cardContainer, { width: cardWidth }]}>
        <View style={styles.card}>
          <Image
            source={{ uri: item.content.image.url }}
            style={styles.cardImage}
            resizeMode="cover"
          />
          <Text style={styles.cardText}>{item.content.location.name}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        placeholder="Departure Destination"
        value={location}
        onChangeText={(text) => setLocation(text)}
      />
      <TextInput
        style={styles.input}
        placeholder="Departure Date (YYYY-MM-DD)"
        value={departureDate}
        onChangeText={(text) => setDepartureDate(text)}
      />
      <Button title="Search Flights" onPress={searchFlights} />
      {loading ? (
        <ActivityIndicator size="large" color="#0000ff" />
      ) : (
        <FlatList
          data={flights.sort((a, b) => (a.content.location.name > b.content.location.name) ? 1 : -1)}
          renderItem={renderFlightCard}
          keyExtractor={(item, index) => index.toString()}
          numColumns={2}
          contentContainerStyle={styles.flatListContainer}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#fff',
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 16,
    paddingLeft: 8,
  },
  flatListContainer: {
    paddingHorizontal: 8, // Add horizontal padding to align cards properly
    justifyContent: 'center', // Center the content vertically
  },
  cardContainer: {
    height: 280,
    margin: 8,
    borderRadius: 8,
    overflow: 'hidden', // This will make sure the clickable area matches the card size
  },
  card: {
    flex: 1,
    padding: 8,
    backgroundColor: '#f9f9f9',
    borderColor: '#ddd',
    borderWidth: 1,
    borderRadius: 8,
    alignItems: 'center', // Center the content horizontally
  },
  cardText: {
    fontSize: 16,
    padding: 16,
    textAlign: 'center',
    marginBottom: 8, // Add margin bottom to separate the text from the image
  },
  cardImage: {
    width: '100%', 
    height: 200, // Set a fixed height for the image
    borderRadius: 8,
  },
});

export default FlightSearch;