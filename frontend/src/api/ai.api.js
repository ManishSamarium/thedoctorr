import api from "./axios";

export const predictDisease = (symptoms) =>
  api.post("/ai/predict", { symptoms });
