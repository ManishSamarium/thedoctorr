import api from "./axios";

export const createAppointment = (formData) =>
  api.post("/appointment", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });

export const getDoctorAppointments = () =>
  api.get("/appointment/doctor");

export const getPatientAppointments = () =>
  api.get("/appointment/patient");

export const getAppointment = (appointmentId) =>
  api.get(`/appointment/${appointmentId}`);

export const updateAppointmentStatus = (id, status) =>
  api.patch(`/appointment/${id}/status`, { status });
