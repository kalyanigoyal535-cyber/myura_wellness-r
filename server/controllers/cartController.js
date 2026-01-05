import pool from "../config/database.js";
import { sendSuccess, sendError, sendNotFound } from "../utils/response.js";
import { getImageUrl } from "../utils/imageUrl.js";
import crypto from "crypto";
import { createNotification } from "./notificationController.js";

// Helper function to format cart response
async function formatCartResponse(req, cart) {
  // Get cart items with product details
  const [items] = await pool.execute(
    `SELECT 
      ci.cart_item_id as id,
      ci.product_id,
      ci.quantity,
      ci.created_at,
      p.product_id,
      p.name,
      p.price,
      p.image,
      p.in_stock
    FROM cart_items ci
    INNER JOIN products p ON ci.product_id = p.product_id
    WHERE ci.cart_id = ?
    ORDER BY ci.created_at DESC`,
    [cart.cart_id]
  );

  // Format items
  let totalAmount = 0;
  let totalItems = 0;

  const formattedItems = items.map((item) => {
    const price = parseFloat(item.price);
    const quantity = item.quantity;
    const subtotal = price * quantity;
    totalAmount += subtotal;
    totalItems += quantity;

    return {
      id: item.id,
      product_id: item.product_id,
      product: {
        id: item.product_id,
        name: item.name,
        price: item.price.toString(),
        image: item.image,
        image_url: getImageUrl(req, item.image),
        in_stock: item.in_stock,
      },
      quantity: quantity,
      subtotal: subtotal.toFixed(2),
      created_at: item.created_at,
    };
  });

  return {
    id: cart.cart_id,
    items: formattedItems,
    total_items: totalItems,
    total_amount: totalAmount.toFixed(2),
    created_at: cart.created_at,
  };
}

// Helper function to get or create cart
async function getOrCreateCart(
  userId = null,
  cartId = null,
  sessionKey = null
) {
  let cart;

  // Priority 1: If cartId is provided, try to get that cart (most reliable)
  if (cartId) {
    const [carts] = await pool.execute("SELECT * FROM cart WHERE cart_id = ?", [
      cartId,
    ]);
    if (carts.length > 0) {
      cart = carts[0];
      // If this cart doesn't have user_id but user is now authenticated, update it
      if (cart && userId && !cart.user_id) {
        await pool.execute(
          "UPDATE cart SET user_id = ?, session_key = NULL WHERE cart_id = ?",
          [userId, cart.cart_id]
        );
        const [updatedCarts] = await pool.execute(
          "SELECT * FROM cart WHERE cart_id = ?",
          [cart.cart_id]
        );
        if (updatedCarts.length > 0) {
          cart = updatedCarts[0];
        }
      }
      return cart;
    }
  }

  // Priority 2: If user is authenticated, try to get user's cart
  if (!cart && userId) {
    const [carts] = await pool.execute(
      "SELECT * FROM cart WHERE user_id = ? ORDER BY created_at DESC LIMIT 1",
      [userId]
    );
    if (carts.length > 0) {
      cart = carts[0];
      return cart;
    }
  }

  // Priority 3: If sessionKey is provided, try to get session cart
  if (!cart && sessionKey) {
    const [carts] = await pool.execute(
      "SELECT * FROM cart WHERE session_key = ? AND (user_id IS NULL OR user_id = ?) ORDER BY created_at DESC LIMIT 1",
      [sessionKey, userId || null]
    );
    if (carts.length > 0) {
      cart = carts[0];
      // If user is now authenticated, update the cart
      if (cart && userId && !cart.user_id) {
        await pool.execute(
          "UPDATE cart SET user_id = ?, session_key = NULL WHERE cart_id = ?",
          [userId, cart.cart_id]
        );
        const [updatedCarts] = await pool.execute(
          "SELECT * FROM cart WHERE cart_id = ?",
          [cart.cart_id]
        );
        if (updatedCarts.length > 0) {
          cart = updatedCarts[0];
        }
      }
      return cart;
    }
  }

  // Priority 4: For guest users, check for most recent session cart (within last 1 hour)
  // This prevents creating duplicate carts when cartId is not yet stored
  if (!cart && !userId) {
    const [recentCarts] = await pool.execute(
      `SELECT * FROM cart 
       WHERE user_id IS NULL 
       AND session_key IS NOT NULL 
       AND created_at > DATE_SUB(NOW(), INTERVAL 1 HOUR)
       ORDER BY created_at DESC 
       LIMIT 1`
    );
    if (recentCarts.length > 0) {
      cart = recentCarts[0];
      return cart;
    }
  }

  // Create new cart if none exists
  if (!cart) {
    // Only generate session_key if user is not logged in
    const finalSessionKey = userId ? null : (sessionKey || crypto.randomBytes(20).toString("hex"));
    
    const [result] = await pool.execute(
      "INSERT INTO cart (user_id, session_key) VALUES (?, ?)",
      [userId, finalSessionKey]
    );
    const [newCarts] = await pool.execute(
      "SELECT * FROM cart WHERE cart_id = ?",
      [result.insertId]
    );
    cart = newCarts[0];

    // Create notification for admin if it's a user cart (not session cart)
    if (userId) {
      const [users] = await pool.execute(
        "SELECT email FROM user WHERE id = ?",
        [userId]
      );
      const userEmail = users.length > 0 ? users[0].email : "Unknown";
      
      await createNotification(
        "system",
        "New Cart Created",
        `A new cart was created by user ${userEmail}`,
        cart.cart_id,
        "cart"
      );
    }
  }

  return cart;
}

