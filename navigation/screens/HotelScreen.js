import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, StyleSheet, ActivityIndicator, Button, TouchableOpacity, Dimensions, Image, Modal, TouchableWithoutFeedback } from 'react-native';
import CalendarPicker from 'react-native-calendar-picker';
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { FontAwesome5 } from '@expo/vector-icons';
import moment from 'moment';
import axios from 'axios';

const HotelSearch = () => {
	const navigation = useNavigation();
  const [loading, setLoading] = useState(false);
  const [hotels, setHotels] = useState([]);
  const [checkInDate, setCheckInDate] = useState(new Date().toISOString().split('T')[0]);
  const [checkOutDate, setCheckOutDate] = useState(new Date().toISOString().split('T')[0]);
	const [selectedDate, setSelectedDate] = useState(new Date());
  const [checkInCalendarVisible, setCheckInCalendarVisible] = useState(false);
	const [checkOutCalendarVisible, setCheckOutCalendarVisible] = useState(false);
  const [cardWidth, setCardWidth] = useState(null);


  useEffect(() => {
		const screenWidth = Dimensions.get('window').width;
		const calculatedCardWidth = screenWidth * 0.8;
    setCardWidth(calculatedCardWidth);
  }, []);

  const searchHotels = async () => {
    setLoading(true);
    setHotels([]);
        
    try{
			const response = await axios.get('https://serpapi.com/search', {
				params: {
					api_key: 'e215005fe8bb8b0cf45a564a912a0f51b6db61e9eab6b26eac39aa8faefd50aa',
					engine: 'google_hotels',
					q: '',
					check_in_date: checkInDate,
					check_out_date: checkOutDate
        }
      });
			// Extract and set hotel data
			setHotels(response.data.properties)
    } catch (error) {
			console.error('Error fetching hotels:', error);
		}
		setLoading(false);
  };
	const goToHotelDetails = (hotelDetails) => {
    navigation.navigate('HotelDetails', { hotelDetails }); 
  };
	const renderHotelCard = ({ item }) => {

    return (
      <TouchableOpacity onPress={() => goToHotelDetails(item)}>
        <View style={[styles.cardContainer, { width: cardWidth }]}>
           <View style={styles.overlay}>
            <Text style={styles.overlayText}>Hotel Name: {item.name}</Text>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>

      {/* Display selected Check In and Check out dates */}
      <View style={styles.dateContainer}>
        <View style={styles.dateItem}>
          <Text style={styles.selectedDateText}>
            Check In Date: {moment(checkInDate).format('MMMM DD, YYYY')}
          </Text>
          <TouchableOpacity onPress={() => setCheckInCalendarVisible(true)}>
            <FontAwesome5 name="calendar" size={20} color="black" />
          </TouchableOpacity>
        </View>
        <View style={styles.dateItem}>
          <Text style={styles.selectedDateText}>
            Check out Date: {moment(checkOutDate).format('MMMM DD, YYYY')}
          </Text>
          <TouchableOpacity onPress={() => setCheckOutCalendarVisible(true)}>
            <FontAwesome5 name="calendar" size={20} color="black" />
          </TouchableOpacity>
        </View>
      </View>
      
      {/* Search Button */}
      <Button title="Search Hotels" onPress={searchHotels} />
  
      {/* Hotel results section */}
      <FlatList
        data={hotels}
        renderItem={renderHotelCard}
        keyExtractor={(item, index) => index.toString()}
        contentContainerStyle={styles.flatListContainer}
        horizontal={false} // Restrict scrolling to vertical movement
      />
  
      {/* Loading Indicator */}
      {loading && (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#0000ff" />
        </View>
      )}

			{/*Check In Calendar modal */}
      <Modal
        visible={checkInCalendarVisible}
        animationType="fade"
        transparent={true}
        onRequestClose={() => setCheckInCalendarVisible(false)}
      >
        {/* Calendar content */}
        <TouchableWithoutFeedback onPress={() => setCheckInCalendarVisible(false)}>
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
              <CalendarPicker
                minDate={new Date()} // Prevent selecting dates before today
                onDateChange={(date) => {
                  setSelectedDate(date);
                  const formattedDate = date.toISOString().split('T')[0]; // Formats the date as YYYY-MM-DD
                  setCheckInDate(formattedDate);
                  if (moment(date).isAfter(checkOutDate)) {
                    setCheckOutDate(formattedDate);
                  }
                  setCheckInCalendarVisible(false);
                }}
                width={300}
                height={400}
              />
            </View>
          </View>
        </TouchableWithoutFeedback>
      </Modal>

			{/*Check Out Calendar modal */}
      <Modal
        visible={checkOutCalendarVisible}
        animationType="fade"
        transparent={true}
        onRequestClose={() => setCheckOutCalendarVisible(false)}
      >
        {/* Calendar content */}
        <TouchableWithoutFeedback onPress={() => setCheckOutCalendarVisible(false)}>
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
              <CalendarPicker
                minDate={new Date()} // Prevent selecting dates before today
                onDateChange={(date) => {
                  setSelectedDate(date);
                  const formattedDate = date.toISOString().split('T')[0]; // Formats the date as YYYY-MM-DD
                  setCheckOutDate(formattedDate);
                  if (moment(date).isBefore(checkInDate)) {
                    setCheckInDate(formattedDate);
                  }
                  setCheckOutCalendarVisible(false);
                }}
                width={300}
                height={400}
              />
            </View>
          </View>
        </TouchableWithoutFeedback>
      </Modal>
			
    </View>
  );
};

const styles = StyleSheet.create({

});

export default HotelSearch;