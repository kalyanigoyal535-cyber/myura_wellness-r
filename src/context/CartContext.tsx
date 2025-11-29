import { useMemo, useEffect, useState, type ReactNode } from 'react';
import {
  addItem,
  removeItem,
  updateQty,
  clearCart,
  selectCartItems,
  selectCartCount,
  selectCartSubtotal,
  CartItem,
} from '../store/slices/cartSlice';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { cartApi } from '../services/cart';
import { Cart as ApiCart, CartItem as ApiCartItem } from '../services/types';
import { useAuth } from './AuthContext';

export interface CartContextValue {
  items: CartItem[];
  addItem: (item: Omit<CartItem, 'qty'>, qty?: number) => Promise<void>;
  removeItem: (id: string) => Promise<void>;
  updateQty: (id: string, qty: number) => Promise<void>;
  clear: () => Promise<void>;
  count: number;
  subtotal: number;
  isLoading: boolean;
  syncCart: () => Promise<void>;
}

// Helper to convert API cart item to frontend cart item
const apiCartItemToFrontend = (apiItem: ApiCartItem): CartItem => {
  const product = apiItem.product;
  // Note: We don't need image URLs from API - cart will use static product images directly
  return {
    id: String(product.id),
    name: product.name,
    price: parseFloat(product.price),
    image: '', // Not used - cart uses static product images directly
    qty: apiItem.quantity,
  };
};

// Helper to convert frontend cart item to API format
const frontendCartItemToApi = (item: CartItem) => {
  return {
    product_id: parseInt(item.id),
    quantity: item.qty,
  };
};

export const useCart = (): CartContextValue => {
  const dispatch = useAppDispatch();
  const items = useAppSelector(selectCartItems);
  const count = useAppSelector(selectCartCount);
  const subtotal = useAppSelector(selectCartSubtotal);
  const { isAuthenticated } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);

  // Sync cart from backend
  const syncCart = async () => {
    setIsLoading(true);
    try {
      const apiCart = await cartApi.getCart();
      // Convert API cart items to frontend format
      const frontendItems: CartItem[] = apiCart.items.map(apiCartItemToFrontend);
      
      // Update Redux store
      dispatch(clearCart());
      frontendItems.forEach((item) => {
        dispatch(addItem({ item: { id: item.id, name: item.name, price: item.price, image: item.image }, qty: item.qty }));
      });
    } catch (error) {
      console.error('Failed to sync cart from backend:', error);
      // Continue with local cart if sync fails
    } finally {
      setIsLoading(false);
    }
  };

  // Add item to cart (syncs with backend)
  const addItemToCart = async (item: Omit<CartItem, 'qty'>, qty = 1) => {
    setIsLoading(true);
    try {
      // Handle both numeric IDs (from API) and string IDs (from static data)
      let productId: number;
      
      // Check if ID is already a number
      if (typeof item.id === 'number') {
        productId = item.id;
      } else {
        // Try to parse as integer
        const parsedId = parseInt(item.id, 10);
        
        if (!isNaN(parsedId) && parsedId > 0) {
          // ID is a numeric string (e.g., "1", "2")
          productId = parsedId;
        } else {
          // ID is a slug (e.g., "dia-care") - need to find product by category
          // Try to get product from API by category ID
          try {
            const { productsApi } = await import('../services/products');
            const categoryData = await productsApi.getCategory(item.id);
            
            if (categoryData.products && categoryData.products.length > 0) {
              // Use the first product from that category
              productId = categoryData.products[0].id;
            } else {
              throw new Error(`No products found for category: ${item.id}`);
            }
          } catch (apiError) {
            console.error('Failed to find product by category:', apiError);
            const errorMessage = apiError instanceof Error ? apiError.message : 'Unknown error';
            throw new Error(`Cannot add to cart: Product "${item.name}" not found in database. ${errorMessage}`);
          }
        }
      }
      
      if (!productId || productId <= 0) {
        throw new Error(`Invalid product ID: ${item.id}`);
      }
      
      await cartApi.addToCart(productId, qty);
      // Sync cart from backend to get updated state
      await syncCart();
    } catch (error) {
      console.error('Failed to add item to cart:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  // Remove item from cart (syncs with backend)
  const removeItemFromCart = async (id: string) => {
    setIsLoading(true);
    try {
      // Find the cart item ID from backend
      const apiCart = await cartApi.getCart();
      const apiItem = apiCart.items.find((item) => String(item.product.id) === id);
      
      if (apiItem) {
        await cartApi.removeCartItem(apiItem.id);
        await syncCart();
      } else {
        // Fallback to local removal if not found in backend
        dispatch(removeItem(id));
      }
    } catch (error) {
      console.error('Failed to remove item from cart:', error);
      // Fallback to local removal
      dispatch(removeItem(id));
    } finally {
      setIsLoading(false);
    }
  };

  // Update item quantity (syncs with backend)
  const updateItemQty = async (id: string, qty: number) => {
    setIsLoading(true);
    try {
      // Find the cart item ID from backend
      const apiCart = await cartApi.getCart();
      const apiItem = apiCart.items.find((item) => String(item.product.id) === id);
      
      if (apiItem) {
        await cartApi.updateCartItem(apiItem.id, qty);
        await syncCart();
      } else {
        // Fallback to local update if not found in backend
        dispatch(updateQty({ id, qty }));
      }
    } catch (error) {
      console.error('Failed to update cart item:', error);
      // Fallback to local update
      dispatch(updateQty({ id, qty }));
    } finally {
      setIsLoading(false);
    }
  };

  // Clear cart (syncs with backend)
  const clearCartItems = async () => {
    setIsLoading(true);
    try {
      await cartApi.clearCart();
      dispatch(clearCart());
    } catch (error) {
      console.error('Failed to clear cart:', error);
      // Fallback to local clear
      dispatch(clearCart());
    } finally {
      setIsLoading(false);
    }
  };

  // Sync cart from backend on mount and when auth state changes
  useEffect(() => {
    const initializeCart = async () => {
      if (!isInitialized) {
        await syncCart();
        setIsInitialized(true);
      }
    };
    initializeCart();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAuthenticated]);

  const actions = useMemo(
    () => ({
      addItem: addItemToCart,
      removeItem: removeItemFromCart,
      updateQty: updateItemQty,
      clear: clearCartItems,
      syncCart,
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [isAuthenticated]
  );

  return {
    items,
    count,
    subtotal,
    isLoading,
    ...actions,
  };
};

export const CartProvider = ({ children }: { children: ReactNode }) => (
  <>{children}</>
);
