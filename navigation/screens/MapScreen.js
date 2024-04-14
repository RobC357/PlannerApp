import React, { useState, useRef, useEffect } from 'react';
import { View, StyleSheet, Alert, Animated } from 'react-native';
import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps';
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';
import * as Location from "expo-location";
import Geocoder from 'react-native-geocoding';

Geocoder.init("AIzaSyD_04TRnFkDE5khuHI75Cw7dzpbiuq_oGQ");

const MapScreen = () => {
  const [markers, setMarkers] = useState([]);
  const [suggestionsVisible, setSuggestionsVisible] = useState(false);
  const searchBoxTranslateY = useRef(new Animated.Value(0)).current;
  const [selectedLocation, setSelectedLocation] = useState(null);
  const mapRef = useRef(null);
  const [initialRegion, setInitialRegion] = useState(null); // State to store initial region

  useEffect(() => {
    (async () => {
      // Request permission for location access
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission denied', 'Please enable location services to use this feature.');
        return;
      }

      // Get user's current location
      let location = await Location.getCurrentPositionAsync({});
      const { latitude, longitude } = location.coords;

      // Set initial region to user's current location
      setInitialRegion({
        latitude,
        longitude,
        latitudeDelta: 0.0922,
        longitudeDelta: 0.0421,
      });
    })();
  }, []);

  const addMarker = async (address) => {
    try {
      const response = await Geocoder.from(address);
      const { lat, lng } = response.results[0].geometry.location;
      const newMarker = { coordinate: { latitude: lat, longitude: lng }, title: address };
      setMarkers([...markers, newMarker]);
    } catch (error) {
      Alert.alert('Error', 'Could not find location. Please try again.');
    }
  };
  const handlePlaceSelect = async (data, details = null) => {
    const { description } = data;
    try {
      const response = await Geocoder.from(description);
      const { lat, lng } = response.results[0].geometry.location;
      const coordinate = { latitude: lat, longitude: lng };

      mapRef.current.animateToRegion({
        ...coordinate,
        latitudeDelta: 0.05,
        longitudeDelta: 0.05,
      });

      setSelectedLocation(data);

      Alert.alert(
        'Add Marker',
        `Do you want to add a marker at ${description}?`,
        [
          {
            text: 'Cancel',
            onPress: () => {
              setSelectedLocation(null);
            },
            style: 'cancel',
          },
          {
            text: 'OK',
            onPress: () => {
              addMarker(description);
              setSelectedLocation(null);
            },
          },
        ],
        { cancelable: false }
      );

      // Hide suggestions and animate search box back to normal position
      setSuggestionsVisible(false);
      Animated.timing(searchBoxTranslateY, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }).start();
    } catch (error) {
      console.error('Error:', error);
      Alert.alert('Error', 'Could not find location. Please try again.');
    }
  };

  const handleSuggestionsVisibility = (visible) => {
    // Update state and animate search box position based on suggestions visibility
    setSuggestionsVisible(visible);
    Animated.timing(searchBoxTranslateY, {
      toValue: visible ? -200 : 0,
      duration: 300,
      useNativeDriver: true,
    }).start();
  };

  const handleMapPress = async (event) => {
    try {
      const coordinate = event.nativeEvent.coordinate;
      const response = await Geocoder.from(coordinate);
      const address = response.results[0].formatted_address;
  
      // Check if there's already a marker at the pressed location
      const existingMarker = markers.find(
        (marker) =>
          marker.coordinate.latitude === coordinate.latitude &&
          marker.coordinate.longitude === coordinate.longitude
      );
  
      if (existingMarker) {
        // If there's already a marker, show its details
        console.log("yes marker!");
      } else {
        // If no marker exists
        console.log("No marker!");
      }
    } catch (error) {
      console.error('Error:', error);
      Alert.alert(
        'Error',
        'Could not retrieve location information. Please try again.'
      );
    }
  };

  const handleLongPress = async (event) => {
    try {
      const coordinate = event.nativeEvent.coordinate;
      const response = await Geocoder.from(coordinate);
      const address = response.results[0].formatted_address;
  
      // Check if there's already a marker at the pressed location
      const existingMarker = markers.find(
        (marker) =>
          marker.coordinate.latitude === coordinate.latitude &&
          marker.coordinate.longitude === coordinate.longitude
      );
  
      if (existingMarker) {
        // If there's already a marker, show its details
        Alert.alert(
          'Marker Details',
          `You tapped on an existing marker at ${address}`,
          [{ text: 'OK' }],
          { cancelable: false }
        );
      } else {
        // If no marker exists, prompt to add a new one
        Alert.alert(
          'Add Marker',
          `Do you want to add a marker at ${address}?`,
          [
            {
              text: 'Cancel',
              style: 'cancel',
            },
            {
              text: 'OK',
              onPress: () => addMarker(address),
            },
          ],
          { cancelable: false }
        );
      }
    } catch (error) {
      console.error('Error:', error);
      Alert.alert(
        'Error',
        'Could not retrieve location information. Please try again.'
      );
    }
  };

  return (
    <View style={styles.container}>
      <MapView
        ref={mapRef}
        style={styles.map}
        provider={PROVIDER_GOOGLE}
        showsUserLocation
        showsMyLocationButton
        userLocationPriority='balanced'
        initialRegion={initialRegion} // Set initial region to user's current location
        onPress={handleMapPress} // Handle regular tap events
        onLongPress={handleLongPress} // Handle long press events
      >
        {markers.map((marker, index) => (
          <Marker
            key={index}
            coordinate={marker.coordinate}
            title={marker.title}
          />
        ))}
      </MapView>
      <Animated.View style={[styles.searchBoxContainer, { transform: [{ translateY: searchBoxTranslateY }] }]}>
        <GooglePlacesAutocomplete
          placeholder="Search"
          onPress={handlePlaceSelect}
          fetchDetails
          query={{
            key: 'AIzaSyD_04TRnFkDE5khuHI75Cw7dzpbiuq_oGQ',
            language: 'en',
          }}
          styles={{
            textInputContainer: {
              backgroundColor: 'rgba(0,0,0,0)',
              borderTopWidth: 0,
              borderBottomWidth: 0,
            },
            textInput: {
              marginLeft: 0,
              marginRight: 0,
              height: 38,
              color: '#5d5d5d',
              fontSize: 16,
            },
            predefinedPlacesDescription: {
              color: '#1faadb',
            },
          }}
          listViewDisplayed="auto"
          onListVisibilityChange={handleSuggestionsVisibility}
        />
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    flex: 1,
  },
  searchBoxContainer: {
    position: 'absolute',
    top: 20,
    left: 0,
    right: 0,
    paddingHorizontal: 20,
    zIndex: 1,
  },
});

export default MapScreen;