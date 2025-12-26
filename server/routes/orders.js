import express from "express";
import { authenticate } from "../middleware/auth.js";
import {
  getOrders,
  getOrder,
  createOrder,
  cancelOrder,
} from "../controllers/orderController.js";

const router = express.Router();

// Get all orders for authenticated user
router.get("/", authenticate, getOrders);

// Get single order by ID
router.get("/:id/", authenticate, getOrder);

// Create new order
router.post("/create/", authenticate, createOrder);

// Cancel order
router.post("/:id/cancel/", authenticate, cancelOrder);

export default router;
