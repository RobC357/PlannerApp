import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ImageBackground,
  StyleSheet,
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
      <ImageBackground
        source={require("../../images/testImage.png")}
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
    </View>
  );
};

const styles = StyleSheet.create({
  outerContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  innerContainer: {
    marginLeft: "20%",
    marginRight: "20%",
    marginTop: "40%",
    marginBottom: "40%",
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
    fontSize: 16,
    fontWeight: "bold",
    color: "black",
    lineHeight: 20,
  },
  buttonsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "80%",
  },
  button: {
    backgroundColor: "dodgerblue",
    padding: 10,
    borderRadius: 8,
    marginVertical: 10,
    width: (300 * 0.8 - 10) / 2, // Calculates button width dynamically based on the inner container's width
  },
  leftButton: {
    marginRight: 10,
  },
  buttonText: {
    color: "white",
    fontSize: 16,
    textAlign: "center",
  },
  tripEasyText: {
    fontWeight: "bold",
    fontSize: 52,
    color: "black",
  },
  titleContainer: {
    alignItems: "center",
    marginBottom: "60%",
  },
});

export default LandingPageScreen;
