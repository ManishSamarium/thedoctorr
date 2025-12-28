import api from "./axios";

export const submitRating = (appointmentId, rating, review) =>
  api.post(`/rating/${appointmentId}`, { rating, review });

export const getDoctorRatings = (doctorId) =>
  api.get(`/rating/doctor/${doctorId}`);
