import express from 'express';
import jwt from 'jsonwebtoken';
import pool from '../config/database.js';
import { authenticate } from '../middleware/auth.js';
import {
  getCart,
  addToCart,
  updateCartItem,
  removeCartItem,
  clearCart,
  mergeCart,
} from '../controllers/cartController.js';

const router = express.Router();

// Optional auth middleware - doesn't fail if no token
const optionalAuth = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    
    if (authHeader && authHeader.startsWith('Bearer ')) {
      const token = authHeader.substring(7);
      
      try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key-change-this-in-production');
        
        // First check admins table
        const [admins] = await pool.execute(
          'SELECT id, email, name, is_verified FROM admins WHERE id = ? AND is_verified = 1',
          [decoded.userId]
        );

        if (admins.length > 0) {
          req.user = {
            ...admins[0],
            is_staff: true,
            is_superuser: true,
          };
          return next();
        }

        // If not admin, check user table
        const [users] = await pool.execute(
          'SELECT id, email, username, first_name, last_name, phone, phone_number, is_verified, status FROM user WHERE id = ? AND status = "Active"',
          [decoded.userId]
        );

        if (users.length > 0) {
          req.user = {
            ...users[0],
            is_staff: false,
            is_superuser: false,
          };
          return next();
        }
      } catch (error) {
        // Token invalid or expired, continue without user
        // Don't fail, just proceed without authentication
      }
    }
    
    // No auth header or auth failed, continue without user
    req.user = null;
    next();
  } catch (error) {
    // If any error, continue without user
    req.user = null;
    next();
  }
};

// Get cart (optional auth - works for both authenticated and guest users)
router.get('/', optionalAuth, getCart);

// Add item to cart
router.post('/items/', optionalAuth, addToCart);

// Update cart item
router.put('/items/:id/', optionalAuth, updateCartItem);

// Remove cart item
router.delete('/items/:id/', optionalAuth, removeCartItem);

// Clear cart
router.delete('/', optionalAuth, clearCart);

// Merge cart (requires authentication)
router.post('/merge/', authenticate, mergeCart);

export default router;
