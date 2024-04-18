import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, StyleSheet, ActivityIndicator, Button, TouchableOpacity, Dimensions, Image, Modal, TouchableWithoutFeedback } from 'react-native';
import CalendarPicker from 'react-native-calendar-picker';
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';
import { FontAwesome5 } from '@expo/vector-icons';
import moment from 'moment';
import axios from 'axios';

const FlightSearch = () => {
  const [loading, setLoading] = useState(false);
  const [flights, setFlights] = useState([]);
  const [departureDate, setDepartureDate] = useState(new Date().toISOString().split('T')[0]);
  const [arrivalDate, setArrivalDate] = useState(new Date().toISOString().split('T')[0]);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [departureCalendarVisible, setDepartureCalendarVisible] = useState(false);
  const [arrivalCalendarVisible, setArrivalCalendarVisible] = useState(false);
  const [cardWidth, setCardWidth] = useState(null);
  const [departurePlaceId, setDeparturePlaceId] = useState('');
  const [arrivalPlaceId, setArrivalPlaceId] = useState('');
  const [departureAirportOptions, setDepartureAirportOptions] = useState([]);
  const [arrivalAirportOptions, setArrivalAirportOptions] = useState([]);

  useEffect(() => {
    const screenWidth = Dimensions.get('window').width;
    const calculatedCardWidth = screenWidth * 0.80;
    setCardWidth(calculatedCardWidth);
  }, []);

  // Function to retrieve nearby airports based on coordinates
  const getNearbyAirports = async (latitude, longitude) => {
    try {
      const response = await axios.get(`https://example.com/api/airports?lat=${latitude}&lng=${longitude}&radius=50`);
      return response.data.airports;
    } catch (error) {
      console.error('Error fetching nearby airports:', error);
      return [];
    }
  };

  // Function to search for flights
  const searchFlights = async () => {
    setLoading(true);
    setFlights([]); // Resetting flights to empty array
    
    try {
      // Construct the API request to SERP API for Google Flights
      const response = await axios.get('https://serpapi.com/search', {
        params: {
          api_key: '32a22720e066e5d948a13183ce32715e8008f02c3cb67ced3b623ef2e02e9175',
          engine: 'google_flights',
          departure_id: "JFK",
          arrival_id: "LHR",
          currency: 'USD',
          outbound_date: "2024-04-29",
          return_date: "2024-04-30",
          // Add additional parameters if needed
        }
      });
  
      // Log the entire response to diagnose the issue
      console.log('Flight search response:', response.data);
  
      // Extract flight data from the response and update state
      const bestFlights = response.data.best_flights || []; // Default to an empty array if best_flights is not present
      const otherFlights = response.data.other_flights || []; // Default to an empty array if other_flights is not present
      const allFlights = [...bestFlights, ...otherFlights]; // Combine best_flights and other_flights
      setFlights(allFlights); // Assuming response.data is the correct structure
    } catch (error) {
      console.error('Error fetching flights:', error);
    }
    setLoading(false);
  };

  const handleDepartureSelection = async (data, details = null) => {
    setDeparturePlaceId(details.place_id);
    const { lat, lng } = details.geometry.location;
    const airports = await getNearbyAirports(lat, lng);
    setDepartureAirportOptions(airports);
  };
  
  const handleArrivalSelection = async (data, details = null) => {
    setArrivalPlaceId(details.place_id);
    const { lat, lng } = details.geometry.location;
    const airports = await getNearbyAirports(lat, lng);
    setArrivalAirportOptions(airports);
  };

  // Flight card rendering function
  const renderFlightCard = ({ item }) => (
    <TouchableOpacity onPress={() => goToFlightDetails(item.departure_token)}>
      <View style={[styles.cardContainer , {width: cardWidth}]}>
        <View style={styles.card}>
          <Image
            source={{ uri: item.airline_logo }}
            style={styles.cardImage}
            resizeMode="cover"
          />
          <View style={styles.cardContent}>
            <Text style={styles.cardText}>Airline: {item.flights[0].airline}</Text>
            <Text style={styles.cardText}>Flight Number: {item.flights[0].flight_number}</Text>
            <Text style={styles.cardText}>Departure Airport: {item.flights[0].departure_airport.name}</Text>
            <Text style={styles.cardText}>Departure Time: {moment(item.flights[0].departure_airport.time).format('YYYY-MM-DD HH:mm')}</Text>
            <Text style={styles.cardText}>Arrival Airport: {item.flights[0].arrival_airport.name}</Text>
            <Text style={styles.cardText}>Arrival Time: {moment(item.flights[0].arrival_airport.time).format('YYYY-MM-DD HH:mm')}</Text>
            <Text style={styles.cardText}>Duration: {item.total_duration} minutes</Text>
            <Text style={styles.cardText}>Airplane: {item.flights[0].airplane}</Text>
            <Text style={styles.cardText}>Travel Class: {item.flights[0].travel_class}</Text>
            <Text style={styles.cardText}>Price: ${item.price}</Text>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
  

  return (
    <View style={styles.container}>
      {/* Departure and Arrival Section */}
      <View style={styles.topSection}>
        {/* Departure */}
        <View style={styles.locationContainer}>
          <GooglePlacesAutocomplete
            placeholder="Departure Airport"
            onPress={handleDepartureSelection}
            query={{
              key: 'AIzaSyD_04TRnFkDE5khuHI75Cw7dzpbiuq_oGQ',
              language: 'en',
              types: '(airport)',
            }}
            styles={{
              textInputContainer: styles.autocompleteContainer,
              textInput: styles.autocompleteInput,
            }}
          />
        </View>
        {/* Arrival */}
        <View style={styles.locationContainer}>
          <GooglePlacesAutocomplete
            placeholder="Arrival Airport"
            onPress={handleArrivalSelection}
            query={{
              key: 'AIzaSyD_04TRnFkDE5khuHI75Cw7dzpbiuq_oGQ',
              language: 'en',
              types: '(airport)',
            }}
            styles={{
              textInputContainer: styles.autocompleteContainer,
              textInput: styles.autocompleteInput,
            }}
          />
        </View>
      </View>

      {/* Display selected departure and arrival dates */}
      <View style={styles.dateContainer}>
        <View style={styles.dateItem}>
          <Text style={styles.selectedDateText}>
            Departure Date: {moment(departureDate).format('MMMM DD, YYYY')}
          </Text>
          <TouchableOpacity onPress={() => setDepartureCalendarVisible(true)}>
            <FontAwesome5 name="calendar" size={20} color="black" />
          </TouchableOpacity>
        </View>
        <View style={styles.dateItem}>
          <Text style={styles.selectedDateText}>
            Arrival Date: {moment(arrivalDate).format('MMMM DD, YYYY')}
          </Text>
          <TouchableOpacity onPress={() => setArrivalCalendarVisible(true)}>
            <FontAwesome5 name="calendar" size={20} color="black" />
          </TouchableOpacity>
        </View>
      </View>
      
      {/* Search Button */}
      <Button title="Search Flights" onPress={searchFlights} />
  
      {/* Flight results section */}
      <FlatList
        data={flights}
        renderItem={renderFlightCard}
        keyExtractor={(item, index) => index.toString()}
        contentContainerStyle={styles.flatListContainer}
        horizontal={false} // Restrict scrolling to vertical movement
      />
  
      {/* Loading Indicator */}
      {loading && (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#0000ff" />
        </View>
      )}

      {/* Departure Calendar modal */}
      <Modal
        visible={departureCalendarVisible}
        animationType="fade"
        transparent={true}
        onRequestClose={() => setDepartureCalendarVisible(false)}
      >
        {/* Calendar content */}
        <TouchableWithoutFeedback onPress={() => setDepartureCalendarVisible(false)}>
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
              <CalendarPicker
                minDate={new Date()} // Prevent selecting dates before today
                onDateChange={(date) => {
                  setSelectedDate(date);
                  const formattedDate = date.toISOString().split('T')[0]; // Formats the date as YYYY-MM-DD
                  setDepartureDate(formattedDate);
                  if (moment(date).isAfter(arrivalDate)) {
                    setArrivalDate(formattedDate);
                  }
                  setDepartureCalendarVisible(false);
                }}
                width={300}
                height={400}
              />
            </View>
          </View>
        </TouchableWithoutFeedback>
      </Modal>

      {/* Arrival Calendar modal */}
      <Modal
        visible={arrivalCalendarVisible}
        animationType="fade"
        transparent={true}
        onRequestClose={() => setArrivalCalendarVisible(false)}
      >
        {/* Calendar content */}
        <TouchableWithoutFeedback onPress={() => setArrivalCalendarVisible(false)}>
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
              <CalendarPicker
                minDate={new Date()} // Prevent selecting dates before today
                onDateChange={(date) => {
                  setSelectedDate(date);
                  const formattedDate = date.toISOString().split('T')[0]; // Formats the date as YYYY-MM-DD
                  setArrivalDate(formattedDate);
                  if (moment(date).isBefore(departureDate)) {
                    setDepartureDate(formattedDate);
                  }
                  setArrivalCalendarVisible(false);
                }}
                width={300}
                height={400}
              />
            </View>
          </View>
        </TouchableWithoutFeedback>
      </Modal>
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
  topSection: {
    flexDirection: 'row', // Change to horizontal layout
    flexWrap: 'wrap', // Allow content to wrap to the next line if needed
    marginBottom: 20,
    alignItems: 'center',
    justifyContent: 'space-between', // Distribute items evenly along the main axis
  },
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center', // Align items in the center horizontally
    marginBottom: 10,
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
  dateItem: {
    flexDirection: 'row', // Arrange text and icon horizontally
    alignItems: 'center',
    justifyContent: 'center', // Align items in the center horizontally
    paddingBottom: 20,
  },
  selectedDateText: {
    fontSize: 16,
    textAlign: 'center', // Center the text
    marginRight: 10, // Add margin to separate text and icon
  },
  modalContent: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 20,
    width: '80%',
    maxHeight: '80%',
  },
  flatListContainer: {
    flexGrow: 1,
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  cardContainer: {
    marginVertical: 8,
    justifyContent: 'center',
    alignSelf: 'stretch', // Make card container take full width
  },
  card: {
    flexDirection: 'row', // Arrange image and content horizontally
    padding: 8,
    backgroundColor: '#f9f9f9',
    borderColor: '#ddd',
    borderWidth: 1,
    borderRadius: 8,
  },
  cardContent: {
    flex: 1, // Take remaining space
    justifyContent: 'center',
    marginLeft: 8, // Add margin between image and content
  },
  cardText: {
    fontSize: 14, // Decrease font size for a more compact look
    marginBottom: 4, // Reduce margin between text lines
  },
  cardImage: {
    width: 100, // Set a fixed width for the image
    height: 100, // Set a fixed height for the image
    borderRadius: 8,
  },
  autocompleteContainer: {
    width: '100%',
  },
  autocompleteInput: {
    height: 40,
    borderWidth: 1,
    borderColor: '#ccc',
    paddingHorizontal: 10,
  },
  dateContainer: {
    marginBottom: 20,
  },
});

export default FlightSearch;
