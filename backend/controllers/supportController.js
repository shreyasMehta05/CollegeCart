import axios from 'axios';

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
const GEMINI_MODEL = "gemini-1.5-flash"; // Using the working model

export const chat = async (req, res) => {
  try {
    const { message, context } = req.body;

    if (!message || !context || !Array.isArray(context)) {
      return res.status(400).json({ message: "Message and context are required." });
    }

    // Convert the conversation history to the format expected by the Gemini API.
    const formattedHistory = context.map((msg) => ({
      role: msg.role === 'assistant' ? 'model' : 'user',
      parts: [{ text: msg.content }]
    }));

    // Make sure the conversation starts with a user message
    if (formattedHistory.length > 0 && formattedHistory[0].role !== 'user') {
      formattedHistory.shift();
    }

    const requestBody = {
      contents: [
        ...formattedHistory,
        { parts: [{ text: message }] }
      ]
    };

    // Make the POST request to the Gemini API
    const response = await axios.post(
      `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent?key=${GEMINI_API_KEY}`,
      requestBody,
      { headers: { 'Content-Type': 'application/json' } }
    );

    // Extract the chatbot's reply from the API response.
    const reply = response.data.candidates?.[0]?.content?.parts?.[0]?.text || "I'm not sure how to respond.";
    
    res.json({ reply });
  } catch (error) {
    console.error('Chatbot error:', error.response?.data || error.message);
    res.status(500).json({
      message: 'Error processing chat request',
      error: error.response?.data || error.message,
    });
  }
};
