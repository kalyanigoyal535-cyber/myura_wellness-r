import apiClient, { getErrorMessage } from './api';
import { Cart, CartItem } from './types';

const CART_ID_STORAGE_KEY = 'myura_cart_id';

const getStoredCartId = (): number | null => {
  if (typeof window === 'undefined') return null;
  try {
    const stored = localStorage.getItem(CART_ID_STORAGE_KEY);
    if (stored) {
      const cartId = parseInt(stored, 10);
      if (!isNaN(cartId) && cartId > 0) {
        return cartId;
      }
    }
  } catch {
  }
  return null;
};

const storeCartId = (cartId: number): void => {
  if (typeof window !== 'undefined') {
    try {
      localStorage.setItem(CART_ID_STORAGE_KEY, String(cartId));
    } catch {
    }
  }
};

const clearStoredCartId = (): void => {
  if (typeof window !== 'undefined') {
    try {
      localStorage.removeItem(CART_ID_STORAGE_KEY);
    } catch {
    }
  }
};

export const cartApi = {
  getCart: async (): Promise<Cart> => {
    try {
      const cartId = getStoredCartId();
      const config = cartId ? {
        headers: {
          'X-Cart-ID': String(cartId),
        },
      } : undefined;
      const response = await apiClient.get<Cart>('/cart/', config);
      if (response.data.id) {
        storeCartId(response.data.id);
      }
      return response.data;
    } catch (error) {
      throw new Error(getErrorMessage(error));
    }
  },

  addToCart: async (productId: number, quantity: number = 1): Promise<Cart> => {
    try {
      const cartId = getStoredCartId();
      const config = cartId ? {
        headers: {
          'X-Cart-ID': String(cartId),
        },
      } : undefined;
      const response = await apiClient.post<Cart>('/cart/items/', {
        product_id: productId,
        quantity,
      }, config);
      if (response.data.id) {
        storeCartId(response.data.id);
      }
      return response.data;
    } catch (error) {
      console.error('[Cart API] Add to cart error:', error);
      throw new Error(getErrorMessage(error));
    }
  },

  updateCartItem: async (itemId: number, quantity: number): Promise<Cart> => {
    try {
      const cartId = getStoredCartId();
      const config = cartId ? {
        headers: {
          'X-Cart-ID': String(cartId),
        },
      } : undefined;
      const response = await apiClient.put<Cart>(`/cart/items/${itemId}/`, {
        quantity,
      }, config);
      if (response.data.id) {
        storeCartId(response.data.id);
      }
      return response.data;
    } catch (error) {
      throw new Error(getErrorMessage(error));
    }
  },

  removeCartItem: async (itemId: number): Promise<Cart> => {
    try {
      const cartId = getStoredCartId();
      const config = cartId ? {
        headers: {
          'X-Cart-ID': String(cartId),
        },
      } : undefined;
      const response = await apiClient.delete<Cart>(`/cart/items/${itemId}/`, config);
      if (response.data.id) {
        storeCartId(response.data.id);
      }
      return response.data;
    } catch (error) {
      throw new Error(getErrorMessage(error));
    }
  },

  clearCart: async (): Promise<void> => {
    try {
      const cartId = getStoredCartId();
      const config = cartId ? {
        headers: {
          'X-Cart-ID': String(cartId),
        },
      } : undefined;
      await apiClient.delete('/cart/', config);
      clearStoredCartId();
    } catch (error) {
      throw new Error(getErrorMessage(error));
    }
  },

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



