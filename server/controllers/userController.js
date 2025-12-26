import bcrypt from "bcryptjs";
import { body, validationResult } from "express-validator";
import pool from "../config/database.js";
import { generateTokens, verifyRefreshToken } from "../utils/jwt.js";
import { sendSuccess, sendError, sendBadRequest } from "../utils/response.js";
import { getImageUrl } from "../utils/imageUrl.js";
import crypto from "crypto";
import { sendPasswordResetEmail } from "../utils/email.js";

// Register user
export const register = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const {
      email,
      password,
      password2,
      first_name,
      last_name,
      username,
      phone_number,
    } = req.body;

    // Validate password match
    if (password !== password2) {
      return sendBadRequest(res, "Passwords do not match");
    }

    // Check if user exists
    const [existing] = await pool.execute(
      "SELECT id FROM user WHERE email = ? OR username = ?",
      [email, username]
    );

    if (existing.length > 0) {
      return sendBadRequest(
        res,
        "User with this email or username already exists"
      );
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user
    const [result] = await pool.execute(
      `INSERT INTO user (email, username, first_name, last_name, password, phone_number, status) 
       VALUES (?, ?, ?, ?, ?, ?, 'Active')`,
      [
        email,
        username || null,
        first_name || null,
        last_name || null,
        hashedPassword,
        phone_number || null,
      ]
    );

    const userId = result.insertId;

    // Generate tokens
    const { accessToken, refreshToken } = generateTokens(userId);

    // Fetch created user
    const [users] = await pool.execute(
      "SELECT id, email, username, first_name, last_name, phone_number, date_joined FROM user WHERE id = ?",
      [userId]
    );

    return sendSuccess(
      res,
      {
        user: users[0],
        tokens: {
          access: accessToken,
          refresh: refreshToken,
        },
      },
      "User registered successfully",
      201
    );
  } catch (error) {
    console.error("Register error:", error);
    return sendError(res, "Registration failed", 500);
  }
};

// User login
export const login = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { email, password } = req.body;

    // Check user table (regular users only)
    const [users] = await pool.execute(
      "SELECT id, email, username, first_name, last_name, password, phone_number, status, is_verified FROM user WHERE email = ?",
      [email]
    );

    if (users.length === 0) {
      return sendError(res, "Invalid credentials", 401);
    }

    const user = users[0];

    // Check if user is active
    if (user.status !== "Active") {
      return sendError(
        res,
        "Account is inactive. Please contact support.",
        401
      );
    }

    // Verify password
    const isValid = await bcrypt.compare(password, user.password);
    if (!isValid) {
      return sendError(res, "Invalid credentials", 401);
    }

    // Generate tokens
    const { accessToken, refreshToken } = generateTokens(user.id);

    return sendSuccess(
      res,
      {
        user: {
          id: user.id,
          email: user.email,
          username: user.username,
          first_name: user.first_name,
          last_name: user.last_name,
          phone_number: user.phone_number,
          is_verified: user.is_verified,
        },
        tokens: {
          access: accessToken,
          refresh: refreshToken,
        },
      },
      "Login successful"
    );
  } catch (error) {
    console.error("Login error:", error);
    return sendError(res, "Login failed", 500);
  }
};

// Get user profile
export const getProfile = async (req, res) => {
  try {
    const userId = req.user?.id;

    if (!userId) {
      return sendError(res, "Authentication required", 401);
    }

    // Fetch user data
    const [users] = await pool.execute(
      "SELECT id, email, username, first_name, last_name, phone, phone_number, photo, is_verified, status, date_joined FROM user WHERE id = ?",
      [userId]
    );

    if (users.length === 0) {
      return sendError(res, "User not found", 404);
    }

    const user = users[0];

    return sendSuccess(res, {
      id: user.id,
      email: user.email,
      username: user.username,
      first_name: user.first_name,
      last_name: user.last_name,
      phone: user.phone,
      phone_number: user.phone_number,
      photo: user.photo ? getImageUrl(req, user.photo, "users") : null,
      is_verified: user.is_verified,
      status: user.status,
      date_joined: user.date_joined,
    });
  } catch (error) {
    console.error("Get profile error:", error);
    return sendError(res, "Failed to get profile", 500);
  }
};

