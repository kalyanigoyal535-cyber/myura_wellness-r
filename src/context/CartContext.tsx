import { useMemo, useEffect, useState, type ReactNode } from 'react';
import {
  addItem,
  removeItem,
  updateQty,
  clearCart,
  setCartItems,
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

const apiCartItemToFrontend = (apiItem: ApiCartItem): CartItem => {
  const product = apiItem.product;
  return {
    id: String(product.id),
    name: product.name,
    price: parseFloat(product.price),
    image: '',
    qty: apiItem.quantity,
  };
};

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

  const syncCart = async () => {
    setIsLoading(true);
    try {
      console.log('[Cart] Fetching cart from backend...');
      const apiCart = await cartApi.getCart();
      console.log('[Cart] Backend cart response:', apiCart);
      
      const frontendItems: CartItem[] = apiCart.items.map(apiCartItemToFrontend);
      console.log('[Cart] Converted frontend items:', frontendItems);
      console.log('[Cart] API cart ID:', apiCart.id, 'Total items:', apiCart.total_items);
      
      dispatch(setCartItems(frontendItems));
      console.log('[Cart] Cart sync complete. Items count:', frontendItems.length);
    } catch (error) {
      console.error('[Cart] Failed to sync cart from backend:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const addItemToCart = async (item: Omit<CartItem, 'qty'>, qty = 1) => {
    setIsLoading(true);
    console.log('[Cart] Adding item to cart:', { item, qty });
    try {
      let productId: number;
      
      if (typeof item.id === 'number') {
        productId = item.id;
        console.log('[Cart] Using numeric ID:', productId);
      } else {
        const parsedId = parseInt(item.id, 10);
        
        if (!isNaN(parsedId) && parsedId > 0) {
          // ID is a numeric string (e.g., "1", "2")
          productId = parsedId;
          console.log('[Cart] Parsed numeric string ID:', productId);
        } else {
          // ID is a slug (e.g., "dia-care") - need to find product by category or search
          console.log('[Cart] Looking up product by slug/category:', item.id);
          const { productsApi } = await import('../services/products');
          
          // First, try to find by category ID
          try {
            const categoryData = await productsApi.getCategory(item.id);
            console.log('[Cart] Category lookup result:', categoryData);
            
            if (categoryData.products && categoryData.products.length > 0) {
              // Use the first product from that category
              productId = categoryData.products[0].id;
              console.log('[Cart] Found product in category:', productId);
            } else {
              throw new Error(`No products found for category: ${item.id}`);
            }
          } catch (categoryError) {
            console.log('[Cart] Category lookup failed, trying search:', categoryError);
            // If category lookup fails, try searching by product name or slug
            try {
              // First try searching by exact product name
              let searchResponse = await productsApi.getProducts({
                search: item.name,
                in_stock: true,
              });
              console.log('[Cart] Search by name result:', searchResponse);
              
              // If no results, try searching by slug (item.id)
              if (!searchResponse.results || searchResponse.results.length === 0) {
                searchResponse = await productsApi.getProducts({
                  search: item.id, // Try slug as search term
                  in_stock: true,
                });
                console.log('[Cart] Search by slug result:', searchResponse);
              }
              
              if (searchResponse.results && searchResponse.results.length > 0) {
                // Find exact match by name (case-insensitive)
                const exactMatch = searchResponse.results.find(
                  (p) => p.name.toLowerCase() === item.name.toLowerCase()
                );
                
                if (exactMatch) {
                  productId = exactMatch.id;
                  console.log('[Cart] Found exact match:', productId);
                } else if (searchResponse.results.length > 0) {
                  // Use first result if no exact match
                  productId = searchResponse.results[0].id;
                  console.log('[Cart] Using first search result:', productId);
                } else {
                  throw new Error(`Product "${item.name}" not found in database`);
                }
              } else {
                throw new Error(`Product "${item.name}" not found in database`);
              }
            } catch (searchError) {
              console.error('[Cart] Failed to find product:', { categoryError, searchError });
              const errorMessage = searchError instanceof Error ? searchError.message : 'Unknown error';
              throw new Error(
                `Cannot add to cart: Product "${item.name}" is not available in the database. ` +
                `Please ensure this product has been added to the backend. ` +
                `Error: ${errorMessage}`
              );
            }
          }
        }
      }
      
      if (!productId || productId <= 0) {
        throw new Error(`Invalid product ID: ${item.id}`);
      }
      
      console.log('[Cart] Calling API to add product:', { productId, qty });
      const cartResponse = await cartApi.addToCart(productId, qty);
      console.log('[Cart] API response:', cartResponse);
      
      // Use the cart response directly as source of truth (avoids session issues)
      console.log('[Cart] Updating cart from API response...');
      const frontendItems: CartItem[] = cartResponse.items.map(apiCartItemToFrontend);
      console.log('[Cart] Converted frontend items from response:', frontendItems);
      console.log('[Cart] API cart ID:', cartResponse.id, 'Total items:', cartResponse.total_items);
      
      // Get current Redux items for comparison
      const currentItems = items;
      console.log('[Cart] Current Redux items count:', currentItems.length);
      
      // Replace all cart items with API response (API is source of truth)
      // This is more efficient than clear + add loop and avoids race conditions
      dispatch(setCartItems(frontendItems));
      console.log('[Cart] Cart updated from API response. Items count:', frontendItems.length);
      
      // If API response has fewer items than expected, log a warning
      if (currentItems.length > 0 && frontendItems.length < currentItems.length) {
        console.warn('[Cart] API response has fewer items than Redux store. This may indicate a session issue.', {
          reduxCount: currentItems.length,
          apiCount: frontendItems.length,
          cartId: cartResponse.id
        });
      }
    } catch (error) {
      console.error('[Cart] Failed to add item to cart:', error);
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
