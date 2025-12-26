import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  Bell,
  Users,
  ShoppingCart,
  MessageSquare,
  Settings,
  Check,
  CheckCheck,
  Trash2,
  X,
  ChevronRight,
} from "lucide-react";
import { Notification } from "../types";
import { notificationService } from "../services/notifications";
import "../styles/NotificationPanel.css";

interface NotificationPanelProps {
  isOpen: boolean;
  onClose: () => void;
  onUnreadCountChange?: (count: number) => void;
}

export default function NotificationPanel({
  isOpen,
  onClose,
  onUnreadCountChange,
}: NotificationPanelProps) {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    if (isOpen) {
      fetchNotifications();
      fetchUnreadCount();
    }
  }, [isOpen]);

  // Poll for new notifications every 30 seconds
  useEffect(() => {
    if (!isOpen) return;

    const interval = setInterval(() => {
      fetchUnreadCount();
      fetchNotifications();
    }, 30000);

    return () => clearInterval(interval);
  }, [isOpen]);

  const fetchNotifications = async () => {
    try {
      setLoading(true);
      const data = await notificationService.getNotifications({
        limit: 20,
        offset: 0,
      });
      setNotifications(data.notifications);
      setUnreadCount(data.unread_count);
      onUnreadCountChange?.(data.unread_count);
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
      const newCount = Math.max(0, unreadCount - 1);
      setUnreadCount(newCount);
      onUnreadCountChange?.(newCount);
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
      onUnreadCountChange?.(0);
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
        const newCount = Math.max(0, unreadCount - 1);
        setUnreadCount(newCount);
        onUnreadCountChange?.(newCount);
      }
    } catch (error) {
      console.error("Failed to delete notification:", error);
    }
  };

  const getNotificationIcon = (type: Notification["type"]) => {
    switch (type) {
      case "user_registered":
        return <Users size={18} />;
      case "order_placed":
      case "order_updated":
        return <ShoppingCart size={18} />;
      case "contact_submission":
        return <MessageSquare size={18} />;
      default:
        return <Bell size={18} />;
    }
  };

  const getNotificationLink = (notification: Notification): string => {
    if (notification.related_type === "user" && notification.related_id) {
      return `/users`;
    }
    if (notification.related_type === "order" && notification.related_id) {
      return `/orders/${notification.related_id}`;
    }
    if (notification.type === "contact_submission") {
      return "/contacts";
    }
    return "#";
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
    return date.toLocaleDateString();
  };

  return (
    <>
      <div
        className={`notification-panel-overlay ${isOpen ? "open" : ""}`}
        onClick={onClose}
      />
      <div className={`notification-panel ${isOpen ? "open" : ""}`}>
        <div className="notification-panel-header">
          <div className="notification-panel-title-section">
            <h2 className="notification-panel-title">Notifications</h2>
            {unreadCount > 0 && (
              <span className="notification-panel-badge">{unreadCount}</span>
            )}
          </div>
          <div className="notification-panel-actions">
            {unreadCount > 0 && (
              <button
                className="notification-action-btn"
                onClick={handleMarkAllAsRead}
                title="Mark all as read"
              >
                <CheckCheck size={18} />
              </button>
            )}
            <button
              className="notification-close-btn"
              onClick={onClose}
              title="Close"
            >
              <X size={20} />
            </button>
          </div>
        </div>

        <div className="notification-panel-content">
          {loading ? (
            <div className="notification-loading">
              <div className="loading-spinner"></div>
            </div>
          ) : notifications.length === 0 ? (
            <div className="notification-empty">
              <Bell size={48} className="notification-empty-icon" />
              <p className="notification-empty-text">No notifications</p>
            </div>
          ) : (
            <div className="notification-list">
              {notifications.map((notification) => (
                <Link
                  key={notification.id}
                  to={getNotificationLink(notification)}
                  className={`notification-item ${
                    !notification.is_read ? "unread" : ""
                  }`}
                  onClick={() => {
                    if (!notification.is_read) {
                      handleMarkAsRead(notification.id);
                    }
                    onClose();
                  }}
                >
                  <div className="notification-item-icon">
                    {getNotificationIcon(notification.type)}
                  </div>
                  <div className="notification-item-content">
                    <p className="notification-item-title">
                      {notification.title}
                    </p>
                    <p className="notification-item-message">
                      {notification.message}
                    </p>
                    <p className="notification-item-time">
                      {formatTimeAgo(notification.created_at)}
                    </p>
                  </div>
                  <div className="notification-item-actions">
                    {!notification.is_read && (
                      <button
                        className="notification-mark-read-btn"
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          handleMarkAsRead(notification.id);
                        }}
                        title="Mark as read"
                      >
                        <Check size={16} />
                      </button>
                    )}
                    <button
                      className="notification-delete-btn"
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        handleDelete(notification.id);
                      }}
                      title="Delete"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>

        {notifications.length > 0 && (
          <div className="notification-panel-footer">
            <Link
              to="/notifications"
              className="notification-view-all-btn"
              onClick={onClose}
            >
              View All Notifications
              <ChevronRight size={16} />
            </Link>
          </div>
        )}
      </div>
    </>
  );
}
