// Api config Settings and inti 
const express = require('express');
const cors = require('cors');
const { GoogleGenerativeAI, HarmCategory, HarmBlockThreshold } = require('@google/generative-ai');

const app = express();
const port = 3000;
app.use(express.json());
app.use(cors());


///////////////////////////////////////////////// GEMINI API CONFIG ///////////////////////////////////////////////

const GEMINI_MODEL_NAME = "gemini-pro";
const GEMINI_API_KEY = "";

async function runChat(userInput) {
  const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);
  const model = genAI.getGenerativeModel({ model: GEMINI_MODEL_NAME });

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

  const chat = model.startChat({
    generationConfig,
    safetySettings,
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
  });

  const result = await chat.sendMessage(userInput);
  const response = result.response;
  return response.text();
}

app.post('/chat', async (req, res) => {
  try {
    const userInput = req.body?.userInput;
    console.log('incoming /chat req', userInput)
    if (!userInput) {
      return res.status(400).json({ error: 'Invalid request body' });
    }

    const response = await runChat(userInput);
    res.json({ response });
  } catch (error) {
    console.error('Error in chat endpoint:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

///////////////////////////////////////////////// GEMINI API CONFIG END ///////////////////////////////////////////////

app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});