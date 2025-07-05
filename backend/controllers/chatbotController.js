// chatbotController.js will contain the logic for processing the user’s message and calling the Gemini API to get the chatbot’s response.

import axios from 'axios';
const conversations = new Map();


// const  getChatbotResponse  = async (req, res) => {
//     console.log('Request body:', req.body);
//     const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
//     const GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent';
  
//     try {
//       const response = await axios.post(
//         `${GEMINI_API_URL}?key=${GEMINI_API_KEY}`,
//         {
//           contents: [{
//             parts: [{
//               text: req.body.message
//             }]
//           }]
//         },
//         {
//           headers: {
//             'Content-Type': 'application/json'
//           }
//         }
//       );
//       console.log('Gemini API response:', response.data);
  
//       const botMessage = response.data.candidates[0].content.parts[0].text;
//       res.json({ response: botMessage });
//     } catch (error) {
//       console.error('Error calling Gemini API:', error);
//       res.status(500).json({ message: 'Error processing request' });
//     }
// };
const getChatbotResponse = async (req, res) => {
    const { message, sessionId } = req.body;
    const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
    const GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent';
  
    try {
      // Get or create conversation history
      let conversation = conversations.get(sessionId) || [];
      
      // Add user message to history
      conversation.push({ role: 'user', content: message });
  
      // Prepare context for Gemini
      const contextPrompt = `You are a helpful support assistant for the IIIT Buy-Sell website. 
      Previous conversation: ${conversation.map(msg => `${msg.role}: ${msg.content}`).join('\n')}
      
      Current user message: ${message}
      
      Please provide a helpful response considering the context above.`;
  
      const response = await axios.post(
        `${GEMINI_API_URL}?key=${GEMINI_API_KEY}`,
        {
          contents: [{
            parts: [{
              text: contextPrompt
            }]
          }]
        },
        {
          headers: {
            'Content-Type': 'application/json'
          }
        }
      );
  
      const botMessage = response.data.candidates[0].content.parts[0].text;
      
      // Add bot response to history
      conversation.push({ role: 'assistant', content: botMessage });
      
      // Save updated conversation
      conversations.set(sessionId, conversation);
      
      res.json({ response: botMessage });
    } catch (error) {
      console.error('Error calling Gemini API:', error);
      res.status(500).json({ message: 'Error processing request' });
    }
  };
  
export default getChatbotResponse;