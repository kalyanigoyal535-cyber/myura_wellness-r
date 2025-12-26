import express from "express";
import { body } from "express-validator";
import { authenticate } from "../middleware/auth.js";
import {
  adminLogin,
  getCurrentUser,
  refreshToken,
  logout,
} from "../controllers/authController.js";

const router = express.Router();

// Admin Login
router.post(
  "/login",
  [body("email").isEmail().normalizeEmail(), body("password").notEmpty()],
  adminLogin
);

// Get current user
router.get("/user", authenticate, getCurrentUser);

// Refresh token
router.post("/token/refresh", refreshToken);

// Logout
router.post("/logout", authenticate, logout);

export default router;
