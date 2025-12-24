import sharp from 'sharp';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';
import { v4 as uuidv4 } from 'uuid';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/**
 * Process and save uploaded image with compression and unique naming
 * @param {Buffer} imageBuffer - Image buffer from multer
 * @param {string} folder - Folder name (e.g., 'products', 'categories', 'blogs')
 * @param {object} options - Processing options
 * @returns {Promise<string>} - Relative path to saved image
 */
export const processImage = async (imageBuffer, folder = 'general', options = {}) => {
  try {
    // Validate input
    if (!imageBuffer || !Buffer.isBuffer(imageBuffer)) {
      throw new Error('Invalid image buffer provided');
    }

    // Validate buffer is not empty
    if (imageBuffer.length === 0) {
      throw new Error('Image buffer is empty');
    }

    // Default options
    const {
      maxWidth = 1920,
      maxHeight = 1920,
      quality = 85,
      format = 'jpeg', // 'jpeg', 'png', 'webp'
      fit = 'inside' // 'cover', 'contain', 'fill', 'inside', 'outside'
    } = options;

    // Create folder structure if it doesn't exist
    const uploadsDir = path.join(__dirname, '../uploads');
    const folderPath = path.join(uploadsDir, folder);
    
    if (!fs.existsSync(uploadsDir)) {
      fs.mkdirSync(uploadsDir, { recursive: true });
    }
    if (!fs.existsSync(folderPath)) {
      fs.mkdirSync(folderPath, { recursive: true });
    }

    // Generate unique filename with timestamp for better organization
    const uniqueId = uuidv4();
    const timestamp = Date.now();
    const extension = format === 'png' ? 'png' : format === 'webp' ? 'webp' : 'jpg';
    const filename = `${timestamp}-${uniqueId}.${extension}`;
    const filePath = path.join(folderPath, filename);

    // Validate image format with Sharp before processing
    let sharpInstance;
    try {
      sharpInstance = sharp(imageBuffer);
      // Verify it's a valid image
      const metadata = await sharpInstance.metadata();
      if (!metadata.width || !metadata.height) {
        throw new Error('Invalid image format');
      }
    } catch (sharpError) {
      throw new Error(`Invalid image file: ${sharpError.message}`);
    }

    // Process image with Sharp - resize and compress
    sharpInstance = sharp(imageBuffer)
      .resize(maxWidth, maxHeight, {
        fit: fit,
        withoutEnlargement: true
      });

    // Apply format-specific compression settings
    if (format === 'jpeg') {
      sharpInstance = sharpInstance.jpeg({
        quality: quality,
        progressive: true,
        mozjpeg: true
      });
    } else if (format === 'png') {
      sharpInstance = sharpInstance.png({
        quality: quality,
        compressionLevel: 9,
        adaptiveFiltering: true
      });
    } else if (format === 'webp') {
      sharpInstance = sharpInstance.webp({
        quality: quality,
        effort: 6
      });
    }

    // Save processed image
    await sharpInstance.toFile(filePath);

    // Verify file was created
    if (!fs.existsSync(filePath)) {
      throw new Error('Failed to save processed image');
    }

    // Get final file size
    const stats = fs.statSync(filePath);
    console.log(`Image processed: ${filename}, Size: ${(stats.size / 1024).toFixed(2)}KB`);

    // Return relative path for database storage
    return `${folder}/${filename}`;
  } catch (error) {
    console.error('Image processing error:', error);
    throw new Error(`Failed to process image: ${error.message}`);
  }
};

/**
 * Delete image file
 * @param {string} imagePath - Relative path to image (e.g., 'products/uuid.jpg')
 * @returns {Promise<void>}
 */
export const deleteImage = async (imagePath) => {
  try {
    if (!imagePath) return;
    
    const fullPath = path.join(__dirname, '../uploads', imagePath);
    
    if (fs.existsSync(fullPath)) {
      await fs.promises.unlink(fullPath);
    }
  } catch (error) {
    console.error('Image deletion error:', error);
    // Don't throw error, just log it
  }
};

/**
 * Get image metadata
 * @param {Buffer} imageBuffer - Image buffer
 * @returns {Promise<object>} - Image metadata
 */
export const getImageMetadata = async (imageBuffer) => {
  try {
    const metadata = await sharp(imageBuffer).metadata();
    return {
      width: metadata.width,
      height: metadata.height,
      format: metadata.format,
      size: metadata.size,
      hasAlpha: metadata.hasAlpha
    };
  } catch (error) {
    console.error('Get image metadata error:', error);
    return null;
  }
};

