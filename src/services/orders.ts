import apiClient, { getErrorMessage } from './api';
import { Order, CreateOrderRequest } from './types';

export const ordersApi = {
  createOrder: async (data: CreateOrderRequest): Promise<Order> => {
    try {
      const response = await apiClient.post<{ message: string; order: Order }>('/orders/create/', data);
      return response.data.order;
    } catch (error) {
      throw new Error(getErrorMessage(error));
    }
  },

  getOrders: async (): Promise<Order[]> => {
    try {
      const response = await apiClient.get<Order[]>('/orders/');
      return response.data;
    } catch (error) {
      throw new Error(getErrorMessage(error));
    }
  },

  getOrder: async (id: number): Promise<Order> => {
    try {
      const response = await apiClient.get<Order>(`/orders/${id}/`);
      return response.data;
    } catch (error) {
      throw new Error(getErrorMessage(error));
    }
  },

  cancelOrder: async (id: number): Promise<Order> => {
    try {
      const response = await apiClient.post<{ message: string; order: Order }>(`/orders/${id}/cancel/`);
      return response.data.order;
    } catch (error) {
      throw new Error(getErrorMessage(error));
    }
  },
};

