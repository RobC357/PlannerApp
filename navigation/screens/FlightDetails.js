import React, { useState, useEffect } from 'react';
import { View, Text, Button, StyleSheet, Image, Alert, ScrollView } from 'react-native';
import { FontAwesome5 } from '@expo/vector-icons';
import moment from 'moment';
import { getFirestore, collection, addDoc, query, where, getDocs } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';

const FlightDetails = ({ route }) => {
  const { flightDetails } = route.params || {};
  const [airportFontSize, setAirportFontSize] = useState(16);
  const [flightSaved, setFlightSaved] = useState(false);
  const firestore = getFirestore();
  const auth = getAuth();

  const departureTime = moment(flightDetails.flights[0].departure_airport.time).format('MMM D, YYYY h:mm A');
  const arrivalTime = moment(flightDetails.flights[0].arrival_airport.time).format('MMM D, YYYY h:mm A');

  useEffect(() => {
    const handleLayout = (event) => {
      const { width } = event.nativeEvent.layout;
      const fontSize = width >= 300 ? 16 : 14; // Adjust font size based on available width
      setAirportFontSize(fontSize);
      checkFlightSaved();
    };

    // Call handleLayout on mount and on layout changes
    handleLayout({ nativeEvent: { layout: { width: '100%' } } });
  }, []);

  const checkFlightSaved = async () => {
    try {
      const user = auth.currentUser;
      if (user) {
        const flightExistsQuery = query(collection(firestore, 'flights'), where('flight_number', '==', flightDetails.flights[0].flight_number), where('user_uid', '==', user.uid));
        const querySnapshot = await getDocs(flightExistsQuery);
        setFlightSaved(!querySnapshot.empty); // Update flightSaved based on whether the flight exists
      }
    } catch (error) {
      console.error('Error checking saved flight:', error);
    }
  };

  const saveFlight = async () => {
    try {
      const user = auth.currentUser;
      if (user) {
        const flightData = {
          airline: flightDetails.flights[0].airline,
          flight_number: flightDetails.flights[0].flight_number,
          duration: flightDetails.total_duration,
          airplane: flightDetails.flights[0].airplane,
          travel_class: flightDetails.flights[0].travel_class,
          price: flightDetails.price,
          departure_airport: flightDetails.flights[0].departure_airport.name,
          arrival_airport: flightDetails.flights[0].arrival_airport.name,
          departure_time: departureTime,
          arrival_time: arrivalTime,
          user_uid: user.uid,
          image_url: flightDetails.airline_logo,
          extensions: flightDetails.flights[0].extensions
        };
  
        const flightExistsQuery = query(collection(firestore, 'flights'), where('flight_number', '==', flightData.flight_number), where('user_uid', '==', user.uid));
        const querySnapshot = await getDocs(flightExistsQuery);
        if (!querySnapshot.empty) {
          Alert.alert('Info', 'Flight is already saved.');
          return;
        }
  
        await addDoc(collection(firestore, 'flights'), flightData);
        Alert.alert('Success', 'Flight saved successfully!');
      } else {
        Alert.alert('Error', 'User not authenticated. Please log in.');
      }
    } catch (error) {
      console.error('Error saving flight:', error);
      Alert.alert('Error', 'Failed to save flight. Please try again.');
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.scrollViewContent}>
      <View style={styles.container}>
        <View style={styles.imageContainer}>
          <Image
            source={{ uri: flightDetails.airline_logo }}
            style={styles.image}
            resizeMode="cover"
          />
        </View>
        <Text style={styles.title}>Flight Details</Text>
        <View style={styles.detailsContainer}>
          <View style={styles.infoContainer}>
            <FlightInfo label="Airline" value={flightDetails.flights[0].airline} />
            <FlightInfo label="Flight Number" value={flightDetails.flights[0].flight_number} />
            <FlightInfo label="Duration" value={`${flightDetails.total_duration} minutes`} />
            <FlightInfo label="Airplane" value={flightDetails.flights[0].airplane} />
            <FlightInfo label="Travel Class" value={flightDetails.flights[0].travel_class} />
            <FlightInfo label="Price" value={`$${flightDetails.price}`} />
            <View style={styles.airportContainer}>
              <AirportInfo label="Departure Airport" value={flightDetails.flights[0].departure_airport.name} fontSize={airportFontSize} />
            </View>
            <View style={styles.airportContainer}>
              <AirportInfo label="Arrival Airport" value={flightDetails.flights[0].arrival_airport.name} fontSize={airportFontSize} />
            </View>
            <View style={styles.timeContainer}>
              <FontAwesome5 name="plane-departure" size={20} color="#007bff" />
              <Text style={styles.time}>{departureTime}</Text>
              <View style={styles.arrowContainer}>
                <FontAwesome5 name="long-arrow-alt-right" size={20} color="#007bff" style={styles.arrow} />
              </View>
              <FontAwesome5 name="plane-arrival" size={20} color="#007bff" />
              <Text style={styles.time}>{arrivalTime}</Text>
            </View>
            <FlightExtensions extensions={flightDetails.flights[0].extensions} fontSize={airportFontSize} />
          </View>
        </View>
        <View style={styles.buttonContainer}>
          <Button title="Save Flight" onPress={saveFlight} disabled={flightSaved} />
        </View>
      </View>
    </ScrollView>
  );
};

