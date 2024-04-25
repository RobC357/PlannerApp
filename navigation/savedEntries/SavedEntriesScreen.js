import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ActivityIndicator, Animated, FlatList, Image } from 'react-native';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { getFirestore, collection, getDocs, doc, deleteDoc } from 'firebase/firestore';
import Swipeable from 'react-native-gesture-handler/Swipeable';

const auth = getAuth();
const firestore = getFirestore();

const MapImage = ({ latitude, longitude }) => {
  if (!latitude || !longitude) {
    return <Text>No location data</Text>;
  }

  const API_KEY = 'AIzaSyD_04TRnFkDE5khuHI75Cw7dzpbiuq_oGQ'; 
  const imageUrl = `https://maps.googleapis.com/maps/api/staticmap?center=${latitude},${longitude}&zoom=12&size=400x400&markers=color:red|${latitude},${longitude}&key=${API_KEY}`;

  return <Image source={{ uri: imageUrl }} style={{ width: 100, height: 100 }} />;
};

const SavedEntriesScreen = () => {
  const navigation = useNavigation();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedTab, setSelectedTab] = useState('Chatbot');
  const [savedEntries, setSavedEntries] = useState([]);
  const [markers, setMarkers] = useState([]);
  const [flights, setFlights] = useState([]);
  const [hotels, setHotels] = useState([]);
  const [error, setError] = useState(null);
  const [fadeAnim] = useState(new Animated.Value(0));

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        setUser(user);
        await fetchSavedEntries(user.uid);
        await fetchFlights(user.uid);
        await fetchMarkers(user.uid);
        await fetchHotels(user.uid);
      } else {
        setUser(null);
        setSavedEntries([]);
        setFlights([]);
        setMarkers([]);
        setHotels([]);
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, []);

  useFocusEffect(
    React.useCallback(() => {
      if (user && selectedTab === 'Chatbot') {
        setLoading(true);
        fetchSavedEntries(user.uid);
      } else if (user && selectedTab === 'Flights') {
        setLoading(true);
        fetchFlights(user.uid);
      } else if (user && selectedTab === 'Markers') {
        setLoading(true);
        fetchMarkers(user.uid);
      } else if (user && selectedTab === 'Hotels') {
        setLoading(true);
        fetchHotels(user.uid);
      }
    }, [user, selectedTab])
  );

  const fetchSavedEntries = async (userId) => {
    try {
      const entriesRef = collection(firestore, 'chatLogs');
      const snapshot = await getDocs(entriesRef);
      const entriesData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      const userEntries = entriesData.filter(entry => entry.userUID === userId);
      const sortedEntries = userEntries.sort((a, b) => a.timestamp.toDate() - b.timestamp.toDate());
      setSavedEntries(sortedEntries);
      setError(null);
    } catch (error) {
      console.error('Error fetching saved entries: ', error);
      setError('Error fetching saved entries');
    } finally {
      setLoading(false);
    }
  };

  const fetchFlights = async () => {
    try {
      const flightsRef = collection(firestore, 'flights');
      const querySnapshot = await getDocs(flightsRef);
      const flightsData = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setFlights(flightsData);
      setError(null);
    } catch (error) {
      console.error('Error fetching flights: ', error);
      setError('Error fetching flights');
    } finally {
      setLoading(false);
    }
  };

  const fetchMarkers = async (userId) => {
    try {
      const markersRef = collection(firestore, 'markers');
      const snapshot = await getDocs(markersRef);
      const markersData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setMarkers(markersData);
      setError(null);
    } catch (error) {
      console.error('Error fetching markers: ', error);
      setError('Error fetching markers');
    } finally {
      setLoading(false);
    }
  };

  const fetchHotels = async (userId) => {
    try {
      const hotelsRef = collection(firestore, 'hotels');
      const snapshot = await getDocs(hotelsRef);
      const hotelsData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setHotels(hotelsData);
      setError(null);
    } catch (error) {
      console.error('Error fetching hotels: ', error);
      setError('Error fetching hotels');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fadeAnim.setValue(0);
    Animated.timing(
      fadeAnim,
      {
        toValue: 1,
        duration: 1000,
        useNativeDriver: true
      }
    ).start();
  }, [fadeAnim]);

  const handleTabChange = tab => {
    setSelectedTab(tab);
  };

  const handleEntryPress = (entry) => {
    navigation.navigate('ChatLogDetails', { entry });
  };

  const handleFlightPress = (flightDetails) => {
    //navigation.navigate('FlightDetails', { flightDetails }); NEED TO MAKE NEW?
  };

  const handleMarkerPress = (latitude, longitude) => {
    navigation.navigate('MapScreenStack', {
      screen: 'MapScreen',
      params: {
        latitude,
        longitude,
        isMarkerNavigation: true,
      },
    });
  };

  const deleteEntry = async (entryId) => {
    try {
      await deleteDoc(doc(firestore, 'chatLogs', entryId));
      setSavedEntries(prevEntries => prevEntries.filter(entry => entry.id !== entryId));
    } catch (error) {
      console.error('Error deleting entry: ', error);
    }
  };

  const deleteFlight = async (flightId) => {
    try {
      await deleteDoc(doc(firestore, 'flights', flightId));
      setFlights(prevFlights => prevFlights.filter(flight => flight.id !== flightId));
    } catch (error) {
      console.error('Error deleting flight: ', error);
    }
  };

  const deleteMarker = async (markerId) => {
    try {
      await deleteDoc(doc(firestore, 'markers', markerId));
      setMarkers(prevMarkers => prevMarkers.filter(marker => marker.id !== markerId));
    } catch (error) {
      console.error('Error deleting marker: ', error);
    }
  };

  const deleteHotel = async (hotelId) => {
    try {
      await deleteDoc(doc(firestore, 'hotels', hotelId));
      setHotels(prevHotels => prevHotels.filter(hotel => hotel.id !== hotelId));
    } catch (error) {
      console.error('Error deleting hotel: ', error);
    }
  };
  
  const renderSwipeableItem = ({ item, index }) => (
    <Swipeable
      overshootRight={false}
      renderRightActions={(progress, dragX) => {
        const scale = dragX.interpolate({
          inputRange: [-100, 0],
          outputRange: [1, 0.5],
          extrapolate: 'clamp',
        });
        return (
          <Animated.View style={{ flex: 1, flexDirection: 'row', justifyContent: 'flex-end', transform: [{ scale }] }}>
            <TouchableOpacity style={styles.deleteButton} onPress={() => deleteEntry(item.id)}>
              <Text style={styles.deleteButtonText}>Delete</Text>
            </TouchableOpacity>
          </Animated.View>
        );
      }}
    >
      <Animated.View style={{ opacity: fadeAnim, transform: [{ translateY: fadeAnim.interpolate({ inputRange: [0, 1], outputRange: [-20 * index, 0] }) }] }}>
        <TouchableOpacity onPress={() => handleEntryPress(item)} style={styles.entry}>
          <Text style={styles.entryName}>{item.logName}</Text>
          <Text style={styles.entryTimestamp}>Time: {item.timestamp.toDate().toLocaleString()}</Text>
          <Text style={styles.entryChatLength}>Chat Length: {item.chat.length}</Text>
        </TouchableOpacity>
      </Animated.View>
    </Swipeable>
  );

  const renderSwipeableFlightItem = ({ item, index }) => (
    <Swipeable
      overshootRight={false}
      renderRightActions={(progress, dragX) => {
        const scale = dragX.interpolate({
          inputRange: [-100, 0],
          outputRange: [1, 0.5],
          extrapolate: 'clamp',
        });
        return (
          <Animated.View style={{ flex: 1, flexDirection: 'row', justifyContent: 'flex-end', transform: [{ scale }] }}>
            <TouchableOpacity style={styles.deleteButton} onPress={() => deleteFlight(item.id)}>
              <Text style={styles.deleteButtonText}>Delete</Text>
            </TouchableOpacity>
          </Animated.View>
        );
      }}
    >
      <TouchableOpacity onPress={() => handleFlightPress(item)} style={styles.entry}>
        {/* Render flight details here */}
        <View>
        {item.image_url && <Image source={{ uri: item.image_url }} style={{ width: 100, height: 100 }} />}
          <Text>Airline: {item.airline}</Text>
          <Text>Flight Number: {item.flight_number}</Text>
          <Text>Departure Time: {item.departure_time}</Text>
          <Text>Arrival Time: {item.arrival_time}</Text>
          <Text>Departure Airport: {item.departure_airport}</Text>
          <Text>Arrival Airport: {item.arrival_airport}</Text>
          <Text>Price: ${item.price}</Text>
        </View>
      </TouchableOpacity>
    </Swipeable>
  );

  const renderSwipeableMarkerItem = ({ item, index }) => (
    <Swipeable
      overshootRight={false}
      renderRightActions={(progress, dragX) => {
        const scale = dragX.interpolate({
          inputRange: [-100, 0],
          outputRange: [1, 0.5],
          extrapolate: 'clamp',
        });
        return (
          <Animated.View style={{ flex: 1, flexDirection: 'row', justifyContent: 'flex-end', transform: [{ scale }] }}>
            <TouchableOpacity style={styles.deleteButton} onPress={() => deleteMarker(item.id)}>
              <Text style={styles.deleteButtonText}>Delete</Text>
            </TouchableOpacity>
          </Animated.View>
        );
      }}
    >
      <TouchableOpacity onPress={() => handleMarkerPress(item.latitude, item.longitude)} style={styles.marker}>
        <View style={styles.markerContent}>
          <View style={styles.mapContainer}>
            <MapImage latitude={item.latitude} longitude={item.longitude} />
          </View>
          <View style={styles.detailsContainer}>
            <Text style={styles.addressText}>{item.address}</Text>
            <Text style={styles.timestampText}>
              Added on: {item.timestamp.toDate().toLocaleString()}
            </Text>
          </View>
        </View>
      </TouchableOpacity>
    </Swipeable>
  );

  const renderSwipeableHotelItem = ({ item, index }) => (
    <Swipeable
      overshootRight={false}
      renderRightActions={(progress, dragX) => {
        const scale = dragX.interpolate({
          inputRange: [-100, 0],
          outputRange: [1, 0.5],
          extrapolate: 'clamp',
        });
        return (
          <Animated.View style={{ flex: 1, flexDirection: 'row', justifyContent: 'flex-end', transform: [{ scale }] }}>
            <TouchableOpacity style={styles.deleteButton} onPress={() => deleteHotel(item.id)}>
              <Text style={styles.deleteButtonText}>Delete</Text>
            </TouchableOpacity>
          </Animated.View>
        );
      }}
    >
      <TouchableOpacity onPress={() => handleHotelPress(item)} style={styles.entry}>
        {/* Render hotel details here */}
        <View>
          {/* Render hotel details */}
          <Text>Hotel Name: {item.hotel_name}</Text>
          {/* Add more hotel details here */}
        </View>
      </TouchableOpacity>
    </Swipeable>
  );

  return (
    <View style={styles.container}>
      {/* Tab header */}
      <View style={styles.header}>
        {/* Chatbot tab */}
        <TouchableOpacity
          style={[styles.tab, selectedTab === 'Chatbot' && styles.selectedTab]}
          onPress={() => handleTabChange('Chatbot')}>
          <Text style={styles.tabText}>Chatbot</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, selectedTab === 'Flights' && styles.selectedTab]}
          onPress={() => handleTabChange('Flights')}>
          <Text style={styles.tabText}>Flights</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, selectedTab === 'Hotels' && styles.selectedTab]}
          onPress={() => handleTabChange('Hotels')}>
          <Text style={styles.tabText}>Hotels</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, selectedTab === 'Markers' && styles.selectedTab]}
          onPress={() => handleTabChange('Markers')}>
          <Text style={styles.tabText}>Markers</Text>
        </TouchableOpacity>
      </View>
      {/* Loading indicator or content based on selected tab */}
      {loading ? (
        // Display loading indicator if data is being fetched
        <ActivityIndicator style={styles.loadingIndicator} size="large" color="#0000ff" />
      ) : (
        // Render content based on selected tab
        <>
          {selectedTab === 'Chatbot' ? (
            // Render chatlogs if 'Chatbot' tab is selected
            savedEntries.length > 0 ? (
              // Render chatlogs if there are savedEntries
              <FlatList
                data={savedEntries}
                renderItem={renderSwipeableItem}
                keyExtractor={item => item.id}
              />
            ) : (
              // Display message if no chatlogs are found
              <Text style={styles.noEntriesText}>No chatlogs found</Text>
            )
          ) : selectedTab === 'Flights' ? (
            // Render flight items if 'Flights' tab is selected
            flights.length > 0 ? (
              // Render flights if there are saved flights
              <FlatList
                data={flights}
                renderItem={renderSwipeableFlightItem}
                keyExtractor={item => item.id}
              />
            ) : (
              // Display message if no flights are found
              <Text style={styles.noEntriesText}>No flights found</Text>
            )
          ) : selectedTab === 'Markers' ? (
            // Render markers if 'Markers' tab is selected
            markers.length > 0 ? (
              // Render markers if there are markers
              <FlatList
                data={markers.sort((a, b) => a.timestamp.toDate() - b.timestamp.toDate())}
                renderItem={renderSwipeableMarkerItem}
                keyExtractor={item => item.id}
              />
            ) : (
              // Display message if no markers are found
              <Text style={styles.noEntriesText}>No markers found</Text>
            )
          ) : (
            // Render hotels if 'Hotels' tab is selected
            hotels.length > 0 ? (
              // Render hotels if there are hotels
              <FlatList
                data={hotels.sort((a, b) => a.timestamp.toDate() - b.timestamp.toDate())}
                renderItem={renderSwipeableHotelItem}
                keyExtractor={item => item.id}
              />
            ) : (
              // Display message if no hotels are found
              <Text style={styles.noEntriesText}>No hotels found</Text>
            )
          )}
        </>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  tab: {
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  selectedTab: {
    borderBottomWidth: 2,
    borderBottomColor: 'blue',
  },
  tabText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  loadingIndicator: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  entry: {
    backgroundColor: '#f0f0f0',
    padding: 10,
    marginBottom: 10,
    borderRadius: 5,
  },
  entryName: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  entryTimestamp: {
    fontSize: 14,
    marginBottom: 5,
  },
  entryChatLength: {
    fontSize: 14,
  },
  noEntriesText: {
    textAlign: 'center',
    marginTop: 20,
    fontSize: 16,
    color: 'gray',
  },
  marker: {
    marginBottom: 10,
  },
  markerContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  mapContainer: {
    marginRight: 10,
  },
  detailsContainer: {
    flex: 1,
  },
  addressText: {
    fontSize: 16,
  },
  timestampText: {
    fontSize: 14,
    color: 'gray',
    marginTop: 5,
  },
  deleteButton: {
    backgroundColor: 'red',
    justifyContent: 'center',
    alignItems: 'center',
    width: 80,
    marginRight: 10,
    paddingVertical: 10,
  },
  deleteButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default SavedEntriesScreen;
