import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { AntDesign } from '@expo/vector-icons';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { getAuth, signInWithEmailAndPassword, sendPasswordResetEmail } from 'firebase/auth';

const auth = getAuth();

const LoginScreen = ({ navigation }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [resetEmailSent, setResetEmailSent] = useState(false);

  const handleLogin = async () => {
    if (username.trim() === '' && password.trim() === '') {
      setError('Please fill in a username and password.');
    } else if (username.trim() === '') {
      setError('Please fill in a username.');
    } else if (password.trim() === '') {
      setError('Please fill in a password.');
    } else {
      try {
        await signInWithEmailAndPassword(auth, username, password);
        handleClose();
        resetErrorMessage();
      } catch (error) {
        // Handle specific error cases
        switch (error.code) {
          case 'auth/user-not-found':
            setError('User not found. Please check your email.');
            break;
          case 'auth/wrong-password':
            setError('Invalid password. Please check your password.');
            break;
          default:
            setError('Login failed. Please try again later.');
        }
      }
    }
  };

  const handleForgotPassword = async () => {
    if (username.trim() === '') {
      setError('Please fill in your username to reset the password.');
      return;
    }

    try {
      await sendPasswordResetEmail(auth, username);
      setResetEmailSent(true);
      Alert.alert('Password Reset Email Sent', 'Check your email for instructions to reset your password.');
    } catch (error) {
      setError('Error sending password reset email.');
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

  const toggleShowPassword = () => {
    setShowPassword(!showPassword);
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
            placeholder="Email"
          />
          <View style={styles.passwordInputContainer}>
            <TextInput
              style={styles.passwordInput}
              value={password}
              onChangeText={setPassword}
              placeholder="Password"
              secureTextEntry={!showPassword}
            />
            <TouchableOpacity onPress={toggleShowPassword} style={styles.showHideButton}>
              <AntDesign name={showPassword ? 'eye' : 'eyeo'} size={20} color="black" />
            </TouchableOpacity>
          </View>
          <TouchableOpacity style={styles.loginButton} onPress={handleLogin}>
            <Text style={styles.buttonText}>Login</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={handleForgotPassword}>
            <Text style={styles.forgotPasswordText}>Forgot Password?</Text>
          </TouchableOpacity>
          {resetEmailSent && (
            <Text style={styles.errorText}>Password reset email sent successfully.</Text>
          )}
          <View style={styles.errorContainer}>
            {error !== '' && <Text style={styles.errorText}>{error}</Text>}
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
  passwordInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
  },
  passwordInput: {
    flex: 1,
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 8,
    backgroundColor: 'white',
  },
  showHideButton: {
    padding: 10,
  },
  loginButton: {
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
  forgotPasswordText: {
    color: 'blue',
    marginTop: 10,
    textDecorationLine: 'underline',
  },
  errorContainer: {
    width: '80%',
    alignItems: 'center',
    marginTop: 10,
  },
  errorText: {
    height: 20,
    color: 'red',
    marginTop: 10,
    textAlign: 'center',
    width: '150%',
  },
});

export default LoginScreen;