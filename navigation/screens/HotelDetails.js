import React, { useState, useEffect } from 'react';
import { View, Text, Button, StyleSheet, Image, Alert, ScrollView, Linking } from 'react-native';
import moment from 'moment';
import { getFirestore, collection, addDoc, query, where, getDocs } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import { FontAwesome } from '@expo/vector-icons';
import MapView, { Marker } from 'react-native-maps';
import Swiper from 'react-native-swiper';

const HotelDetails = ({ route }) => {
  const { hotelDetails, checkInDateTime, checkOutDateTime } = route.params || {};
  const [hotelSaved, setHotelSaved] = useState(false);
  const firestore = getFirestore();
  const auth = getAuth();

  const formattedCheckInDateTime = moment(checkInDateTime).format('MMM D, YYYY');
const formattedCheckOutDateTime = moment(checkOutDateTime).format('MMM D, YYYY');

  useEffect(() => {
    checkHotelSaved();
  }, []);

  const checkHotelSaved = async () => {
    try {
      const user = auth.currentUser;
      if (user && hotelDetails) {
        const hotelExistsQuery = query(collection(firestore, 'hotels'), where('name', '==', hotelDetails.name), where('user_uid', '==', user.uid));
        const querySnapshot = await getDocs(hotelExistsQuery);
        setHotelSaved(!querySnapshot.empty);
      }
    } catch (error) {
      console.error('Error checking saved hotel:', error);
    }
  };

  let images = hotelDetails.images.map(image => ({
    original: image.original_image,
    thumbnail: image.thumbnail
  }));

  const saveHotel = async () => {
    try {
      const user = auth.currentUser;
      if (user && hotelDetails) {
        // Combine the formatted dates with the times from the API response
        const checkInDateTime = moment(formattedCheckInDateTime + ' ' + hotelDetails.check_in_time, 'MMM D, YYYY h:mm A').toDate();
        const checkOutDateTime = moment(formattedCheckOutDateTime + ' ' + hotelDetails.check_out_time, 'MMM D, YYYY h:mm A').toDate();
  
        // Prepare the hotel data to be saved in Firestore
        const hotelData = {
          name: hotelDetails.name,
          overall_rating: hotelDetails.overall_rating,
          link: hotelDetails.link,
          price: hotelDetails.rate_per_night.lowest,
          user_uid: user.uid,
          check_in_time: checkInDateTime,
          check_out_time: checkOutDateTime,
          latitude: hotelDetails.gps_coordinates.latitude,
          longitude: hotelDetails.gps_coordinates.longitude,
          images: hotelDetails.images.map(image => image.original_image)
        };
        
        // Check if the hotel already exists in Firestore
        const hotelExistsQuery = query(collection(firestore, 'hotels'), where('name', '==', hotelDetails.name), where('user_uid', '==', user.uid));
        const querySnapshot = await getDocs(hotelExistsQuery);
        if (!querySnapshot.empty) {
          Alert.alert('Info', 'Hotel is already saved.');
          return;
        }
  
        // Save the hotel data to Firestore
        await addDoc(collection(firestore, 'hotels'), hotelData);
        Alert.alert('Success', 'Hotel saved successfully!');
        
        // After successfully saving the hotel, check again if the hotel is saved
        await checkHotelSaved();
      } else {
        Alert.alert('Error', 'User not authenticated or hotel details are missing. Please try again.');
      }
    } catch (error) {
      console.error('Error saving hotel:', error);
      Alert.alert('Error', 'Failed to save hotel. Please try again.');
    }
  };

  const openHotelWebsite = () => {
    Linking.openURL(hotelDetails.link);
  };

  const renderStars = (rating) => {
    const stars = [];
    for (let i = 0; i < Math.floor(rating); i++) {
      stars.push(<FontAwesome name="star" key={i} style={styles.starIcon} />);
    }
    if (rating % 1 !== 0) {
      stars.push(<FontAwesome name="star-half-full" key={stars.length} style={styles.starIcon} />);
    }
    return stars;
  };

  return (
    <ScrollView contentContainerStyle={styles.scrollViewContent}>
      <View style={styles.container}>
        <View style={styles.swiperContainer}>
          <Swiper autoplay={true} showsButtons={true} autoplayTimeout={5.0}>
            {images.map((image, index) => (
              <View key={index} style={styles.swiperItem}>
                <Image
                  style={styles.image}
                  source={{ uri: image.original }}
                  resizeMode="cover"
                />
              </View>
            ))}
          </Swiper>
        </View>
        <Text style={styles.title}>Hotel Details</Text>
        <View style={styles.detailsContainer}>
          <HotelInfo label="Hotel Name" value={hotelDetails.name} />
          <HotelInfo label="Type" value={hotelDetails.type} />
          <HotelInfo label="Check-In Date & Time" value={`${formattedCheckInDateTime} ${hotelDetails.check_in_time}`} />
         <HotelInfo label="Check-Out Date & Time" value={`${formattedCheckOutDateTime} ${hotelDetails.check_out_time}`} />
          <HotelInfo label="Price" value={`~${hotelDetails.rate_per_night.lowest}`} />
          <View style={styles.ratingContainer}>
            <Text style={styles.label}>Rating:</Text>
            {renderStars(hotelDetails.overall_rating)}
            <Text style={styles.totalRating}>({hotelDetails.overall_rating})</Text>
          </View>
          <HotelInfo label="Amenities" value={hotelDetails.amenities.join(', ')} />
        </View>
        <View style={styles.mapContainer}>
          <MapView
            style={styles.map}
            initialRegion={{
              latitude: hotelDetails.gps_coordinates.latitude,
              longitude: hotelDetails.gps_coordinates.longitude,
              latitudeDelta: 0.0922,
              longitudeDelta: 0.0421,
            }}
          >
            <Marker
              coordinate={{
                latitude: hotelDetails.gps_coordinates.latitude,
                longitude: hotelDetails.gps_coordinates.longitude,
              }}
              title={hotelDetails.name}
            />
          </MapView>
        </View>
        <View style={styles.buttonContainer}>
          <Button title="Save Hotel" onPress={saveHotel} disabled={hotelSaved} />
          <Button title="Visit Website" onPress={openHotelWebsite} />
        </View>
      </View>
    </ScrollView>
  );
};

const HotelInfo = ({ label, value }) => (
  <View style={styles.detailItem}>
    <Text style={styles.label}>{label}:</Text>
    <Text style={styles.value}>{value}</Text>
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
  swiper: {
    width: '100%',
    height: 200,
    marginBottom: 20,
  },
  image: {
    width: '100%',
    height: '100%',
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
  swiperContainer: {
    height: 200,
    marginBottom: 20,
  },
  detailItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
    width: '100%',
    padding: 5,
  },
  label: {
    fontWeight: 'bold',
    marginRight: 10,
  },
  value: {
    flex: 1,
  },
  buttonContainer: {
    marginTop: 20,
    marginBottom: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
    width: '100%',
    padding: 5,
  },
  starIcon: {
    color: 'gold',
  },
  totalRating: {
    marginLeft: 5,
    color: 'gray',
  },
  mapContainer: {
    width: '100%',
    height: 200,
    marginTop: 20,
  },
  map: {
    flex: 1,
  },
});

export default HotelDetails;