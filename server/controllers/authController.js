import bcrypt from "bcryptjs";
import { body, validationResult } from "express-validator";
import pool from "../config/database.js";
import { generateTokens, verifyRefreshToken } from "../utils/jwt.js";
import { sendSuccess, sendError, sendBadRequest } from "../utils/response.js";
import { getImageUrl } from "../utils/imageUrl.js";

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
      return sendError(res, "Access denied. Admin account required.", 401);
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
    return sendError(res, "Login failed", 500);
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
    return sendError(res, "Failed to get admin", 500);
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
