import express from 'express';
import { body } from 'express-validator';
import { authenticate } from '../middleware/auth.js';
import {
  register,
  login,
  getCurrentUser,
  refreshToken,
  logout,
} from '../controllers/authController.js';

const router = express.Router();

// Register
router.post('/register', [
  body('email').isEmail().normalizeEmail(),
  body('password').isLength({ min: 6 }),
  body('name').notEmpty().trim(),
], register);

// Login
router.post('/login', [
  body('email').isEmail().normalizeEmail(),
  body('password').notEmpty(),
], login);

// Get current user
router.get('/user', authenticate, getCurrentUser);

// Refresh token
router.post('/token/refresh', refreshToken);

// Logout
router.post('/logout', authenticate, logout);

export default router;
