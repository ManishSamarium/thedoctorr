import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";

import authRoutes from "./routes/auth.rout.js";
import doctorRoutes from "./routes/doctor.rout.js";
import patientRoutes from "./routes/patient.rout.js";
import appointmentRoutes from "./routes/appointment.rout.js";
import aiRoutes from "./routes/ai.rout.js";
import reportRoutes from "./routes/report.rout.js";
import chatRoutes from "./routes/chat.rout.js";
import ratingRoutes from "./routes/rating.rout.js";

const app = express();

// Middleware
app.use(cors({ origin: true, credentials: true }));
app.use(express.json());
app.use(express.urlencoded({ limit: "10mb" }));
app.use(cookieParser());

// Serve uploaded files
app.use("/uploads", express.static("uploads"));

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/doctor", doctorRoutes);
app.use("/api/patient", patientRoutes);
app.use("/api/appointment", appointmentRoutes);
app.use("/api/ai", aiRoutes);
app.use("/api/report", reportRoutes);
app.use("/api/chat", chatRoutes);
app.use("/api/rating", ratingRoutes);

// Health check
app.get("/health", (req, res) => {
  res.json({ status: "ok" });
});

export default app;
