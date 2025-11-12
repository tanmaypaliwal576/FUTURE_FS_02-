import express from "express";
import { connectDB } from "./lib/db.js";
import dotenv from "dotenv";
dotenv.config();

const app = express();

app.listen(3000, () => {
  console.log("Server is Running");
  connectDB();
});
