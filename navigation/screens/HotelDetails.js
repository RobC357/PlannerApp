import React, { useState, useEffect } from 'react';
import { View, Text, Button, StyleSheet, Image, Alert, ScrollView } from 'react-native';
import { FontAwesome5 } from '@expo/vector-icons';
import moment from 'moment';
import { getFirestore, collection, addDoc, query, where, getDocs } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';

const HotelDetails = ({ route }) => {
    const { hotelDetails } = route.params || {};
    const [hotelFontSize, setHotelFontSize] = useState(16);
    const [hotelSaved, setHotelSaved] = useState(false);
    const firestore = getFirestore();
    const auth = getAuth();
  
    useEffect(() => {
      const handleLayout = (event) => {
        const { width } = event.nativeEvent.layout;
        const fontSize = width >= 300 ? 16 : 14; // Adjust font size based on available width
        setHotelFontSize(fontSize);
        checkHotelSaved();
      };
  
      // Call handleLayout on mount and on layout changes
      handleLayout({ nativeEvent: { layout: { width: '100%' } } });
    }, []);
  
    const checkHotelSaved = async () => {
      try {
        const user = auth.currentUser;
        if (user) {
          const hotelExistsQuery = query(collection(firestore, 'hotels'), where('name', '==', hotelDetails.hotels[0].name), where('user_uid', '==', user.uid));
          const querySnapshot = await getDocs(hotelExistsQuery);
          setHotelSaved(!querySnapshot.empty); // Update hotelSaved based on whether the hotel exists
        }
      } catch (error) {
        console.error('Error checking saved hotel:', error);
      }
    };
  
    const saveHotel = async () => {
      try {
        const user = auth.currentUser;
        if (user) {
          const hotelData = {
            name: hotelDetails.hotels[0].name,
            description: hotelDetails.hotels[0].description,
            overall_rating: hotelDetails.hotels[0].overall_rating,
            user_uid: user.uid
          };
          
          const hotelExistsQuery = query(collection(firestore, 'hotels'), where('hotel_number', '==', hotelData.name), where('user_uid', '==', user.uid));
          const querySnapshot = await getDocs(hotelExistsQuery);
          if (!querySnapshot.empty) {
            Alert.alert('Info', 'Hotel is already saved.');
            return;
          }
    
          await addDoc(collection(firestore, 'hotels'), hotelData);
          Alert.alert('Success', 'Hotel saved successfully!');
        } else {
          Alert.alert('Error', 'User not authenticated. Please log in.');
        }
      } catch (error) {
        console.error('Error saving hotel:', error);
        Alert.alert('Error', 'Failed to save hotel. Please try again.');
      }
    };
  
    return (
      <ScrollView contentContainerStyle={styles.scrollViewContent}>
        <View style={styles.container}>
          <Text style={styles.title}>Hotel Details</Text>
          <View style={styles.detailsContainer}>
            <View style={styles.infoContainer}>
              <HotelInfo label="Hotel" value={hotelDetails.hotels[0].name} />
            </View>
          </View>
          <View style={styles.buttonContainer}>
            <Button title="Save Hotel" onPress={saveHotel} disabled={hotelSaved} />
          </View>
        </View>
      </ScrollView>
    );
  };
  
  const HotelInfo = ({ label, value, fontSize }) => (
    <View style={styles.detailHotel}>
      <Text style={[styles.label, { fontSize }]}>{label}:</Text>
      <Text style={[styles.value, { fontSize }]}>{value}</Text>
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

  export default HotelDetails;