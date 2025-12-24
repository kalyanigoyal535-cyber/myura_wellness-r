import express from 'express';
import { getCategories, getCategory } from '../controllers/categoryController.js';

const router = express.Router();

// Get all categories
router.get('/', getCategories);

// Get single category
router.get('/:id', getCategory);

export default router;
