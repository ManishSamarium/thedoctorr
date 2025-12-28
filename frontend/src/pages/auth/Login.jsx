import { useState, useEffect } from "react";
import { loginUser } from "../../api/auth.api";
import { getMyProfile } from "../../api/doctor.api";
import { useAuth } from "../../context/AuthContext";
import { useNavigate, Link, useLocation } from "react-router-dom";

const Login = () => {
  const [form, setForm] = useState({
    email: "",
    password: "",
    role: "patient",
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);
  const { setUser } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // Show message from registration redirect
  useEffect(() => {
    if (location.state?.message) {
      setSuccess(location.state.message);
      if (location.state?.email) {
        setForm((prev) => ({ ...prev, email: location.state.email }));
      }
    }
  }, [location]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
    setError(""); // Clear error when user starts typing
  };

  const submit = async (e) => {
    e.preventDefault();

    // Validate form
    if (!form.email.trim()) {
      setError("Email is required");
      return;
    }
    if (!form.password) {
      setError("Password is required");
      return;
    }

    try {
      setLoading(true);
      setError("");

      // 1. Login and get user data
      const res = await loginUser(form);
      // Backend returns user in res.data.user, fallback to res.data
      const userData = res.data.user || res.data;

      // 2. Update auth context immediately
      setUser(userData);

      // 3. Determine where to redirect based on role
      if (userData.role === "doctor") {
        // Check if doctor has a profile
        try {
          await getMyProfile();
          // Profile exists, go to doctor dashboard
          navigate("/doctor", { replace: true });
        } catch (err) {
          // Profile doesn't exist, redirect to create profile
          navigate("/doctor/profile", { replace: true });
        }
      } else {
        // Patient goes to patient dashboard
        navigate("/patient", { replace: true });
      }
    } catch (err) {
      console.error("Login error:", err);
      setError(
        err.response?.data?.message ||
          "Login failed. Please check your credentials."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4">
      <div className="w-full max-w-md bg-white rounded-lg shadow-md p-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-blue-600">TheDoctor</h1>
          <p className="text-gray-600 text-sm mt-2">Healthcare Platform</p>
        </div>

        <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">
          Sign In
        </h2>

        {success && (
          <div className="mb-4 p-3 bg-green-50 border border-green-200 text-green-700 rounded-lg text-sm">
            ✓ {success}
          </div>
        )}

        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded-lg text-sm">
            {error}
          </div>
        )}

        <form onSubmit={submit} className="space-y-4">
          {/* Role Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Login As
            </label>
            <select
              name="role"
              value={form.role}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="patient">Patient</option>
              <option value="doctor">Doctor</option>
            </select>
          </div>

          {/* Email Input */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email Address
            </label>
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              placeholder="you@example.com"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          {/* Password Input */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Password
            </label>
            <input
              type="password"
              name="password"
              value={form.password}
              onChange={handleChange}
              placeholder="••••••••"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-medium py-2 rounded-lg transition duration-200"
          >
            {loading ? "Signing In..." : "Sign In"}
          </button>
        </form>

        {/* Register Link */}
        <p className="text-center text-gray-600 text-sm mt-6">
          Don't have an account?{" "}
          <Link
            to="/register"
            className="text-blue-600 hover:text-blue-700 font-medium"
          >
            Register here
          </Link>
        </p>

        {/* Demo Credentials */}
        <div className="mt-6 pt-6 border-t border-gray-200">
          <p className="text-xs text-gray-600 text-center mb-2">
            Demo Credentials
          </p>
          <div className="bg-gray-50 p-3 rounded text-xs space-y-1">
            <p>
              <span className="font-medium">Patient:</span> patient@example.com
              / password
            </p>
            <p>
              <span className="font-medium">Doctor:</span> doctor@example.com /
              password
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
