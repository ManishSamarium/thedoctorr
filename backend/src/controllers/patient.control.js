import Patient from "../models/patient.model.js";

export const createPatientProfile = async (req, res) => {
  const profile = await Patient.create(req.body);
  res.json(profile);
};
