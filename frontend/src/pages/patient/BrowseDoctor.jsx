import { useEffect, useState } from "react";
import { getAllDoctors } from "../../api/doctor.api";
import DoctorCard from "../../components/doctor/DoctorCard";
import { useNavigate, useLocation } from "react-router-dom";
import Loader from "../../components/common/Loader";

const BrowseDoctor = () => {
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        setLoading(true);
        setError(null);
        const res = await getAllDoctors();
        setDoctors(res.data || []);
      } catch (err) {
        console.error(err);
        setError("Failed to load doctors. Please try again.");
        setDoctors([]);
      } finally {
        setLoading(false);
      }
    };

    fetchDoctors();
  }, []);

  const { state: incomingState } = useLocation();

  const handleSelect = (doctor) => {
    navigate("/patient/send-report", {
      state: {
        doctor,
        symptoms: incomingState?.symptoms || [],
        predictions: incomingState?.predictions || [],
        reportId: incomingState?.reportId || null
      },
    });
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
          Available Doctors
        </h2>
        <p className="text-gray-600">
          Browse and select a doctor for consultation
        </p>
      </div>

      {doctors.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-500 text-lg">
            No doctors available at the moment.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {doctors.map((doc) => (
            <DoctorCard key={doc._id} doctor={doc} onSelect={handleSelect} />
          ))}
        </div>
      )}
    </div>
  );
};

export default BrowseDoctor;
