import pool from "../config/database.js";
import {
  sendSuccess,
  sendError,
  sendNotFound,
  sendBadRequest,
} from "../utils/response.js";

// Get all addresses for authenticated user
export const getAddresses = async (req, res) => {
  try {
    if (!req.user || !req.user.id) {
      return sendError(res, "Authentication required", 401);
    }

    const userId = req.user.id;

    // Check if addresses table exists, if not return empty array
    // For now, we'll create addresses table structure
    const [addresses] = await pool.execute(
      `SELECT 
        address_id as id,
        user_id,
        address_type,
        full_name,
        phone_number,
        address_line_1,
        address_line_2,
        city,
        state,
        postal_code,
        country,
        is_default,
        created_at
      FROM addresses
      WHERE user_id = ?
      ORDER BY is_default DESC, created_at DESC`,
      [userId]
    );

    return sendSuccess(res, addresses);
  } catch (error) {
    // If table doesn't exist, return empty array
    if (error.code === "ER_NO_SUCH_TABLE") {
      return sendSuccess(res, []);
    }
    console.error("Get addresses error:", error);
    return sendError(res, "Failed to fetch addresses", 500);
  }
};

// Get single address by ID
export const getAddress = async (req, res) => {
  try {
    if (!req.user || !req.user.id) {
      return sendError(res, "Authentication required", 401);
    }

    const userId = req.user.id;
    const addressId = parseInt(req.params.id);

    if (isNaN(addressId)) {
      return sendBadRequest(res, "Invalid address ID");
    }

    const [addresses] = await pool.execute(
      `SELECT 
        address_id as id,
        user_id,
        address_type,
        full_name,
        phone_number,
        address_line_1,
        address_line_2,
        city,
        state,
        postal_code,
        country,
        is_default,
        created_at
      FROM addresses
      WHERE address_id = ? AND user_id = ?`,
      [addressId, userId]
    );

    if (addresses.length === 0) {
      return sendNotFound(res, "Address");
    }

    return sendSuccess(res, addresses[0]);
  } catch (error) {
    if (error.code === "ER_NO_SUCH_TABLE") {
      return sendNotFound(res, "Address");
    }
    console.error("Get address error:", error);
    return sendError(res, "Failed to fetch address", 500);
  }
};