const FlightInfo = ({ label, value, fontSize }) => (
  <View style={styles.detailItem}>
    <Text style={[styles.label, { fontSize }]}>
      {label}:
    </Text>
    <Text style={[styles.value, { fontSize }]}>
      {value}
    </Text>
  </View>
);

const AirportInfo = ({ label, value, fontSize }) => (
  <View style={styles.detailAirport}>
    <Text style={[styles.label, { fontSize }]}>{label}:</Text>
    <Text style={[styles.value, { fontSize }]}>{value}</Text>
  </View>
);

const FlightExtensions = ({ extensions, fontSize }) => (
  <View style={styles.extensionsContainer}>
    <Text style={[styles.label, { fontSize }]}>Extensions:</Text>
    <View style={styles.extensionsList}>
      {extensions.map((extension, index) => (
        <View key={index} style={styles.extensionItem}>
          <FontAwesome5 name="circle" size={5} color="black" style={styles.bullet} />
          <Text style={[styles.extensionText, { fontSize }]}>{extension}</Text>
        </View>
      ))}
    </View>
  </View>
);

const styles = StyleSheet.create({
  scrollViewContent: {
    flexGrow: 1,
  },
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'flex-start',
    paddingHorizontal: 20,
  },
  imageContainer: {
    marginBottom: 20,
  },
  image: {
    width: 150,
    height: 150,
    borderRadius: 8,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  detailsContainer: {
    width: '100%',
  },
  infoContainer: {
    justifyContent: 'flex-start',
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  detailItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
    width: '50%',
    padding: 5,
  },
  detailAirport: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
    padding: 5,
  },
  label: {
    fontWeight: 'bold',
    marginRight: 10,
  },
  value: {
    flex: 1,
  },
  airportContainer: {
    width: '100%',
    marginBottom: 10,
  },
  timeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    marginTop: 10,
  },
  time: {
    marginLeft: 10,
    fontSize: 12,
  },
  arrowContainer: {
    paddingHorizontal: 5,
  },
  arrow: {
    marginHorizontal: 5,
  },
  buttonContainer: {
    marginTop: 20,
  },
  extensionsContainer: {
    marginBottom: 10,
    width: '100%',
    paddingVertical: 10,
  },
  extensionsList: {
    marginLeft: 20,
  },
  extensionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 5,
  },
  bullet: {
    marginRight: 5,
  },
  extensionText: {
    flex: 1,
  },
});

export default FlightDetails;