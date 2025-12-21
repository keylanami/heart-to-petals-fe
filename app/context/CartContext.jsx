"use client";
import { createContext, useContext, useState, useEffect } from "react";

const CartContext = createContext();

export function CartProvider({ children }) {
  const [cart, setCart] = useState([]);

  // 1. Load data dari LocalStorage saat web dibuka pertama kali
  useEffect(() => {
    const savedCart = localStorage.getItem("myCart");
    if (savedCart) {
      setCart(JSON.parse(savedCart));
    }
  }, []);

  // 2. Simpan ke LocalStorage setiap kali cart berubah
  useEffect(() => {
    localStorage.setItem("myCart", JSON.stringify(cart));
  }, [cart]);

  // --- ACTIONS ---

  const addToCart = (product, quantity = 1) => {
    setCart((prev) => {
      // Cek apakah barang sudah ada di cart?
      const existingItem = prev.find((item) => item.id === product.id);

      if (existingItem) {
        // Kalau ada, update quantity-nya aja
        return prev.map((item) =>
          item.id === product.id
            ? { ...item, qty: item.qty + quantity }
            : item
        );
      } else {
        // Kalau belum, masukkan barang baru
        return [...prev, { ...product, qty: quantity }];
      }
    });
  };

  const removeFromCart = (productId) => {
    setCart((prev) => prev.filter((item) => item.id !== productId));
  };

  const removeItems = (idsToRemove) => {
    // Filter cart, buang item yang ID-nya ada di list 'idsToRemove'
    setCart((prev) => prev.filter((item) => !idsToRemove.includes(item.id)));
  };

  // Hitung total items (misal: beli 2 mawar + 1 tulip = 3 items)
  const totalItems = cart.reduce((acc, item) => acc + item.qty, 0);

  return (
    <CartContext.Provider value={{ cart, removeItems,  addToCart, removeFromCart, totalItems }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  return useContext(CartContext);
}