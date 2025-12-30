import pool from "../config/database.js";
import {
  sendSuccess,
  sendError,
  sendNotFound,
  sendBadRequest,
} from "../utils/response.js";
import { getImageUrl } from "../utils/imageUrl.js";
import crypto from "crypto";
import { createNotification } from "./notificationController.js";

// Generate unique order number
function generateOrderNumber() {
  const timestamp = Date.now();
  const random = crypto.randomBytes(4).toString("hex").toUpperCase();
  return `ORD-${timestamp}-${random}`;
}

// Get all orders for authenticated user
export const getOrders = async (req, res) => {
  try {
    if (!req.user || !req.user.id) {
      return sendError(res, "Authentication required", 401);
    }

    const userId = req.user.id;

    // Get orders with order items
    const [orders] = await pool.execute(
      `SELECT 
        o.order_id as id,
        o.order_number,
        o.user_id,
        o.order_status as status,
        o.payment_status,
        o.payment_method,
        o.payment_id,
        o.shipping_address,
        o.billing_address,
        o.discount_amount,
        o.shipping_fee,
        o.cod_fee,
        o.total_amount,
        o.tracking_number,
        o.created_at,
        o.updated_at,
        u.email as user_email
      FROM orders o
      LEFT JOIN user u ON o.user_id = u.id
      WHERE o.user_id = ?
      ORDER BY o.created_at DESC`,
      [userId]
    );

    // Get order items for each order
    const ordersWithItems = await Promise.all(
      orders.map(async (order) => {
        const [items] = await pool.execute(
          `SELECT 
            oi.order_item_id as id,
            oi.product_id,
            oi.quantity,
            oi.price,
            oi.created_at,
            p.name as product_name,
            p.image as product_image,
            p.slug as product_slug
          FROM order_items oi
          INNER JOIN products p ON oi.product_id = p.product_id
          WHERE oi.order_id = ?
          ORDER BY oi.created_at ASC`,
          [order.id]
        );

        const formattedItems = items.map((item) => ({
          id: item.id,
          product: {
            id: item.product_id,
            name: item.product_name,
            price: item.price.toString(),
            image: item.product_image,
            image_url: getImageUrl(req, item.product_image, "products"),
            slug: item.product_slug,
          },
          quantity: item.quantity,
          price: item.price.toString(),
          subtotal: (parseFloat(item.price) * item.quantity).toFixed(2),
          created_at: item.created_at,
        }));

        return {
          id: order.id,
          order_number: order.order_number,
          user: order.user_id,
          user_email: order.user_email,
          status: order.status,
          payment_status: order.payment_status,
          payment_method: order.payment_method,
          payment_id: order.payment_id,
          shipping_address: order.shipping_address
            ? JSON.parse(order.shipping_address)
            : null,
          billing_address: order.billing_address
            ? JSON.parse(order.billing_address)
            : null,
          discount_amount: order.discount_amount?.toString() || "0.00",
          shipping_fee: order.shipping_fee?.toString() || "0.00",
          cod_fee: order.cod_fee?.toString() || "0.00",
          total_amount: order.total_amount.toString(),
          tracking_number: order.tracking_number,
          items: formattedItems,
          created_at: order.created_at,
          updated_at: order.updated_at,
        };
      })
    );

    return sendSuccess(res, ordersWithItems);
  } catch (error) {
    console.error("Get orders error:", error);
    return sendError(res, "Failed to fetch orders", 500);
  }
};

