import express from "express";
import { body } from "express-validator";
import { authenticate } from "../middleware/auth.js";
import {
  register,
  login,
  getProfile,
  updateProfile,
  requestPasswordReset,
  confirmPasswordReset,
  logout,
} from "../controllers/userController.js";

const router = express.Router();

// Register
router.post(
  "/register/",
  [
    body("email").isEmail().normalizeEmail(),
    body("password").isLength({ min: 6 }),
    body("password2").notEmpty(),
    body("username").optional().trim(),
  ],
  register
);

// Login
router.post(
  "/login/",
  [body("email").isEmail().normalizeEmail(), body("password").notEmpty()],
  login
);

// Get user profile
router.get("/profile/", authenticate, getProfile);

// Update user profile
router.put(
  "/profile/",
  authenticate,
  [
    body("first_name").optional().trim(),
    body("last_name").optional().trim(),
    body("phone_number").optional().trim(),
  ],
  updateProfile
);

// Password reset request
router.post(
  "/password/reset/",
  [body("email").isEmail().normalizeEmail()],
  requestPasswordReset
);

// Password reset confirm
router.post(
  "/password/reset/confirm/",
  [
    body("uid").notEmpty(),
    body("token").notEmpty(),
    body("new_password").isLength({ min: 8 }),
    body("new_password2").notEmpty(),
  ],
  confirmPasswordReset
);

// Logout
router.post("/logout/", authenticate, logout);

export default router;

