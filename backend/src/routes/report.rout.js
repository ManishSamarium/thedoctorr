import express from "express";
import {
  getMyReports,
  downloadReportPDF
} from "../controllers/report.control.js";
import { protect } from "../middleware/auth.middleware.js";

const router = express.Router();

router.get("/my", protect, getMyReports);
router.get("/:reportId/pdf", protect, downloadReportPDF);

export default router;
