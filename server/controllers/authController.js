import bcrypt from "bcryptjs";
import { body, validationResult } from "express-validator";
import pool from "../config/database.js";
import { generateTokens, verifyRefreshToken } from "../utils/jwt.js";
import { sendSuccess, sendError, sendBadRequest } from "../utils/response.js";
import { getImageUrl } from "../utils/imageUrl.js";
import crypto from "crypto";
import { sendPasswordResetEmail } from "../utils/email.js";

// Admin Login - Only for admins
export const adminLogin = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { email, password } = req.body;

    // Only allow admins to login - check admins table only
    const [admins] = await pool.execute(
      "SELECT id, email, name, password, is_verified FROM admins WHERE email = ?",
      [email]
    );

    if (admins.length === 0) {
      return sendError(res, "Admin not found", 401);
    }

    const admin = admins[0];

    // Verify password
    const isValid = await bcrypt.compare(password, admin.password);
    if (!isValid) {
      return sendError(res, "Invalid credentials", 401);
    }

    if (!admin.is_verified) {
      return sendError(res, "Admin account not verified", 401);
    }

    // Generate tokens
    const { accessToken, refreshToken } = generateTokens(admin.id);

    return sendSuccess(
      res,
      {
        user: {
          id: admin.id,
          email: admin.email,
          name: admin.name,
          is_staff: true,
          is_superuser: true,
        },
        access: accessToken,
        refresh: refreshToken,
      },
      "Login successful"
    );
  } catch (error) {
    console.error("Login error:", error);
    if (error.code === 'ECONNREFUSED' || error.code === 'PROTOCOL_CONNECTION_LOST' || error.code === 'ECONNRESET') {
      return sendError(res, "Database connection error. Please ensure MySQL is running.", 500);
    }
    return sendError(res, "Login failed. Please try again later.", 500);
  }
};

// Get current admin user
export const getCurrentUser = async (req, res) => {
  try {
    // This endpoint is only for admins
    if (!req.user.is_staff && !req.user.is_superuser) {
      return sendError(res, "Admin access required", 403);
    }

    // Fetch full admin data from admins table
    const [admins] = await pool.execute(
      "SELECT id, email, name, photo, is_verified FROM admins WHERE id = ?",
      [req.user.id]
    );

    if (admins.length === 0) {
      return sendError(res, "Admin not found", 404);
    }

    const admin = admins[0];
    return sendSuccess(res, {
      id: admin.id,
      email: admin.email,
      name: admin.name,
      photo: admin.photo ? getImageUrl(req, admin.photo, "admins") : null,
      is_verified: admin.is_verified,
      is_staff: true,
      is_superuser: true,
    });
  } catch (error) {
    console.error("Get admin error:", error);
    if (error.code === 'ECONNREFUSED' || error.code === 'PROTOCOL_CONNECTION_LOST' || error.code === 'ECONNRESET') {
      return sendError(res, "Database connection error. Please ensure MySQL is running.", 500);
    }
    return sendError(res, "Failed to get admin profile.", 500);
  }
};

// Refresh token
export const refreshToken = async (req, res) => {
  try {
    const { refresh } = req.body;

    if (!refresh) {
      return sendBadRequest(res, "Refresh token required");
    }

    const decoded = verifyRefreshToken(refresh);
    const { accessToken } = generateTokens(decoded.userId);

    return sendSuccess(res, { access: accessToken });
  } catch (error) {
    return sendError(res, "Invalid refresh token", 401);
  }
};

// Logout
export const logout = async (req, res) => {
  return sendSuccess(res, {}, "Logged out successfully");
};

// Request admin password reset
export const requestAdminPasswordReset = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { email } = req.body;

    // Check if admin exists
    const [admins] = await pool.execute(
      "SELECT id, email, name FROM admins WHERE email = ? AND is_verified = 1",
      [email]
    );

    // For security, always return success message even if admin doesn't exist
    if (admins.length === 0) {
      return sendSuccess(
        res,
        {
          message:
            "If an account with that email exists, we have sent a password reset link.",
        },
        "Password reset link sent"
      );
    }

    const admin = admins[0];

    // Generate reset token
    const resetToken = crypto.randomBytes(32).toString("hex");
    const resetTokenExpiry = new Date();
    resetTokenExpiry.setHours(resetTokenExpiry.getHours() + 1); // Token valid for 1 hour

    // Store reset token in database
    await pool.execute(
      "UPDATE admins SET reset_token = ?, reset_token_expiry = ? WHERE id = ?",
      [resetToken, resetTokenExpiry, admin.id]
    );

    // Generate reset link
    const resetLink = `${
      process.env.ADMIN_PANEL_URL ||
      process.env.FRONTEND_URL ||
      "http://localhost:5173"
    }/reset-password/${admin.id}/${resetToken}`;

    // Send password reset email
    const emailSent = await sendPasswordResetEmail(
      email,
      resetLink,
      admin.name || null
    );

    if (!emailSent) {
      // Log the link if email sending fails (for development)
      console.log(`Admin password reset link for ${email}: ${resetLink}`);
    }

    return sendSuccess(
      res,
      {
        message:
          "If an account with that email exists, we have sent a password reset link.",
      },
      "Password reset link sent"
    );
  } catch (error) {
    console.error("Request admin password reset error:", error);
    // Still return success for security
    return sendSuccess(
      res,
      {
        message:
          "If an account with that email exists, we have sent a password reset link.",
      },
      "Password reset link sent"
    );
  }
};

// Confirm admin password reset
export const confirmAdminPasswordReset = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { uid, token, new_password, new_password2 } = req.body;

    if (!uid || !token || !new_password || !new_password2) {
      return sendBadRequest(res, "All fields are required");
    }

    if (new_password !== new_password2) {
      return sendBadRequest(res, "Passwords do not match");
    }

    if (new_password.length < 8) {
      return sendBadRequest(res, "Password must be at least 8 characters long");
    }

    // Verify token and get admin
    const [admins] = await pool.execute(
      "SELECT id, reset_token, reset_token_expiry FROM admins WHERE id = ? AND reset_token = ?",
      [uid, token]
    );

    if (admins.length === 0) {
      return sendError(res, "Invalid or expired reset token", 400);
    }

    const admin = admins[0];

    // Check if token is expired
    if (
      !admin.reset_token_expiry ||
      new Date() > new Date(admin.reset_token_expiry)
    ) {
      return sendError(
        res,
        "Reset token has expired. Please request a new one.",
        400
      );
    }

    // Hash new password
    const hashedPassword = await bcrypt.hash(new_password, 10);

    // Update password and clear reset token
    await pool.execute(
      "UPDATE admins SET password = ?, reset_token = NULL, reset_token_expiry = NULL WHERE id = ?",
      [hashedPassword, admin.id]
    );

    return sendSuccess(
      res,
      { message: "Password has been reset successfully" },
      "Password reset successful"
    );
  } catch (error) {
    console.error("Confirm admin password reset error:", error);
    return sendError(res, "Failed to reset password", 500);
  }
};
