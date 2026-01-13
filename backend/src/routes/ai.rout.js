import express from "express";
import { getPrediction } from "../controllers/ai.control.js";
import { testML } from "../controllers/ai.control.js";
import { protect } from "../middleware/auth.middleware.js";

const router = express.Router();

router.post("/predict", protect, getPrediction);
router.get("/test", testML);

export default router;
