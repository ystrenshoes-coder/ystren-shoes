"use client";

import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import type { Product } from "@/lib/api";

const STORAGE_KEY = "ystren-shoes-cart";

export type CartItem = {
  product: Product;
  size: string;
  quantity: number;
};

type CartContextValue = {
  items: CartItem[];
  addItem: (product: Product, size: string, quantity: number) => void;
  updateQuantity: (productId: number, size: string, quantity: number) => void;
  removeItem: (productId: number, size: string) => void;
  clear: () => void;
  subtotal: number;
  totalCount: number;
};

const CartContext = createContext<CartContextValue | null>(null);

function sameLine(item: CartItem, productId: number, size: string) {
  return item.product.id === productId && item.size === size;
}

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        setItems(JSON.parse(stored));
      } catch {
        // Ignore corrupted cart data.
      }
    }
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (hydrated) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    }
  }, [items, hydrated]);

  function addItem(product: Product, size: string, quantity: number) {
    setItems((current) => {
      const existing = current.find((item) => sameLine(item, product.id, size));
      if (existing) {
        return current.map((item) =>
          sameLine(item, product.id, size)
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      }
      return [...current, { product, size, quantity }];
    });
  }

  function updateQuantity(productId: number, size: string, quantity: number) {
    setItems((current) =>
      current.map((item) =>
        sameLine(item, productId, size)
          ? { ...item, quantity: Math.max(1, quantity) }
          : item
      )
    );
  }

  function removeItem(productId: number, size: string) {
    setItems((current) => current.filter((item) => !sameLine(item, productId, size)));
  }

  function clear() {
    setItems([]);
  }

  const subtotal = useMemo(
    () => items.reduce((sum, item) => sum + item.product.price * item.quantity, 0),
    [items]
  );

  const totalCount = useMemo(
    () => items.reduce((sum, item) => sum + item.quantity, 0),
    [items]
  );

  return (
    <CartContext.Provider
      value={{ items, addItem, updateQuantity, removeItem, clear, subtotal, totalCount }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart debe usarse dentro de un CartProvider");
  }
  return context;
}
