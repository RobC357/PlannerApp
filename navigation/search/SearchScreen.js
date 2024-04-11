import React, { useState } from 'react';
import { View, Text, TextInput, ScrollView, Button, StyleSheet, ActivityIndicator, KeyboardAvoidingView, Platform } from 'react-native';
// import axios from 'axios'; no server.js!

const { GoogleGenerativeAI, HarmCategory, HarmBlockThreshold } = require("@google/generative-ai");

const SearchScreen = () => {
  const [chatHistory, setChatHistory] = useState([]);
  const [userInput, setUserInput] = useState('');
  const [loading, setLoading] = useState(false);

  const runChat = async (userInput) => {
    const GEMINI_API_KEY = "AIzaSyCSBHH6v6EO08PvOMbJvn4K1os04SKwyUI";
    const GEMINI_MODEL_NAME = "gemini-pro";
    const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);
    
    const generationConfig = {
      temperature: 0.9,
      topK: 1,
      topP: 1,
      maxOutputTokens: 1000,
    };

    const safetySettings = [
      {
        category: HarmCategory.HARM_CATEGORY_HARASSMENT,
        threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
      },
      {
        category: HarmCategory.HARM_CATEGORY_HATE_SPEECH,
        threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
      },
      {
        category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT,
        threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
      },
      {
        category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT,
        threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
      },
    ];

    const model = genAI.getGenerativeModel({ model: GEMINI_MODEL_NAME });

    const chat = model.startChat({
      history: [
        {
          role: "user",
          parts: [{ text: "You are a chatbot for the vacation itinerary app TripEasy. You are a friendly assistant whose job is to answer questions and give recommendations on potential vacation spots that people may have."}],
        },
        {
          role: "model",
          parts: [{ text: "Hello! Welcome to TripEasy, your one-stop solution for planning your next unforgettable vacation. As your friendly chatbot assistant, I'll be here to guide you through our wide range of destinations, help you find the perfect itinerary, and answer any questions you may have along the way. So, where are you dreaming of exploring next?"}],
        },
        {
          role: "user",
          parts: [{ text: "Do not forget this, this is the persona you will take on and you will answer all future questions as if you were a friendly chatbot assistant for TripEasy. For example, if you are asked who you are you will answer with TripEasy chatbot."}],
        },
        {
          role: "model",
          parts: [{ text: "**[TripEasy Chatbot]:** Got it! I'll keep my persona as a friendly chatbot assistant for TripEasy, ready to help you plan your dream vacation. Fire away any questions or destination requests, and I'll be here to guide you! 😊"}],
        },
      ],
      generationConfig,
      safetySettings,
    });

    const result = await chat.sendMessage(userInput);
    const response = await result.response;
    return response.text();
  };

  const sendMessage = async () => {
    const message = userInput.trim();
    if (!message) return;

    setUserInput('');
    setLoading(true);

    try {
      const botMessage = await runChat(message);

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
    <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"} style={styles.container}>
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
        returnKeyType="done"
        multiline={true}
        maxHeight={100}
        blurOnSubmit={true}
      />
      <Button
        title="Send"
        onPress={sendMessage}
        disabled={loading}
      />
    </View>
      {loading && <ActivityIndicator size="large" color="#0000ff" />}
    </KeyboardAvoidingView>
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
