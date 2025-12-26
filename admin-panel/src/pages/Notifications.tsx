import { useEffect, useState } from "react";
import {
  Bell,
  Users,
  ShoppingCart,
  MessageSquare,
  Check,
  CheckCheck,
  Trash2,
} from "lucide-react";
import { Notification } from "../types";
import { notificationService } from "../services/notifications";
import "../styles/Notifications.css";

export default function Notifications() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(true);
  const [filter, setFilter] = useState<"all" | "unread">("all");

  useEffect(() => {
    fetchNotifications();
    fetchUnreadCount();
  }, [filter]);

  // Poll for new notifications every 30 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      fetchUnreadCount();
      if (filter === "all") {
        fetchNotifications();
      }
    }, 30000);

    return () => clearInterval(interval);
  }, [filter]);

  const fetchNotifications = async () => {
    try {
      setLoading(true);
      const data = await notificationService.getNotifications({
        limit: 100,
        offset: 0,
        unread_only: filter === "unread",
      });
      setNotifications(data.notifications);
      setUnreadCount(data.unread_count);
    } catch (error) {
      console.error("Failed to fetch notifications:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchUnreadCount = async () => {
    try {
      const data = await notificationService.getUnreadCount();
      setUnreadCount(data.unread_count);
    } catch (error) {
      console.error("Failed to fetch unread count:", error);
    }
  };

  const handleMarkAsRead = async (id: number) => {
    try {
      await notificationService.markAsRead(id);
      setNotifications((prev) =>
        prev.map((notif) =>
          notif.id === id ? { ...notif, is_read: true } : notif
        )
      );
      setUnreadCount((prev) => Math.max(0, prev - 1));
    } catch (error) {
      console.error("Failed to mark as read:", error);
    }
  };

  const handleMarkAllAsRead = async () => {
    try {
      await notificationService.markAllAsRead();
      setNotifications((prev) =>
        prev.map((notif) => ({ ...notif, is_read: true }))
      );
      setUnreadCount(0);
    } catch (error) {
      console.error("Failed to mark all as read:", error);
    }
  };

  const handleDelete = async (id: number) => {
    try {
      await notificationService.deleteNotification(id);
      setNotifications((prev) => prev.filter((notif) => notif.id !== id));
      const deletedNotif = notifications.find((n) => n.id === id);
      if (deletedNotif && !deletedNotif.is_read) {
        setUnreadCount((prev) => Math.max(0, prev - 1));
      }
    } catch (error) {
      console.error("Failed to delete notification:", error);
    }
  };

  const handleDeleteAllRead = async () => {
    try {
      await notificationService.deleteAllRead();
      setNotifications((prev) => prev.filter((notif) => !notif.is_read));
    } catch (error) {
      console.error("Failed to delete all read:", error);
    }
  };

  const getNotificationIcon = (type: Notification["type"]) => {
    switch (type) {
      case "user_registered":
        return <Users size={20} />;
      case "order_placed":
      case "order_updated":
        return <ShoppingCart size={20} />;
      case "contact_submission":
        return <MessageSquare size={20} />;
      default:
        return <Bell size={20} />;
    }
  };

  const getNotificationTypeLabel = (type: Notification["type"]) => {
    switch (type) {
      case "user_registered":
        return "User Registration";
      case "order_placed":
        return "Order Placed";
      case "order_updated":
        return "Order Updated";
      case "contact_submission":
        return "Contact Form";
      default:
        return "System";
    }
  };

  const formatTimeAgo = (dateString: string): string => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

    if (diffInSeconds < 60) return "Just now";
    if (diffInSeconds < 3600)
      return `${Math.floor(diffInSeconds / 60)} minutes ago`;
    if (diffInSeconds < 86400)
      return `${Math.floor(diffInSeconds / 3600)} hours ago`;
    if (diffInSeconds < 604800)
      return `${Math.floor(diffInSeconds / 86400)} days ago`;
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  return (
    <div className="notifications-container">
      <div className="notifications-header">
        <div>
          <h1 className="notifications-title">Notifications</h1>
          <p className="notifications-subtitle">
            Manage and view all your notifications ({notifications.length}{" "}
            total, {unreadCount} unread)
          </p>
        </div>
        <div className="notifications-actions">
          {unreadCount > 0 && (
            <button
              className="notifications-action-btn"
              onClick={handleMarkAllAsRead}
            >
              <CheckCheck size={18} />
              Mark All as Read
            </button>
          )}
          <button
            className="notifications-action-btn delete-btn"
            onClick={handleDeleteAllRead}
          >
            <Trash2 size={18} />
            Delete Read
          </button>
        </div>
      </div>

      <div className="notifications-filters">
        <button
          className={`filter-btn ${filter === "all" ? "active" : ""}`}
          onClick={() => setFilter("all")}
        >
          All ({notifications.length})
        </button>
        <button
          className={`filter-btn ${filter === "unread" ? "active" : ""}`}
          onClick={() => setFilter("unread")}
        >
          Unread ({unreadCount})
        </button>
      </div>

      {loading ? (
        <div className="notifications-loading">
          <div className="loading-spinner"></div>
        </div>
      ) : notifications.length === 0 ? (
        <div className="notifications-empty">
          <Bell size={64} className="notifications-empty-icon" />
          <p className="notifications-empty-text">
            {filter === "unread"
              ? "No unread notifications"
              : "No notifications found"}
          </p>
        </div>
      ) : (
        <div className="notifications-list">
          {notifications.map((notification) => (
            <div
              key={notification.id}
              className={`notification-card ${
                !notification.is_read ? "unread" : ""
              }`}
            >
              <div className="notification-card-icon">
                {getNotificationIcon(notification.type)}
              </div>
              <div className="notification-card-content">
                <div className="notification-card-header">
                  <div>
                    <h3 className="notification-card-title">
                      {notification.title}
                    </h3>
                    <span className="notification-card-type">
                      {getNotificationTypeLabel(notification.type)}
                    </span>
                  </div>
                  <div className="notification-card-actions">
                    {!notification.is_read && (
                      <button
                        className="notification-card-action-btn"
                        onClick={() => handleMarkAsRead(notification.id)}
                        title="Mark as read"
                      >
                        <Check size={18} />
                      </button>
                    )}
                    <button
                      className="notification-card-action-btn delete"
                      onClick={() => handleDelete(notification.id)}
                      title="Delete"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </div>
                <p className="notification-card-message">
                  {notification.message}
                </p>
                <div className="notification-card-footer">
                  <span className="notification-card-time">
                    {formatTimeAgo(notification.created_at)}
                  </span>
                  {notification.is_read && notification.read_at && (
                    <span className="notification-card-read-time">
                      Read {formatTimeAgo(notification.read_at)}
                    </span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
