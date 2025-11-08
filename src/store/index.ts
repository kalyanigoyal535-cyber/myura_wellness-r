import { configureStore } from '@reduxjs/toolkit';
import cartReducer from './slices/cartSlice';

export const store = configureStore({
  reducer: {
    cart: cartReducer,
  },
  devTools: process.env.NODE_ENV !== 'production',
});

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;

const STORAGE_KEY = 'myura_cart_v1';

const persistCart = (state: RootState) => {
  try {
    const serialized = JSON.stringify(state.cart.items);
    localStorage.setItem(STORAGE_KEY, serialized);
  } catch {
    // ignore persistence errors (e.g. private browsing)
  }
};

if (typeof window !== 'undefined') {
  persistCart(store.getState());
  store.subscribe(() => persistCart(store.getState()));
}


