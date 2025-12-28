import { Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { useEffect, useState } from "react";
import { getMyProfile } from "../../api/doctor.api";
import { getDoctorAppointments } from "../../api/appointment.api";

const DoctorDashboard = () => {
  const { user } = useAuth();
  const [profile, setProfile] = useState(null);
  const [pendingCount, setPendingCount] = useState(0);

  const fetchData = async () => {
    try {
      const p = await getMyProfile();
      setProfile(p.data);
    } catch (err) {
      setProfile(null);
    }

    try {
      const appts = await getDoctorAppointments();
      const pending = (appts.data || []).filter((a) => a.status === "pending")
        .length;
      setPendingCount(pending);
    } catch (err) {
      setPendingCount(0);
    }
  };

  useEffect(() => {
    fetchData();

    const onProfileChange = (e) => fetchData();
    const onRating = (e) => fetchData();

    window.addEventListener("profile-updated", onProfileChange);
    window.addEventListener("rating-updated", onRating);

    return () => {
      window.removeEventListener("profile-updated", onProfileChange);
      window.removeEventListener("rating-updated", onRating);
    };
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="bg-linear-to-r from-indigo-600 to-indigo-700 text-white p-8 rounded-lg shadow-md mb-8 flex items-center gap-6">
          {profile?.profileImage ? (
            <img
              src={`http://localhost:5000/${profile.profileImage}`}
              alt="Profile"
              className="w-24 h-24 rounded-full object-cover border-4 border-white"
            />
          ) : (
            <div className="w-24 h-24 rounded-full bg-indigo-700 flex items-center justify-center text-white text-2xl font-bold">Dr</div>
          )}

          <div>
            <h1 className="text-4xl font-bold mb-2">Welcome, Dr. {user?.name}!</h1>
            <p className="text-indigo-100 text-lg">Manage your practice and patient care</p>
          </div>
        </div>

        {/* Main Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {/* Create/Edit Profile Card */}
          <Link
            to="/doctor/profile"
            className="group bg-white p-6 rounded-lg shadow-md hover:shadow-xl transition transform hover:scale-105 flex items-center gap-4"
          >
            <div className="text-4xl mb-4">👤</div>
            <div>
              <h3 className="text-xl font-bold text-gray-900 group-hover:text-blue-600 transition mb-2">
                My Profile
              </h3>
              <p className="text-gray-600 text-sm">
                {profile ? "Profile completed" : "Create or update your professional profile and credentials"}
              </p>
            </div>
          </Link>

          {/* View Appointments Card */}
          <Link
            to="/doctor/appointments"
            className="group bg-white p-6 rounded-lg shadow-md hover:shadow-xl transition transform hover:scale-105"
          >
            <div className="text-4xl mb-4">📋</div>
            <h3 className="text-xl font-bold text-gray-900 group-hover:text-green-600 transition mb-2">
              Patient Appointments
            </h3>
            <p className="text-gray-600 text-sm">
              Review and manage appointment requests from patients
            </p>
          </Link>
        </div>

        {/* Stats Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <div className="bg-white p-6 rounded-lg shadow-md text-center">
            <div className="text-3xl font-bold text-blue-600">{profile ? "✅" : "--"}</div>
            <p className="text-gray-600 text-sm mt-2">Profile Status</p>
            <p className="text-xs text-gray-500 mt-1">
              {profile ? "Completed" : "Incomplete"}
            </p>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-md text-center">
            <div className="text-3xl font-bold text-green-600">{pendingCount}</div>
            <p className="text-gray-600 text-sm mt-2">Patient Requests</p>
            <p className="text-xs text-gray-500 mt-1">Pending appointments</p>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-md text-center">
            <div className="text-3xl font-bold text-purple-600">{profile?.averageRating?.toFixed(1) || "--"}</div>
            <p className="text-gray-600 text-sm mt-2">Rating Score</p>
            <p className="text-xs text-gray-500 mt-1">
              {profile?.ratingCount || 0} reviews
            </p>
          </div>
        </div>

        {/* Guidelines */}
        <div className="bg-indigo-50 border border-indigo-200 p-6 rounded-lg">
          <h3 className="text-lg font-bold text-gray-900 mb-3">📋 Getting Started</h3>
          <ul className="space-y-2 text-gray-700">
            <li>• Complete your professional profile with credentials and experience</li>
            <li>• Receive appointment requests from patients with their symptoms</li>
            <li>• Accept or reject appointments based on your availability</li>
            <li>• Chat with patients to provide consultation</li>
            <li>• Build your reputation through patient ratings</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default DoctorDashboard;
