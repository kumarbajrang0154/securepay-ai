// server/server.js
import express from "express";
import cors from "cors";
import dotenv from "dotenv";

import connectDB from "./src/config/db.js";
import { config } from "./src/config/constants.js";

import analyzeRoutes from "./src/routes/analyzeRoutes.js";
import analysisRoutes from "./src/routes/analysisRoutes.js";
import authRoutes from "./src/routes/authRoutes.js";
import fraudRoutes from "./src/routes/fraudRoutes.js";
import transactionRoutes from "./src/routes/transactionRoutes.js";
import analyticsRoutes from "./src/routes/analyticsRoutes.js";

// Load environment variables
dotenv.config();

const app = express();

app.use(cors());
app.use(express.json({ limit: "5mb" }));
app.use(express.urlencoded({ extended: true }));

// Connect to database
connectDB();

// health check
app.get("/", (req, res) => {
  res.json({ success: true, message: "SecurePay AI API Running" });
});

// mount routes
app.use("/api", analyzeRoutes);

const PORT = 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});