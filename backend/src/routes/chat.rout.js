import express from "express";
import { getMessages, sendMessage } from "../controllers/chat.control.js";
import { protect } from "../middleware/auth.middleware.js";

const router = express.Router();

/**
 * Get all messages for an appointment
 * Only doctor and patient of the appointment can access
 */
router.get("/:appointmentId", protect, getMessages);

/**
 * Send a message in an appointment
 * Only doctor and patient of the appointment can send
 */
router.post("/:appointmentId", protect, sendMessage);

export default router;
