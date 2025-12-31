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

    // 2. Get AI Response
    // Optional: Fetch previous context here if you want conversation history
    const result = await model.generateContent(text);
    const aiResponseText = result.response.text();

    // 3. Save AI message to DB
    const aiMessage = new Message({
      senderId: AI_ID,
      receiverId: myId,
      text: aiResponseText,
    });
    await aiMessage.save();

    // 4. Return the AI's message to the frontend to update the UI immediately
    res.status(200).json(aiMessage);

  } catch (error) {
    console.error("Error in chatWithGemini: ", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
};