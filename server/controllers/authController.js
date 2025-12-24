import bcrypt from "bcryptjs";
import { body, validationResult } from "express-validator";
import pool from "../config/database.js";
import { generateTokens, verifyRefreshToken } from "../utils/jwt.js";
import { sendSuccess, sendError, sendBadRequest } from "../utils/response.js";
import { getImageUrl } from "../utils/imageUrl.js";

// Register
export const register = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const {
      email,
      password,
      first_name,
      last_name,
      username,
      phone,
      phone_number,
    } = req.body;

    // Check if user exists
    const [existing] = await pool.execute(
      "SELECT id FROM user WHERE email = ?",
      [email]
    );

    if (existing.length > 0) {
      return sendBadRequest(res, "User already exists");
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user
    const [result] = await pool.execute(
      `INSERT INTO user (email, username, first_name, last_name, password, phone, phone_number, status) 
       VALUES (?, ?, ?, ?, ?, ?, ?, 'Active')`,
      [
        email,
        username || null,
        first_name || null,
        last_name || null,
        hashedPassword,
        phone || null,
        phone_number || null,
      ]
    );

    const userId = result.insertId;

    // Generate tokens
    const { accessToken, refreshToken } = generateTokens(userId);

    return sendSuccess(
      res,
      {
        user: {
          id: userId,
          email,
          username: username || null,
          first_name: first_name || null,
          last_name: last_name || null,
        },
        access: accessToken,
        refresh: refreshToken,
      },
      "User registered successfully",
      201
    );
  } catch (error) {
    console.error("Register error:", error);
    return sendError(res, "Registration failed", 500);
  }
};

// Login - Check admins table first for admin login
export const login = async (req, res) => {
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

// Get current user
export const getCurrentUser = async (req, res) => {
  try {
    // Check if user is admin (has name field or is_staff/is_superuser)
    if (req.user.is_staff || req.user.is_superuser || req.user.name) {
      // Fetch full admin data from admins table
      const [admins] = await pool.execute(
        "SELECT id, email, name, photo, is_verified FROM admins WHERE id = ?",
        [req.user.id]
      );

      if (admins.length > 0) {
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
      }
    }

    // Regular user - return user table data
    return sendSuccess(res, {
      id: req.user.id,
      email: req.user.email,
      username: req.user.username,
      first_name: req.user.first_name,
      last_name: req.user.last_name,
      phone: req.user.phone,
      phone_number: req.user.phone_number,
      is_verified: req.user.is_verified,
      status: req.user.status,
      is_staff: req.user.is_staff || false,
      is_superuser: req.user.is_superuser || false,
    });
  } catch (error) {
    console.error("Get user error:", error);
    return sendError(res, "Failed to get user", 500);
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
