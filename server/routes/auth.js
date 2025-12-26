import express from "express";
import { body } from "express-validator";
import { authenticate } from "../middleware/auth.js";
import {
  adminLogin,
  getCurrentUser,
  refreshToken,
  logout,
  requestAdminPasswordReset,
  confirmAdminPasswordReset,
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

// Admin password reset request
router.post(
  "/password/reset/",
  [body("email").isEmail().normalizeEmail()],
  requestAdminPasswordReset
);

// Admin password reset confirm
router.post(
  "/password/reset/confirm/",
  [
    body("uid").notEmpty(),
    body("token").notEmpty(),
    body("new_password").isLength({ min: 8 }),
    body("new_password2").notEmpty(),
  ],
  confirmAdminPasswordReset
);

export default router;
