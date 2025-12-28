import { useState } from "react";
import { updateAppointmentStatus } from "../../api/appointment.api";
import { useToast } from "../common/Toast";

const AppointmentCard = ({ appointment, onStatusChange }) => {
  const {
    _id,
    patientId,
    symptoms,
    predictions,
    message,
    attachments,
    status,
  } = appointment;
  const [loading, setLoading] = useState(false);
  const { show: showToast } = useToast();

  const handleUpdateStatus = async (newStatus) => {
    setLoading(true);
    try {
      await updateAppointmentStatus(_id, newStatus);
      showToast(
        `Appointment ${newStatus === "accepted" ? "accepted" : "rejected"}!`,
        "success"
      );
      onStatusChange();
    } catch (err) {
      console.error(err);
      showToast("Failed to update appointment status", "error");
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    const colors = {
      pending: "bg-yellow-100 text-yellow-800",
      accepted: "bg-green-100 text-green-800",
      rejected: "bg-red-100 text-red-800",
      completed: "bg-blue-100 text-blue-800",
    };
    return colors[status] || "bg-gray-100 text-gray-800";
  };

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition">
      {/* Header */}
      <div className="bg-linear-to-r from-indigo-600 to-indigo-700 text-white p-6">
        <div className="flex justify-between items-start">
          <div>
            <h3 className="text-xl font-bold">Patient: {patientId.name}</h3>
            <p className="text-indigo-100 text-sm mt-1">{patientId.email}</p>
          </div>
          <span
            className={`px-4 py-2 rounded-full text-sm font-semibold ${getStatusColor(
              status
            )}`}
          >
            {status.toUpperCase()}
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="p-6 space-y-4">
        {/* Patient Message */}
        {message && (
          <div>
            <h4 className="font-semibold text-gray-900 mb-2">
              Patient Message
            </h4>
            <p className="text-gray-700 bg-blue-50 p-3 rounded border-l-4 border-blue-500">
              "{message}"
            </p>
          </div>
        )}

        {/* Symptoms */}
        {symptoms && symptoms.length > 0 && (
          <div>
            <h4 className="font-semibold text-gray-900 mb-2">
              Reported Symptoms
            </h4>
            <div className="flex flex-wrap gap-2">
              {symptoms.map((symptom) => (
                <span
                  key={symptom}
                  className="bg-red-100 text-red-700 px-3 py-1 rounded-full text-sm"
                >
                  {symptom}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* AI Predictions */}
        {predictions && predictions.length > 0 && (
          <div>
            <h4 className="font-semibold text-gray-900 mb-2">AI Predictions</h4>
            <div className="space-y-2 bg-gray-50 p-4 rounded">
              {predictions.map((p, idx) => (
                <div key={idx} className="flex justify-between items-center">
                  <span className="font-medium text-gray-800">{p.disease}</span>
                  <span className="text-indigo-600 font-bold text-lg">
                    {p.probability?.toFixed(1) || 0}%
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Attachments */}
        {attachments && attachments.length > 0 && (
          <div>
            <h4 className="font-semibold text-gray-900 mb-2">Attachments</h4>
            <ul className="space-y-2">
              {attachments.map((file, idx) => (
                <li key={idx}>
                  <a
                    href={`http://localhost:5000/${file.filename}`}
                    target="_blank"
                    rel="noreferrer"
                    className="text-blue-600 hover:text-blue-800 underline flex items-center gap-2"
                  >
                    📄 {file.originalName || `Document ${idx + 1}`}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>

      {/* Actions */}
      {status === "pending" && (
        <div className="border-t bg-gray-50 p-6 flex gap-3">
          <button
            onClick={async () => {
              await handleUpdateStatus("accepted");
              // Notify patient and chat components immediately
              try {
                window.dispatchEvent(
                  new CustomEvent("appointment-accepted", { detail: { appointmentId: _id, doctorId: patientId } })
                );
              } catch (e) {
                // ignore
              }
            }}
            disabled={loading}
            className="flex-1 px-4 py-3 bg-green-600 hover:bg-green-700 disabled:bg-gray-400 text-white font-semibold rounded-lg transition"
          >
            {loading ? "Processing..." : "✅ Accept"}
          </button>

          <button
            onClick={() => handleUpdateStatus("rejected")}
            disabled={loading}
            className="flex-1 px-4 py-3 bg-red-600 hover:bg-red-700 disabled:bg-gray-400 text-white font-semibold rounded-lg transition"
          >
            {loading ? "Processing..." : "❌ Reject"}
          </button>
        </div>
      )}

      {status === "accepted" && (
        <div className="border-t bg-green-50 p-6 flex items-center justify-between">
          <p className="text-green-700 font-medium flex items-center gap-2">
            ✅ You accepted this appointment. Patient can now chat with you.
          </p>
          <button
            onClick={() => (window.location.href = `/chat/${_id}`)}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium"
          >
            Open Chat
          </button>
        </div>
      )}

      {status === "rejected" && (
        <div className="border-t bg-red-50 p-6">
          <p className="text-red-700 font-medium flex items-center gap-2">
            ❌ You rejected this appointment.
          </p>
        </div>
      )}
    </div>
  );
};

export default AppointmentCard;
