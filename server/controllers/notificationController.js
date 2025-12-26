import pool from "../config/database.js";
import { sendSuccess, sendError, sendNotFound } from "../utils/response.js";

export const createNotification = async (
  type,
  title,
  message,
  relatedId = null,
  relatedType = null
) => {
  try {
    const [result] = await pool.execute(
      `INSERT INTO notifications (type, title, message, related_id, related_type) 
       VALUES (?, ?, ?, ?, ?)`,
      [type, title, message, relatedId, relatedType]
    );
    return result.insertId;
  } catch (error) {
    console.error("Create notification error:", error);
    return null;
  }
};

/**
 * Get all notifications for admin
 */
export const getNotifications = async (req, res) => {
  try {
    const { limit = 50, offset = 0, unread_only = false } = req.query;

    let query = "SELECT * FROM notifications";
    const params = [];

    if (unread_only === "true") {
      query += " WHERE is_read = 0";
    }

    query += " ORDER BY created_at DESC LIMIT ? OFFSET ?";
    params.push(parseInt(limit), parseInt(offset));

    const [notifications] = await pool.execute(query, params);

    // Get total count
    let countQuery = "SELECT COUNT(*) as total FROM notifications";
    if (unread_only === "true") {
      countQuery += " WHERE is_read = 0";
    }
    const [countResult] = await pool.execute(countQuery);
    const total = countResult[0].total;

    // Get unread count
    const [unreadResult] = await pool.execute(
      "SELECT COUNT(*) as unread_count FROM notifications WHERE is_read = 0"
    );
    const unreadCount = unreadResult[0].unread_count;

    return sendSuccess(res, {
      notifications,
      total,
      unread_count: unreadCount,
      limit: parseInt(limit),
      offset: parseInt(offset),
    });
  } catch (error) {
    console.error("Get notifications error:", error);
    return sendError(res, "Failed to fetch notifications", 500);
  }
};

/**
 * Get unread notification count
 */
export const getUnreadCount = async (req, res) => {
  try {
    const [result] = await pool.execute(
      "SELECT COUNT(*) as unread_count FROM notifications WHERE is_read = 0"
    );

    return sendSuccess(res, {
      unread_count: result[0].unread_count,
    });
  } catch (error) {
    console.error("Get unread count error:", error);
    return sendError(res, "Failed to fetch unread count", 500);
  }
};

/**
 * Mark notification as read
 */
export const markAsRead = async (req, res) => {
  try {
    const { id } = req.params;

    const [result] = await pool.execute(
      "UPDATE notifications SET is_read = 1, read_at = NOW() WHERE id = ?",
      [id]
    );

    if (result.affectedRows === 0) {
      return sendNotFound(res, "Notification not found");
    }

    return sendSuccess(res, { message: "Notification marked as read" });
  } catch (error) {
    console.error("Mark as read error:", error);
    return sendError(res, "Failed to mark notification as read", 500);
  }
};

/**
 * Mark all notifications as read
 */
export const markAllAsRead = async (req, res) => {
  try {
    await pool.execute(
      "UPDATE notifications SET is_read = 1, read_at = NOW() WHERE is_read = 0"
    );

    return sendSuccess(res, { message: "All notifications marked as read" });
  } catch (error) {
    console.error("Mark all as read error:", error);
    return sendError(res, "Failed to mark all notifications as read", 500);
  }
};

/**
 * Delete notification
 */
export const deleteNotification = async (req, res) => {
  try {
    const { id } = req.params;

    const [result] = await pool.execute(
      "DELETE FROM notifications WHERE id = ?",
      [id]
    );

    if (result.affectedRows === 0) {
      return sendNotFound(res, "Notification not found");
    }

    return sendSuccess(res, { message: "Notification deleted" });
  } catch (error) {
    console.error("Delete notification error:", error);
    return sendError(res, "Failed to delete notification", 500);
  }
};

/**
 * Delete all read notifications
 */
export const deleteAllRead = async (req, res) => {
  try {
    const [result] = await pool.execute(
      "DELETE FROM notifications WHERE is_read = 1"
    );

    return sendSuccess(res, {
      message: "All read notifications deleted",
      deleted_count: result.affectedRows,
    });
  } catch (error) {
    console.error("Delete all read error:", error);
    return sendError(res, "Failed to delete read notifications", 500);
  }
};
