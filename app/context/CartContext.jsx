"use client";
import { createContext, useContext, useState, useEffect } from "react";

const CartContext = createContext();

export function CartProvider({ children }) {
  const [cart, setCart] = useState([]);
  const [isInitialized, setIsInitialized] = useState(false); // GUARD: Biar gak nimpa LocalStorage

  // 1. Load data sekali saat mount
  useEffect(() => {
    if (typeof window !== "undefined") {
      const savedCart = localStorage.getItem("myCart");
      if (savedCart) {
        try {
          setCart(JSON.parse(savedCart));
        } catch (error) {
          console.error("Gagal parse cart:", error);
        }
      }
      setIsInitialized(true); // Tandai sudah load
    }
  }, []);

  // 2. Simpan otomatis tiap cart berubah (TAPI TUNGGU Initialized dulu)
  useEffect(() => {
    if (isInitialized && typeof window !== "undefined") {
      localStorage.setItem("myCart", JSON.stringify(cart));
    }
  }, [cart, isInitialized]);

  // --- ACTIONS ---

  const addToCart = (product, quantity = 1) => {
    setCart((prev) => {
      const existingItemIndex = prev.findIndex((item) => item.id === product.id);
      if (existingItemIndex > -1) {
        const newCart = [...prev];
        newCart[existingItemIndex].qty += quantity;
        return newCart;
      } else {
        return [...prev, { ...product, qty: quantity }];
      }
    });
  };

  const removeFromCart = (productId) => {
    setCart((prev) => prev.filter((item) => item.id !== productId));
  };

  const removeItems = (idsToRemove) => {
    setCart((prev) => prev.filter((item) => !idsToRemove.includes(item.id)));
  };

  const clearCart = () => {
    setCart([]);
  };

  const totalItems = cart.reduce((acc, item) => acc + item.qty, 0);

  return (
    <CartContext.Provider value={{ cart, removeItems, addToCart, removeFromCart, clearCart, totalItems }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  return useContext(CartContext);
}