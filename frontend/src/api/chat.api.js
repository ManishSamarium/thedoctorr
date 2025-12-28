import api from "./axios";

export const getMessages = (appointmentId) =>
  api.get(`/chat/${appointmentId}`);

export const sendMessage = (appointmentId, text) =>
  api.post(`/chat/${appointmentId}`, { text });
