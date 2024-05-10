
import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  ActivityIndicator,
  Button,
  TouchableOpacity,
  Dimensions,
  Image,
  Modal,
  TouchableWithoutFeedback,
} from "react-native";
import CalendarPicker from "react-native-calendar-picker";
import { GooglePlacesAutocomplete } from "react-native-google-places-autocomplete";
import { useNavigation, useFocusEffect } from "@react-navigation/native";
import { FontAwesome, FontAwesome5 } from "@expo/vector-icons";
import moment from "moment";
import axios from "axios";
import CustomDropdown from "../../utils/CustomDropdown";
import PeopleDropdown from "../../utils/PeopleDropdown";

const FlightSearch = () => {
  const navigation = useNavigation();
  const [loading, setLoading] = useState(false);
  const [flights, setFlights] = useState([]);
  const [departureDate, setDepartureDate] = useState(new Date().toISOString().split("T")[0]);
  const [arrivalDate, setArrivalDate] = useState(new Date().toISOString().split("T")[0]);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [departureCalendarVisible, setDepartureCalendarVisible] = useState(false);
  const [arrivalCalendarVisible, setArrivalCalendarVisible] = useState(false);
  const [cardWidth, setCardWidth] = useState(null);
  const [dropdownWidth, setdropdownWidth] = useState(null);
  const [departurePlaceId, setDeparturePlaceId] = useState("");
  const [arrivalPlaceId, setArrivalPlaceId] = useState("");
  const [departureAirportOptions, setDepartureAirportOptions] = useState([]);
  const [arrivalAirportOptions, setArrivalAirportOptions] = useState([]);

  const [selectedOption, setSelectedOption] = useState(null);
  // peopleCounts = {Adult: #, Child: # Infant: #}
  const [peopleCounts, setPeopleCounts] = useState({});
  const [sortKey, setSortKey] = useState('');
  const [isAscending, setIsAscending] = useState(true);
  // used in filters
  const [flightType, setFlightType] = useState({ value: "Round trip" });
  const [travelClass, setTravelClass] = useState({ value: "Economy" });
  const [sortType, setSortType] = useState({ value: "Price" });

  const flightTypeOptions = [
    { value: "Round trip" },
    { value: "One-way" },
    //{ value: "Multi-city" },
  ];

  const travelClassOptions = [
    { value: "Economy" },
    { value: "Premium Economy" },
    { value: "Business" },
    { value: "First" },
  ];

  const sortingOptions = [
    { value: "Price" },
    { value: "Duration" },
  ];


  const handleFlightSelect = (option) => {
    setFlightType(option);
  };

  const handleTravelClassSelect = (option) => {
    setTravelClass(option);
  };

  const handlePeopleCountsUpdate = (newPeopleCounts) => {
    setPeopleCounts(newPeopleCounts);
  };

  const handleSortTypeSelect = (option)=>{
    setSortType(option);
    sortFlights(option.value);
    
  }


  const sortFlights = (key) => {
    const sortedFlights = flights.sort((a, b) => {
      if (isAscending) {
        if (key === 'price') {
          return a.price - b.price;
        } else if (key === 'total_duration') {
          return a.total_duration - b.total_duration;
        }
      } else {
        if (key === 'price') {
          return b.price - a.price;
        } else if (key === 'total_duration') {
          return b.total_duration - a.total_duration;
        }
      }
    });
    setFlights(sortedFlights);
    setSortKey(key);
    setIsAscending(!isAscending);
  };


  // Callback function for selecting flight type
  const handleFlightTypeSelect = (filterType, option) => {
    switch (filterType) {
      case "flightType":
        setFlightType(option.value);
        break;
      case "travelClass":
        setTravelClass(option.value);
        break;
    }
  };

  useEffect(() => {
    const screenWidth = Dimensions.get("window").width;
    const calculatedCardWidth = screenWidth * 0.8;
    const dropdownWidth = screenWidth / 3;
    setCardWidth(calculatedCardWidth);
  }, []);

  useEffect(() => {
    // This effect is currently empty
    // It will run after each render cycle when peopleCounts changes
  }, [peopleCounts]);

  const getNearbyAirports = async (lat, lng) => {
    try {
      const response = await axios.get(
        `http://iatageo.com/getCode/${lat}/${lng}`
      );
      const { IATA } = response.data;
      console.log("IATA:", IATA);
      return IATA;
    } catch (error) {
      console.error("Error fetching nearby airports:", error);
      return null;
    }
  };

  const searchFlights = async () => {
    setLoading(true);
    setFlights([]);

    const adultCount = peopleCounts.Adult || 0; // Access Adult count using dot notation
    const childCount = peopleCounts["Child (2-11)"] || 0; // Access Child count using square bracket notation
    const infantInSeatCount = peopleCounts["Infant (in seat)"] || 0; // Access Infant in seat count using square bracket notation
    const infantInLapCount = peopleCounts["Infant (in lap)"] || 0; // Access Infant in lap count using square bracket notation

    if (childCount !== infantInSeatCount + infantInLapCount) {
      alert("Please designate infants correctly.");
      setLoading(false);
      return;
    }

    if (!departurePlaceId || !arrivalPlaceId) {
      alert("Please select departure and/or arrival airports.");
      setLoading(false);
      return;
    }

    if (adultCount === 0) {
      alert("Please select at least one adult.");
      setLoading(false);
      return;
    }

    const flightTypeInt = flightType.value === "Round trip" ? 1 : flightType.value === "One-way" ? 2 : 1;
    const travelClassInt = travelClass.value === "Economy" ? 1 : travelClass.value === "Premium Economy" ? 2 : travelClass.value === "Business" ? 3 : 4;

    let returnDateToSend = arrivalDate; // Default return date is arrival date (for one way detection)

    if (flightType.value === "One-way" || flightTypeInt === 2) {
      returnDateToSend = null;
  }

    try {
      // Use departure and arrival IATA codes in the API request
      const response = await axios.get("https://serpapi.com/search", {
        params: {
          api_key:
            "9978848158bdda2246a6190f20c0ec8611ba53cec5e0c364ea877d68aba3d976",
          engine: "google_flights",
          departure_id: departurePlaceId,
          arrival_id: arrivalPlaceId,
          currency: "USD",
          travel_class: travelClassInt,
          type: flightTypeInt,
          outbound_date: departureDate,
          return_date: returnDateToSend,
          adults: adultCount,
          children: childCount,
          infants_in_seat: infantInSeatCount,
          infants_on_lap: infantInLapCount,
        },
      });

      // Extract and set flight data
      const bestFlights = response.data.best_flights || [];
      const otherFlights = response.data.other_flights || [];
      const allFlights = [...bestFlights, ...otherFlights];

      // Include only  the flights that match what the user chose
      allFlights.filter(function (flight) {
        // Check if the flight type matches flightType
        var isCorrectType = flight.type === flightType.value;

        // Check if any of the classes within the flight match travelClass
        var hasCorrectTravelClass = flight.flights.some(function (
          flightDetail
        ) {
          return flightDetail.travel_class === travelClass.value;
        });

        // Return true only if both conditions are met
        return isCorrectType && hasCorrectTravelClass;
      });

      setFlights(allFlights);
    } catch (error) {
      console.error("Error fetching flights:", error);
    }
    setLoading(false);
  };

  const getCoordinates = async (address) => {
    try {
      const response = await axios.get(
        "https://maps.googleapis.com/maps/api/geocode/json",
        {
          params: {
            address: address,
            key: "AIzaSyBNAj7uomTA-m9Gja0gV8-wv2YQdIHGCo8", // Replace with your Google Geocoding API key
          },
        }
      );

      // Parse the response to extract latitude and longitude
      const { results } = response.data;
      if (results && results.length > 0) {
        const { geometry } = results[0];
        if (geometry && geometry.location) {
          const { lat, lng } = geometry.location;
          console.log("Latitude:", lat, "Longitude:", lng);
          return { lat, lng };
        } else {
          console.error("No geometry data found in Geocoding API response");
          return null;
        }
      } else {
        console.error("No results found in Geocoding API response");
        return null;
      }
    } catch (error) {
      console.error("Error fetching coordinates from Geocoding API:", error);
      return null;
    }
  };

  const handleDepartureSelection = async (data, details = null) => {
    console.log("Departure details:", details);
    if (details) {
      const { place_id } = details;
      console.log("Departure place_id:", place_id);
      try {
        const coordinates = await getCoordinates(details.description);
        if (coordinates) {
          console.log("Departure coordinates:", coordinates);
          const { lat, lng } = coordinates;
          const airportCode = await getNearbyAirports(lat, lng);
          console.log("Departure airport code:", airportCode);
          setDeparturePlaceId(airportCode);
          setDepartureAirportOptions([{ place_id, airportCode }]);
        }
      } catch (error) {
        console.error("Error fetching airport details for departure:", error);
      }
    }
  };

  const handleArrivalSelection = async (data, details = null) => {
    console.log("Arrival details:", details);
    if (details) {
      const { place_id } = details;
      console.log("Arrival place_id:", place_id);
      try {
        const coordinates = await getCoordinates(details.description);
        if (coordinates) {
          console.log("Arrival coordinates:", coordinates);
          const { lat, lng } = coordinates;
          const airportCode = await getNearbyAirports(lat, lng);
          console.log("Arrival airport code:", airportCode);
          setArrivalPlaceId(airportCode);
          setArrivalAirportOptions([{ place_id, airportCode }]);
        }
      } catch (error) {
        console.error("Error fetching airport details for arrival:", error);
      }
    }
  };

  const goToFlightDetails = (flightDetails) => {
    navigation.navigate("FlightDetails", { flightDetails });
  };

  const renderFlightCard = ({ item }) => {
    const departureTime = moment(item.flights[0].departure_airport.time).format(
      "h:mm A"
    );
    const arrivalTime = moment(item.flights[0].arrival_airport.time).format(
      "h:mm A"
    );


    // tq
    return (
      <TouchableOpacity onPress={() => goToFlightDetails(item)}>
        <View style={[styles.cardContainer, { width: cardWidth }]}>
          <Image
            source={{ uri: item.airline_logo }}
            style={styles.cardImage}
            resizeMode="cover"
          />
          <View style={styles.overlay}>
            <Text style={styles.overlayText}>
              Flight Number: {item.flights[0].flight_number}
            </Text>
            <View style={styles.airportContainer}>
              <Text style={styles.overlayText}>Departure Airport:</Text>
              <Text style={[styles.overlayText, styles.airportName]}>
                {item.flights[0].departure_airport.name}
              </Text>
            </View>
            <View style={styles.airportContainer}>
              <Text style={styles.overlayText}>Arrival Airport:</Text>
              <Text style={[styles.overlayText, styles.airportName]}>
                {item.flights[0].arrival_airport.name}
              </Text>
            </View>
            <View style={styles.timeContainer}>
              <FontAwesome5 name="plane-departure" size={20} color="#007bff" />
              <Text style={styles.time}>{departureTime}</Text>
              <View style={styles.arrowContainer}>
                <FontAwesome5
                  name="long-arrow-alt-right"
                  size={20}
                  color="#007bff"
                  style={styles.arrow}
                />
              </View>
              <FontAwesome5 name="plane-arrival" size={20} color="#007bff" />
              <Text style={styles.time}>{arrivalTime}</Text>
            </View>
            <View>
              <Text style={styles.bottomRow}>
                Travel Class: {item.flights[0].travel_class}
              </Text>
              <Text style={styles.bottomRow}>
                Type: {item.type}
              </Text>
            </View>
            <View style={styles.bottomRow}>
              <Text style={styles.bottomRowText}>
                Duration: {Math.floor(item.total_duration / 60)}h{" "}
                {item.total_duration % 60}m
              </Text>
              <Text style={styles.bottomRowText}>Price: ${item.price}</Text>
            </View>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      {/* Departure and Arrival Section */}
      <View style={styles.topSection}>
        <View style={styles.locationContainer}>
          <GooglePlacesAutocomplete
            placeholder="Departure Airport"
            onPress={handleDepartureSelection}
            query={{
              key: "AIzaSyBNAj7uomTA-m9Gja0gV8-wv2YQdIHGCo8",
              language: "en",
            }}
            styles={{
              textInputContainer: styles.autocompleteContainer,
              textInput: styles.autocompleteInput,
            }}
          />
        </View>
        <View style={styles.locationContainer}>
          <GooglePlacesAutocomplete
            placeholder="Arrival Airport"
            onPress={handleArrivalSelection}
            query={{
              key: "AIzaSyBNAj7uomTA-m9Gja0gV8-wv2YQdIHGCo8",
              language: "en",
            }}
            styles={{
              textInputContainer: styles.autocompleteContainer,
              textInput: styles.autocompleteInput,
            }}
          />
        </View>
      </View>


        {/* Sorting options */}
        <View style={styles.sortContainer}>
              <Text style={styles.sortText}>Sort by:</Text>
              <TouchableOpacity onPress={() => sortFlights('price')}>
                <Text style={styles.sortOption}>Price</Text>
                {isAscending && sortKey === 'price' ? (
                  <FontAwesome name="arrow-up" size={12} color="gray" />
                ) : (
                  <FontAwesome name="arrow-down" size={12} color="gray" />
                )}
              </TouchableOpacity>
              <TouchableOpacity onPress={() => sortFlights('total_duration')}>
                <Text style={styles.sortOption}>Duration</Text>
                {isAscending && sortKey === 'total_duration' ? (
                  <FontAwesome name="arrow-up" size={12} color="gray" />
                ) : (
                  <FontAwesome name="arrow-down" size={12} color="gray" />
                )}
              </TouchableOpacity>
          </View>


       {/* START OF DROPDOWN SECTION */}
      {/* Container for Flight Type dropdown */}
      <View style={[styles.dropdownContainer, { top: 1, left: 30, width: dropdownWidth }]}>
        <CustomDropdown
          options={flightTypeOptions}
          onSelect={handleFlightSelect}
          selectedOption={flightType}
        />
      </View>

      {/* Container for Travel Class dropdown */}
      <View style={[styles.dropdownContainer, { top: 1, left: 275, width: dropdownWidth }]}>
        <CustomDropdown
          options={travelClassOptions}
          onSelect={handleTravelClassSelect}
          selectedOption={travelClass}
        />
      </View>

      {/* Container for People dropdown */}
      <View style={[styles.dropdownContainer, { top: 1, left: 125, width: dropdownWidth }]}>
        <PeopleDropdown
          options={[
            "Adult",
            "Child (2-11)",
            "Infant (in seat)",
            "Infant (in lap)",
          ]}
          onUpdate={handlePeopleCountsUpdate}
          peopleCounts={peopleCounts} // Pass peopleCounts as a prop
        />
      </View>
      {/* END OF DROPDOWN SECTION*/}

      {/* Display selected departure and arrival dates */}
      <View style={styles.dateContainer}>
        <View style={styles.dateItem}>
          <Text style={styles.selectedDateText}>
            Departure Date: {moment(departureDate).format("MMMM DD, YYYY")}
          </Text>
          <TouchableOpacity onPress={() => setDepartureCalendarVisible(true)}>
            <FontAwesome5 name="calendar" size={20} color="black" />
          </TouchableOpacity>
        </View>
        <View style={styles.dateItem}>
          <Text style={styles.selectedDateText}>
            Arrival Date: {moment(arrivalDate).format("MMMM DD, YYYY")}
          </Text>
          <TouchableOpacity onPress={() => setArrivalCalendarVisible(true)}>
            <FontAwesome5 name="calendar" size={20} color="black" />
          </TouchableOpacity>
        </View>
      </View>

      {/* Search Button */}
      <Button title="Search Flights" onPress={searchFlights} />

      {/* Flight results section */}
      <FlatList
  data={flights}
  renderItem={renderFlightCard}
  keyExtractor={(item, index) => index.toString()}
  contentContainerStyle={styles.flatListContainer}
  horizontal={false} // Restrict scrolling to vertical movement
  keyboardShouldPersistTaps="handled" // Prevent the screen from scrolling
/>

      {/* Loading Indicator */}
      {loading && (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#0000ff" />
        </View>
      )}

      {/* Departure Calendar modal */}
      <Modal
        visible={departureCalendarVisible}
        animationType="fade"
        transparent={true}
        onRequestClose={() => setDepartureCalendarVisible(false)}
      >
        {/* Calendar content */}
        <TouchableWithoutFeedback
          onPress={() => setDepartureCalendarVisible(false)}
        >
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
              <CalendarPicker
                minDate={new Date()} // Prevent selecting dates before today
                onDateChange={(date) => {
                  setSelectedDate(date);
                  const formattedDate = date.toISOString().split("T")[0]; // Formats the date as YYYY-MM-DD
                  setDepartureDate(formattedDate);
                  if (moment(date).isAfter(arrivalDate)) {
                    setArrivalDate(formattedDate);
                  }
                  setDepartureCalendarVisible(false);
                }}
                width={300}
                height={400}
              />
            </View>
          </View>
        </TouchableWithoutFeedback>
      </Modal>

      {/* Arrival Calendar modal */}
      <Modal
        visible={arrivalCalendarVisible}
        animationType="fade"
        transparent={true}
        onRequestClose={() => setArrivalCalendarVisible(false)}
      >
        {/* Calendar content */}
        <TouchableWithoutFeedback
          onPress={() => setArrivalCalendarVisible(false)}
        >
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
              <CalendarPicker
                minDate={new Date()} // Prevent selecting dates before today
                onDateChange={(date) => {
                  setSelectedDate(date);
                  const formattedDate = date.toISOString().split("T")[0]; // Formats the date as YYYY-MM-DD
                  setArrivalDate(formattedDate);
                  if (moment(date).isBefore(departureDate)) {
                    setDepartureDate(formattedDate);
                  }
                  setArrivalCalendarVisible(false);
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
    alignItems: "center",
    justifyContent: "center",
    padding: 30,
    position: "relative", // Set position to relative
  },
  topSection: {
    flexDirection: "row", // Change to horizontal layout
    flexWrap: "wrap", // Allow content to wrap to the next line if needed
    marginBottom: 20,
    alignItems: "center",
    justifyContent: "space-between", // Distribute items evenly along the main axis
  },
  locationContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center", // Align items in the center horizontally
    marginBottom: 10,
  },
  dropdownContainer: {
    position: "absolute", // Position the dropdowns absolutely
    zIndex: 1, // Set a higher z-index to ensure it appears above other content
  },
  listContainer: {
    flex: 1,
    width: "100%",
  },
  loadingContainer: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: "center",
    alignItems: "center",
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  calendarButton: {
    fontSize: 18,
    color: "blue",
    marginBottom: 10,
  },
  dateItem: {
    flexDirection: "row", // Arrange text and icon horizontally
    alignItems: "center",
    justifyContent: "center", // Align items in the center horizontally
    paddingBottom: 20,
  },
  selectedDateText: {
    fontSize: 16,
    textAlign: "center", // Center the text
    marginRight: 10, // Add margin to separate text and icon
  },
  modalContent: {
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 20,
    width: "80%",
    maxHeight: "80%",
  },
  flatListContainer: {
    flexGrow: 1,
    alignItems: "center",
    paddingHorizontal: 20,
  },
  cardContainer: {
    marginVertical: 8,
    alignSelf: "stretch",
  },
  card: {
    flexDirection: "row",
    padding: 8,
    backgroundColor: "#F5F5F5",
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#E0E0E0",
  },
  cardContent: {
    flex: 1,
    justifyContent: "center",
    marginLeft: 8,
  },
  cardText: {
    fontSize: 14,
    marginBottom: 4,
  },
  cardImage: {
    width: 100,
    height: 100,
    borderRadius: 8,
  },
  autocompleteContainer: {
    width: "100%",
  },
  autocompleteInput: {
    height: 40,
    borderWidth: 1,
    borderColor: "#ccc",
    paddingHorizontal: 10,
  },
  dateContainer: {
    marginBottom: 20,
  },
  bottomRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 5,
    paddingVertical: 5,
  },
  bottomRowText: {
    fontSize: 13,
  },
  timeContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  time: {
    marginLeft: 5,
    marginRight: 5,
  },
  arrowContainer: {
    paddingHorizontal: 5,
  },
  airportContainer: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 5,
  },
  airportName: {
    flex: 1,
    marginLeft: 5,
    marginRight: 5,
    flexWrap: "wrap",
  },
  topSection: {
    flexDirection: "row", // Change to horizontal layout
    flexWrap: "wrap", // Allow content to wrap to the next line if needed
    marginBottom: 20,
    alignItems: "center",
    justifyContent: "space-between", // Distribute items evenly along the main axis
  },
  filterContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center", // Align items in the center horizontally
    marginBottom: 10,
    marginRight: 10, // Add right margin to create space between dropdowns
  },
  sortButton: {
    backgroundColor: 'transparent',
    borderRadius: 5,
    paddingVertical: 8,
    paddingHorizontal: 15,
    marginVertical: 10, 
    marginHorizontal: 10, 
    flexDirection: 'row',
    alignItems: 'center',
  },
  sortButtonBorder: {
    borderWidth: 1,
    borderColor: 'lightgray',
  },
  sortButtonText: {
    color: 'black',
    marginRight: 5,
  },
  sortOption: {
    fontSize: 16,
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderColor: '#ccc',
  },
  sortContainer: {
    flexDirection: 'row',
    padding: 5,

  },
});

export default FlightSearch;