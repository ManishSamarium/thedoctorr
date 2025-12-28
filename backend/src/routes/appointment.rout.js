import express from "express";
import {
  createAppointment,
  getDoctorAppointments,
  getPatientAppointments,
  updateAppointmentStatus,
  getAppointment
} from "../controllers/appointment.control.js";
import { protect } from "../middleware/auth.middleware.js";
import { allow } from "../middleware/role.middleware.js";
import upload from "../middleware/upload.middleware.js";

const router = express.Router();

/**
 * Patient creates appointment (sends report + optional attachments)
 */
router.post(
  "/",
  protect,
  allow("patient"),
  upload.array("attachments", 5),
  createAppointment
);

/**
 * Doctor views received appointments
 */
router.get(
  "/doctor",
  protect,
  allow("doctor"),
  getDoctorAppointments
);

/**
 * Patient views their appointments
 */
router.get(
  "/patient",
  protect,
  allow("patient"),
  getPatientAppointments
);

/**
 * Get single appointment (for chat/details)
 */
router.get(
  "/:appointmentId",
  protect,
  getAppointment
);

/**
 * Doctor updates appointment status (accept/reject)
 */
router.patch(
  "/:appointmentId/status",
  protect,
  allow("doctor"),
  updateAppointmentStatus
);

export default router;
