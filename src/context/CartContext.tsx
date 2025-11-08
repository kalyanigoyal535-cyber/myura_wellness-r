import { useMemo, type ReactNode } from 'react';
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

export interface CartContextValue {
  items: CartItem[];
  addItem: (item: Omit<CartItem, 'qty'>, qty?: number) => void;
  removeItem: (id: string) => void;
  updateQty: (id: string, qty: number) => void;
  clear: () => void;
  count: number;
  subtotal: number;
}

export const useCart = (): CartContextValue => {
  const dispatch = useAppDispatch();
  const items = useAppSelector(selectCartItems);
  const count = useAppSelector(selectCartCount);
  const subtotal = useAppSelector(selectCartSubtotal);

  const actions = useMemo(
    () => ({
      addItem: (item: Omit<CartItem, 'qty'>, qty = 1) =>
        dispatch(addItem({ item, qty })),
      removeItem: (id: string) => dispatch(removeItem(id)),
      updateQty: (id: string, qty: number) =>
        dispatch(updateQty({ id, qty })),
      clear: () => dispatch(clearCart()),
    }),
    [dispatch]
  );

  return {
    items,
    count,
    subtotal,
    ...actions,
  };
};

export const CartProvider = ({ children }: { children: ReactNode }) => (
  <>{children}</>
);

