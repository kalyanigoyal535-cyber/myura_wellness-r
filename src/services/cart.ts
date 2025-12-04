import apiClient, { getErrorMessage } from './api';
import { Cart, CartItem } from './types';

// Cart ID storage key
const CART_ID_STORAGE_KEY = 'myura_cart_id';

// Helper to get stored cart ID
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
    // Ignore errors
  }
  return null;
};

// Helper to store cart ID
const storeCartId = (cartId: number): void => {
  if (typeof window !== 'undefined') {
    try {
      localStorage.setItem(CART_ID_STORAGE_KEY, String(cartId));
    } catch {
      // Ignore errors (e.g., private browsing)
    }
  }
};

// Helper to clear stored cart ID
const clearStoredCartId = (): void => {
  if (typeof window !== 'undefined') {
    try {
      localStorage.removeItem(CART_ID_STORAGE_KEY);
    } catch {
      // Ignore errors
    }
  }
};

// Cart API
export const cartApi = {
  // Get current cart (creates if doesn't exist)
  getCart: async (): Promise<Cart> => {
    try {
      console.log('[Cart API] Fetching cart...');
      const cartId = getStoredCartId();
      const config = cartId ? {
        headers: {
          'X-Cart-ID': String(cartId),
        },
      } : undefined;
      const response = await apiClient.get<Cart>('/cart/', config);
      console.log('[Cart API] Get cart response:', response.data);
      // Store cart ID for future requests
      if (response.data.id) {
        storeCartId(response.data.id);
      }
      return response.data;
    } catch (error) {
      console.error('[Cart API] Get cart error:', error);
      throw new Error(getErrorMessage(error));
    }
  },

  // Add item to cart
  addToCart: async (productId: number, quantity: number = 1): Promise<Cart> => {
    try {
      console.log('[Cart API] Adding to cart:', { productId, quantity });
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
      console.log('[Cart API] Add to cart response:', response.data);
      // Store cart ID for future requests
      if (response.data.id) {
        storeCartId(response.data.id);
      }
      return response.data;
    } catch (error) {
      console.error('[Cart API] Add to cart error:', error);
      throw new Error(getErrorMessage(error));
    }
  },

  // Update cart item quantity
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
      // Store cart ID if returned
      if (response.data.id) {
        storeCartId(response.data.id);
      }
      return response.data;
    } catch (error) {
      throw new Error(getErrorMessage(error));
    }
  },

  // Remove item from cart
  removeCartItem: async (itemId: number): Promise<Cart> => {
    try {
      const cartId = getStoredCartId();
      const config = cartId ? {
        headers: {
          'X-Cart-ID': String(cartId),
        },
      } : undefined;
      const response = await apiClient.delete<Cart>(`/cart/items/${itemId}/`, config);
      // Store cart ID if returned
      if (response.data.id) {
        storeCartId(response.data.id);
      }
      return response.data;
    } catch (error) {
      throw new Error(getErrorMessage(error));
    }
  },

  // Clear entire cart
  clearCart: async (): Promise<void> => {
    try {
      const cartId = getStoredCartId();
      const config = cartId ? {
        headers: {
          'X-Cart-ID': String(cartId),
        },
      } : undefined;
      await apiClient.delete('/cart/', config);
      // Clear stored cart ID after clearing cart
      clearStoredCartId();
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