// Create new address
export const createAddress = async (req, res) => {
  try {
    if (!req.user || !req.user.id) {
      return sendError(res, "Authentication required", 401);
    }

    const userId = req.user.id;
    const {
      address_type = "home",
      full_name,
      phone_number,
      address_line_1,
      address_line_2 = "",
      city,
      state,
      postal_code,
      country = "India",
      is_default = false,
    } = req.body;

    // Validate required fields
    if (
      !full_name ||
      !phone_number ||
      !address_line_1 ||
      !city ||
      !state ||
      !postal_code
    ) {
      return sendBadRequest(res, "All required fields must be provided");
    }

    // If setting as default, unset other default addresses
    if (is_default) {
      await pool.execute(
        `UPDATE addresses SET is_default = 0 WHERE user_id = ?`,
        [userId]
      );
    }

    // Create address
    const [result] = await pool.execute(
      `INSERT INTO addresses (
        user_id,
        address_type,
        full_name,
        phone_number,
        address_line_1,
        address_line_2,
        city,
        state,
        postal_code,
        country,
        is_default
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        userId,
        address_type,
        full_name,
        phone_number,
        address_line_1,
        address_line_2 || null,
        city,
        state,
        postal_code,
        country,
        is_default ? 1 : 0,
      ]
    );

    const addressId = result.insertId;

    // Get created address
    const [addresses] = await pool.execute(
      `SELECT 
        address_id as id,
        user_id,
        address_type,
        full_name,
        phone_number,
        address_line_1,
        address_line_2,
        city,
        state,
        postal_code,
        country,
        is_default,
        created_at
      FROM addresses
      WHERE address_id = ?`,
      [addressId]
    );

    return sendSuccess(res, addresses[0], "Address created successfully", 201);
  } catch (error) {
    if (error.code === "ER_NO_SUCH_TABLE") {
      // Create addresses table if it doesn't exist
      try {
        await pool.execute(`
          CREATE TABLE IF NOT EXISTS addresses (
            address_id INT AUTO_INCREMENT PRIMARY KEY,
            user_id INT NOT NULL,
            address_type ENUM('home', 'work', 'other') DEFAULT 'home',
            full_name VARCHAR(100) NOT NULL,
            phone_number VARCHAR(20) NOT NULL,
            address_line_1 VARCHAR(255) NOT NULL,
            address_line_2 VARCHAR(255) DEFAULT NULL,
            city VARCHAR(100) NOT NULL,
            state VARCHAR(100) NOT NULL,
            postal_code VARCHAR(20) NOT NULL,
            country VARCHAR(100) DEFAULT 'India',
            is_default BOOLEAN DEFAULT 0,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (user_id) REFERENCES user(id) ON DELETE CASCADE
          ) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_unicode_ci
        `);
        // Retry creating address
        return createAddress(req, res);
      } catch (createError) {
        console.error("Create addresses table error:", createError);
        return sendError(res, "Failed to create address", 500);
      }
    }
    console.error("Create address error:", error);
    return sendError(res, "Failed to create address", 500);
  }
};

// Update address
export const updateAddress = async (req, res) => {
  try {
    if (!req.user || !req.user.id) {
      return sendError(res, "Authentication required", 401);
    }

    const userId = req.user.id;
    const addressId = parseInt(req.params.id);

    if (isNaN(addressId)) {
      return sendBadRequest(res, "Invalid address ID");
    }

    const {
      address_type,
      full_name,
      phone_number,
      address_line_1,
      address_line_2,
      city,
      state,
      postal_code,
      country,
      is_default,
    } = req.body;

    // Check if address exists and belongs to user
    const [addresses] = await pool.execute(
      `SELECT address_id FROM addresses WHERE address_id = ? AND user_id = ?`,
      [addressId, userId]
    );

    if (addresses.length === 0) {
      return sendNotFound(res, "Address");
    }

    // Build update query dynamically
    const updateFields = [];
    const updateValues = [];

    if (address_type !== undefined) updateFields.push("address_type = ?");
    if (full_name !== undefined) {
      updateFields.push("full_name = ?");
      updateValues.push(full_name);
    }
    if (phone_number !== undefined) {
      updateFields.push("phone_number = ?");
      updateValues.push(phone_number);
    }
    if (address_line_1 !== undefined) {
      updateFields.push("address_line_1 = ?");
      updateValues.push(address_line_1);
    }
    if (address_line_2 !== undefined) {
      updateFields.push("address_line_2 = ?");
      updateValues.push(address_line_2);
    }
    if (city !== undefined) {
      updateFields.push("city = ?");
      updateValues.push(city);
    }
    if (state !== undefined) {
      updateFields.push("state = ?");
      updateValues.push(state);
    }
    if (postal_code !== undefined) {
      updateFields.push("postal_code = ?");
      updateValues.push(postal_code);
    }
    if (country !== undefined) {
      updateFields.push("country = ?");
      updateValues.push(country);
    }
    if (address_type !== undefined) updateValues.push(address_type);

    // Handle is_default
    if (is_default !== undefined) {
      if (is_default) {
        // Unset other default addresses
        await pool.execute(
          `UPDATE addresses SET is_default = 0 WHERE user_id = ?`,
          [userId]
        );
      }
      updateFields.push("is_default = ?");
      updateValues.push(is_default ? 1 : 0);
    }

    if (updateFields.length === 0) {
      return sendBadRequest(res, "No fields to update");
    }

    updateValues.push(addressId, userId);

    // Update address
    await pool.execute(
      `UPDATE addresses SET ${updateFields.join(
        ", "
      )} WHERE address_id = ? AND user_id = ?`,
      updateValues
    );

    // Get updated address
    const [updatedAddresses] = await pool.execute(
      `SELECT 
        address_id as id,
        user_id,
        address_type,
        full_name,
        phone_number,
        address_line_1,
        address_line_2,
        city,
        state,
        postal_code,
        country,
        is_default,
        created_at
      FROM addresses
      WHERE address_id = ?`,
      [addressId]
    );

    return sendSuccess(
      res,
      updatedAddresses[0],
      "Address updated successfully",
      200
    );
  } catch (error) {
    if (error.code === "ER_NO_SUCH_TABLE") {
      return sendNotFound(res, "Address");
    }
    console.error("Update address error:", error);
    return sendError(res, "Failed to update address", 500);
  }
};

// Delete address
export const deleteAddress = async (req, res) => {
  try {
    if (!req.user || !req.user.id) {
      return sendError(res, "Authentication required", 401);
    }

    const userId = req.user.id;
    const addressId = parseInt(req.params.id);

    if (isNaN(addressId)) {
      return sendBadRequest(res, "Invalid address ID");
    }

    // Check if address exists and belongs to user
    const [addresses] = await pool.execute(
      `SELECT address_id FROM addresses WHERE address_id = ? AND user_id = ?`,
      [addressId, userId]
    );

    if (addresses.length === 0) {
      return sendNotFound(res, "Address");
    }

    // Delete address
    await pool.execute(
      `DELETE FROM addresses WHERE address_id = ? AND user_id = ?`,
      [addressId, userId]
    );

    return sendSuccess(res, {}, "Address deleted successfully", 200);
  } catch (error) {
    if (error.code === "ER_NO_SUCH_TABLE") {
      return sendNotFound(res, "Address");
    }
    console.error("Delete address error:", error);
    return sendError(res, "Failed to delete address", 500);
  }
};

// Set address as default
export const setDefaultAddress = async (req, res) => {
  try {
    if (!req.user || !req.user.id) {
      return sendError(res, "Authentication required", 401);
    }

    const userId = req.user.id;
    const addressId = parseInt(req.params.id);

    if (isNaN(addressId)) {
      return sendBadRequest(res, "Invalid address ID");
    }

    // Check if address exists and belongs to user
    const [addresses] = await pool.execute(
      `SELECT address_id FROM addresses WHERE address_id = ? AND user_id = ?`,
      [addressId, userId]
    );

    if (addresses.length === 0) {
      return sendNotFound(res, "Address");
    }

    // Unset all default addresses for user
    await pool.execute(
      `UPDATE addresses SET is_default = 0 WHERE user_id = ?`,
      [userId]
    );

    // Set this address as default
    await pool.execute(
      `UPDATE addresses SET is_default = 1 WHERE address_id = ? AND user_id = ?`,
      [addressId, userId]
    );

    // Get updated address
    const [updatedAddresses] = await pool.execute(
      `SELECT 
        address_id as id,
        user_id,
        address_type,
        full_name,
        phone_number,
        address_line_1,
        address_line_2,
        city,
        state,
        postal_code,
        country,
        is_default,
        created_at
      FROM addresses
      WHERE address_id = ?`,
      [addressId]
    );

    return sendSuccess(
      res,
      { address: updatedAddresses[0] },
      "Default address updated successfully",
      200
    );
  } catch (error) {
    if (error.code === "ER_NO_SUCH_TABLE") {
      return sendNotFound(res, "Address");
    }
    console.error("Set default address error:", error);
    return sendError(res, "Failed to set default address", 500);
  }
};
