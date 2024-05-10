import React from 'react';
import { View, Text, StyleSheet, ScrollView, Image, TouchableOpacity, Linking } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import Swiper from 'react-native-swiper';
import MapView, { Marker } from 'react-native-maps';

const HotelLogDetails = ({ route }) => {
  const { hotel } = route.params;

  return (
    <ScrollView contentContainerStyle={styles.scrollViewContent}>
      <View style={styles.container}>
        <View style={styles.swiperContainer}>
          <Swiper autoplay={true} showsButtons={true} autoplayTimeout={5.0}>
            {hotel.images.map((image, index) => (
              <View key={index} style={styles.swiperItem}>
                <Image
                  style={styles.image}
                  source={{ uri: image }}
                  resizeMode="cover"
                />
              </View>
            ))}
          </Swiper>
        </View>
        <Text style={styles.title}>Hotel Details</Text>
        <View style={styles.detailsContainer}>
          <HotelInfo label="Hotel Name" value={hotel.name} />
          <HotelInfo label="Type" value={hotel.type} />
          <HotelInfo label="Check-In Date & Time" value={formatDateTime(hotel.check_in_time)} />
          <HotelInfo label="Check-Out Date & Time" value={formatDateTime(hotel.check_out_time)} />
          <HotelInfo label="Price" value={hotel.price} />
          <View style={styles.ratingContainer}>
            <Text style={styles.label}>Rating:</Text>
            {renderStars(hotel.overall_rating)}
            <Text style={styles.totalRating}>({hotel.overall_rating})</Text>
          </View>
           <View style={styles.mapContainer}>
          <MapView
            style={styles.map}
            initialRegion={{
              latitude: hotel.latitude,
              longitude: hotel.longitude,
              latitudeDelta: 0.0922,
              longitudeDelta: 0.0421,
            }}
          >
            <Marker
              coordinate={{
                latitude: hotel.latitude,
                longitude: hotel.longitude,
              }}
              title={hotel.name}
            />
          </MapView>
        </View>
          <TouchableOpacity onPress={() => openHotelWebsite(hotel.link)} style={styles.buttonContainer}>
            <Text style={styles.buttonText}>Visit Hotel Website</Text>
          </TouchableOpacity>
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

const openHotelWebsite = (link) => {
  Linking.openURL(link);
};

const formatDateTime = (dateTime) => {
  // Assuming dateTime is an object with keys { seconds, nanoseconds }
  // You can format it as per your requirements
  return new Date(dateTime.seconds * 1000).toLocaleString();
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
    backgroundColor: '#007bff',
    padding: 10,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
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

export default HotelLogDetails;