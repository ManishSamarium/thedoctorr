import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../api/axios";
import RatingForm from "../../components/patient/RatingForm";
import Loader from "../../components/common/Loader";
import { useToast } from "../../components/common/Toast";

const MyAppointments = () => {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const { show: showToast } = useToast();

  const fetchAppointments = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await api.get("/appointment/patient");
      setAppointments(res.data || []);
    } catch (err) {
      console.error(err);
      setError("Failed to load appointments");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAppointments();

    const onAccepted = (e) => {
      try {
        const detail = e.detail || {};
        // If the accepted appointment belongs to current list, refresh
        if (!detail.appointmentId) return;
        fetchAppointments();
      } catch (err) {
        // ignore
      }
    };

    window.addEventListener("appointment-accepted", onAccepted);

    return () => window.removeEventListener("appointment-accepted", onAccepted);
  }, []);

  const getStatusColor = (status) => {
    const colors = {
      pending: "bg-yellow-100 text-yellow-800",
      accepted: "bg-green-100 text-green-800",
      rejected: "bg-red-100 text-red-800",
      completed: "bg-blue-100 text-blue-800",
    };
    return colors[status] || "bg-gray-100 text-gray-800";
  };

  const getStatusIcon = (status) => {
    const icons = {
      pending: "⏳",
      accepted: "✅",
      rejected: "❌",
      completed: "🏁",
    };
    return icons[status] || "📋";
  };

  if (loading) {
    return <Loader />;
  }

  if (error) {
    return (
      <div className="p-6 max-w-4xl mx-auto">
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-gray-900 mb-2">
          My Appointments
        </h2>
        <p className="text-gray-600">
          Track your consultations and manage your health journey
        </p>
      </div>

      {appointments.length === 0 ? (
        <div className="text-center py-12 bg-gray-50 rounded-lg">
          <p className="text-gray-500 text-lg mb-4">
            You don't have any appointments yet.
          </p>
          <button
            onClick={() => navigate("/patient/doctors")}
            className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition"
          >
            Browse Doctors
          </button>
        </div>
      ) : (
        <div className="grid gap-6">
          {appointments.map((appt) => (
            <div
              key={appt._id}
              className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition"
            >
              {/* Header */}
              <div className="bg-linear-to-r from-blue-600 to-blue-700 text-white p-6">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-xl font-bold">
                      Dr. {appt.doctorId.name}
                    </h3>
                    <p className="text-blue-100 text-sm mt-1">
                      Appointment ID: {appt._id}
                    </p>
                  </div>
                  <span
                    className={`px-4 py-2 rounded-full text-sm font-semibold flex items-center gap-2 ${getStatusColor(
                      appt.status
                    )}`}
                  >
                    {getStatusIcon(appt.status)} {appt.status.toUpperCase()}
                  </span>
                </div>
              </div>

              {/* Content */}
              <div className="p-6 space-y-4">
                {/* Symptoms */}
                {appt.symptoms && appt.symptoms.length > 0 && (
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2">
                      Reported Symptoms
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {appt.symptoms.map((symptom) => (
                        <span
                          key={symptom}
                          className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm"
                        >
                          {symptom}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Predictions */}
                {appt.predictions && appt.predictions.length > 0 && (
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2">
                      AI Predictions
                    </h4>
                    <div className="space-y-2">
                      {appt.predictions.map((pred, idx) => (
                        <div
                          key={idx}
                          className="flex justify-between items-center bg-gray-50 p-3 rounded"
                        >
                          <span>{pred.disease}</span>
                          <span className="text-blue-600 font-bold">
                            {pred.probability.toFixed(1)}%
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Message */}
                {appt.message && (
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2">
                      Message
                    </h4>
                    <p className="text-gray-700 bg-gray-50 p-3 rounded">
                      {appt.message}
                    </p>
                  </div>
                )}

                {/* Dates */}
                <div className="grid grid-cols-2 gap-4 text-sm text-gray-600 pt-4 border-t">
                  <div>
                    <p className="font-medium">Created</p>
                    <p>{new Date(appt.createdAt).toLocaleDateString()}</p>
                  </div>
                  {appt.updatedAt && (
                    <div>
                      <p className="font-medium">Updated</p>
                      <p>{new Date(appt.updatedAt).toLocaleDateString()}</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Actions */}
              <div className="border-t p-6 bg-gray-50 space-y-3">
                {appt.status === "accepted" && (
                  <button
                    onClick={() => navigate(`/chat/${appt._id}`)}
                    className="w-full px-4 py-2 bg-green-600 hover:bg-green-700 text-white font-medium rounded-lg transition"
                  >
                    Open Chat with Doctor
                  </button>
                )}

                {appt.status === "pending" && (
                  <p className="text-yellow-700 bg-yellow-50 px-4 py-2 rounded">
                    ⏳ Waiting for doctor to accept...
                  </p>
                )}

                {appt.status === "rejected" && (
                  <p className="text-red-700 bg-red-50 px-4 py-2 rounded">
                    ❌ Doctor rejected this appointment
                  </p>
                )}
              </div>

              {/* Rating Form */}
              {appt.status === "accepted" && !appt.rating && (
                <div className="px-6 pb-6">
                  <RatingForm
                    appointmentId={appt._id}
                    onSubmitted={fetchAppointments}
                    appointmentStatus={appt.status}
                  />
                </div>
              )}

              {/* Existing Rating */}
              {appt.rating && (
                <div className="px-6 pb-6 bg-linear-to-r from-yellow-50 to-orange-50 p-4 rounded">
                  <div className="flex items-center gap-3">
                    <div>
                      <p className="font-semibold text-gray-900">Your Rating</p>
                      <div className="flex gap-1 mt-1">
                        {[...Array(appt.rating.rating)].map((_, i) => (
                          <span key={i} className="text-yellow-400 text-xl">
                            ⭐
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                  {appt.rating.review && (
                    <p className="text-sm text-gray-700 mt-2 italic">
                      "{appt.rating.review}"
                    </p>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyAppointments;
