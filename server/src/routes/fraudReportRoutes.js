import express from "express";

import {
createFraudReport,
getUserReports
} from "../controllers/fraudReportController.js";

const router = express.Router();

router.post("/report", createFraudReport);

router.get("/reports/:mobile", getUserReports);

export default router;