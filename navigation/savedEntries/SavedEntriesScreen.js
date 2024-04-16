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
  const [error, setError] = useState(null);
  const [fadeAnim] = useState(new Animated.Value(0));

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        setUser(user);
        await fetchSavedEntries(user.uid);
        await fetchMarkers(user.uid);
      } else {
        setUser(null);
        setSavedEntries([]);
        setMarkers([]);
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
      } else if (user && (selectedTab === 'Flights' || selectedTab === 'Markers')) {
        setLoading(true);
        fetchMarkers(user.uid);
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

  const handleMarkerPress = (latitude, longitude) => {
    navigation.navigate('MapScreen', {
      latitude,
      longitude,
      isMarkerNavigation: true
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

  const deleteMarker = async (markerId) => {
    try {
      await deleteDoc(doc(firestore, 'markers', markerId));
      setMarkers(prevMarkers => prevMarkers.filter(marker => marker.id !== markerId));
    } catch (error) {
      console.error('Error deleting marker: ', error);
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

  return (
    <View style={styles.container}>
      <View style={styles.header}>
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
          style={[styles.tab, selectedTab === 'Markers' && styles.selectedTab]}
          onPress={() => handleTabChange('Markers')}>
          <Text style={styles.tabText}>Markers</Text>
        </TouchableOpacity>
      </View>
      {loading ? (
        <ActivityIndicator style={styles.loadingIndicator} size="large" color="#0000ff" />
      ) : (
        <>
          {selectedTab === 'Chatbot' ? (
            savedEntries.length > 0 ? (
              <FlatList
                data={savedEntries}
                renderItem={renderSwipeableItem}
                keyExtractor={item => item.id}
              />
            ) : (
              <Text style={styles.noEntriesText}>No chatlogs found</Text>
            )
          ) : selectedTab === 'Flights' ? (
            <Text style={styles.noEntriesText}>No flights saved</Text>
          ) : (
            markers.length > 0 ? (
              <FlatList
                data={markers.sort((a, b) => a.timestamp.toDate() - b.timestamp.toDate())}
                renderItem={renderSwipeableMarkerItem}
                keyExtractor={item => item.id}
              />
            ) : (
              <Text style={styles.noEntriesText}>No markers found</Text>
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
