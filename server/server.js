// server/server.js
import express from "express";
import cors from "cors";
import analyzeRoutes from "./src/routes/analyzeRoutes.js";

const app = express();

app.use(cors());
app.use(express.json()); // IMPORTANT

// health check
app.get("/", (req, res) => {
  res.send("SecurePay AI API Running");
});

// mount routes
app.use("/api", analyzeRoutes);

const PORT = 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});