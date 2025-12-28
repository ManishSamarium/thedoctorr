import axios from "axios";

export const predictDisease = async (symptoms) => {
  try {
    const response = await axios.post(
      "http://127.0.0.1:8000/predict",
      { symptoms }
    );
    return response.data;
  } catch (err) {
    console.error("AI service error:", err.message);
    throw new Error("AI prediction service unavailable");
  }
};
