import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, ImageBackground, ScrollView, FlatList, TouchableOpacity } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { useNavigation } from '@react-navigation/native';
import axios from 'axios';

const FlightSearch = ({ route }) => {
  const navigation = useNavigation();
  const [fromLocation, setFromLocation] = useState('');
  const [toLocation, setToLocation] = useState('');
  const [returnDate, setReturnDate] = useState('');
  const [numberOfAdults, setNumberOfAdults] = useState(1);
  const [numberOfChildren, setNumberOfChildren] = useState(0);
  const [seatingPreferences, setSeatingPreferences] = useState([]);
  const [sortBy, setSortBy] = useState('Price');
  const [tripTypes, setTripTypes] = useState(['One Way']);
  const [flights, setFlights] = useState([]);

  const { id, name, uri, departureDate } = route.params;

  const searchFlights = async () => {
    if (!returnDate) {
      alert('Please enter return date');
      return;
    }
    try {
      const response = await axios.get('https://example.com/flights', {
        params: {
          fromLocation,
          toLocation,
          departureDate,
          returnDate,
          numberOfAdults,
          numberOfChildren,
          seatingPreferences: seatingPreferences.join(','),
          sortBy,
          tripTypes: tripTypes.join(','),
        },
      });
      setFlights(response.data); // Assuming the response data is an array of flights
    } catch (error) {
      console.error('Error searching flights:', error);
    }
  };

  const renderFlightItem = ({ item }) => (
    <View style={styles.flightItem}>
      {/* Render flight item components here */}
    </View>
  );

  // Custom CheckBox component
  const CustomCheckBox = ({ checked, onPress, text }) => (
    <TouchableOpacity style={styles.checkboxContainer} onPress={onPress}>
      <View style={[styles.checkbox, checked && styles.checked]}>
        {checked && <Text style={styles.checkmark}>✓</Text>}
      </View>
      <Text style={styles.checkboxLabel}>{text}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <ImageBackground source={{ uri }} style={styles.heroImage}>
        <Text style={styles.title}>{name}</Text>
      </ImageBackground>
      <ScrollView>
        <View style={styles.formContainer}>
          <Text style={styles.filterLabel}>From</Text>
          <TextInput
            style={styles.input}
            placeholder="From"
            value={fromLocation}
            onChangeText={setFromLocation}
          />
          <Text style={styles.filterLabel}>To</Text>
          <TextInput
            style={styles.input}
            placeholder="To"
            value={toLocation}
            onChangeText={setToLocation}
          />
          <Text style={styles.filterLabel}>Return Date</Text>
          <TextInput
            style={styles.input}
            placeholder="Return Date"
            value={returnDate}
            onChangeText={setReturnDate}
          />
          <Text style={styles.filterLabel}>Number of Adults</Text>
          <TextInput
            style={styles.input}
            placeholder="Number of Adults"
            value={numberOfAdults.toString()}
            onChangeText={(text) => setNumberOfAdults(parseInt(text) || 0)}
            keyboardType="numeric"
          />
          <Text style={styles.filterLabel}>Number of Children</Text>
          <TextInput
            style={styles.input}
            placeholder="Number of Children"
            value={numberOfChildren.toString()}
            onChangeText={(text) => setNumberOfChildren(parseInt(text) || 0)}
            keyboardType="numeric"
          />
          <Text style={styles.filterLabel}>Seating Preferences</Text>
          <View style={styles.checkboxGroup}>
            <CustomCheckBox
              text="First Class"
              checked={seatingPreferences.includes('First Class')}
              onPress={() => {
                if (seatingPreferences.includes('First Class')) {
                  setSeatingPreferences(seatingPreferences.filter(pref => pref !== 'First Class'));
                } else {
                  setSeatingPreferences([...seatingPreferences, 'First Class']);
                }
              }}
            />
            <CustomCheckBox
              text="Business"
              checked={seatingPreferences.includes('Business')}
              onPress={() => {
                if (seatingPreferences.includes('Business')) {
                  setSeatingPreferences(seatingPreferences.filter(pref => pref !== 'Business'));
                } else {
                  setSeatingPreferences([...seatingPreferences, 'Business']);
                }
              }}
            />
            <CustomCheckBox
              text="Economy"
              checked={seatingPreferences.includes('Economy')}
              onPress={() => {
                if (seatingPreferences.includes('Economy')) {
                  setSeatingPreferences(seatingPreferences.filter(pref => pref !== 'Economy'));
                } else {
                  setSeatingPreferences([...seatingPreferences, 'Economy']);
                }
              }}
            />
          </View>
          <Text style={styles.filterLabel}>Sort By</Text>
          <View style={styles.checkboxGroup}>
            <CustomCheckBox
                text="One Way"
                checked={tripTypes.includes('One Way')}
                onPress={() => {
                if (tripTypes.includes('One Way')) {
                    setTripTypes(tripTypes.filter(type => type !== 'One Way'));
                } else {
                    setTripTypes([...tripTypes, 'One Way']);
                }
                }}
            />
            <CustomCheckBox
                text="Round Trip"
                checked={tripTypes.includes('Round Trip')}
                onPress={() => {
                if (tripTypes.includes('Round Trip')) {
                    setTripTypes(tripTypes.filter(type => type !== 'Round Trip'));
                } else {
                    setTripTypes([...tripTypes, 'Round Trip']);
                }
                }}
            />
            </View>
          <Button title="Search Flights" onPress={searchFlights} />
        </View>
      </ScrollView>
      <FlatList
        data={flights}
        renderItem={renderFlightItem}
        keyExtractor={(item, index) => index.toString()}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  heroImage: {
    height: 200,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    backgroundColor: 'rgba(0,0,0,0.5)',
    padding: 10,
    borderRadius: 5,
  },
  formContainer: {
    padding: 20,
  },
  filterLabel: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  input: {
    height: 40,
    borderWidth: 1,
    borderColor: '#ccc',
    marginBottom: 10,
    paddingHorizontal: 10,
    paddingVertical: 5, // Add padding vertical
  },
  picker: {
    height: 40,
    borderWidth: 1,
    borderColor: '#ccc',
    marginBottom: 10,
  },
  checkboxGroup: {
    marginBottom: 10,
  },
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 5,
  },
  checkbox: {
    width: 20,
    height: 20,
    borderWidth: 1,
    borderColor: '#000',
    marginRight: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  checked: {
    backgroundColor: '#000',
  },
  checkmark: {
    color: '#fff',
  },
  checkboxLabel: {
    fontSize: 16,
  },
  flightItem: {
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
});

export default FlightSearch;