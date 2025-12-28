import mongoose from "mongoose";

const doctorSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true
    },

    category: {
      type: String,
      required: true
    },

    experience: {
      type: Number,
      required: true
    },

    bio: String,

    profileImage: String,

    // ⭐ NEW: rating fields
    averageRating: {
      type: Number,
      default: 0
    },

    ratingCount: {
      type: Number,
      default: 0
    }
  },
  { timestamps: true }
);

export default mongoose.model("Doctor", doctorSchema);
