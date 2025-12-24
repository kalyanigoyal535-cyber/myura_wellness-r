import multer from 'multer';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Use memory storage to process images with Sharp before saving
const storage = multer.memoryStorage();

export const upload = multer({ 
  storage,
  limits: { 
    fileSize: 5 * 1024 * 1024 // 5MB max size
  },
  fileFilter: (req, file, cb) => {
    // Check if file is an image
    if (file.mimetype.startsWith('image/')) {
      // Additional validation for image types
      const allowedMimes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif'];
      if (allowedMimes.includes(file.mimetype)) {
        cb(null, true);
      } else {
        cb(new Error('Only JPEG, PNG, WebP, and GIF images are allowed'));
      }
    } else {
      cb(new Error('Only image files are allowed'));
    }
  }
});
