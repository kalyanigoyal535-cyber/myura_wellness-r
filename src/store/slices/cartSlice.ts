import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface CartItem {
  id: string;
  name: string;
  variant?: string;
  price: number;
  image: string;
  qty: number;
}

export interface CartState {
  items: CartItem[];
}

const STORAGE_KEY = 'myura_cart_v1';
const clampQty = (qty: number) => Math.max(1, Math.min(99, qty));

const loadInitialItems = (): CartItem[] => {
  if (typeof window === 'undefined') {
    return [];
  }

  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];

    const parsed = JSON.parse(raw) as CartItem[];
    return Array.isArray(parsed)
      ? parsed.map((item) => ({
          ...item,
          qty: clampQty(item.qty ?? 1),
        }))
      : [];
  } catch {
    return [];
  }
};

const initialState: CartState = {
  items: loadInitialItems(),
};

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    addItem: (
      state,
      action: PayloadAction<{ item: Omit<CartItem, 'qty'>; qty?: number }>
    ) => {
      const { item, qty = 1 } = action.payload;
      const existing = state.items.find((entry) => entry.id === item.id);

      if (existing) {
        existing.qty = clampQty(existing.qty + qty);
      } else {
        state.items.push({
          ...item,
          qty: clampQty(qty),
        });
      }
    },
    removeItem: (state, action: PayloadAction<string>) => {
      state.items = state.items.filter((item) => item.id !== action.payload);
    },
    updateQty: (
      state,
      action: PayloadAction<{ id: string; qty: number }>
    ) => {
      const target = state.items.find((item) => item.id === action.payload.id);
      if (target) {
        target.qty = clampQty(action.payload.qty);
      }
    },
    clearCart: (state) => {
      state.items = [];
    },
  },
});

export const { addItem, removeItem, updateQty, clearCart } = cartSlice.actions;
export const selectCartItems = (state: { cart: CartState }) => state.cart.items;
export const selectCartCount = (state: { cart: CartState }) =>
  state.cart.items.reduce((total, item) => total + item.qty, 0);
export const selectCartSubtotal = (state: { cart: CartState }) =>
  state.cart.items.reduce((total, item) => total + item.price * item.qty, 0);

export default cartSlice.reducer;


