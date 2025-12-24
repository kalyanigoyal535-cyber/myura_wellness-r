import jwt from 'jsonwebtoken';
import pool from '../config/database.js';

export const authenticate = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'No token provided' });
    }

    const token = authHeader.substring(7); // Remove 'Bearer ' prefix
    
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

    if (users.length === 0) {
      return res.status(401).json({ error: 'User not found' });
    }

    req.user = {
      ...users[0],
      is_staff: false,
      is_superuser: false,
    };
    next();
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ error: 'Token expired' });
    }
    return res.status(401).json({ error: 'Invalid token' });
  }
};

export const requireAdmin = async (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({ error: 'Authentication required' });
  }

  // Check if user is admin (you may need to check admins table or add admin flag to user table)
  // For now, checking if user exists in admins table
  const [admins] = await pool.execute(
    'SELECT id FROM admins WHERE email = ?',
    [req.user.email]
  );
  
  if (admins.length === 0) {
    return res.status(403).json({ error: 'Admin access required' });
  }

  next();
};