// Get cart with items
export const getCart = async (req, res) => {
  try {
    const userId = req.user?.id || null;
    const cartId = req.headers["x-cart-id"]
      ? parseInt(req.headers["x-cart-id"])
      : null;
    const sessionKey = req.body?.session_key || null;

    const cart = await getOrCreateCart(userId, cartId, sessionKey);
    const cartData = await formatCartResponse(req, cart);
    return sendSuccess(res, cartData);
  } catch (error) {
    console.error("Get cart error:", error);

    // Handle database connection errors
    if (error.code === "ECONNREFUSED") {
      return sendError(
        res,
        "Database connection failed. Please ensure MySQL server is running.",
        503
      );
    }

    if (error.code === "ER_ACCESS_DENIED_ERROR") {
      return sendError(
        res,
        "Database access denied. Please check your database credentials.",
        503
      );
    }

    if (error.code === "ER_BAD_DB_ERROR") {
      return sendError(
        res,
        "Database not found. Please check your database configuration.",
        503
      );
    }

    return sendError(res, "Failed to fetch cart", 500);
  }
};

// Add item to cart
export const addToCart = async (req, res) => {
  try {
    const { product_id, quantity = 1 } = req.body;
    const userId = req.user?.id || null;
    const cartId = req.headers["x-cart-id"]
      ? parseInt(req.headers["x-cart-id"])
      : null;

    if (!product_id) {
      return sendError(res, "Product ID is required", 400);
    }

    if (quantity < 1 || quantity > 99) {
      return sendError(res, "Quantity must be between 1 and 99", 400);
    }

    // Check if product exists
    const [products] = await pool.execute(
      "SELECT product_id, name, price, in_stock FROM products WHERE product_id = ?",
      [product_id]
    );

    if (products.length === 0) {
      return sendNotFound(res, "Product");
    }

    const product = products[0];
    if (!product.in_stock) {
      return sendError(res, "Product is out of stock", 400);
    }

    const cart = await getOrCreateCart(userId, cartId, null);

    // Check if item already exists in cart
    const [existingItems] = await pool.execute(
      "SELECT cart_item_id, quantity FROM cart_items WHERE cart_id = ? AND product_id = ?",
      [cart.cart_id, product_id]
    );

    if (existingItems.length > 0) {
      // Update quantity
      const newQuantity = Math.min(existingItems[0].quantity + quantity, 99);
      await pool.execute(
        "UPDATE cart_items SET quantity = ? WHERE cart_item_id = ?",
        [newQuantity, existingItems[0].cart_item_id]
      );
    } else {
      // Add new item
      await pool.execute(
        "INSERT INTO cart_items (cart_id, product_id, quantity) VALUES (?, ?, ?)",
        [cart.cart_id, product_id, quantity]
      );
    }

    // Return updated cart
    const updatedCart = await getOrCreateCart(userId, cart.cart_id, null);
    const cartData = await formatCartResponse(req, updatedCart);
    return sendSuccess(res, cartData);
  } catch (error) {
    console.error("Add to cart error:", error);
    return sendError(res, "Failed to add item to cart", 500);
  }
};

// Update cart item quantity
export const updateCartItem = async (req, res) => {
  try {
    const { id } = req.params;
    const { quantity } = req.body;
    const userId = req.user?.id || null;
    const cartId = req.headers["x-cart-id"]
      ? parseInt(req.headers["x-cart-id"])
      : null;

    if (!quantity || quantity < 1 || quantity > 99) {
      return sendError(res, "Quantity must be between 1 and 99", 400);
    }

    const cart = await getOrCreateCart(userId, cartId, null);

    // Check if item belongs to this cart
    const [cartItems] = await pool.execute(
      "SELECT cart_item_id FROM cart_items WHERE cart_item_id = ? AND cart_id = ?",
      [id, cart.cart_id]
    );

    if (cartItems.length === 0) {
      return sendNotFound(res, "Cart item");
    }

    // Update quantity
    await pool.execute(
      "UPDATE cart_items SET quantity = ? WHERE cart_item_id = ?",
      [quantity, id]
    );

    // Return updated cart
    const updatedCart = await getOrCreateCart(userId, cart.cart_id, null);
    const cartData = await formatCartResponse(req, updatedCart);
    return sendSuccess(res, cartData);
  } catch (error) {
    console.error("Update cart item error:", error);
    return sendError(res, "Failed to update cart item", 500);
  }
};