// Get single order by ID
export const getOrder = async (req, res) => {
  try {
    if (!req.user || !req.user.id) {
      return sendError(res, "Authentication required", 401);
    }

    const userId = req.user.id;
    const orderId = parseInt(req.params.id);

    if (isNaN(orderId)) {
      return sendBadRequest(res, "Invalid order ID");
    }

    // Get order
    const [orders] = await pool.execute(
      `SELECT 
        o.order_id as id,
        o.order_number,
        o.user_id,
        o.order_status as status,
        o.payment_status,
        o.payment_method,
        o.payment_id,
        o.shipping_address,
        o.billing_address,
        o.discount_amount,
        o.shipping_fee,
        o.cod_fee,
        o.total_amount,
        o.tracking_number,
        o.created_at,
        o.updated_at,
        u.email as user_email
      FROM orders o
      LEFT JOIN user u ON o.user_id = u.id
      WHERE o.order_id = ? AND o.user_id = ?`,
      [orderId, userId]
    );

    if (orders.length === 0) {
      return sendNotFound(res, "Order");
    }

    const order = orders[0];

    // Get order items
    const [items] = await pool.execute(
      `SELECT 
        oi.order_item_id as id,
        oi.product_id,
        oi.quantity,
        oi.price,
        oi.created_at,
        p.name as product_name,
        p.image as product_image,
        p.slug as product_slug
      FROM order_items oi
      INNER JOIN products p ON oi.product_id = p.product_id
      WHERE oi.order_id = ?
      ORDER BY oi.created_at ASC`,
      [order.id]
    );

    const formattedItems = items.map((item) => ({
      id: item.id,
      product: {
        id: item.product_id,
        name: item.product_name,
        price: item.price.toString(),
        image: item.product_image,
        image_url: getImageUrl(req, item.product_image, "products"),
        slug: item.product_slug,
      },
      quantity: item.quantity,
      price: item.price.toString(),
      subtotal: (parseFloat(item.price) * item.quantity).toFixed(2),
      created_at: item.created_at,
    }));

    const orderData = {
      id: order.id,
      order_number: order.order_number,
      user: order.user_id,
      user_email: order.user_email,
      status: order.status,
      payment_status: order.payment_status,
      payment_method: order.payment_method,
      payment_id: order.payment_id,
      shipping_address: order.shipping_address
        ? JSON.parse(order.shipping_address)
        : null,
      billing_address: order.billing_address
        ? JSON.parse(order.billing_address)
        : null,
      discount_amount: order.discount_amount?.toString() || "0.00",
      shipping_fee: order.shipping_fee?.toString() || "0.00",
      cod_fee: order.cod_fee?.toString() || "0.00",
      total_amount: order.total_amount.toString(),
      tracking_number: order.tracking_number,
      items: formattedItems,
      created_at: order.created_at,
      updated_at: order.updated_at,
    };

    return sendSuccess(res, orderData);
  } catch (error) {
    console.error("Get order error:", error);
    return sendError(res, "Failed to fetch order", 500);
  }
};

