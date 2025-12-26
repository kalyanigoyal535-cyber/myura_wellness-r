import express from "express";
import { body } from "express-validator";
import { authenticate } from "../middleware/auth.js";
import {
  getAddresses,
  getAddress,
  createAddress,
  updateAddress,
  deleteAddress,
  setDefaultAddress,
} from "../controllers/addressController.js";

const router = express.Router();

// Get all addresses for authenticated user
router.get("/", authenticate, getAddresses);

// Get single address by ID
router.get("/:id/", authenticate, getAddress);

// Create new address
router.post(
  "/",
  authenticate,
  [
    body("full_name").notEmpty().trim(),
    body("phone_number").notEmpty().trim(),
    body("address_line_1").notEmpty().trim(),
    body("city").notEmpty().trim(),
    body("state").notEmpty().trim(),
    body("postal_code").notEmpty().trim(),
    body("address_type").optional().isIn(["home", "work", "other"]),
    body("country").optional().trim(),
    body("is_default").optional().isBoolean(),
  ],
  createAddress
);

// Update address
router.put(
  "/:id/",
  authenticate,
  [
    body("full_name").optional().trim(),
    body("phone_number").optional().trim(),
    body("address_line_1").optional().trim(),
    body("city").optional().trim(),
    body("state").optional().trim(),
    body("postal_code").optional().trim(),
    body("address_type").optional().isIn(["home", "work", "other"]),
    body("country").optional().trim(),
    body("is_default").optional().isBoolean(),
  ],
  updateAddress
);

// Delete address
router.delete("/:id/", authenticate, deleteAddress);

// Set address as default
router.post("/:id/set-default/", authenticate, setDefaultAddress);

export default router;