// Remove item from cart
export const removeCartItem = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user?.id || null;
    const cartId = req.headers["x-cart-id"]
      ? parseInt(req.headers["x-cart-id"])
      : null;

    const cart = await getOrCreateCart(userId, cartId, null);

    // Check if item belongs to this cart
    const [cartItems] = await pool.execute(
      "SELECT cart_item_id FROM cart_items WHERE cart_item_id = ? AND cart_id = ?",
      [id, cart.cart_id]
    );

    if (cartItems.length === 0) {
      return sendNotFound(res, "Cart item");
    }

    // Delete item
    await pool.execute("DELETE FROM cart_items WHERE cart_item_id = ?", [id]);

    // Check if cart is now empty
    const [remainingItems] = await pool.execute(
      "SELECT COUNT(*) as count FROM cart_items WHERE cart_id = ?",
      [cart.cart_id]
    );

    // If cart is empty, delete the cart
    if (remainingItems[0].count === 0) {
      await pool.execute("DELETE FROM cart WHERE cart_id = ?", [cart.cart_id]);
      // Return empty cart response
      return sendSuccess(res, {
        id: null,
        items: [],
        total_items: 0,
        total_amount: "0.00",
        created_at: null,
      });
    }

    // Return updated cart
    const updatedCart = await getOrCreateCart(userId, cart.cart_id, null);
    const cartData = await formatCartResponse(req, updatedCart);
    return sendSuccess(res, cartData);
  } catch (error) {
    console.error("Remove cart item error:", error);
    return sendError(res, "Failed to remove cart item", 500);
  }
};

// Clear cart
export const clearCart = async (req, res) => {
  try {
    const userId = req.user?.id || null;
    const cartId = req.headers["x-cart-id"]
      ? parseInt(req.headers["x-cart-id"])
      : null;

    const cart = await getOrCreateCart(userId, cartId, null);

    // Delete all items
    await pool.execute("DELETE FROM cart_items WHERE cart_id = ?", [
      cart.cart_id,
    ]);

    // Delete the cart since it's now empty
    await pool.execute("DELETE FROM cart WHERE cart_id = ?", [cart.cart_id]);

    // Return empty cart response
    return sendSuccess(res, {
      id: null,
      items: [],
      total_items: 0,
      total_amount: "0.00",
      created_at: null,
    });
  } catch (error) {
    console.error("Clear cart error:", error);
    return sendError(res, "Failed to clear cart", 500);
  }
};

// Merge cart (merge session cart with user cart)
export const mergeCart = async (req, res) => {
  try {
    const { session_key } = req.body;
    const userId = req.user?.id;

    if (!userId) {
      return sendError(res, "Authentication required", 401);
    }

    if (!session_key) {
      return sendError(res, "Session key is required", 400);
    }

    // Get user's cart
    const [userCarts] = await pool.execute(
      "SELECT * FROM cart WHERE user_id = ?",
      [userId]
    );

    let userCart;
    if (userCarts.length === 0) {
      // Create user cart
      const [result] = await pool.execute(
        "INSERT INTO cart (user_id) VALUES (?)",
        [userId]
      );
      const [newCarts] = await pool.execute(
        "SELECT * FROM cart WHERE cart_id = ?",
        [result.insertId]
      );
      userCart = newCarts[0];
    } else {
      userCart = userCarts[0];
    }

    // Get session cart
    const [sessionCarts] = await pool.execute(
      "SELECT * FROM cart WHERE session_key = ? AND user_id IS NULL",
      [session_key]
    );

    if (sessionCarts.length > 0) {
      const sessionCart = sessionCarts[0];

      // Get session cart items
      const [sessionItems] = await pool.execute(
        "SELECT product_id, quantity FROM cart_items WHERE cart_id = ?",
        [sessionCart.cart_id]
      );

      // Merge items into user cart
      for (const item of sessionItems) {
        const [existingItems] = await pool.execute(
          "SELECT cart_item_id, quantity FROM cart_items WHERE cart_id = ? AND product_id = ?",
          [userCart.cart_id, item.product_id]
        );

        if (existingItems.length > 0) {
          // Update quantity (add together, max 99)
          const newQuantity = Math.min(
            existingItems[0].quantity + item.quantity,
            99
          );
          await pool.execute(
            "UPDATE cart_items SET quantity = ? WHERE cart_item_id = ?",
            [newQuantity, existingItems[0].cart_item_id]
          );
        } else {
          // Add new item
          await pool.execute(
            "INSERT INTO cart_items (cart_id, product_id, quantity) VALUES (?, ?, ?)",
            [userCart.cart_id, item.product_id, item.quantity]
          );
        }
      }

      // Delete session cart
      await pool.execute("DELETE FROM cart WHERE cart_id = ?", [
        sessionCart.cart_id,
      ]);
    }

    // Return merged cart
    const mergedCart = await getOrCreateCart(userId, userCart.cart_id, null);
    const cartData = await formatCartResponse(req, mergedCart);
    return sendSuccess(res, cartData);
  } catch (error) {
    console.error("Merge cart error:", error);
    return sendError(res, "Failed to merge cart", 500);
  }
};