// Create new order
export const createOrder = async (req, res) => {
  try {
    if (!req.user || !req.user.id) {
      return sendError(res, "Authentication required", 401);
    }

    const userId = req.user.id;
    const {
      shipping_address,
      shipping_address_id,
      payment_method = "cod",
      payment_status = "pending",
      payment_id = null,
      applied_coupon = null,
      discount_amount = 0,
    } = req.body;

    // Get user's cart
    const [carts] = await pool.execute(
      `SELECT cart_id FROM cart WHERE user_id = ? ORDER BY created_at DESC LIMIT 1`,
      [userId]
    );

    if (carts.length === 0) {
      return sendBadRequest(res, "Cart is empty");
    }

    const cartId = carts[0].cart_id;

    // Get cart items
    const [cartItems] = await pool.execute(
      `SELECT 
        ci.product_id,
        ci.quantity,
        p.price,
        p.name
      FROM cart_items ci
      INNER JOIN products p ON ci.product_id = p.product_id
      WHERE ci.cart_id = ?`,
      [cartId]
    );

    if (cartItems.length === 0) {
      return sendBadRequest(res, "Cart is empty");
    }

    // Calculate totals
    let subtotal = 0;
    cartItems.forEach((item) => {
      subtotal += parseFloat(item.price) * item.quantity;
    });

    const shippingFee = payment_method === "cod" ? 50 : 0; // COD fee
    const codFee = payment_method === "cod" ? 30 : 0; // COD handling fee
    
    // Use discount_amount from request if provided, otherwise calculate from coupon
    let finalDiscountAmount = parseFloat(discount_amount) || 0;
    
    // If coupon is provided but discount_amount is not, calculate it
    if (applied_coupon && finalDiscountAmount === 0) {
      if (applied_coupon.discount_type === "percentage") {
        finalDiscountAmount = (subtotal * parseFloat(applied_coupon.discount_value)) / 100;
        if (applied_coupon.max_discount && finalDiscountAmount > parseFloat(applied_coupon.max_discount)) {
          finalDiscountAmount = parseFloat(applied_coupon.max_discount);
        }
      } else {
        finalDiscountAmount = parseFloat(applied_coupon.discount_value) || 0;
      }
    }
    
    const totalAmount = subtotal + shippingFee + codFee - finalDiscountAmount;

    // Get shipping address
    let finalShippingAddress = shipping_address;
    if (shipping_address_id) {
      // Fetch address from addresses table if address_id provided
      // For now, use the provided shipping_address
      finalShippingAddress = shipping_address;
    }

    if (!finalShippingAddress) {
      return sendBadRequest(res, "Shipping address is required");
    }

    // Generate order number
    const orderNumber = generateOrderNumber();

    // Create order
    const [orderResult] = await pool.execute(
      `INSERT INTO orders (
        order_number,
        user_id,
        order_status,
        payment_status,
        payment_method,
        payment_id,
        shipping_address,
        shipping_fee,
        cod_fee,
        discount_amount,
        total_amount,
        applied_coupon
      ) VALUES (?, ?, 'pending', ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        orderNumber,
        userId,
        payment_status,
        payment_method,
        payment_id,
        JSON.stringify(finalShippingAddress),
        shippingFee,
        codFee,
        finalDiscountAmount,
        totalAmount,
        applied_coupon ? JSON.stringify(applied_coupon) : null,
      ]
    );

    const orderId = orderResult.insertId;

    // Create order items
    for (const item of cartItems) {
      await pool.execute(
        `INSERT INTO order_items (order_id, product_id, quantity, price)
         VALUES (?, ?, ?, ?)`,
        [orderId, item.product_id, item.quantity, item.price]
      );
    }

    // Get user email for notification
    const [users] = await pool.execute(
      "SELECT email FROM user WHERE id = ?",
      [userId]
    );
    const userEmail = users.length > 0 ? users[0].email : "Unknown";

    // Create notification for admin about new order
    await createNotification(
      "order_placed",
      "New Order Placed",
      `Order ${orderNumber} placed by ${userEmail} for ₹${totalAmount.toFixed(2)}`,
      orderId,
      "order"
    );

    // Clear cart after order creation
    await pool.execute(`DELETE FROM cart_items WHERE cart_id = ?`, [cartId]);
    await pool.execute(`DELETE FROM cart WHERE cart_id = ?`, [cartId]);

    // Get created order with items
    const [createdOrders] = await pool.execute(
      `SELECT 
        o.order_id as id,
        o.order_number,
        o.user_id,
        o.order_status as status,
        o.payment_status,
        o.payment_method,
        o.payment_id,
        o.shipping_address,
        o.total_amount,
        o.created_at,
        o.updated_at
      FROM orders o
      WHERE o.order_id = ?`,
      [orderId]
    );

    const order = createdOrders[0];

    // Get order items
    const [items] = await pool.execute(
      `SELECT 
        oi.order_item_id as id,
        oi.product_id,
        oi.quantity,
        oi.price,
        oi.created_at,
        p.name as product_name,
        p.image as product_image,
        p.slug as product_slug
      FROM order_items oi
      INNER JOIN products p ON oi.product_id = p.product_id
      WHERE oi.order_id = ?
      ORDER BY oi.created_at ASC`,
      [orderId]
    );

    const formattedItems = items.map((item) => ({
      id: item.id,
      product: {
        id: item.product_id,
        name: item.product_name,
        price: item.price.toString(),
        image: item.product_image,
        image_url: getImageUrl(req, item.product_image, "products"),
        slug: item.product_slug,
      },
      quantity: item.quantity,
      price: item.price.toString(),
      subtotal: (parseFloat(item.price) * item.quantity).toFixed(2),
      created_at: item.created_at,
    }));

    const orderData = {
      id: order.id,
      order_number: order.order_number,
      user: order.user_id,
      status: order.status,
      payment_status: order.payment_status,
      payment_method: order.payment_method,
      payment_id: order.payment_id,
      shipping_address: order.shipping_address
        ? JSON.parse(order.shipping_address)
        : null,
      total_amount: order.total_amount.toString(),
      items: formattedItems,
      created_at: order.created_at,
      updated_at: order.updated_at,
    };

    return sendSuccess(
      res,
      { order: orderData },
      "Order created successfully",
      201
    );
  } catch (error) {
    console.error("Create order error:", error);
    return sendError(res, "Failed to create order", 500);
  }
};

// Cancel order
export const cancelOrder = async (req, res) => {
  try {
    if (!req.user || !req.user.id) {
      return sendError(res, "Authentication required", 401);
    }

    const userId = req.user.id;
    const orderId = parseInt(req.params.id);

    if (isNaN(orderId)) {
      return sendBadRequest(res, "Invalid order ID");
    }

    // Check if order exists and belongs to user
    const [orders] = await pool.execute(
      `SELECT order_id, order_status FROM orders WHERE order_id = ? AND user_id = ?`,
      [orderId, userId]
    );

    if (orders.length === 0) {
      return sendNotFound(res, "Order");
    }

    const order = orders[0];

    // Check if order can be cancelled
    if (order.order_status === "cancelled") {
      return sendBadRequest(res, "Order is already cancelled");
    }

    if (order.order_status === "delivered") {
      return sendBadRequest(res, "Delivered orders cannot be cancelled");
    }

    // Update order status
    await pool.execute(
      `UPDATE orders SET order_status = 'cancelled' WHERE order_id = ?`,
      [orderId]
    );

    // Get updated order
    const [updatedOrders] = await pool.execute(
      `SELECT 
        o.order_id as id,
        o.order_number,
        o.user_id,
        o.order_status as status,
        o.payment_status,
        o.payment_method,
        o.payment_id,
        o.shipping_address,
        o.total_amount,
        o.created_at,
        o.updated_at
      FROM orders o
      WHERE o.order_id = ?`,
      [orderId]
    );

    const updatedOrder = updatedOrders[0];

    // Get order items
    const [items] = await pool.execute(
      `SELECT 
        oi.order_item_id as id,
        oi.product_id,
        oi.quantity,
        oi.price,
        oi.created_at,
        p.name as product_name,
        p.image as product_image,
        p.slug as product_slug
      FROM order_items oi
      INNER JOIN products p ON oi.product_id = p.product_id
      WHERE oi.order_id = ?
      ORDER BY oi.created_at ASC`,
      [orderId]
    );

    const formattedItems = items.map((item) => ({
      id: item.id,
      product: {
        id: item.product_id,
        name: item.product_name,
        price: item.price.toString(),
        image: item.product_image,
        image_url: getImageUrl(req, item.product_image, "products"),
        slug: item.product_slug,
      },
      quantity: item.quantity,
      price: item.price.toString(),
      subtotal: (parseFloat(item.price) * item.quantity).toFixed(2),
      created_at: item.created_at,
    }));

    const orderData = {
      id: updatedOrder.id,
      order_number: updatedOrder.order_number,
      user: updatedOrder.user_id,
      status: updatedOrder.order_status,
      payment_status: updatedOrder.payment_status,
      payment_method: updatedOrder.payment_method,
      payment_id: updatedOrder.payment_id,
      shipping_address: updatedOrder.shipping_address
        ? JSON.parse(updatedOrder.shipping_address)
        : null,
      total_amount: updatedOrder.total_amount.toString(),
      items: formattedItems,
      created_at: updatedOrder.created_at,
      updated_at: updatedOrder.updated_at,
    };

    return sendSuccess(
      res,
      { order: orderData },
      "Order cancelled successfully",
      200
    );
  } catch (error) {
    console.error("Cancel order error:", error);
    return sendError(res, "Failed to cancel order", 500);
  }
};
