import express from 'express';
import { getProducts, getProduct } from '../controllers/productController.js';

const router = express.Router();

// Get all products with filters
router.get('/', getProducts);

// Get single product
router.get('/:id', getProduct);

export default router;
