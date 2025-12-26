import express from "express";
import {
  getNotifications,
  getUnreadCount,
  markAsRead,
  markAllAsRead,
  deleteNotification,
  deleteAllRead,
} from "../controllers/notificationController.js";
import { authenticate, requireAdmin } from "../middleware/auth.js";

const router = express.Router();

// Get all notifications
router.get("/", authenticate, requireAdmin, getNotifications);

// Get unread count
router.get("/unread-count", authenticate, requireAdmin, getUnreadCount);

// Mark notification as read
router.patch("/:id/read", authenticate, requireAdmin, markAsRead);

// Mark all notifications as read
router.patch("/read-all", authenticate, requireAdmin, markAllAsRead);

// Delete notification
router.delete("/:id", authenticate, requireAdmin, deleteNotification);

// Delete all read notifications
router.delete("/read/all", authenticate, requireAdmin, deleteAllRead);

export default router;
