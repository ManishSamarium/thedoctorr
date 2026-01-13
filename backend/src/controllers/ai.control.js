import { predictDisease } from "../services/ai.servic.js";
import Report from "../models/report.model.js";

export const getPrediction = async (req, res) => {
  try {
    const { symptoms } = req.body;

    if (!symptoms || !Array.isArray(symptoms) || symptoms.length === 0) {
      return res.status(400).json({ message: "Symptoms array required" });
    }

    // 1. Call ML service (may throw axios error)
    const mlResult = await predictDisease(symptoms);

    // 2. Save report to MongoDB
    const report = await Report.create({
      patientId: req.user.id,      // from JWT
      symptoms,
      predictions: mlResult.predictions
    });

    // 3. Return response
    res.json({
      message: "Prediction generated and report saved",
      reportId: report._id,
      predictions: report.predictions
    });
  } catch (err) {
    // Better logging: if axios error, log response status/data
    console.error("Prediction error:", err?.response?.status, err?.response?.data || err.message || err);
    const message = err?.response?.data?.message || err?.message || "Prediction failed";
    res.status(500).json({ message });
  }
};

// Public endpoint to test ML connectivity from backend (no auth)
export const testML = async (req, res) => {
  try {
    const sample = ["fever", "cough"];
    const mlResult = await predictDisease(sample);
    res.json({ ok: true, sample, mlResult });
  } catch (err) {
    console.error("ML test error:", err?.response?.status, err?.response?.data || err.message || err);
    const detail = err?.response?.data || err?.message || "Unknown error";
    res.status(500).json({ ok: false, error: detail });
  }
};
