import { Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

const PatientDashboard = () => {
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="bg-linear-to-r from-blue-600 to-blue-700 text-white p-8 rounded-lg shadow-md mb-8">
          <h1 className="text-4xl font-bold mb-2">Welcome, {user?.name}!</h1>
          <p className="text-blue-100 text-lg">
            Your health journey starts here
          </p>
        </div>

        {/* Main Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {/* Browse Doctors Card */}
          <Link
            to="/patient/doctors"
            className="group bg-white p-6 rounded-lg shadow-md hover:shadow-xl transition transform hover:scale-105"
          >
            <div className="text-4xl mb-4">👨‍⚕️</div>
            <h3 className="text-xl font-bold text-gray-900 group-hover:text-blue-600 transition mb-2">
              Browse Doctors
            </h3>
            <p className="text-gray-600 text-sm">
              Find and connect with experienced healthcare professionals
            </p>
          </Link>

          {/* Disease Prediction Card */}
          <Link
            to="/patient/predict"
            className="group bg-white p-6 rounded-lg shadow-md hover:shadow-xl transition transform hover:scale-105"
          >
            <div className="text-4xl mb-4">🔬</div>
            <h3 className="text-xl font-bold text-gray-900 group-hover:text-green-600 transition mb-2">
              Predict Disease
            </h3>
            <p className="text-gray-600 text-sm">
              Get preliminary health insights using AI analysis
            </p>
          </Link>

          {/* My Appointments Card */}
          <Link
            to="/patient/appointments"
            className="group bg-white p-6 rounded-lg shadow-md hover:shadow-xl transition transform hover:scale-105"
          >
            <div className="text-4xl mb-4">📅</div>
            <h3 className="text-xl font-bold text-gray-900 group-hover:text-purple-600 transition mb-2">
              My Appointments
            </h3>
            <p className="text-gray-600 text-sm">
              View and manage your scheduled appointments
            </p>
          </Link>

          {/* Medical Reports Card */}
          <div className="group bg-white p-6 rounded-lg shadow-md hover:shadow-xl transition transform hover:scale-105 opacity-50 cursor-not-allowed">
            <div className="text-4xl mb-4">📄</div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">
              Medical Reports
            </h3>
            <p className="text-gray-600 text-sm">
              Upload and share your medical reports with doctors
            </p>
            <p className="text-xs text-yellow-600 font-medium mt-3">
              Coming Soon
            </p>
          </div>
        </div>

        {/* Quick Tips */}
        <div className="bg-blue-50 border border-blue-200 p-6 rounded-lg">
          <h3 className="text-lg font-bold text-gray-900 mb-3">
            💡 Quick Tips
          </h3>
          <ul className="space-y-2 text-gray-700">
            <li>• Start by browsing available doctors in your area</li>
            <li>• Use the disease predictor to analyze your symptoms</li>
            <li>• Schedule appointments with doctors for consultations</li>
            <li>• Chat with your doctor once an appointment is accepted</li>
            <li>• Rate doctors after consultation to help other patients</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default PatientDashboard;
