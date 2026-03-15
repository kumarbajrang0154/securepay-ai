import express from "express";
import {
  getDashboardStats,
  getTopFraudUpi,
  getTopFraudMerchants,
  getDailyScanStats,
  getAnalytics
} from "../controllers/analyticsController.js";

const router = express.Router();

router.get("/dashboard", getDashboardStats);
router.get("/top-upi", getTopFraudUpi);
router.get("/top-merchants", getTopFraudMerchants);
router.get("/daily-scans", getDailyScanStats);
router.get("/analytics", getAnalytics);

export default router;