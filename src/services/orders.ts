import apiClient, { getErrorMessage } from './api';
import { Order, CreateOrderRequest } from './types';

// Orders API
export const ordersApi = {
  // Create order from cart
  createOrder: async (data: CreateOrderRequest): Promise<Order> => {
    try {
      const response = await apiClient.post<{ message: string; order: Order }>('/orders/create/', data);
      return response.data.order;
    } catch (error) {
      throw new Error(getErrorMessage(error));
    }
  },

  // Get user's orders
  getOrders: async (): Promise<Order[]> => {
    try {
      const response = await apiClient.get<Order[]>('/orders/');
      return response.data;
    } catch (error) {
      throw new Error(getErrorMessage(error));
    }
  },

  // Get order by ID
  getOrder: async (id: number): Promise<Order> => {
    try {
      const response = await apiClient.get<Order>(`/orders/${id}/`);
      return response.data;
    } catch (error) {
      throw new Error(getErrorMessage(error));
    }
  },

  // Cancel order
  cancelOrder: async (id: number): Promise<Order> => {
    try {
      const response = await apiClient.post<{ message: string; order: Order }>(`/orders/${id}/cancel/`);
      return response.data.order;
    } catch (error) {
      throw new Error(getErrorMessage(error));
    }
  },
};

