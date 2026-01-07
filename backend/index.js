import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url"; // 1. IMPORT THIS

import { connectDB } from "./src/lib/db.js";

import authRoutes from "./src/routes/auth.route.js";
import messageRoutes from "./src/routes/message.route.js";
import { app, server } from "./src/lib/socket.js";
import aiRoutes from "./src/routes/ai.route.js";

dotenv.config();

const PORT = process.env.PORT;

// 2. FIX PATH RESOLUTION (The Critical Change)
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
// Now __dirname is guaranteed to be the "backend" folder

app.use(express.json({ limit: "10mb" })); 
app.use(express.urlencoded({ limit: "10mb", extended: true }));
app.use(cookieParser());

app.use(
  cors({
    origin: ["http://localhost:5173", process.env.CLIENT_URL],
    credentials: true,
  })
);

app.use("/api/auth", authRoutes);
app.use("/api/messages", messageRoutes);
app.use("/api/ai", aiRoutes);

if (process.env.NODE_ENV === "production") {
  // 3. USE THE FIXED __dirname HERE
  // This correctly goes up one level to "root", then into "frontend/dist"
  app.use(express.static(path.join(__dirname, "../frontend/dist")));

  app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "../frontend", "dist", "index.html"));
  });
}

server.listen(PORT, () => {
  console.log("server is running on PORT:" + PORT);
  connectDB();
});