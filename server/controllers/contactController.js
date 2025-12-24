import pool from '../config/database.js';
import { sendSuccess, sendError, sendBadRequest } from '../utils/response.js';

// Submit contact form
export const submitContact = async (req, res) => {
  try {
    const { name, email, phone_number, subject, message } = req.body;

    if (!name || !email || !subject || !message) {
      return sendBadRequest(res, 'Missing required fields');
    }

    await pool.execute(
      'INSERT INTO contact_submissions (name, email, phone_number, subject, message, is_read) VALUES (?, ?, ?, ?, ?, 0)',
      [name, email, phone_number || null, subject, message]
    );

    return sendSuccess(res, {}, 'Contact submission received', 201);
  } catch (error) {
    console.error('Contact submission error:', error);
    return sendError(res, 'Failed to submit contact form', 500);
  }
};

