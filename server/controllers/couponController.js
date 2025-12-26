import pool from "../config/database.js";
import {
  sendSuccess,
  sendError,
  sendNotFound,
  sendBadRequest,
} from "../utils/response.js";

// Get all active coupons (public - for users)
export const getActiveCoupons = async (req, res) => {
  try {
    const today = new Date().toISOString().split("T")[0];

    const [coupons] = await pool.execute(
      `SELECT 
        coupon_id as id,
        code,
        name,
        description,
        discount_type,
        discount_value,
        min_order_amount,
        max_discount,
        usage_limit,
        used_count,
        valid_from,
        valid_to,
        status,
        created_at
      FROM coupons
      WHERE status = 'active'
        AND valid_from <= ?
        AND (valid_to >= ? OR valid_to IS NULL)
        AND (usage_limit IS NULL OR used_count < usage_limit)
      ORDER BY created_at DESC`,
      [today, today]
    );

    // Return array directly as JSON array (not wrapped in object)
    return res.status(200).json(coupons);
  } catch (error) {
    console.error("Get active coupons error:", error);
    return sendError(res, "Failed to fetch coupons", 500);
  }
};

// Get all coupons (admin only)
export const getAllCoupons = async (req, res) => {
  try {
    const [coupons] = await pool.execute(
      `SELECT 
        coupon_id as id,
        code,
        name,
        description,
        discount_type,
        discount_value,
        min_order_amount,
        max_discount,
        usage_limit,
        used_count,
        valid_from,
        valid_to,
        status,
        created_at,
        updated_at
      FROM coupons
      ORDER BY created_at DESC`
    );

    return res.status(200).json(coupons);
  } catch (error) {
    console.error("Get all coupons error:", error);
    return sendError(res, "Failed to fetch coupons", 500);
  }
};

// Get single coupon by ID
export const getCoupon = async (req, res) => {
  try {
    const couponId = parseInt(req.params.id);

    if (isNaN(couponId)) {
      return sendBadRequest(res, "Invalid coupon ID");
    }

    const [coupons] = await pool.execute(
      `SELECT 
        coupon_id as id,
        code,
        name,
        description,
        discount_type,
        discount_value,
        min_order_amount,
        max_discount,
        usage_limit,
        used_count,
        valid_from,
        valid_to,
        status,
        created_at,
        updated_at
      FROM coupons
      WHERE coupon_id = ?`,
      [couponId]
    );

    if (coupons.length === 0) {
      return sendNotFound(res, "Coupon");
    }

    return sendSuccess(res, coupons[0]);
  } catch (error) {
    console.error("Get coupon error:", error);
    return sendError(res, "Failed to fetch coupon", 500);
  }
};

// Validate coupon code (for checkout)
export const validateCoupon = async (req, res) => {
  try {
    const { code, order_amount } = req.body;

    if (!code) {
      return sendBadRequest(res, "Coupon code is required");
    }

    const today = new Date().toISOString().split("T")[0];

    const [coupons] = await pool.execute(
      `SELECT 
        coupon_id as id,
        code,
        name,
        description,
        discount_type,
        discount_value,
        min_order_amount,
        max_discount,
        usage_limit,
        used_count,
        valid_from,
        valid_to,
        status
      FROM coupons
      WHERE code = ?`,
      [code.toUpperCase()]
    );

    if (coupons.length === 0) {
      return sendBadRequest(res, "Invalid coupon code");
    }

    const coupon = coupons[0];

    // Check if coupon is active
    if (coupon.status !== "active") {
      return sendBadRequest(res, "This coupon is not active");
    }

    // Check validity dates
    if (coupon.valid_from > today) {
      return sendBadRequest(res, "This coupon is not yet valid");
    }

    if (coupon.valid_to && coupon.valid_to < today) {
      return sendBadRequest(res, "This coupon has expired");
    }

    // Check usage limit
    if (coupon.usage_limit && coupon.used_count >= coupon.usage_limit) {
      return sendBadRequest(res, "This coupon has reached its usage limit");
    }

    // Check minimum order amount
    if (order_amount && coupon.min_order_amount > parseFloat(order_amount)) {
      return sendBadRequest(
        res,
        `Minimum order amount of ₹${coupon.min_order_amount} required for this coupon`
      );
    }

    // Calculate discount
    let discountAmount = 0;
    if (coupon.discount_type === "percentage") {
      discountAmount =
        (parseFloat(order_amount || 0) * coupon.discount_value) / 100;
      if (coupon.max_discount && discountAmount > coupon.max_discount) {
        discountAmount = coupon.max_discount;
      }
    } else {
      discountAmount = coupon.discount_value;
    }

    return sendSuccess(res, {
      coupon: {
        id: coupon.id,
        code: coupon.code,
        name: coupon.name,
        description: coupon.description,
        discount_type: coupon.discount_type,
        discount_value: coupon.discount_value,
        max_discount: coupon.max_discount,
      },
      discount_amount: discountAmount.toFixed(2),
      valid: true,
    });
  } catch (error) {
    console.error("Validate coupon error:", error);
    return sendError(res, "Failed to validate coupon", 500);
  }
};

