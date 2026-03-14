import express from "express";
import { analyzeQR } from "../controllers/analyzeController.js";

const router = express.Router();

// POST /api/analyze
router.post("/analyze", analyzeQR);

export default router;