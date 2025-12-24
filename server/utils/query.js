import pool from '../config/database.js';
import { processImage } from './imageProcessor.js';

// Execute query helper
export const executeQuery = async (query, params = []) => {
  try {
    const [results] = await pool.execute(query, params);
    return results;
  } catch (error) {
    console.error('Query error:', error);
    throw error;
  }
};

// Build dynamic update query with image processing
export const buildUpdateQuery = async (allowedFields, body, file = null, folder = 'general') => {
  const updateFields = [];
  const values = [];

  for (const field of allowedFields) {
    if (body[field] !== undefined) {
      if (field === 'category') {
        updateFields.push('category_id = ?');
        values.push(body[field]);
      } else if (field === 'notes' || field === 'benefits') {
        updateFields.push(`${field} = ?`);
        const data = body[field];
        values.push(JSON.stringify(Array.isArray(data) ? data : data.split('\n').filter(n => n.trim())));
      } else {
        updateFields.push(`${field} = ?`);
        values.push(body[field]);
      }
    }
  }

  // Process image if file is provided
  if (file && file.buffer) {
    try {
      const imageName = await processImage(file.buffer, folder, {
        maxWidth: 1920,
        maxHeight: 1920,
        quality: 85,
        format: 'jpeg'
      });
      
      // Determine field name based on folder
      const imageField = folder === 'blogs' ? 'featured_image' : folder === 'categories' ? 'image_url' : 'image';
      updateFields.push(`${imageField} = ?`);
      values.push(imageName);
    } catch (error) {
      console.error('Image processing error in buildUpdateQuery:', error);
      throw error;
    }
  }

  return { updateFields, values };
};
