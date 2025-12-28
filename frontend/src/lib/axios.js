import axios from "axios";

export const axiosInstance = axios.create({
  // In Next.js, we use NEXT_PUBLIC_ for client-side env vars
  baseURL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:5001/api",
  withCredentials: true,
});