// Update user profile
export const updateProfile = async (req, res) => {
  try {
    const userId = req.user?.id;

    if (!userId) {
      return sendError(res, "Authentication required", 401);
    }

    const { first_name, last_name, phone_number } = req.body;

    // Update user
    const updateFields = [];
    const values = [];

    if (first_name !== undefined) {
      updateFields.push("first_name = ?");
      values.push(first_name);
    }
    if (last_name !== undefined) {
      updateFields.push("last_name = ?");
      values.push(last_name);
    }
    if (phone_number !== undefined) {
      updateFields.push("phone_number = ?");
      values.push(phone_number);
    }

    if (updateFields.length === 0) {
      return sendBadRequest(res, "No fields to update");
    }

    values.push(userId);

    await pool.execute(
      `UPDATE user SET ${updateFields.join(", ")} WHERE id = ?`,
      values
    );

    // Fetch updated user
    const [users] = await pool.execute(
      "SELECT id, email, username, first_name, last_name, phone, phone_number, photo, is_verified, status, date_joined FROM user WHERE id = ?",
      [userId]
    );

    const user = users[0];

    return sendSuccess(
      res,
      {
        id: user.id,
        email: user.email,
        username: user.username,
        first_name: user.first_name,
        last_name: user.last_name,
        phone: user.phone,
        phone_number: user.phone_number,
        photo: user.photo ? getImageUrl(req, user.photo, "users") : null,
        is_verified: user.is_verified,
        status: user.status,
        date_joined: user.date_joined,
      },
      "Profile updated successfully"
    );
  } catch (error) {
    console.error("Update profile error:", error);
    return sendError(res, "Failed to update profile", 500);
  }
};

// Request password reset
export const requestPasswordReset = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { email } = req.body;

    // Check if user exists in user table
    const [users] = await pool.execute(
      "SELECT id, email, first_name, username FROM user WHERE email = ? AND status = 'Active'",
      [email]
    );

    // For security, always return success message even if user doesn't exist
    // This prevents email enumeration attacks
    if (users.length === 0) {
      return sendSuccess(
        res,
        {
          message:
            "If an account with that email exists, we have sent a password reset link.",
        },
        "Password reset link sent"
      );
    }

    const user = users[0];

    // Generate reset token
    const resetToken = crypto.randomBytes(32).toString("hex");
    const resetTokenExpiry = new Date();
    resetTokenExpiry.setHours(resetTokenExpiry.getHours() + 1); // Token valid for 1 hour

    // Store reset token in database
    try {
      await pool.execute(
        "UPDATE user SET reset_token = ?, reset_token_expiry = ? WHERE id = ?",
        [resetToken, resetTokenExpiry, user.id]
      );
    } catch (updateError) {
      // If columns don't exist, we need to add them
      if (updateError.code === "ER_BAD_FIELD_ERROR") {
        console.warn(
          "reset_token columns not found in user table. Please add them to schema."
        );
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
      throw updateError;
    }

    // Generate reset link
    const resetLink = `${
      process.env.FRONTEND_URL || "http://localhost:3000"
    }/reset-password/${user.id}/${resetToken}`;

    // Send password reset email
    const emailSent = await sendPasswordResetEmail(
      email,
      resetLink,
      user.first_name || user.username || null
    );

    if (!emailSent) {
      // Log the link if email sending fails (for development)
      console.log(`Password reset link for ${email}: ${resetLink}`);
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
    console.error("Request password reset error:", error);
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

// Confirm password reset
export const confirmPasswordReset = async (req, res) => {
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

    // Verify token and get user
    const [users] = await pool.execute(
      "SELECT id, reset_token, reset_token_expiry FROM user WHERE id = ? AND reset_token = ?",
      [uid, token]
    );

    if (users.length === 0) {
      return sendError(res, "Invalid or expired reset token", 400);
    }

    const user = users[0];

    // Check if token is expired
    if (
      !user.reset_token_expiry ||
      new Date() > new Date(user.reset_token_expiry)
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
    try {
      await pool.execute(
        "UPDATE user SET password = ?, reset_token = NULL, reset_token_expiry = NULL WHERE id = ?",
        [hashedPassword, user.id]
      );
    } catch (updateError) {
      if (updateError.code === "ER_BAD_FIELD_ERROR") {
        // If reset_token columns don't exist, just update password
        await pool.execute("UPDATE user SET password = ? WHERE id = ?", [
          hashedPassword,
          user.id,
        ]);
      } else {
        throw updateError;
      }
    }

    return sendSuccess(
      res,
      { message: "Password has been reset successfully" },
      "Password reset successful"
    );
  } catch (error) {
    console.error("Confirm password reset error:", error);
    return sendError(res, "Failed to reset password", 500);
  }
};

// Logout
export const logout = async (req, res) => {
  return sendSuccess(res, {}, "Logged out successfully");
};
