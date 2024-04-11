import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, StyleSheet, ActivityIndicator, TextInput, Button, TouchableOpacity, Dimensions, Image, Modal, TouchableWithoutFeedback } from 'react-native';
import CalendarPicker from 'react-native-calendar-picker';
import { useNavigation } from '@react-navigation/native';
import moment from 'moment';
import axios from 'axios';

const FlightSearch = ({ navigation }) => {
  const [loading, setLoading] = useState(false);
  const [flights, setFlights] = useState([]);
  const [location, setLocation] = useState('');
  const [departureDate, setDepartureDate] = useState(new Date().toISOString().split('T')[0]);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [cardWidth, setCardWidth] = useState(null);
  const [calendarVisible, setCalendarVisible] = useState(false);

  useEffect(() => {
    const screenWidth = Dimensions.get('window').width;
    const calculatedCardWidth = (screenWidth - 80) / 2;
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
    setFlights([]); // Resetting flights to empty array
    
    try {
      const options = {
        method: 'GET',
        url: 'https://skyscanner80.p.rapidapi.com/api/v1/flights/search-everywhere',
        params: {
          fromId: 'eyJzIjoiVFlPQSIsImUiOiIyNzU0MjA4OSIsImgiOiIyNzU0MjA4OSIsInAiOiJDSVRZIn0=',
          departDate: moment(departureDate).format('YYYY-MM-DD'),
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
      setFlights(response.data.data.everywhereDestination.results);
    } catch (error) {
      console.error('Error fetching flights:', error);
    }
    setLoading(false);
  };

  const goToFlightDetails = (id, name, uri, departureDate) => {
    navigation.navigate('FlightSearch', { id, name, uri, departureDate });
  };

  const renderFlightCard = ({ item }) => (
    <TouchableOpacity onPress={() => goToFlightDetails(item.content.location.id, item.content.location.name, item.content.image.url)}>
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
      <TouchableOpacity onPress={() => setCalendarVisible(true)}>
        <Text style={styles.calendarButton}>Select Departure Date</Text>
      </TouchableOpacity>
      {departureDate && (
        <Text style={styles.selectedDateText}>
          Selected Date: {moment(departureDate).format('MMMM DD, YYYY')}
        </Text>
      )}
      <Modal
        visible={calendarVisible}
        animationType="fade"
        transparent={true}
        onRequestClose={() => setCalendarVisible(false)}
      >
        <TouchableWithoutFeedback onPress={() => setCalendarVisible(false)}>
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
              <CalendarPicker
                onDateChange={(date) => {
                  setSelectedDate(date);
                  const formattedDate = date.toISOString().split('T')[0]; // Formats the date as YYYY-MM-DD
                  console.log(formattedDate);
                  setDepartureDate(formattedDate);
                  setCalendarVisible(false);
                }}
                width={300}
                height={400}
              />
            </View>
          </View>
        </TouchableWithoutFeedback>
      </Modal>
      <Button title="Search Flights" onPress={searchFlights} />
      <View style={styles.listContainer}>
        {loading && (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#0000ff" />
          </View>
        )}
        <FlatList
          data={flights.sort((a, b) => (a.content.location.name > b.content.location.name) ? 1 : -1)}
          renderItem={renderFlightCard}
          keyExtractor={(item, index) => index.toString()}
          numColumns={2}
          contentContainerStyle={styles.flatListContainer}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  listContainer: {
    flex: 1,
    width: '100%',
  },
  loadingContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
  },
  input: {
    width: '100%',
    height: 40,
    borderWidth: 1,
    borderColor: '#ccc',
    marginBottom: 10,
    paddingHorizontal: 10,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  calendarButton: {
    fontSize: 18,
    color: 'blue',
    marginBottom: 10,
  },
  selectedDateText: {
    fontSize: 16,
    marginBottom: 10,
  },
  modalContent: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 20,
    width: '80%',
    maxHeight: '80%',
  },
  flatListContainer: {
    padding: 8,
    flexGrow: 1,
    alignItems: 'center',
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