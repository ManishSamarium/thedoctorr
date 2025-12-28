import express from "express";
import { createPatientProfile } from "../controllers/patient.control.js";

const router = express.Router();
router.post("/profile", createPatientProfile);

export default router;
