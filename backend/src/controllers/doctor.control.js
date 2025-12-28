import Doctor from "../models/doctor.model.js";
import User from "../models/user.model.js";

/**
 * Create or update doctor profile
 * Only doctors with valid profile can be discovered by patients
 */
export const createOrUpdateProfile = async (req, res) => {
  try {
    const { category, experience, bio } = req.body;

    // Validate required fields
    if (!category || experience === undefined) {
      return res
        .status(400)
        .json({ message: "Category and experience required" });
    }

    const experienceNum = parseInt(experience);
    if (isNaN(experienceNum) || experienceNum < 0) {
      return res.status(400).json({ message: "Invalid experience value" });
    }

    // Find or create doctor profile
    let profile = await Doctor.findOne({ userId: req.user.id });

    if (!profile) {
      profile = await Doctor.create({
        userId: req.user.id,
        category,
        experience: experienceNum,
        bio: bio || null,
        profileImage: req.file ? req.file.path : null
      });
    } else {
      // Update existing profile
      profile.category = category;
      profile.experience = experienceNum;
      profile.bio = bio || profile.bio;
      if (req.file) {
        profile.profileImage = req.file.path;
      }
      await profile.save();
    }

    res.status(200).json({
      message: "Profile saved successfully",
      profile
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to save profile" });
  }
};

/**
 * Get doctor's own profile
 */
export const getMyProfile = async (req, res) => {
  try {
    const profile = await Doctor.findOne({ userId: req.user.id });

    if (!profile) {
      return res.status(404).json({ message: "Profile not found" });
    }

    res.json(profile);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to fetch profile" });
  }
};

/**
 * Get all complete doctor profiles for patient browsing
 * Only returns doctors with valid complete profiles
 */
export const getAllDoctors = async (req, res) => {
  try {
    const doctors = await Doctor.find()
      .populate({
        path: "userId",
        select: "name email",
        match: { role: "doctor" }
      })
      .lean();

    // Filter out incomplete profiles (where userId is null or not found)
    const completeDoctors = doctors
      .filter((doc) => doc.userId !== null)
      .map((doc) => ({
        ...doc,
        name: doc.userId.name,
        email: doc.userId.email
      }));

    res.json(completeDoctors);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to fetch doctors" });
  }
};

