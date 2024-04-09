import React, { useState } from 'react';
import { View, Text, TextInput, ScrollView, Button, StyleSheet, ActivityIndicator } from 'react-native';
import axios from 'axios';

const SearchScreen = () => {
  const [chatHistory, setChatHistory] = useState([]);
  const [userInput, setUserInput] = useState('');
  const [loading, setLoading] = useState(false);

  const sendMessage = async () => {
    const message = userInput.trim();
    if (!message) return;

    setUserInput('');
    setLoading(true);

    try {
      const response = await axios.post('http://localhost:3000/chat', { userInput: message });
      const botMessage = response.data.response;

      setChatHistory(prevHistory => ([
        ...prevHistory,
        { text: message, isUser: true },
        { text: botMessage, isUser: false }
      ]));
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>TripEasy Chatbot</Text>
      <ScrollView style={styles.chatHistory} contentContainerStyle={{ paddingBottom: 20 }}>
        {chatHistory.map((message, index) => (
          <View key={index} style={[styles.messageContainer, message.isUser ? styles.userMessageContainer : styles.botMessageContainer]}>
            <Text style={styles.messageText}>{message.text}</Text>
          </View>
        ))}
      </ScrollView>
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.textInput}
          value={userInput}
          onChangeText={setUserInput}
          placeholder="Enter your message"
        />
        <Button
          title="Send"
          onPress={sendMessage}
          disabled={loading}
        />
      </View>
      {loading && <ActivityIndicator size="large" color="#0000ff" />}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f0f0f0',
    paddingHorizontal: 20,
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    marginTop: 20,
    marginBottom: 20,
  },
  chatHistory: {
    flex: 1,
    width: '100%',
    marginBottom: 20,
    paddingHorizontal: 10,
  },
  messageContainer: {
    maxWidth: '80%',
    alignSelf: 'flex-start',
    marginVertical: 5,
    padding: 10,
    borderRadius: 10,
  },
  userMessageContainer: {
    alignSelf: 'flex-end',
    backgroundColor: 'blue',
    color: 'white',
  },
  botMessageContainer: {
    alignSelf: 'flex-start',
    backgroundColor: 'green',
  },
  messageText: {
    fontSize: 16,
    color: 'white',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  textInput: {
    flex: 1,
    marginRight: 10,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    paddingVertical: 5,
    paddingHorizontal: 10,
  },
});

export default SearchScreen;