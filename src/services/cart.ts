import apiClient, { getErrorMessage } from './api';
import { Cart, CartItem } from './types';

// Cart API
export const cartApi = {
  // Get current cart (creates if doesn't exist)
  getCart: async (): Promise<Cart> => {
    try {
      const response = await apiClient.get<Cart>('/cart/');
      return response.data;
    } catch (error) {
      throw new Error(getErrorMessage(error));
    }
  },

  // Add item to cart
  addToCart: async (productId: number, quantity: number = 1): Promise<Cart> => {
    try {
      const response = await apiClient.post<Cart>('/cart/items/', {
        product_id: productId,
        quantity,
      });
      return response.data;
    } catch (error) {
      throw new Error(getErrorMessage(error));
    }
  },

  // Update cart item quantity
  updateCartItem: async (itemId: number, quantity: number): Promise<Cart> => {
    try {
      const response = await apiClient.put<Cart>(`/cart/items/${itemId}/`, {
        quantity,
      });
      return response.data;
    } catch (error) {
      throw new Error(getErrorMessage(error));
    }
  },

  // Remove item from cart
  removeCartItem: async (itemId: number): Promise<Cart> => {
    try {
      const response = await apiClient.delete<Cart>(`/cart/items/${itemId}/`);
      return response.data;
    } catch (error) {
      throw new Error(getErrorMessage(error));
    }
  },

  // Clear entire cart
  clearCart: async (): Promise<void> => {
    try {
      await apiClient.delete('/cart/');
    } catch (error) {
      throw new Error(getErrorMessage(error));
    }
  },

  // Merge guest cart with user cart (after login)
  mergeCart: async (sessionKey?: string): Promise<Cart> => {
    try {
      const response = await apiClient.post<Cart>('/cart/merge/', {
        session_key: sessionKey,
      });
      return response.data;
    } catch (error) {
      throw new Error(getErrorMessage(error));
    }
  },
};



