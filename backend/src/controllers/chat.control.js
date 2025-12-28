import Appointment from "../models/appointment.model.js";
import Message from "../models/message.model.js";

/**
 * Get messages for an appointment
 * Authorization: Only doctor and patient of the appointment
 */
export const getMessages = async (req, res) => {
  try {
    const { appointmentId } = req.params;

    // Verify appointment exists and user is authorized
    const appointment = await Appointment.findById(appointmentId);
    if (!appointment) {
      return res.status(404).json({ message: "Appointment not found" });
    }

    // Check if user is doctor or patient of this appointment
    const userId = req.user.id;
    const isAuthorized =
      appointment.patientId.toString() === userId ||
      appointment.doctorId.toString() === userId;

    if (!isAuthorized) {
      return res.status(403).json({ message: "Unauthorized" });
    }

    // Only allow chat if appointment is accepted
    if (appointment.status !== "accepted") {
      return res
        .status(403)
        .json({ message: "Chat only available for accepted appointments" });
    }

    // Fetch messages
    const messages = await Message.find({ appointmentId })
      .populate("senderId", "name")
      .sort({ createdAt: 1 });

    res.json(messages);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to fetch messages" });
  }
};

/**
 * Send a message in an appointment
 */
export const sendMessage = async (req, res) => {
  try {
    const { appointmentId } = req.params;
    const { text } = req.body;

    if (!text || !text.trim()) {
      return res.status(400).json({ message: "Message text required" });
    }

    // Verify appointment exists and user is authorized
    const appointment = await Appointment.findById(appointmentId);
    if (!appointment) {
      return res.status(404).json({ message: "Appointment not found" });
    }

    // Check if user is doctor or patient
    const userId = req.user.id;
    const isAuthorized =
      appointment.patientId.toString() === userId ||
      appointment.doctorId.toString() === userId;

    if (!isAuthorized) {
      return res.status(403).json({ message: "Unauthorized" });
    }

    // Only allow if appointment is accepted
    if (appointment.status !== "accepted") {
      return res
        .status(403)
        .json({ message: "Chat only available for accepted appointments" });
    }

    // Create message
    const message = await Message.create({
      appointmentId,
      senderId: userId,
      text: text.trim()
    });

    // Populate sender info
    await message.populate("senderId", "name");

    res.status(201).json(message);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to send message" });
  }
};