// Create new coupon (admin only)
export const createCoupon = async (req, res) => {
  try {
    const {
      code,
      name,
      description,
      discount_type,
      discount_value,
      min_order_amount = 0,
      max_discount = null,
      usage_limit = null,
      valid_from,
      valid_to,
      status = "active",
    } = req.body;

    // Validate required fields
    if (
      !code ||
      !name ||
      !discount_type ||
      !discount_value ||
      !valid_from ||
      !valid_to
    ) {
      return sendBadRequest(res, "All required fields must be provided");
    }

    // Validate discount_type
    if (!["percentage", "fixed"].includes(discount_type)) {
      return sendBadRequest(
        res,
        "Discount type must be 'percentage' or 'fixed'"
      );
    }

    // Validate discount_value
    if (parseFloat(discount_value) <= 0) {
      return sendBadRequest(res, "Discount value must be greater than 0");
    }

    if (discount_type === "percentage" && parseFloat(discount_value) > 100) {
      return sendBadRequest(res, "Percentage discount cannot exceed 100%");
    }

    // Validate dates
    if (new Date(valid_from) > new Date(valid_to)) {
      return sendBadRequest(
        res,
        "Valid from date must be before valid to date"
      );
    }

    // Check if code already exists
    const [existing] = await pool.execute(
      `SELECT coupon_id FROM coupons WHERE code = ?`,
      [code.toUpperCase()]
    );

    if (existing.length > 0) {
      return sendBadRequest(res, "Coupon code already exists");
    }

    // Create coupon
    const [result] = await pool.execute(
      `INSERT INTO coupons (
        code,
        name,
        description,
        discount_type,
        discount_value,
        min_order_amount,
        max_discount,
        usage_limit,
        valid_from,
        valid_to,
        status
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        code.toUpperCase(),
        name,
        description || null,
        discount_type,
        discount_value,
        min_order_amount,
        max_discount || null,
        usage_limit || null,
        valid_from,
        valid_to,
        status,
      ]
    );

    const couponId = result.insertId;

    // Get created coupon
    const [coupons] = await pool.execute(
      `SELECT 
        coupon_id as id,
        code,
        name,
        description,
        discount_type,
        discount_value,
        min_order_amount,
        max_discount,
        usage_limit,
        used_count,
        valid_from,
        valid_to,
        status,
        created_at,
        updated_at
      FROM coupons
      WHERE coupon_id = ?`,
      [couponId]
    );

    return sendSuccess(res, coupons[0], "Coupon created successfully", 201);
  } catch (error) {
    console.error("Create coupon error:", error);
    if (error.code === "ER_DUP_ENTRY") {
      return sendBadRequest(res, "Coupon code already exists");
    }
    return sendError(res, "Failed to create coupon", 500);
  }
};

// Update coupon (admin only)
export const updateCoupon = async (req, res) => {
  try {
    const couponId = parseInt(req.params.id);

    if (isNaN(couponId)) {
      return sendBadRequest(res, "Invalid coupon ID");
    }

    const {
      code,
      name,
      description,
      discount_type,
      discount_value,
      min_order_amount,
      max_discount,
      usage_limit,
      valid_from,
      valid_to,
      status,
    } = req.body;

    // Check if coupon exists
    const [existing] = await pool.execute(
      `SELECT coupon_id FROM coupons WHERE coupon_id = ?`,
      [couponId]
    );

    if (existing.length === 0) {
      return sendNotFound(res, "Coupon");
    }

    // Build update query dynamically
    const updateFields = [];
    const updateValues = [];

    if (code !== undefined) {
      // Check if new code already exists (excluding current coupon)
      const [codeCheck] = await pool.execute(
        `SELECT coupon_id FROM coupons WHERE code = ? AND coupon_id != ?`,
        [code.toUpperCase(), couponId]
      );
      if (codeCheck.length > 0) {
        return sendBadRequest(res, "Coupon code already exists");
      }
      updateFields.push("code = ?");
      updateValues.push(code.toUpperCase());
    }

    if (name !== undefined) {
      updateFields.push("name = ?");
      updateValues.push(name);
    }
    if (description !== undefined) {
      updateFields.push("description = ?");
      updateValues.push(description);
    }
    if (discount_type !== undefined) {
      if (!["percentage", "fixed"].includes(discount_type)) {
        return sendBadRequest(
          res,
          "Discount type must be 'percentage' or 'fixed'"
        );
      }
      updateFields.push("discount_type = ?");
      updateValues.push(discount_type);
    }
    if (discount_value !== undefined) {
      if (parseFloat(discount_value) <= 0) {
        return sendBadRequest(res, "Discount value must be greater than 0");
      }
      updateFields.push("discount_value = ?");
      updateValues.push(discount_value);
    }
    if (min_order_amount !== undefined) {
      updateFields.push("min_order_amount = ?");
      updateValues.push(min_order_amount);
    }
    if (max_discount !== undefined) {
      updateFields.push("max_discount = ?");
      updateValues.push(max_discount);
    }
    if (usage_limit !== undefined) {
      updateFields.push("usage_limit = ?");
      updateValues.push(usage_limit);
    }
    if (valid_from !== undefined) {
      updateFields.push("valid_from = ?");
      updateValues.push(valid_from);
    }
    if (valid_to !== undefined) {
      updateFields.push("valid_to = ?");
      updateValues.push(valid_to);
    }
    if (status !== undefined) {
      if (!["active", "inactive"].includes(status)) {
        return sendBadRequest(res, "Status must be 'active' or 'inactive'");
      }
      updateFields.push("status = ?");
      updateValues.push(status);
    }

    if (updateFields.length === 0) {
      return sendBadRequest(res, "No fields to update");
    }

    updateValues.push(couponId);

    // Update coupon
    await pool.execute(
      `UPDATE coupons SET ${updateFields.join(", ")} WHERE coupon_id = ?`,
      updateValues
    );

    // Get updated coupon
    const [coupons] = await pool.execute(
      `SELECT 
        coupon_id as id,
        code,
        name,
        description,
        discount_type,
        discount_value,
        min_order_amount,
        max_discount,
        usage_limit,
        used_count,
        valid_from,
        valid_to,
        status,
        created_at,
        updated_at
      FROM coupons
      WHERE coupon_id = ?`,
      [couponId]
    );

    return sendSuccess(res, coupons[0], "Coupon updated successfully", 200);
  } catch (error) {
    console.error("Update coupon error:", error);
    if (error.code === "ER_DUP_ENTRY") {
      return sendBadRequest(res, "Coupon code already exists");
    }
    return sendError(res, "Failed to update coupon", 500);
  }
};

// Delete coupon (admin only)
export const deleteCoupon = async (req, res) => {
  try {
    const couponId = parseInt(req.params.id);

    if (isNaN(couponId)) {
      return sendBadRequest(res, "Invalid coupon ID");
    }

    // Check if coupon exists
    const [existing] = await pool.execute(
      `SELECT coupon_id FROM coupons WHERE coupon_id = ?`,
      [couponId]
    );

    if (existing.length === 0) {
      return sendNotFound(res, "Coupon");
    }

    // Delete coupon (cascade will delete coupon_usage records)
    await pool.execute(`DELETE FROM coupons WHERE coupon_id = ?`, [couponId]);

    return sendSuccess(res, {}, "Coupon deleted successfully", 200);
  } catch (error) {
    console.error("Delete coupon error:", error);
    return sendError(res, "Failed to delete coupon", 500);
  }
};
