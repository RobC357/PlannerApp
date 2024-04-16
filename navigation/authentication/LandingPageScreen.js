import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ImageBackground,
  StyleSheet,
  Dimensions,
  StatusBar,
} from "react-native";

const LandingPageScreen = ({ navigation }) => {

  const handleLogin = () => {
    navigation.navigate("Login");
  };

  const handleRegister = () => {
    navigation.navigate("Register");
  };

  return (
    <View style={styles.outerContainer}>
       <React.Fragment>
      <StatusBar barStyle="dark-content" />
      <ImageBackground
        source={require("../../images/landingPageImage.png")}
        resizeMode="cover"
        style={styles.fullScreenBackground}
      >
        <View style={styles.innerContainer}>
          <View style={styles.titleContainer}>
            <Text style={styles.title}>Welcome to</Text>
            <Text style={styles.tripEasyText}>TripEasy</Text>
          </View>
          <View style={styles.buttonsRow}>
            <TouchableOpacity
              style={[styles.button, styles.leftButton]}
              onPress={handleLogin}
              accessibilityLabel="Log in"
            >
              <Text style={styles.buttonText}>Login</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.button}
              onPress={handleRegister}
              accessibilityLabel="Register"
            >
              <Text style={styles.buttonText}>Register</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ImageBackground>
      </React.Fragment>
    </View>
  );
};

const { width, height } = Dimensions.get("window"); // Get the dimensions of the device's screen

const styles = StyleSheet.create({
  outerContainer: {
    flex: 1,
  },
  innerContainer: {
    marginLeft: width * 0.2, // Use percentages of the screen's width and height for margins
    marginRight: width * 0.2,
    marginTop: height * 0.4,
    marginBottom: height * 0.4,
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  fullScreenBackground: {
    flex: 1,
    width: "100%",
    height: "100%",
  },
  title: {
    fontSize: width * 0.04, // Adjust font size based on screen width
    fontWeight: "bold",
    color: "black",
    lineHeight: height * 0.03, // Adjust line height based on screen height
  },
  buttonsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: width * 0.8, // Use percentages of the screen's width for button width
  },
  button: {
    backgroundColor: "dodgerblue",
    padding: width * 0.02, // Adjust padding based on screen width
    borderRadius: width * 0.02, // Adjust border radius based on screen width
    marginVertical: height * 0.02, // Adjust margin based on screen height
    width: (width * 0.8 - width * 0.02) / 2, // Calculates button width dynamically based on the screen width
  },
  leftButton: {
    marginRight: width * 0.02,
  },
  buttonText: {
    color: "white",
    fontSize: width * 0.04, // Adjust font size based on screen width
    textAlign: "center",
  },
  tripEasyText: {
    fontWeight: "bold",
    fontSize: width * 0.13,
    color: "black",
  },
  titleContainer: {
    alignItems: "center",
    marginBottom: height * 0.06,
  },
});

export default LandingPageScreen;