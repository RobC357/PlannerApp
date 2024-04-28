import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, StyleSheet, ActivityIndicator, Button, TouchableOpacity, Dimensions, Image, Modal, TouchableWithoutFeedback, TextInput } from 'react-native';
import CalendarPicker from 'react-native-calendar-picker';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { FontAwesome, FontAwesome5 } from '@expo/vector-icons';
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
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const screenWidth = Dimensions.get('window').width;
    const calculatedCardWidth = screenWidth * 0.8;
    setCardWidth(calculatedCardWidth);
  }, []);

  const searchHotels = async () => {
    setLoading(true);
    setHotels([]);

    // Check if search query is empty
    if (!searchQuery) {
      setLoading(false);
      alert('Please enter a location.');
      return;
    }

    try {
      const response = await axios.get('https://serpapi.com/search', {
        params: {
          api_key: '32a22720e066e5d948a13183ce32715e8008f02c3cb67ced3b623ef2e02e9175',
          engine: 'google_hotels',
          q: searchQuery, // Use the search query entered by the user
          check_in_date: checkInDate,
          check_out_date: checkOutDate
        }
      });
      // Extract and set hotel data
      setHotels(response.data.properties);
    } catch (error) {
      console.error('Error fetching hotels:', error);
      // Check if error is due to network issue
      if (error.response) {
        // The request was made and the server responded with a status code that falls out of the range of 2xx
        alert('Network error. Please try again later.');
      } else if (error.request) {
        // The request was made but no response was received
        alert('No response from server. Please check your internet connection.');
      } else {
        // Something happened in setting up the request that triggered an Error
        alert('Error fetching data. Please try again later.');
      }
    }
    setLoading(false);
  };

  const goToHotelDetails = (hotelDetails) => {
    navigation.navigate('HotelDetails', { hotelDetails}); 
  };

  // Function to render star icons based on rating
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

  const renderHotelCard = ({ item }) => {
    return (
      <TouchableOpacity onPress={() => goToHotelDetails(item)}>
        <View style={[styles.cardContainer, { width: cardWidth }]}>
          {/* Display hotel image */}
          <Image
            source={{ uri: item.images[0].thumbnail }}
            style={styles.hotelImage}
          />
          <View style={styles.overlay}>
            {/* Display hotel name */}
            <Text style={styles.overlayText}>{item.name}</Text>
            {/* Display hotel rating in stars */}
            <View style={styles.ratingContainer}>
              {renderStars(item.overall_rating)}
              <Text style={styles.ratingText}>({item.reviews})</Text>
            </View>
            {/* Display hotel price */}
            <Text style={styles.overlayText}>Price: {item.rate_per_night.lowest}</Text>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      {/* Search Input */}
      <TextInput
        style={styles.searchInput}
        placeholder="Enter your location:"
        onChangeText={setSearchQuery}
        value={searchQuery}
      />

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
      <View style={styles.flatListContainer}>
        <FlatList
          data={hotels}
          renderItem={renderHotelCard}
          keyExtractor={(item, index) => index.toString()}
          horizontal={false} // Restrict scrolling to vertical movement
        />
      </View>

      {/* Loading Indicator */}
      {loading && (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#0000ff" />
        </View>
      )}

      {/* Check In Calendar modal */}
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

      {/* Check Out Calendar modal */}
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
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  searchInput: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 10,
    paddingHorizontal: 10,
  },
  dateContainer: {
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  dateItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 10,
  },
  selectedDateText: {
    marginRight: 10,
  },
  cardContainer: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    padding: 10,
    marginBottom: 10,
  },
  overlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  overlayText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  flatListContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 10,
    elevation: 5,
  },
  hotelImage: {
    width: '100%',
    height: 200,
    resizeMode: 'cover',
    borderTopLeftRadius: 5,
    borderTopRightRadius: 5,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  ratingText: {
    marginLeft: 5,
  },
  starIcon: {
    color: 'gold',
  },
});

export default HotelSearch;