import { GoogleGenerativeAI } from "@google/generative-ai";
import Message from "../models/message.model.js";
import User from "../models/user.model.js";

// A fixed dummy ID for the AI (24 chars hex)
export const AI_ID = "555555555555555555555555";

export const chatWithGemini = async (req, res) => {
  try {
    const { text } = req.body;
    const myId = req.user._id;

    if (!process.env.GEMINI_API_KEY) {
      return res.status(500).json({ message: "Gemini API Key not configured" });
    }

    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

    // 1. Save USER message to DB
    const userMessage = new Message({
      senderId: myId,
      receiverId: AI_ID,
      text: text,
    });
    await userMessage.save();

    // 2. Define the "Friend" Persona
    const prompt = `
      You are a friendly, casual, and supportive AI friend. 
      Do not act like a robot or an assistant. 
      Use emojis occasionally. Keep responses concise and conversational.
      
      User says: ${text}
    `;

    // 3. Get AI Response
    const result = await model.generateContent(prompt);
    const aiResponseText = result.response.text();

    // 4. Save AI message to DB
    const aiMessage = new Message({
      senderId: AI_ID,
      receiverId: myId,
      text: aiResponseText,
    });
    await aiMessage.save();

    // 5. Return the AI's message
    res.status(200).json(aiMessage);

  } catch (error) {
    console.error("Error in chatWithGemini: ", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
};