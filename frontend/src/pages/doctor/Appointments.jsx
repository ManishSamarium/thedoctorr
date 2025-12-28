import { useEffect, useState } from "react";
import { getDoctorAppointments } from "../../api/appointment.api";
import AppointmentCard from "../../components/doctor/AppointmentCard";
import Loader from "../../components/common/Loader";
import { useToast } from "../../components/common/Toast";

const Appointments = () => {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { show: showToast } = useToast();

  const fetchAppointments = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await getDoctorAppointments();
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
  }, []);

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
          Patient Reports
        </h2>
        <p className="text-gray-600">Review and manage patient consultations</p>
      </div>

      {appointments.length === 0 ? (
        <div className="text-center py-12 bg-gray-50 rounded-lg">
          <p className="text-gray-500 text-lg">
            No patient reports yet. Patients will send reports here.
          </p>
        </div>
      ) : (
        <div className="space-y-6">
          {appointments.map((appt) => (
            <AppointmentCard
              key={appt._id}
              appointment={appt}
              onStatusChange={fetchAppointments}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default Appointments;
