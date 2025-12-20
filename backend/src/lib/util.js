import jwt from "jsonwebtoken";

export const generateToken = (userId, res) => {
  const token = jwt.sign({ userId }, process.env.JWT_SECRET, {
    expiresIn: "7d",
  });

  res.cookie("jwt", token, {
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days in MS
    httpOnly: true, // prevent XSS
    // "strict" can block login if frontend/backend domains differ. 
    // "lax" or "none" is safer for separate deployment.
    sameSite: process.env.NODE_ENV === "development" ? "strict" : "none",
    secure: process.env.NODE_ENV !== "development", 
  });

  return token;
};

