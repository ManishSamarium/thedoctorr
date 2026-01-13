import axios from "axios";

const ML_SERVICE_URL = process.env.ML_SERVICE_URL || "http://127.0.0.1:5000";

export const predictDisease = async (symptoms) => {
  try {
    const response = await axios.post(`${ML_SERVICE_URL}/predict`, { symptoms });
    const data = response.data;
    // If ML service returned an error payload or missing predictions, surface it
    if (!data) {
      throw new Error("Empty response from ML service");
    }
    if (data.error) {
      throw new Error(data.error || "ML service returned an error");
    }
    if (!Array.isArray(data.predictions)) {
      throw new Error("ML service returned invalid predictions");
    }

    return data;
  } catch (err) {
    console.error("AI service error:", err.response?.status, err.response?.data || err.message);
    // Rethrow the original error so callers can inspect response/status
    throw err;
  }
};
