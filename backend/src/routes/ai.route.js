import express from "express";
import { protectRoute } from "../middleware/auth.middleware.js";
import { chatWithGemini } from "../controllers/ai.controller.js";

const router = express.Router();

router.post("/chat", protectRoute, chatWithGemini);

export default router;