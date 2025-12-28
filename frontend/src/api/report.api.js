import api from "./axios";

export const downloadReportPdf = async (reportId) => {
  const response = await api.get(`/report/${reportId}/pdf`, { responseType: "blob" });
  return response.data;
};
