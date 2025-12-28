import Rating from "../models/rating.model.js";
import Appointment from "../models/appointment.model.js";
import Doctor from "../models/doctor.model.js";

/**
 * Submit a rating for a doctor after appointment
 * Only allowed if appointment is accepted
 * One rating per appointment per patient
 */
export const submitRating = async (req, res) => {
  try {
    const { appointmentId } = req.params;
    const { rating, review } = req.body;

    // Validate rating
    if (!rating || rating < 1 || rating > 5) {
      return res
        .status(400)
        .json({ message: "Rating must be between 1 and 5" });
    }

    // Get appointment
    const appointment = await Appointment.findById(appointmentId);
    if (!appointment) {
      return res.status(404).json({ message: "Appointment not found" });
    }

    // Verify patient owns this appointment
    if (appointment.patientId.toString() !== req.user.id) {
      return res.status(403).json({ message: "Unauthorized" });
    }

    // Ensure appointment is accepted
    if (appointment.status !== "accepted") {
      return res.status(403).json({
        message: "Can only rate accepted appointments"
      });
    }

    // Check if already rated
    const existingRating = await Rating.findOne({
      appointmentId,
      patientId: req.user.id
    });

    if (existingRating) {
      return res.status(400).json({
        message: "You have already rated this doctor for this appointment"
      });
    }

    // Create rating
    const newRating = await Rating.create({
      appointmentId,
      doctorId: appointment.doctorId,
      patientId: req.user.id,
      rating,
      review: review || null
    });

    // Update doctor's average rating
    const allRatings = await Rating.find({
      doctorId: appointment.doctorId
    });

    const avgRating =
      allRatings.reduce((sum, r) => sum + r.rating, 0) / allRatings.length;

    await Doctor.findByIdAndUpdate(
      appointment.doctorId,
      {
        averageRating: Math.round(avgRating * 10) / 10, // Round to 1 decimal
        ratingCount: allRatings.length
      },
      { new: true }
    );

    res.status(201).json({
      message: "Rating submitted successfully",
      rating: newRating
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to submit rating" });
  }
};

/**
 * Get doctor's ratings
 */
export const getDoctorRatings = async (req, res) => {
  try {
    const { doctorId } = req.params;

    const ratings = await Rating.find({ doctorId })
      .populate("patientId", "name")
      .sort({ createdAt: -1 });

    res.json(ratings);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to fetch ratings" });
  }
};
