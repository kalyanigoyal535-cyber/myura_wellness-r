import express from "express";
import { body } from "express-validator";
import { authenticate } from "../middleware/auth.js";
import { requireAdmin } from "../middleware/auth.js";
import {
  getActiveCoupons,
  getAllCoupons,
  getCoupon,
  validateCoupon,
  createCoupon,
  updateCoupon,
  deleteCoupon,
} from "../controllers/couponController.js";

const router = express.Router();

// Public routes - Get active coupons (for users)
router.get("/active/", getActiveCoupons);

// Public route - Validate coupon code
router.post(
  "/validate/",
  [
    body("code").notEmpty().trim(),
    body("order_amount").optional().isFloat({ min: 0 }),
  ],
  validateCoupon
);

// Admin routes - require authentication and admin access
router.get("/", authenticate, requireAdmin, getAllCoupons);
router.get("/:id/", authenticate, requireAdmin, getCoupon);
router.post(
  "/",
  authenticate,
  requireAdmin,
  [
    body("code").notEmpty().trim(),
    body("name").notEmpty().trim(),
    body("discount_type").isIn(["percentage", "fixed"]),
    body("discount_value").isFloat({ min: 0.01 }),
    body("min_order_amount").optional().isFloat({ min: 0 }),
    body("max_discount").optional().isFloat({ min: 0 }),
    body("usage_limit").optional().isInt({ min: 1 }),
    body("valid_from").isISO8601(),
    body("valid_to").isISO8601(),
    body("status").optional().isIn(["active", "inactive"]),
  ],
  createCoupon
);
router.put(
  "/:id/",
  authenticate,
  requireAdmin,
  [
    body("code").optional().trim(),
    body("name").optional().trim(),
    body("discount_type").optional().isIn(["percentage", "fixed"]),
    body("discount_value").optional().isFloat({ min: 0.01 }),
    body("min_order_amount").optional().isFloat({ min: 0 }),
    body("max_discount").optional().isFloat({ min: 0 }),
    body("usage_limit").optional().isInt({ min: 1 }),
    body("valid_from").optional().isISO8601(),
    body("valid_to").optional().isISO8601(),
    body("status").optional().isIn(["active", "inactive"]),
  ],
  updateCoupon
);
router.delete("/:id/", authenticate, requireAdmin, deleteCoupon);

export default router;
