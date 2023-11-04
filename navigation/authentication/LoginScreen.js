import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import { AntDesign } from '@expo/vector-icons';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';

const LoginScreen = ({ navigation }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = () => 
  {
    if (username.trim() === '' && password.trim() === '') {
      setError('Please fill in a username and password.');
    } 
    else if (username.trim() === '') {
      setError('Please fill in a username.');
    } 
    else if (password.trim() === '') {
      setError('Please fill in a password.');
    } 
    else {
      /// DO POST HERE ********************************************************
      handleClose();
      

    }
    resetErrorMessage();
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
    <View style={styles.container}>
    <TouchableOpacity onPress={handleClose} style={styles.closeButton}>
      <AntDesign name="close" size={25} color="black" />
    </TouchableOpacity>
    <Text style={styles.title}>Login</Text>
    <View style={styles.inputContainer}>
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
      <TouchableOpacity style={styles.loginButton} onPress={handleLogin}>
        <Text style={styles.buttonText}>Login</Text>
      </TouchableOpacity>
      <View style={styles.errorContainer}>
          {error !== '' && <Text style={styles.errorText}>{error}</Text>}
          {error === '' && <Text style={styles.errorText}></Text>}
          </View>
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
    width: '100%',
  },
  closeButton: {
    position: 'absolute',
    top: 50,
    right: 25,
    zIndex: 1,
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
  loginButton: {
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

export default LoginScreen;