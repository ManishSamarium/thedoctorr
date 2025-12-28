import mongoose from "mongoose";

const ratingSchema = new mongoose.Schema(
  {
    doctorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Doctor",
      required: true
    },
    patientId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },
    rating: {
      type: Number,
      min: 1,
      max: 5,
      required: true
    },
    review: String
  },
  { timestamps: true }
);

// Prevent same patient rating same doctor multiple times
ratingSchema.index({ doctorId: 1, patientId: 1 }, { unique: true });

export default mongoose.model("Rating", ratingSchema);
