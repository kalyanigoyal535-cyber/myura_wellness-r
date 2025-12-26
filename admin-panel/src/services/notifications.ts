import api from './api';
import { Notification, NotificationResponse } from '../types';

export const notificationService = {
  /**
   * Get all notifications
   */
  getNotifications: async (params?: {
    limit?: number;
    offset?: number;
    unread_only?: boolean;
  }): Promise<NotificationResponse> => {
    const queryParams = new URLSearchParams();
    if (params?.limit) queryParams.append('limit', params.limit.toString());
    if (params?.offset) queryParams.append('offset', params.offset.toString());
    if (params?.unread_only) queryParams.append('unread_only', 'true');

    const response = await api.get<NotificationResponse>(
      `/admin/notifications${queryParams.toString() ? `?${queryParams.toString()}` : ''}`
    );
    return response.data;
  },

  /**
   * Get unread notification count
   */
  getUnreadCount: async (): Promise<{ unread_count: number }> => {
    const response = await api.get<{ unread_count: number }>(
      '/admin/notifications/unread-count'
    );
    return response.data;
  },

  /**
   * Mark notification as read
   */
  markAsRead: async (id: number): Promise<void> => {
    await api.patch(`/admin/notifications/${id}/read`);
  },

  /**
   * Mark all notifications as read
   */
  markAllAsRead: async (): Promise<void> => {
    await api.patch('/admin/notifications/read-all');
  },

  /**
   * Delete notification
   */
  deleteNotification: async (id: number): Promise<void> => {
    await api.delete(`/admin/notifications/${id}`);
  },

  /**
   * Delete all read notifications
   */
  deleteAllRead: async (): Promise<void> => {
    await api.delete('/admin/notifications/read/all');
  },
};

