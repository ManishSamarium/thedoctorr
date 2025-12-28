import mongoose from "mongoose";

const reportSchema = new mongoose.Schema(
  {
    patientId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },
    symptoms: {
      type: [String],
      required: true
    },
    predictions: [
      {
        disease: String,
        probability: Number
      }
    ]
  },
  { timestamps: true }
);

export default mongoose.model("Report", reportSchema);
