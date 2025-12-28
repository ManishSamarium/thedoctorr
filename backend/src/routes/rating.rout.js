import express from "express";
import {
  submitRating,
  getDoctorRatings
} from "../controllers/rating.control.js";
import { protect } from "../middleware/auth.middleware.js";
import { allow } from "../middleware/role.middleware.js";

const router = express.Router();

/**
 * Patient submits rating for an appointment
 * Only after appointment is accepted
 */
router.post(
  "/:appointmentId",
  protect,
  allow("patient"),
  submitRating
);

/**
 * Get all ratings for a doctor
 */
router.get("/doctor/:doctorId", getDoctorRatings);

export default router;
