import express from "express";
import mongoose from "mongoose";
import cookieParser from "cookie-parser";
import cors from "cors";
import dotenv from "dotenv";

import authRoutes from "./routes/authRoutes.js";
import productRoute from "./routes/productRoute.js";

dotenv.config();

const app = express();

// MIDDLEWARES
app.use(express.json());
app.use(cookieParser());

// CORS (for React on Vite)
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);

// ROUTES
app.use("/auth", authRoutes);
app.use("/products", productRoute);

// DEFAULT ROUTE
app.get("/", (req, res) => {
  res.send("E-Shop Backend Running 🚀");
});

// CONNECT MONGODB
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB Connected ✔"))
  .catch((err) => console.log("DB Error:", err));

// START SERVER
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
