import mongoose from "mongoose";

const patientSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  age: Number,
  gender: String
});

export default mongoose.model("Patient", patientSchema);
