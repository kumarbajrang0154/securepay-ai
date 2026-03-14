import express from "express";

import {
  reportFraud,
  getMyReports
} from "../controllers/fraudReportController.js";

const router = express.Router();

router.post("/report-fraud", reportFraud);

router.get("/my-reports", getMyReports);

export default router;