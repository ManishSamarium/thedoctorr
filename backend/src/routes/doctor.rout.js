import express from "express";
import {
  createOrUpdateProfile,
  getMyProfile,
  getAllDoctors
} from "../controllers/doctor.control.js";
import { protect } from "../middleware/auth.middleware.js";
import { allow } from "../middleware/role.middleware.js";
import upload from "../middleware/upload.middleware.js";

const router = express.Router();

/**
 * Create or update doctor profile (doctor only)
 */
router.post(
  "/profile",
  protect,
  allow("doctor"),
  upload.single("profileImage"),
  createOrUpdateProfile
);

/**
 * Get current doctor's profile
 */
router.get("/profile", protect, allow("doctor"), getMyProfile);

/**
 * Get all complete doctor profiles (public - for patient browsing)
 */
router.get("/", getAllDoctors);

export default router;

