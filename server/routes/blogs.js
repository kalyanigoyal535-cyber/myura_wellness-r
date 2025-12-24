import express from 'express';
import { getBlogs, getBlog } from '../controllers/blogController.js';

const router = express.Router();

// Get all blogs (public)
router.get('/', getBlogs);

// Get single blog
router.get('/:slug', getBlog);

export default router;
