import express from "express";
import { register, login, getMe, logout } from "../controllers/auth.control.js";
import { protect } from "../middleware/auth.middleware.js";

const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.get("/me", protect, getMe);
router.post("/logout", logout);

export default router;
