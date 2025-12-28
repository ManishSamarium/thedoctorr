import Report from "../models/report.model.js";
import Appointment from "../models/appointment.model.js";
import { generateReportPDF } from "../services/pdf.servic.js";

/**
 * Patient fetches own reports
 */
export const getMyReports = async (req, res) => {
  try {
    const reports = await Report.find({ patientId: req.user.id })
      .sort({ createdAt: -1 });

    res.json(reports);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to fetch reports" });
  }
};

/**
 * Patient OR assigned doctor downloads report PDF
 */
export const downloadReportPDF = async (req, res) => {
  try {
    const { reportId } = req.params;

    const report = await Report.findById(reportId);
    if (!report) {
      return res.status(404).json({ message: "Report not found" });
    }

    const userId = req.user.id;
    const userRole = req.user.role;

    let allowed = false;

    // Case 1: Patient owns the report
    if (report.patientId.toString() === userId) {
      allowed = true;
    }

    // Case 2: Doctor assigned via appointment
    if (userRole === "doctor") {
      const appointment = await Appointment.findOne({
        doctorId: userId,
        reportId
      });

      if (appointment) {
        allowed = true;
      }
    }

    if (!allowed) {
      return res.status(403).json({ message: "Access denied" });
    }

    generateReportPDF(report, res);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to generate PDF" });
  }
};
