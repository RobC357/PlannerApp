import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';

const HotelLogDetails = ({ route }) => {
  const { hotel } = route.params;

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
          <HotelInfo label="Hotel Name" value={hotel.name} />
          <HotelInfo label="Type" value={hotel.type} />
          <HotelInfo label="Check-In Date & Time" value={`${formattedCheckInDateTime} ${hotel.check_in_time}`} />
         <HotelInfo label="Check-Out Date & Time" value={`${formattedCheckOutDateTime} ${hotel.check_out_time}`} />
          <HotelInfo label="Price" value={`~${hotel.rate_per_night.lowest}`} />
          <View style={styles.ratingContainer}>
            <Text style={styles.label}>Rating:</Text>
            {renderStars(hotel.overall_rating)}
            <Text style={styles.totalRating}>({hotel.overall_rating})</Text>
          </View>
          <HotelInfo label="Amenities" value={hotel.amenities.join(', ')} />
        </View>
        <View style={styles.mapContainer}>
          <MapView
            style={styles.map}
            initialRegion={{
              latitude: hotel.gps_coordinates.latitude,
              longitude: hotel.gps_coordinates.longitude,
              latitudeDelta: 0.0922,
              longitudeDelta: 0.0421,
            }}
          >
            <Marker
              coordinate={{
                latitude: hotel.gps_coordinates.latitude,
                longitude: hotel.gps_coordinates.longitude,
              }}
              title={hotel.name}
            />
          </MapView>
        </View>
      </View>
    </ScrollView>
  );
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
  
  export default HotelLogDetails;