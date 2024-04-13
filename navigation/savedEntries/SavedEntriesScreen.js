import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ActivityIndicator, FlatList, Animated } from 'react-native';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { getFirestore, collection, getDocs, deleteDoc, doc } from 'firebase/firestore';
import Swipeable from 'react-native-gesture-handler/Swipeable';

const auth = getAuth();
const firestore = getFirestore();

const SavedEntriesScreen = () => {
  const navigation = useNavigation();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedTab, setSelectedTab] = useState('Chatbot'); // Default selected tab
  const [savedEntries, setSavedEntries] = useState([]);
  const [error, setError] = useState(null);
  const [fadeAnim] = useState(new Animated.Value(0));

  useEffect(() => {
    console.log("Starting auth state change listener");
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      console.log("Auth state changed:", user);
      if (user) {
        console.log("User UID:", user.uid); // Print user UID
        setUser(user);
        await fetchSavedEntries(user.uid);
      } else {
        setUser(null);
        setSavedEntries([]); // Clear saved entries if user is not authenticated
        setLoading(false); // Ensure loading state is set to false when user is not authenticated
      }
    });
  
    // Cleanup subscription when component unmounts
    return () => {
      console.log("Unsubscribing from auth state change listener");
      unsubscribe();
    };
  }, []);

  useFocusEffect(
    React.useCallback(() => {
      if (user) {
        setLoading(true); // Set loading state to true before fetching entries
        fetchSavedEntries(user.uid);
      }
    }, [user, selectedTab])
  );

  // Function to fetch saved entries from Firestore
  const fetchSavedEntries = async (userId) => {
    try {
      const entriesRef = collection(firestore, 'chatLogs');
      const snapshot = await getDocs(entriesRef);
      const entriesData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      // Filter entries based on user ID
      const userEntries = entriesData.filter(entry => entry.userUID === userId);
      // Sort entries by timestamp from earliest to latest
      const sortedEntries = userEntries.sort((a, b) => a.timestamp.toDate() - b.timestamp.toDate());
      setSavedEntries(sortedEntries);
      setError(null); // Reset error state if fetching is successful
    } catch (error) {
      console.error('Error fetching saved entries: ', error);
      setError('Error fetching saved entries'); // Set error state if fetching fails
    } finally {
      setLoading(false); // Ensure loading state is set to false after fetching completes
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

  // Function to switch between tabs
  const handleTabChange = tab => {
    setSelectedTab(tab);
  };

  // Function to navigate to chat log details screen
  const handleEntryPress = (entry) => {
    // Pass the selected entry to the chat log details screen
    navigation.navigate('ChatLogDetails', { entry });
  };

  // Function to delete an entry
  const deleteEntry = async (entryId) => {
    try {
      await deleteDoc(doc(firestore, 'chatLogs', entryId));
      // Remove the entry from the savedEntries state
      setSavedEntries(prevEntries => prevEntries.filter(entry => entry.id !== entryId));
    } catch (error) {
      console.error('Error deleting entry: ', error);
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
      renderLeftActions={(progress, dragX) => {
        const scale = dragX.interpolate({
          inputRange: [0, 100],
          outputRange: [0.5, 1],
          extrapolate: 'clamp',
        });
        return (
          <Animated.View style={{ flex: 1, flexDirection: 'row', justifyContent: 'flex-start', transform: [{ scale }] }}>
            <TouchableOpacity style={styles.undoButton} onPress={() => console.log("Undo")}>
              <Text style={styles.undoButtonText}>Undo</Text>
            </TouchableOpacity>
          </Animated.View>
        );
      }}
      friction={1}
      tension={30}
      onSwipeableWillClose={() => console.log("Swipeable is closing")}
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
        {/* Add more tabs as needed */}
      </View>
      {loading ? (
        <ActivityIndicator style={styles.loadingIndicator} size="large" color="#0000ff" />
      ) : error ? (
        <Text style={styles.errorText}>{error}</Text>
      ) : selectedTab === 'Chatbot' ? (
        <>
          {savedEntries.length === 0 ? (
            <Text style={styles.noEntriesText}>No chat logs found</Text>
          ) : (
            <FlatList
            data={savedEntries}
            renderItem={renderSwipeableItem}
            keyExtractor={item => item.id}
          />
          )}
        </>
      ) : (
        <Text style={styles.noEntriesText}>No flights saved</Text>
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
  entriesContainer: {
    flexGrow: 1,
    padding: 20,
  },
  loadingIndicator: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorText: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    textAlign: 'center',
    marginTop: 20,
    fontSize: 16,
    color: 'red',
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
  deleteButton: {
    backgroundColor: 'red',
    justifyContent: 'center',
    alignItems: 'center',
    width: 80,
    height: '100%',
  },
  deleteButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
});

export default SavedEntriesScreen;