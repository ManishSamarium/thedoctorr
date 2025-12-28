import Appointment from "../models/appointment.model.js";
import Report from "../models/report.model.js";
import Doctor from "../models/doctor.model.js";
import Rating from "../models/rating.model.js";

/**
 * Patient sends report + optional attachments to doctor
 */
export const createAppointment = async (req, res) => {
  try {
    const { doctorId, reportId, symptoms, predictions, message } = req.body;

    // Validate required fields
    if (!doctorId || !reportId) {
      return res
        .status(400)
        .json({ message: "doctorId and reportId required" });
    }

    // Verify doctor exists
    const doctor = await Doctor.findOne({ userId: doctorId });
    if (!doctor) {
      return res
        .status(404)
        .json({ message: "Doctor profile not found or incomplete" });
    }

    // Verify report exists
    const report = await Report.findById(reportId);
    if (!report) {
      return res.status(404).json({ message: "Report not found" });
    }

    // Process attachments
    const attachments = (req.files || []).map((file) => ({
      filename: file.filename,
      originalName: file.originalname,
      mimetype: file.mimetype
    }));

    // Parse predictions if sent as JSON string
    let parsedPredictions = predictions;
    if (typeof predictions === "string") {
      try {
        parsedPredictions = JSON.parse(predictions);
      } catch {
        parsedPredictions = [];
      }
    }

    let parsedSymptoms = symptoms;
    if (typeof symptoms === "string") {
      try {
        parsedSymptoms = JSON.parse(symptoms);
      } catch {
        parsedSymptoms = [];
      }
    }

    const appointment = await Appointment.create({
      patientId: req.user.id,
      doctorId,
      reportId,
      symptoms: parsedSymptoms || [],
      predictions: parsedPredictions || [],
      message: message || null,
      attachments
    });

    res.status(201).json({
      message: "Appointment created successfully",
      appointment
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to create appointment" });
  }
};

/**
 * Doctor views received appointments with populated data
 */
export const getDoctorAppointments = async (req, res) => {
  try {
    const appointments = await Appointment.find({
      doctorId: req.user.id
    })
      .populate({
        path: "patientId",
        select: "name email"
      })
      .populate({
        path: "reportId",
        select: "symptoms predictions"
      })
      .sort({ createdAt: -1 });

    res.json(appointments);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to fetch appointments" });
  }
};

/**
 * Patient views their own appointments
 */
export const getPatientAppointments = async (req, res) => {
  try {
    const appointments = await Appointment.find({
      patientId: req.user.id
    })
      .populate({
        path: "doctorId",
        select: "name"
      })
      .populate({
        path: "reportId"
      })
      .sort({ createdAt: -1 });

    // Fetch ratings for each appointment
    const appointmentsWithRatings = await Promise.all(
      appointments.map(async (appt) => {
        const rating = await Rating.findOne({ appointmentId: appt._id });
        return {
          ...appt.toObject(),
          rating
        };
      })
    );

    res.json(appointmentsWithRatings);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to fetch appointments" });
  }
};

/**
 * Doctor updates appointment status
 */
export const updateAppointmentStatus = async (req, res) => {
  try {
    const { appointmentId } = req.params;
    const { status } = req.body;

    // Validate status
    if (!["pending", "accepted", "rejected", "completed"].includes(status)) {
      return res.status(400).json({ message: "Invalid status" });
    }

    const appointment = await Appointment.findById(appointmentId);
    if (!appointment) {
      return res.status(404).json({ message: "Appointment not found" });
    }

    // Verify doctor owns this appointment
    if (appointment.doctorId.toString() !== req.user.id) {
      return res.status(403).json({ message: "Unauthorized" });
    }

    appointment.status = status;
    await appointment.save();

    res.json({
      message: "Appointment status updated",
      appointment
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to update status" });
  }
};

/**
 * Get single appointment (for chat page)
 */
export const getAppointment = async (req, res) => {
  try {
    const { appointmentId } = req.params;

    const appointment = await Appointment.findById(appointmentId)
      .populate("patientId", "name email")
      .populate("doctorId", "name email");

    if (!appointment) {
      return res.status(404).json({ message: "Appointment not found" });
    }

    // Verify user has access
    const userId = req.user.id;
    const hasAccess =
      appointment.patientId._id.toString() === userId ||
      appointment.doctorId._id.toString() === userId;

    if (!hasAccess) {
      return res.status(403).json({ message: "Unauthorized" });
    }

    res.json(appointment);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to fetch appointment" });
  }
};

