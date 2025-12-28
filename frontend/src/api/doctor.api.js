import api from "./axios";

export const createOrUpdateProfile = (formData) =>
  api.post("/doctor/profile", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });

export const getMyProfile = () =>
  api.get("/doctor/profile");

// 🔹 NEW: patient fetch doctors
export const getAllDoctors = () =>
  api.get("/doctor");
