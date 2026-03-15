import express from "express";
import {
  analyzeQR,
  trackPaymentAttemptEndpoint,
  trackPaymentCancellationEndpoint,
  trackPaymentCompletionEndpoint
} from "../controllers/analyzeController.js";

const router = express.Router();

// POST /api/analyze
router.post("/analyze", analyzeQR);

// POST /api/track-payment-attempt
router.post("/track-payment-attempt", trackPaymentAttemptEndpoint);

// POST /api/track-payment-cancellation
router.post("/track-payment-cancellation", trackPaymentCancellationEndpoint);

// POST /api/track-payment-completion
router.post("/track-payment-completion", trackPaymentCompletionEndpoint);

export default router;