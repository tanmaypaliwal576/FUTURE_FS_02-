import jwt from "jsonwebtoken";
import userModel from "../models/userModel.js";

export const protect = async (req, res, next) => {
  try {
    // Read token from cookies
    const token = req.cookies.token;

    if (!token) {
      return res.status(401).send("No token, unauthorized.");
    }

    // Verify JWT
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Attach user to request
    req.user = await userModel.findById(decoded.id).select("-password");

    if (!req.user) {
      return res.status(401).send("User not found.");
    }

    next();
  } catch (err) {
    return res.status(401).send("Invalid or expired token.");
  }
};
