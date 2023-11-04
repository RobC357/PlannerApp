import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import { AntDesign } from '@expo/vector-icons';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';

const RegisterScreen = ({ navigation }) => {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleRegister = () => 
  {
    if (firstName.trim() === '' || lastName.trim() === '' || username.trim() === '' || password.trim() === '') {
      setError('Please fill in all fields.');
      resetErrorMessage();
      return;
    }

    if (!/^[a-zA-Z]*$/g.test(firstName) || !/^[a-zA-Z]*$/g.test(lastName)) {
      setError('First and Last name should contain only characters.');
      resetErrorMessage();
      return;
    }

    if (username.length < 3) {
      setError('Username should contain at least three characters.');
      resetErrorMessage();
      return;
    }

    if (!/(?=.*[A-Z])(?=.*[0-9])/.test(password)) {
      setError('Password must contain at least one uppercase letter and one number.');
      resetErrorMessage();
      return;
    }

    // DO POST HERE ********************************************************
    handleClose();

  };

  const resetErrorMessage = () => {
    setTimeout(() => {
      setError('');
    }, 1500);
    return;
  }

  const handleClose = () => {
    navigation.navigate('LandingPage');
  };

  return (
    <KeyboardAwareScrollView contentContainerStyle={styles.container} enableOnAndroid={true} keyboardShouldPersistTaps="handled">
      <TouchableOpacity onPress={handleClose} style={styles.closeButton}>
        <AntDesign name="close" size={25} color="black" />
      </TouchableOpacity>
      <Text style={styles.title}>Register</Text>
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          value={firstName}
          onChangeText={setFirstName}
          placeholder="First Name"
        />
        <TextInput
          style={styles.input}
          value={lastName}
          onChangeText={setLastName}
          placeholder="Last Name"
        />
        <TextInput
          style={styles.input}
          value={username}
          onChangeText={setUsername}
          placeholder="Username"
        />
        <TextInput
          style={styles.input}
          value={password}
          onChangeText={setPassword}
          placeholder="Password"
          secureTextEntry
        />
        <TouchableOpacity style={styles.registerButton} onPress={handleRegister}>
          <Text style={styles.buttonText}>Register</Text>
        </TouchableOpacity>
        <View style={styles.errorContainer}>
          {error !== '' && <Text style={styles.errorText}>{error}</Text>}
          {error === '' && <Text style={styles.errorText}></Text>}
      </View>
      </View>
      </KeyboardAwareScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    width: "100%",
  },
  closeButton: {
    position: 'absolute',
    top: 50,
    right: 25,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  inputContainer: {
    width: '80%',
    alignItems: 'center',
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    width: '100%',
    marginVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 8,
    backgroundColor: 'white',
  },
  registerButton: {
    backgroundColor: 'blue',
    padding: 15,
    marginVertical: 20,
    borderRadius: 8,
    width: '100%',
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  errorContainer: {
    width: '80%',
    alignItems: 'center',
    marginTop: 10,
  },
  errorText: {
    height: 20,
    color: 'red',
  },
});

export default RegisterScreen;