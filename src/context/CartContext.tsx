import {
  useMemo,
  useEffect,
  useState,
  useContext,
  type ReactNode,
} from "react";
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
} from "../store/slices/cartSlice";
import { useAppDispatch, useAppSelector } from "../store/hooks";
import { cartApi } from "../services/cart";
import { Cart as ApiCart, CartItem as ApiCartItem } from "../services/types";
import { AuthContext } from "./AuthContext";

export interface CartContextValue {
  items: CartItem[];
  addItem: (item: Omit<CartItem, "qty">, qty?: number) => Promise<void>;
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
    image: "",
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

  // Safely get auth state - handle case where AuthProvider might not be available
  const authContext = useContext(AuthContext);
  const isAuthenticated = authContext?.isAuthenticated || false;

  const [isLoading, setIsLoading] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);

  const syncCart = async () => {
    setIsLoading(true);
    try {
      const apiCart = await cartApi.getCart();

      const frontendItems: CartItem[] = apiCart.items.map(
        apiCartItemToFrontend
      );

      dispatch(setCartItems(frontendItems));
    } catch (error) {
      console.error("Failed to sync cart from backend:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const addItemToCart = async (item: Omit<CartItem, "qty">, qty = 1) => {
    setIsLoading(true);
    try {
      let productId: number;

      if (typeof item.id === "number") {
        productId = item.id;
      } else {
        const parsedId = parseInt(item.id, 10);

        if (!isNaN(parsedId) && parsedId > 0) {
          // ID is a numeric string (e.g., "1", "2")
          productId = parsedId;
        } else {
          // ID is a slug (e.g., "dia-care") - need to find product by category or search
          const { productsApi } = await import("../services/products");

          // First, try to find by category ID
          try {
            const categoryData = await productsApi.getCategory(item.id);

            if (categoryData.products && categoryData.products.length > 0) {
              // Use the first product from that category
              productId = categoryData.products[0].id;
            } else {
              throw new Error(`No products found for category: ${item.id}`);
            }
          } catch (categoryError) {
            // If category lookup fails, try searching by product name or slug
            try {
              // First try searching by exact product name
              let searchResponse = await productsApi.getProducts({
                search: item.name,
                in_stock: true,
              });

              // If no results, try searching by slug (item.id)
              if (
                !searchResponse.results ||
                searchResponse.results.length === 0
              ) {
                searchResponse = await productsApi.getProducts({
                  search: item.id, // Try slug as search term
                  in_stock: true,
                });
              }

              if (searchResponse.results && searchResponse.results.length > 0) {
                // Find exact match by name (case-insensitive)
                const exactMatch = searchResponse.results.find(
                  (p) => p.name.toLowerCase() === item.name.toLowerCase()
                );

                if (exactMatch) {
                  productId = exactMatch.id;
                } else if (searchResponse.results.length > 0) {
                  // Use first result if no exact match
                  productId = searchResponse.results[0].id;
                } else {
                  throw new Error(
                    `Product "${item.name}" not found in database`
                  );
                }
              } else {
                throw new Error(`Product "${item.name}" not found in database`);
              }
            } catch (searchError) {
              const errorMessage =
                searchError instanceof Error
                  ? searchError.message
                  : "Unknown error";
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

      const cartResponse = await cartApi.addToCart(productId, qty);

      // Use the cart response directly as source of truth (avoids session issues)
      const frontendItems: CartItem[] = cartResponse.items.map(
        apiCartItemToFrontend
      );

      // Get current Redux items for comparison
      const currentItems = items;

      // Replace all cart items with API response (API is source of truth)
      // This is more efficient than clear + add loop and avoids race conditions
      dispatch(setCartItems(frontendItems));

      // If API response has fewer items than expected, log a warning
      if (
        currentItems.length > 0 &&
        frontendItems.length < currentItems.length
      ) {
        console.warn(
          "API response has fewer items than Redux store. This may indicate a session issue.",
          {
            reduxCount: currentItems.length,
            apiCount: frontendItems.length,
            cartId: cartResponse.id,
          }
        );
      }
    } catch (error) {
      console.error("Failed to add item to cart:", error);
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
      const apiItem = apiCart.items.find(
        (item) => String(item.product.id) === id
      );

      if (apiItem) {
        await cartApi.removeCartItem(apiItem.id);
        await syncCart();
      } else {
        // Fallback to local removal if not found in backend
        dispatch(removeItem(id));
      }
    } catch (error) {
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
      const apiItem = apiCart.items.find(
        (item) => String(item.product.id) === id
      );

      if (apiItem) {
        await cartApi.updateCartItem(apiItem.id, qty);
        await syncCart();
      } else {
        // Fallback to local update if not found in backend
        dispatch(updateQty({ id, qty }));
      }
    } catch (error) {
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
      // Fallback to local clear
      dispatch(clearCart());
    } finally {
      setIsLoading(false);
    }
  };

  // Sync cart from backend on mount and when auth state changes
  useEffect(() => {
    const initializeCart = async () => {
      // Always sync when auth state changes to ensure cart is associated with user
      await syncCart();
      if (!isInitialized) {
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
