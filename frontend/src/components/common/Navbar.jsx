import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

const Navbar = () => {
  const { user, setUser, loading } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      // Call logout endpoint
      await fetch("http://localhost:5000/api/auth/logout", {
        method: "POST",
        credentials: "include",
      });
      setUser(null);
      navigate("/login");
    } catch (err) {
      console.error("Logout failed:", err);
    }
  };

  const getRolePath = () => {
    if (!user) return "/login";
    return user.role === "doctor" ? "/doctor" : "/patient";
  };

  const [profile, setProfile] = useState(null);

  useEffect(() => {
    let mounted = true;
    const fetchProfile = async () => {
      if (user?.role === "doctor") {
        try {
          const res = await fetch("http://localhost:5000/api/doctor/profile", {
            credentials: "include",
          });
          const data = await res.json();
          if (mounted && data) setProfile(data);
        } catch (err) {
          // ignore
        }
      }
    };

    fetchProfile();

    const onProfile = (e) => {
      if (mounted) setProfile(e.detail || null);
    };

    window.addEventListener("profile-updated", onProfile);

    return () => {
      mounted = false;
      window.removeEventListener("profile-updated", onProfile);
    };
  }, [user]);

  // Don't render navigation links while loading
  if (loading) {
    return (
      <nav className="bg-white shadow sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link
              to="/"
              className="flex items-center gap-2 text-xl font-bold text-blue-600 hover:text-blue-700 transition"
            >
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white font-bold">
                T
              </div>
              TheDoctor
            </Link>
            <div className="text-gray-600 text-sm">Loading...</div>
          </div>
        </div>
      </nav>
    );
  }

  return (
    <nav className="bg-white shadow sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link
            to={getRolePath()}
            className="flex items-center gap-2 text-xl font-bold text-blue-600 hover:text-blue-700 transition"
          >
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white font-bold">
              T
            </div>
            TheDoctor
          </Link>

          {/* Navigation Links */}
          <div className="flex items-center gap-6">
            {user ? (
              <>
                {user.role === "patient" && (
                  <div className="hidden md:flex gap-6">
                    <Link
                      to="/patient/doctors"
                      className="text-gray-700 hover:text-blue-600 transition font-medium"
                    >
                      Browse Doctors
                    </Link>
                    <Link
                      to="/patient/predict"
                      className="text-gray-700 hover:text-blue-600 transition font-medium"
                    >
                      Predict Disease
                    </Link>
                    <Link
                      to="/patient/appointments"
                      className="text-gray-700 hover:text-blue-600 transition font-medium"
                    >
                      Appointments
                    </Link>
                  </div>
                )}

                {user.role === "doctor" && (
                  <div className="hidden md:flex gap-6">
                    <Link
                      to="/doctor/profile"
                      className="text-gray-700 hover:text-blue-600 transition font-medium"
                    >
                      My Profile
                    </Link>
                    <Link
                      to="/doctor/appointments"
                      className="text-gray-700 hover:text-blue-600 transition font-medium"
                    >
                      Appointments
                    </Link>
                  </div>
                )}

                {/* User Menu */}
                <div className="flex items-center gap-4 border-l border-gray-200 pl-6">
                  {profile?.profileImage ? (
                    <img
                      src={`http://localhost:5000/${profile.profileImage}`}
                      alt="avatar"
                      className="w-10 h-10 rounded-full object-cover"
                    />
                  ) : (
                    <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center text-gray-700 font-semibold">
                      {user.name?.charAt(0) || "U"}
                    </div>
                  )}
                  <div className="text-sm">
                    <p className="font-medium text-gray-900">{user.name}</p>
                    <p className="text-gray-500 text-xs capitalize">{user.role}</p>
                  </div>
                  <button
                    onClick={handleLogout}
                    className="px-4 py-2 text-sm font-medium text-red-600 hover:bg-red-50 rounded transition"
                  >
                    Logout
                  </button>
                </div>
              </>
            ) : (
              <div className="flex gap-4">
                <Link
                  to="/login"
                  className="px-4 py-2 text-blue-600 font-medium hover:bg-blue-50 rounded transition"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="px-4 py-2 bg-blue-600 text-white font-medium hover:bg-blue-700 rounded transition"
                >
                  Register
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
