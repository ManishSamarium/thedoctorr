import { useState } from "react";
import { createAppointment } from "../../api/appointment.api";
import { useNavigate } from "react-router-dom";
import { useToast } from "../common/Toast";

const ReportUploader = ({ doctor, symptoms, predictions, reportId: propReportId }) => {
  const [files, setFiles] = useState([]);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { show: showToast } = useToast();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!doctor || (!doctor.userId && !doctor._id)) {
      showToast("Invalid doctor selected", "error");
      return;
    }

    setLoading(true);

    try {
      const formData = new FormData();

      // NOTE: The reportId should come from prediction step
      // For now, we'll send symptoms/predictions to backend to create report
      // Send doctor's USER id: handle both userId object or string
      const doctorUserId =
        (doctor && doctor.userId && (doctor.userId._id || doctor.userId)) ||
        doctor._id;
      formData.append("doctorId", doctorUserId);
      formData.append("symptoms", JSON.stringify(symptoms || []));
      formData.append("predictions", JSON.stringify(predictions || []));
      formData.append("message", message || "");

      // Append files
      files.forEach((file) => {
        formData.append("attachments", file);
      });

      // Use reportId provided by prediction step if available
      if (propReportId) {
        formData.append("reportId", propReportId);
      } else {
        // No reportId - backend expects a valid reportId; inform user
        showToast("No associated report found. Please run prediction first.", "error");
        setLoading(false);
        return;
      }

      await createAppointment(formData);

      showToast("Report sent and appointment created!", "success");
      navigate("/patient/appointments");
    } catch (err) {
      console.error(err);
      showToast(
        err.response?.data?.message || "Failed to send appointment",
        "error"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white rounded-xl shadow-md p-8 max-w-2xl mx-auto"
    >
      <h3 className="text-2xl font-bold mb-6">
        Send Report to Dr. {doctor.name}
      </h3>

      {/* Selected symptoms */}
      {symptoms && symptoms.length > 0 && (
        <div className="mb-6">
          <h4 className="font-medium text-gray-900 mb-2">Selected Symptoms</h4>
          <div className="flex flex-wrap gap-2">
            {symptoms.map((symptom) => (
              <span
                key={symptom}
                className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm"
              >
                {symptom}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* AI Predictions */}
      {predictions && predictions.length > 0 && (
        <div className="mb-6">
          <h4 className="font-medium text-gray-900 mb-2">AI Predictions</h4>
          <div className="space-y-2">
            {predictions.map((pred, idx) => (
              <div
                key={idx}
                className="flex justify-between items-center bg-gray-50 p-3 rounded"
              >
                <span className="font-medium">{pred.disease}</span>
                <span className="text-blue-600 font-bold">
                  {pred.probability.toFixed(1)}%
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Message */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-900 mb-2">
          Message to Doctor (optional)
        </label>
        <textarea
          placeholder="Provide any additional context for the doctor..."
          className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          rows={3}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
        />
      </div>

      {/* File Upload */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-900 mb-2">
          Additional Medical Documents (optional)
        </label>
        <label className="flex flex-col items-center justify-center w-full border-2 border-dashed border-blue-300 rounded-lg p-6 cursor-pointer hover:bg-blue-50 transition">
          <div className="text-center">
            <p className="text-sm text-gray-700">
              Click to upload or drag and drop
            </p>
            <p className="text-xs text-gray-500">
              PDF, DOC, JPG up to 10MB each
            </p>
          </div>
          <input
            type="file"
            multiple
            onChange={(e) => setFiles([...e.target.files])}
            className="hidden"
          />
        </label>

        {/* Show selected files */}
        {files.length > 0 && (
          <div className="mt-3 space-y-2">
            {Array.from(files).map((file, idx) => (
              <div
                key={idx}
                className="flex items-center justify-between bg-gray-50 p-2 rounded"
              >
                <span className="text-sm text-gray-700">{file.name}</span>
                <span className="text-xs text-gray-500">
                  {(file.size / 1024 / 1024).toFixed(2)} MB
                </span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Submit Button */}
      <button
        type="submit"
        disabled={loading}
        className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-medium py-3 rounded-lg transition flex items-center justify-center gap-2"
      >
        {loading ? (
          <>
            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
            Sending...
          </>
        ) : (
          "Send Report to Doctor"
        )}
      </button>
    </form>
  );
};

export default ReportUploader;
