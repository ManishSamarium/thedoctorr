import { predictDisease } from "../services/ai.servic.js";
import Report from "../models/report.model.js";

export const getPrediction = async (req, res) => {
  try {
    const { symptoms } = req.body;

    if (!symptoms || !Array.isArray(symptoms) || symptoms.length === 0) {
      return res.status(400).json({ message: "Symptoms array required" });
    }

    // 1. Call ML service (UNCHANGED)
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
    console.error(err);
    res.status(500).json({ message: "Prediction failed" });
  }
};
