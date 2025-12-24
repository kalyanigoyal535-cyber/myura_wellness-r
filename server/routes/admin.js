import express from 'express';
import { authenticate, requireAdmin } from '../middleware/auth.js';
import { upload } from '../utils/upload.js';
import {
  getDashboardStats,
  getProducts,
  getProduct,
  createProduct,
  updateProduct,
  deleteProduct,
  getCategories,
  getCategory,
  createCategory,
  updateCategory,
  deleteCategory,
  getOrders,
  getOrder,
  updateOrderStatus,
  getUsers,
  getContacts,
  markContactRead,
  getBlogs,
  getBlog,
  createBlog,
  updateBlog,
  deleteBlog,
  updateProfile,
  resetPassword,
} from '../controllers/adminController.js';

const router = express.Router();

// Dashboard Stats
router.get('/dashboard/stats', authenticate, requireAdmin, getDashboardStats);

// Admin Products Routes
router.get('/products', authenticate, requireAdmin, getProducts);
router.get('/products/:id', authenticate, requireAdmin, getProduct);
router.post('/products', authenticate, requireAdmin, upload.single('image'), createProduct);
router.patch('/products/:id', authenticate, requireAdmin, upload.single('image'), updateProduct);
router.delete('/products/:id', authenticate, requireAdmin, deleteProduct);

// Admin Categories Routes
router.get('/categories', authenticate, requireAdmin, getCategories);
router.get('/categories/:id', authenticate, requireAdmin, getCategory);
router.post('/categories', authenticate, requireAdmin, upload.single('image'), createCategory);
router.patch('/categories/:id', authenticate, requireAdmin, upload.single('image'), updateCategory);
router.delete('/categories/:id', authenticate, requireAdmin, deleteCategory);

// Admin Orders Routes
router.get('/orders', authenticate, requireAdmin, getOrders);
router.get('/orders/:id', authenticate, requireAdmin, getOrder);
router.patch('/orders/:id/update_status', authenticate, requireAdmin, updateOrderStatus);

// Admin Users Routes
router.get('/users', authenticate, requireAdmin, getUsers);

// Admin Contacts Routes
router.get('/contacts', authenticate, requireAdmin, getContacts);
router.patch('/contacts/:id/mark_read', authenticate, requireAdmin, markContactRead);

// Admin Blogs Routes
router.get('/blogs', authenticate, requireAdmin, getBlogs);
router.get('/blogs/:id', authenticate, requireAdmin, getBlog);
router.post('/blogs', authenticate, requireAdmin, upload.single('featured_image'), createBlog);
router.patch('/blogs/:id', authenticate, requireAdmin, upload.single('featured_image'), updateBlog);
router.delete('/blogs/:id', authenticate, requireAdmin, deleteBlog);

// Admin Profile Routes
router.patch('/profile', authenticate, requireAdmin, upload.single('photo'), updateProfile);
router.post('/reset-password', authenticate, requireAdmin, resetPassword);

export default router;
