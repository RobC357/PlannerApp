import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';

const ChatLogDetails = ({ route }) => {
  const { entry } = route.params;

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.header}>{entry.logName}</Text>
      <View style={styles.chatHistory}>
        {entry.chat.map((message, index) => (
          <View key={index} style={[styles.messageContainer, message.isUser ? styles.userMessageContainer : styles.botMessageContainer]}>
            <Text style={styles.messageText}>{message.text}</Text>
          </View>
        ))}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f0f0f0',
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  chatHistory: {
    width: '100%',
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
});

export default ChatLogDetails;