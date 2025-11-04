import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';

export interface CartItem {
  id: string;
  name: string;
  variant?: string;
  price: number;
  image: string;
  qty: number;
}

interface CartContextValue {
  items: CartItem[];
  addItem: (item: Omit<CartItem, 'qty'>, qty?: number) => void;
  removeItem: (id: string) => void;
  updateQty: (id: string, qty: number) => void;
  clear: () => void;
  count: number;
  subtotal: number;
}

const CartContext = createContext<CartContextValue | undefined>(undefined);

const STORAGE_KEY = 'myura_cart_v1';

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [items, setItems] = useState<CartItem[]>(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      return raw ? (JSON.parse(raw) as CartItem[]) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    } catch {
      // ignore storage errors
    }
  }, [items]);

  const addItem: CartContextValue['addItem'] = (item, qty = 1) => {
    setItems(prev => {
      const idx = prev.findIndex(p => p.id === item.id);
      if (idx >= 0) {
        const next = [...prev];
        next[idx] = { ...next[idx], qty: Math.min(next[idx].qty + qty, 99) };
        return next;
      }
      return [...prev, { ...item, qty: Math.max(1, Math.min(qty, 99)) }];
    });
  };

  const removeItem: CartContextValue['removeItem'] = (id) => {
    setItems(prev => prev.filter(i => i.id !== id));
  };

  const updateQty: CartContextValue['updateQty'] = (id, qty) => {
    setItems(prev => prev.map(i => (i.id === id ? { ...i, qty: Math.max(1, Math.min(qty, 99)) } : i)));
  };

  const clear = () => setItems([]);

  const subtotal = useMemo(() => items.reduce((s, i) => s + i.price * i.qty, 0), [items]);
  const count = useMemo(() => items.reduce((s, i) => s + i.qty, 0), [items]);

  const value: CartContextValue = {
    items,
    addItem,
    removeItem,
    updateQty,
    clear,
    count,
    subtotal,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};

export const useCart = (): CartContextValue => {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart must be used within CartProvider');
  return ctx;
};


