import { useState, useEffect } from "react";
import { createOrUpdateProfile, getMyProfile } from "../../api/doctor.api";
import { useToast } from "../common/Toast";
import Loader from "../common/Loader";

const DoctorProfileForm = () => {
  const [form, setForm] = useState({
    category: "",
    experience: "",
    bio: "",
  });
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const { show: showToast } = useToast();

  // Fetch existing profile
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setFetching(true);
        const res = await getMyProfile();
        const profile = res.data;
        setForm({
          category: profile.category || "",
          experience: profile.experience || "",
          bio: profile.bio || "",
        });
        if (profile.profileImage) {
          setPreview(`http://localhost:5000/${profile.profileImage}`);
        }
      } catch (err) {
        console.error("No existing profile found, creating new");
      } finally {
        setFetching(false);
      }
    };

    fetchProfile();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate
    if (!form.category || !form.experience) {
      showToast("Category and experience are required", "error");
      return;
    }

    const exp = parseInt(form.experience);
    if (isNaN(exp) || exp < 0 || exp > 70) {
      showToast("Experience must be between 0 and 70 years", "error");
      return;
    }

    setLoading(true);

    try {
      const data = new FormData();
      data.append("category", form.category);
      data.append("experience", form.experience);
      data.append("bio", form.bio);
      if (image) {
        data.append("profileImage", image);
      }

      const res = await createOrUpdateProfile(data);
      showToast("Profile saved successfully!", "success");
      // Notify other components to refresh doctor data (Navbar, Dashboard, etc.)
      try {
        const profile = res.data.profile;
        window.dispatchEvent(new CustomEvent("profile-updated", { detail: profile }));
      } catch (e) {
        // ignore
      }
    } catch (err) {
      console.error(err);
      showToast(
        err.response?.data?.message || "Failed to save profile",
        "error"
      );
    } finally {
      setLoading(false);
    }
  };

  if (fetching) {
    return <Loader />;
  }

  const SPECIALIZATIONS = [
    "General Practitioner",
    "Cardiologist",
    "Dermatologist",
    "Neurologist",
    "Orthopedist",
    "Pediatrician",
    "Psychiatrist",
    "Surgeon",
    "Dentist",
    "Ophthalmologist",
    "Other",
  ];

  return (
    <form
      onSubmit={handleSubmit}
      className="max-w-2xl mx-auto bg-white rounded-xl shadow-lg p-8"
    >
      <h2 className="text-3xl font-bold text-gray-900 mb-8">Doctor Profile</h2>

      {/* Profile Image */}
      <div className="mb-8">
        <label className="block text-sm font-semibold text-gray-900 mb-4">
          Profile Picture
        </label>
        <div className="flex items-center gap-6">
          <div className="w-32 h-32 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden border-2 border-gray-300">
            {preview ? (
              <img
                src={preview}
                alt="Preview"
                className="w-full h-full object-cover"
              />
            ) : (
              <span className="text-4xl">👨‍⚕️</span>
            )}
          </div>
          <label className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg cursor-pointer transition font-medium">
            {preview ? "Change Photo" : "Upload Photo"}
            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="hidden"
            />
          </label>
        </div>
        <p className="text-sm text-gray-500 mt-2">
          JPG, PNG up to 5MB recommended
        </p>
      </div>

      {/* Specialization */}
      <div className="mb-6">
        <label className="block text-sm font-semibold text-gray-900 mb-2">
          Specialization *
        </label>
        <select
          name="category"
          value={form.category}
          onChange={handleChange}
          required
          className="w-full border border-gray-300 px-4 py-3 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        >
          <option value="">Select your specialization</option>
          {SPECIALIZATIONS.map((spec) => (
            <option key={spec} value={spec}>
              {spec}
            </option>
          ))}
        </select>
      </div>

      {/* Experience */}
      <div className="mb-6">
        <label className="block text-sm font-semibold text-gray-900 mb-2">
          Years of Experience *
        </label>
        <input
          name="experience"
          type="number"
          min="0"
          max="70"
          value={form.experience}
          onChange={handleChange}
          required
          placeholder="e.g. 10"
          className="w-full border border-gray-300 px-4 py-3 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
      </div>

      {/* Bio */}
      <div className="mb-8">
        <label className="block text-sm font-semibold text-gray-900 mb-2">
          Professional Bio
        </label>
        <textarea
          name="bio"
          value={form.bio}
          onChange={handleChange}
          rows="5"
          placeholder="Brief professional description, education, achievements..."
          className="w-full border border-gray-300 px-4 py-3 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
        />
        <p className="text-sm text-gray-500 mt-2">
          Max 500 characters. This will be visible to patients.
        </p>
      </div>

      {/* Buttons */}
      <div className="flex gap-4">
        <button
          type="submit"
          disabled={loading}
          className="flex-1 px-6 py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-semibold rounded-lg transition flex items-center justify-center gap-2"
        >
          {loading ? (
            <>
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              Saving...
            </>
          ) : (
            "💾 Save Profile"
          )}
        </button>
      </div>
    </form>
  );
};

export default DoctorProfileForm;
