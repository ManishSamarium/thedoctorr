import { Routes, Route, Navigate } from "react-router-dom";
import Login from "../pages/auth/Login";
import Register from "../pages/auth/Register";
import PatientDashboard from "../pages/patient/PatientDashboard";
import DoctorDashboard from "../pages/doctor/DoctorDashboard";
import ProtectedRoute from "../components/common/ProtectedRoute";
import CreateProfile from "../pages/doctor/CreateProfile";
import BrowseDoctor from "../pages/patient/BrowseDoctor";
import PredictDisease from "../pages/patient/PredictDisease";
import SendReport from "../pages/patient/SendReport";
import Appointments from "../pages/doctor/Appointments";
import MyAppointments from "../pages/patient/MyAppointments";
import ChatPage from "../pages/chat/ChatPage";

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/login" />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      <Route
        path="/patient"
        element={
          <ProtectedRoute role="patient">
            <PatientDashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/doctor/profile"
        element={
          <ProtectedRoute role="doctor">
            <CreateProfile />
          </ProtectedRoute>
        }
      />
      <Route
        path="/patient/doctors"
        element={
          <ProtectedRoute role="patient">
            <BrowseDoctor />
          </ProtectedRoute>
        }
      />
      <Route
        path="/patient/predict"
        element={
          <ProtectedRoute role="patient">
            <PredictDisease />
          </ProtectedRoute>
        }
      />
      <Route
        path="/patient/send-report"
        element={
          <ProtectedRoute role="patient">
            <SendReport />
          </ProtectedRoute>
        }
      />

      <Route
        path="/doctor"
        element={
          <ProtectedRoute role="doctor">
            <DoctorDashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/doctor/appointments"
        element={
          <ProtectedRoute role="doctor">
            <Appointments />
          </ProtectedRoute>
        }
      />
      <Route
        path="/patient/appointments"
        element={
          <ProtectedRoute role="patient">
            <MyAppointments />
          </ProtectedRoute>
        }
      />
      <Route
        path="/chat/:appointmentId"
        element={
          <ProtectedRoute>
            <ChatPage />
          </ProtectedRoute>
        }
      />
    </Routes>
  );
};

export default AppRoutes;
