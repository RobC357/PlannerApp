import React, { useState, useRef, useEffect } from 'react';
import { View, StyleSheet, Alert, Animated, TouchableOpacity } from 'react-native';
import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps';
import { useFocusEffect } from '@react-navigation/native';
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';
import * as Location from "expo-location";
import Geocoder from 'react-native-geocoding';
import { getFirestore, collection, addDoc, getDocs , serverTimestamp } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import { FontAwesome } from '@expo/vector-icons';

Geocoder.init("AIzaSyBNAj7uomTA-m9Gja0gV8-wv2YQdIHGCo8");

const MapScreen = ( { route } ) => {
  const [markers, setMarkers] = useState([]);
  const [suggestionsVisible, setSuggestionsVisible] = useState(false);
  const searchBoxTranslateY = useRef(new Animated.Value(0)).current;
  const [selectedLocation, setSelectedLocation] = useState(null);
  const mapRef = useRef(null);
  const [initialRegion, setInitialRegion] = useState(null);
  const auth = getAuth();

  useFocusEffect(
    React.useCallback(() => {
      const animateToRegion = async () => {
        if (route.params && route.params.latitude && route.params.longitude && mapRef.current) {
          const { latitude, longitude, isMarkerNavigation } = route.params;
          if (isMarkerNavigation) {
            console.log("Moving to marker");
            mapRef.current.animateToRegion({
              latitude,
              longitude,
              latitudeDelta: 0.05,
              longitudeDelta: 0.05,
            });
            // Set isMarkerNavigation to false after moving to the marker
            route.params.isMarkerNavigation = false;
          } else {
            try {
              let { status } = await Location.requestForegroundPermissionsAsync();
              if (status !== 'granted') {
                Alert.alert('Permission denied', 'Please enable location services to use this feature.');
                return;
              }

              let location = await Location.getLastKnownPositionAsync({});
              const { latitude, longitude } = location.coords;
              mapRef.current.animateToRegion({
                latitude,
                longitude,
                latitudeDelta: 0.0922,
                longitudeDelta: 0.0421,
              });
            } catch (error) {
              console.error('Error fetching current location: ', error);
              Alert.alert('Error', 'Could not fetch current location. Please try again.');
            }
          }
        }
      };

      animateToRegion();
    }, [route.params, mapRef])
  );

  const fetchMarkers = async () => {
    try {
      const firestore = getFirestore();
      const markersRef = collection(firestore, 'markers');
      const snapshot = await getDocs(markersRef);
      const markersData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      const userMarkers = markersData.filter(marker => marker.userUID === auth.currentUser.uid);
      setMarkers(userMarkers);
    } catch (error) {
      console.error('Error fetching markers: ', error);
      Alert.alert('Error', 'Could not fetch markers. Please try again.');
    }
  };

  useFocusEffect(
    React.useCallback(() => {
      (async () => {
        let { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== 'granted') {
          Alert.alert('Permission denied', 'Please enable location services to use this feature.');
          return;
        }

        let location = await Location.getLastKnownPositionAsync({});
        const { latitude, longitude } = location.coords;
        setInitialRegion({
          latitude,
          longitude,
          latitudeDelta: 0.0922,
          longitudeDelta: 0.0421,
        });

        fetchMarkers();
      })();
    }, [])
  );


  const addMarker = async (address, userUID) => {
    try {
      const response = await Geocoder.from(address);
      if (response.results.length > 0) { // Check if results exist
        const { lat, lng } = response.results[0].geometry.location;
        const timestamp = serverTimestamp();
        const firestore = getFirestore();
        const markersRef = collection(firestore, 'markers');
        const newMarkerData = {
          address: address,
          latitude: lat, // Store latitude
          longitude: lng, // Store longitude
          timestamp: timestamp,
          userUID: userUID,
          name: ''
        };
    
        const docRef = await addDoc(markersRef, newMarkerData);
    
        const newMarker = { latitude: lat, longitude: lng, title: address, id: docRef.id };
    
        setMarkers([...markers, newMarker]);
      } else {
        Alert.alert('Error', 'Could not find location. Please try again.');
      }
    } catch (error) {
      Alert.alert('Error', 'Could not find location. Please try again.');
    }
  };

  const handlePlaceSelect = async (data, details = null) => {
    const { description } = data;
    try {
      const response = await Geocoder.from(description);
      if (response.results.length > 0) { // Check if results exist
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
                addMarker(description, auth.currentUser.uid);
                setSelectedLocation(null);
              },
            },
          ],
          { cancelable: false }
        );
    
        setSuggestionsVisible(false);
        Animated.timing(searchBoxTranslateY, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        }).start();
      } else {
        Alert.alert('Error', 'Could not find location. Please try again.');
      }
    } catch (error) {
      console.error('Error:', error);
      Alert.alert('Error', 'Could not find location. Please try again.');
    }
  };

  const handleSuggestionsVisibility = (visible) => {
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
      if (response.results.length > 0) { // Check if results exist
        const address = response.results[0].formatted_address;
        console.log("Address:", address);
        // Rest of the code remains the same
      } else {
        Alert.alert('Error', 'Could not retrieve location information. Please try again.');
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
      if (response.results.length > 0) { // Check if results exist
        const address = response.results[0].formatted_address;
        
        // Add a marker using the obtained address
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
              onPress: () => {
                addMarker(address, auth.currentUser.uid); // Call addMarker function with the address
              },
            },
          ],
          { cancelable: false }
        );
      } else {
        Alert.alert('Error', 'Could not retrieve location information. Please try again.');
      }
    } catch (error) {
      console.error('Error:', error);
      Alert.alert(
        'Error',
        'Could not retrieve location information. Please try again.'
      );
    }
  };

  const handleCurrentLocationPress = async () => {
    try {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission denied', 'Please enable location services to use this feature.');
        return;
      }
      let location = await Location.getLastKnownPositionAsync({});
      const { latitude, longitude } = location.coords;
      mapRef.current.animateToRegion({
        latitude,
        longitude,
        latitudeDelta: 0.05,
        longitudeDelta: 0.05,
      });
    } catch (error) {
      console.error('Error fetching current location: ', error);
      Alert.alert('Error', 'Could not fetch current location. Please try again.');
    }
  };

  return (
    <View style={styles.container}>
      <MapView
        ref={mapRef}
        style={styles.map}
        provider={PROVIDER_GOOGLE}
        showsUserLocation
        showsMyLocationButton={false}
        userLocationPriority='balanced'
        initialRegion={initialRegion}
        onPress={handleMapPress}
        onLongPress={handleLongPress}
      >
        {markers.map((marker, index) => (
          <Marker
            key={index}
            coordinate={{ latitude: marker.latitude, longitude: marker.longitude }}
            title={marker.address}
          />
        ))}
      </MapView>
      <Animated.View style={[styles.searchBoxContainer, { transform: [{ translateY: searchBoxTranslateY }] }]}>
        <View style={styles.autocompleteContainer}>
          <GooglePlacesAutocomplete
            placeholder="Search"
            onPress={handlePlaceSelect}
            fetchDetails
            query={{
              key: 'AIzaSyBNAj7uomTA-m9Gja0gV8-wv2YQdIHGCo8',
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
            returnKeyType="done"
          />
        </View>
        </Animated.View>
        <TouchableOpacity style={styles.locationButton} onPress={handleCurrentLocationPress}>
        <FontAwesome name="location-arrow" size={24} color="black" />
      </TouchableOpacity>
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
  autocompleteContainer: {
    backgroundColor: '#FFF',
    borderRadius: 5, 
    elevation: 5,
    shadowColor: '#000', 
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  locationButton: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    backgroundColor: 'white',
    borderRadius: 50,
    width: 50,
    height: 50,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 5,
  },
});

export default MapScreen;
