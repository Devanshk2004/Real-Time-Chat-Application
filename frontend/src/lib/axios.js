import axios from "axios";

export const axiosInstance = axios.create({
  // Logic: If we are in development (local), use localhost.
  // If we are in production (Render), use the relative path "/api".
  baseURL: process.env.NODE_ENV === "development" ? "http://localhost:5001/api" : "/api",
  withCredentials: true,
});