import axios from "axios";

const ML_SERVICE_URL = process.env.ML_SERVICE_URL || "http://127.0.0.1:5000";

export const predictDisease = async (symptoms) => {
  try {
    const response = await axios.post(`${ML_SERVICE_URL}/predict`, { symptoms });
    return response.data;
  } catch (err) {
    console.error("AI service error:", err?.response?.data || err.message);
    throw new Error("AI prediction service unavailable");
  }
};
