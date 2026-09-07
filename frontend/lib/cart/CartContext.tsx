"use client";

import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import type { Product } from "@/lib/api";
import { createClient } from "@/lib/supabase/client";

const BASE_KEY = "ystren-shoes-cart";
const ANON_KEY = "anonymous";

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

function getStorageKey(): string {
  return `${BASE_KEY}-${ANON_KEY}`;
}

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [storageKey, setStorageKey] = useState(getStorageKey());
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    let resolvedKey = getStorageKey();
    const supabase = createClient();
    supabase.auth
      .getUser()
      .then(({ data }) => {
        if (data.user) {
          resolvedKey = `${BASE_KEY}-${data.user.id}`;
        }
      })
      .catch(() => {})
      .finally(() => {
        setStorageKey(resolvedKey);
        try {
          const stored = localStorage.getItem(resolvedKey);
          if (stored) {
            setItems(JSON.parse(stored));
          }
        } catch {
          // Ignore corrupted cart data.
        }
        setHydrated(true);
      });
  }, []);

  useEffect(() => {
    if (hydrated && storageKey) {
      localStorage.setItem(storageKey, JSON.stringify(items));
    }
  }, [items, hydrated, storageKey]);

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