import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import { AntDesign } from '@expo/vector-icons';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { getAuth, createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';

const auth = getAuth();

const RegisterScreen = ({ navigation }) => {
  const [displayName, setDisplayName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleRegister = async () => {
    if (displayName.trim() === '' || email.trim() === '' || password.trim() === '') {
      setError('Please fill in all fields.');
      resetErrorMessage();
      return;
    }
  
    // Check for a valid email format
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError('Please enter a valid email address.');
      resetErrorMessage();
      return;
    }
  
    if (!/(?=.*[A-Z])(?=.*[0-9])/.test(password)) {
      setError('Password must contain at least one uppercase letter and one number.');
      resetErrorMessage();
      return;
    }
  
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
  
      // Set the display name for the user
      await updateProfile(userCredential.user, { displayName: displayName });
  
      // Navigate to the profile screen
      navigation.navigate('LandingPage');
    } catch (error) {
      // Handle registration errors
      if (error.code === 'auth/email-already-in-use') {
        setError('This email is already registered. Please login instead.');
      } else {
        console.error('Registration error:', error.message);
      }
    }
  };

  const resetErrorMessage = () => {
    setTimeout(() => {
      setError('');
    }, 1500);
  };

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
          value={displayName}
          onChangeText={setDisplayName}
          placeholder="Display Name"
        />
        <TextInput
          style={styles.input}
          value={email}
          onChangeText={setEmail}
          placeholder="Email"
          keyboardType="email-address"
        />
        <TextInput
          style={styles.input}
          value={password}
          onChangeText={setPassword}
          placeholder="Password"
          //secureTextEntry
        />
        <TouchableOpacity style={styles.registerButton} onPress={handleRegister}>
          <Text style={styles.buttonText}>Register</Text>
        </TouchableOpacity>
        <View style={styles.errorContainer}>
          {error !== '' && <Text style={styles.errorText}>{error}</Text>}
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
    backgroundColor: 'dodgerblue',
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
    paddingHorizontal: 20,
  },
  errorText: {
    color: 'red',
    textAlign: 'center',
  },
});

export default RegisterScreen;