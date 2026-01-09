import bcrypt from "bcryptjs";
import { body, validationResult } from "express-validator";
import pool from "../config/database.js";
import { generateTokens, verifyRefreshToken } from "../utils/jwt.js";
import { sendSuccess, sendError, sendBadRequest } from "../utils/response.js";
import { getImageUrl } from "../utils/imageUrl.js";
import crypto from "crypto";
import { sendPasswordResetEmail, sendOTPEmail } from "../utils/email.js";
import { createNotification } from "./notificationController.js";
import { OAuth2Client } from "google-auth-library";

// Send OTP to email
export const sendOTP = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return sendBadRequest(res, "Email is required");
    }

    // Check if user already exists
    const [existing] = await pool.execute(
      "SELECT id FROM user WHERE email = ?",
      [email]
    );

    if (existing.length > 0) {
      return sendBadRequest(res, "User with this email already exists");
    }

    // Generate 6-digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes from now

    // Store OTP in database (create table if not exists - better to do this once in a migration, but for now we'll handle it)
    try {
      await pool.execute(
        "CREATE TABLE IF NOT EXISTS email_otps (id INT AUTO_INCREMENT PRIMARY KEY, email VARCHAR(255) NOT NULL, otp VARCHAR(6) NOT NULL, expires_at DATETIME NOT NULL, created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP)"
      );

      // Delete any existing OTP for this email
      await pool.execute("DELETE FROM email_otps WHERE email = ?", [email]);

      // Insert new OTP
      await pool.execute(
        "INSERT INTO email_otps (email, otp, expires_at) VALUES (?, ?, ?)",
        [email, otp, expiresAt]
      );

      // Send email
      const emailSent = await sendOTPEmail(email, otp);

      if (!emailSent) {
        // In development, we might still want to know the OTP
        console.log(`OTP for ${email}: ${otp}`);
      }

      return sendSuccess(res, {}, "Verification code sent to your email");
    } catch (dbError) {
      console.error("OTP storage error:", dbError);
      return sendError(res, "Failed to send verification code", 500);
    }
  } catch (error) {
    console.error("Send OTP error:", error);
    return sendError(res, "Failed to send verification code", 500);
  }
};

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
      otp,
      address,
      city,
      state,
      postal_code,
    } = req.body;

    // Validate password match
    if (password !== password2) {
      return sendBadRequest(res, "Passwords do not match");
    }

    // Verify OTP
    const [otpRecords] = await pool.execute(
      "SELECT * FROM email_otps WHERE email = ? AND otp = ? AND expires_at > NOW()",
      [email, otp]
    );

    if (otpRecords.length === 0) {
      return sendBadRequest(res, "Invalid or expired verification code");
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
    try {
      // Ensure columns exist (proactive schema update)
      await pool.execute("ALTER TABLE user ADD COLUMN IF NOT EXISTS phone_number VARCHAR(20) NULL");
      await pool.execute("ALTER TABLE user ADD COLUMN IF NOT EXISTS address TEXT NULL");
      await pool.execute("ALTER TABLE user ADD COLUMN IF NOT EXISTS city VARCHAR(100) NULL");
      await pool.execute("ALTER TABLE user ADD COLUMN IF NOT EXISTS state VARCHAR(100) NULL");
      await pool.execute("ALTER TABLE user ADD COLUMN IF NOT EXISTS postal_code VARCHAR(20) NULL");
    } catch (schemaError) {
      // Ignore if columns already exist or if DB doesn't support ADD COLUMN IF NOT EXISTS
      console.warn("Schema update warning:", schemaError.message);
    }

    const [result] = await pool.execute(
      `INSERT INTO user (email, username, first_name, last_name, password, phone_number, address, city, state, postal_code, status, is_verified) 
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'Active', 1)`,
      [
        email,
        username || null,
        first_name || null,
        last_name || null,
        hashedPassword,
        phone_number || null,
        address || null,
        city || null,
        state || null,
        postal_code || null,
      ]
    );

    const userId = result.insertId;

    // Delete used OTP
    await pool.execute("DELETE FROM email_otps WHERE email = ?", [email]);

    // Create notification for admin about new user registration
    const userName =
      first_name && last_name
        ? `${first_name} ${last_name}`
        : username || email;
    await createNotification(
      "user_registered",
      "New User Registered",
      `${userName} (${email}) has registered on the platform`,
      userId,
      "user"
    );

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
      "SELECT id, email, username, first_name, last_name, phone_number, address, city, state, postal_code, photo, is_verified, status, date_joined FROM user WHERE id = ?",
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
      phone_number: user.phone_number,
      address: user.address,
      city: user.city,
      state: user.state,
      postal_code: user.postal_code,
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

    const { first_name, last_name, phone_number, address, city, state, postal_code } = req.body;

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
    if (address !== undefined) {
      updateFields.push("address = ?");
      values.push(address);
    }
    if (city !== undefined) {
      updateFields.push("city = ?");
      values.push(city);
    }
    if (state !== undefined) {
      updateFields.push("state = ?");
      values.push(state);
    }
    if (postal_code !== undefined) {
      updateFields.push("postal_code = ?");
      values.push(postal_code);
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
      "SELECT id, email, username, first_name, last_name, phone_number, address, city, state, postal_code, photo, is_verified, status, date_joined FROM user WHERE id = ?",
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
        phone_number: user.phone_number,
        address: user.address,
        city: user.city,
        state: user.state,
        postal_code: user.postal_code,
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
    const resetLink = `${process.env.FRONTEND_URL || "http://localhost:3000"
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

// Google OAuth login
export const googleLogin = async (req, res) => {
  try {
    const { credential } = req.body;

    if (!credential) {
      return sendBadRequest(res, "Google credential is required");
    }

    // Verify Google token
    const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);
    const ticket = await client.verifyIdToken({
      idToken: credential,
      audience: process.env.GOOGLE_CLIENT_ID,
    });

    const payload = ticket.getPayload();
    const googleId = payload['sub'];
    const email = payload['email'];
    const firstName = payload['given_name'] || '';
    const lastName = payload['family_name'] || '';
    const picture = payload['picture'];

    // Check if user already exists with this Google ID in social_logins
    let [existingSocialLogins] = await pool.execute(
      "SELECT user_id FROM social_logins WHERE provider = 'google' AND provider_id = ?",
      [googleId]
    );

    if (existingSocialLogins.length > 0) {
      // User already exists, log them in
      const userId = existingSocialLogins[0].user_id;

      // Get user details
      const [users] = await pool.execute(
        "SELECT id, email, username, first_name, last_name, phone_number FROM user WHERE id = ?",
        [userId]
      );

      if (users.length === 0) {
        return sendError(res, "User not found", 404);
      }

      const user = users[0];
      const { accessToken, refreshToken } = generateTokens(user.id);

      return sendSuccess(res, {
        user: {
          id: user.id,
          email: user.email,
          username: user.username,
          first_name: user.first_name,
          last_name: user.last_name,
          phone_number: user.phone_number,
          address: user.address,
          city: user.city,
          state: user.state,
          postal_code: user.postal_code,
        },
        tokens: {
          access: accessToken,
          refresh: refreshToken,
        },
      }, "Google login successful");
    }

    // Check if user exists with this email
    let [users] = await pool.execute(
      "SELECT id, email, username, first_name, last_name, phone_number, address, city, state, postal_code FROM user WHERE email = ?",
      [email]
    );

    let userId;

    if (users.length > 0) {
      // User already exists, link Google account to existing user
      userId = users[0].id;

      // Insert into social_logins table
      await pool.execute(
        "INSERT INTO social_logins (user_id, provider, provider_id) VALUES (?, 'google', ?)",
        [userId, googleId]
      );
    } else {
      // Create new user
      const username = email.split('@')[0];
      const [result] = await pool.execute(
        `INSERT INTO user (email, username, first_name, last_name, status, is_verified) 
         VALUES (?, ?, ?, ?, 'Active', 1)`,
        [email, username, firstName, lastName]
      );

      userId = result.insertId;

      // Insert into social_logins table
      await pool.execute(
        "INSERT INTO social_logins (user_id, provider, provider_id) VALUES (?, 'google', ?)",
        [userId, googleId]
      );

      // Create notification for admin about new user registration
      const fullName = firstName && lastName ? `${firstName} ${lastName}` : username || email;
      await createNotification(
        "user_registered",
        "New User Registered",
        `${fullName} (${email}) has registered on the platform via Google`,
        userId,
        "user"
      );
    }

    // Get user details
    const [newUsers] = await pool.execute(
      "SELECT id, email, username, first_name, last_name, phone_number, address, city, state, postal_code, date_joined FROM user WHERE id = ?",
      [userId]
    );

    const user = newUsers[0];
    const { accessToken, refreshToken } = generateTokens(userId);

    return sendSuccess(
      res,
      {
        user: user,
        tokens: {
          access: accessToken,
          refresh: refreshToken,
        },
      },
      "Google login successful",
      200
    );
  } catch (error) {
    console.error("Google login error:", error);
    return sendError(res, "Google login failed", 500);
  }
};
