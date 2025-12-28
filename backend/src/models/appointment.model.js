import mongoose from "mongoose";

const appointmentSchema = new mongoose.Schema(
  {
    patientId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },
    doctorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },
    reportId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Report",
      required: true
    },

    // Symptoms and AI predictions
    symptoms: [String],
    predictions: [
      {
        disease: String,
        probability: Number
      }
    ],

    // Patient message to doctor
    message: String,

    // Extra uploaded medical files
    attachments: [
      {
        filename: String,
        originalName: String,
        mimetype: String,
        uploadedAt: { type: Date, default: Date.now }
      }
    ],

    status: {
      type: String,
      enum: ["pending", "accepted", "rejected", "completed"],
      default: "pending"
    }
  },
  { timestamps: true }
);

export default mongoose.model("Appointment", appointmentSchema);
