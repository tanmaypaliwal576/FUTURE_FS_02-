import userModel from "../models/userModel.js";
import bcrypt from "bcrypt";
import { generatetoken } from "../utils/generatetoken.js";

// ================================
// REGISTER USER
// ================================
export const registerUser = async (req, res) => {
  try {
    const { fullname, email, password } = req.body;

    // Check if user exists
    const existingUser = await userModel.findOne({ email });
    if (existingUser) {
      return res.status(400).send("User already exists. Please login.");
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user
    const user = await userModel.create({
      fullname,
      email,
      password: hashedPassword,
    });

    // Generate token
    const token = generatetoken(user);

    // FIX: SEND COOKIE PROPERLY FOR LOCALHOST
    res.cookie("token", token, {
      httpOnly: true,
      secure: false, // IMPORTANT for localhost
      sameSite: "Lax",
    });

    return res.send("User registered successfully");
  } catch (err) {
    res.status(500).send(err.message);
  }
};

// ================================
// LOGIN USER
// ================================
export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await userModel.findOne({ email });
    if (!user) {
      return res.status(400).send("No user found. Please register.");
    }

    const match = await bcrypt.compare(password, user.password);
    if (!match) return res.status(400).send("Incorrect email or password.");

    const token = generatetoken(user);

    // FIX: SEND COOKIE PROPERLY FOR LOCALHOST
    res.cookie("token", token, {
      httpOnly: true,
      secure: false, // must be false locally
      sameSite: "Lax",
    });

    return res.json({
      success: true,
      token,
      message: "Login successful",
      fullname: user.fullname,
      email: user.email,
      isAdmin: user.isAdmin,
      _id: user._id,
    });
  } catch (err) {
    res.status(500).send(err.message);
  }
};

// ================================
// LOGOUT USER
// ================================
export const logout = (req, res) => {
  res.cookie("token", "", { expires: new Date(0) });
  return res.send("Logged out successfully");
};
