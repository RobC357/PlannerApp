import React, { useState, useEffect } from 'react';
import { getFirestore, collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { FontAwesome } from '@expo/vector-icons';
import { View, Text, TextInput, Button, StyleSheet, ActivityIndicator, Modal, TouchableOpacity, Alert, SafeAreaView, Keyboard } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'; // Updated import

const { GoogleGenerativeAI, HarmCategory, HarmBlockThreshold } = require("@google/generative-ai");

const SearchScreen = () => {
  const [chatHistory, setChatHistory] = useState([]);
  const [userInput, setUserInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [logName, setLogName] = useState('');
  const [trashDisabled, setTrashDisabled] = useState(true);
  const auth = getAuth();

  const runChat = async (userInput) => {
    const GEMINI_API_KEY = "AIzaSyACSmzLrB3lkkfwY2nRZgdN66i0x9o1gwQ";
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
      history: [...initialPrompt, ...chatHistory.map((message) => ({ // Combine prompts
        role: message.isUser ? "user" : "model",
        parts: [{ text: message.text }],
      }))],
      generationConfig,
      safetySettings,
    });

    const result = await chat.sendMessage(userInput);
    const response = await result.response;
    return response.text();
  };

  const initialPrompt = [
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
  ];

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

  const confirmClearChat = () => {
    Alert.alert(
      'Confirmation',
      'Are you sure you want to clear the chat history?',
      [
        {
          text: 'Cancel',
          style: 'cancel'
        },
        {
          text: 'Clear',
          onPress: clearChatHistory
        }
      ]
    );
  };

  const clearChatHistory = () => {
    setChatHistory([]);
    setUserInput('');
    setTrashDisabled(true); // Disable trash button after clearing chat history
  };

  const saveChatLog = async () => {
    try {
      const user = auth.currentUser; // Retrieve the current user
      const firestore = getFirestore();
      const logsRef = collection(firestore, 'chatLogs');
  
      if (logName.trim() === '') {
        alert('Please enter a log name.');
        return; // Return without saving if log name is empty
      }
  
      const logData = {
        timestamp: serverTimestamp(),
        userUID: user.uid, // Access the user UID
        logName: logName.trim(), // Add log name
        chat: chatHistory.map(message => ({ text: message.text, isUser: message.isUser }))
      };
  
      await addDoc(logsRef, logData);
      console.log('Chat log saved successfully.');
      alert('Chat log saved successfully.'); // Add confirmation message
  
      // Clear the log name after saving
      setLogName('');
    } catch (error) {
      console.error('Error saving chat log:', error);
    }
  };
  
  const handleSaveLog = () => {
    setModalVisible(true);
  };

  const handleSaveLogConfirm = () => {
    setModalVisible(false);
    saveChatLog();
  };

  const handleCancelSaveLog = () => {
    setModalVisible(false);
  };

  const handleTrashIconPress = () => {
    confirmClearChat();
  };

  useEffect(() => {
    setTrashDisabled(chatHistory.length === 0);
  }, [chatHistory]);

 return (
    <SafeAreaView style={{ flex: 1 }}>
      <KeyboardAwareScrollView
        contentContainerStyle={{ flexGrow: 1 }}
        extraScrollHeight={Platform.select({ ios: 50, android: 0 })}
        enableOnAndroid={true}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.container}>
          <Text style={styles.header}>TripEasy Chatbot</Text>
          <View style={styles.chatHistory}>
            {chatHistory.map((message, index) => (
              <View key={index} style={[styles.messageContainer, message.isUser ? styles.userMessageContainer : styles.botMessageContainer]}>
                <Text style={styles.messageText}>{message.text}</Text>
              </View>
            ))}
          </View>
          <View style={styles.inputContainer}>
            <TextInput
              style={styles.textInput}
              value={userInput}
              onChangeText={setUserInput}
              placeholder="Enter your message"
              returnKeyType="done"
              blurOnSubmit={true}
            />
            <Button
              title="Send"
              onPress={sendMessage}
              disabled={loading}
            />
            <Button
              title="Save Log"
              onPress={handleSaveLog}
              disabled={loading || chatHistory.length === 0}
            />
            <TouchableOpacity
              onPress={trashDisabled ? null : handleTrashIconPress}
              disabled={trashDisabled}
            >
              <FontAwesome name="trash" size={24} color={trashDisabled ? 'gray' : 'black'} />
            </TouchableOpacity>
          </View>
        </View>
        {loading && <ActivityIndicator size="large" color="#0000ff" />}
        <Modal
          animationType="fade"
          transparent={true}
          visible={modalVisible}
          onRequestClose={() => setModalVisible(false)}
        >
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
              <TextInput
                style={styles.modalTextInput}
                value={logName}
                onChangeText={setLogName}
                placeholder="Enter log name"
              />
              <TouchableOpacity style={styles.modalButton} onPress={handleSaveLogConfirm}>
                <Text>Save</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.modalButton} onPress={handleCancelSaveLog}>
                <Text>Cancel</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      </KeyboardAwareScrollView>
    </SafeAreaView>
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
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
    width: '50%',
    alignItems: 'center',
  },
  modalTextInput: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    paddingVertical: 5,
    paddingHorizontal: 10,
    marginBottom: 10,
    width: '100%',
  },
  modalButton: {
    backgroundColor: 'lightblue',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    marginBottom: 10,
  },
});

export default SearchScreen;