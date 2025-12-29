"use client";
import { createContext, useContext, useState, useEffect } from "react";

const CartContext = createContext();

export function CartProvider({ children }) {
  const [cart, setCart] = useState([]);
  const [isInitialized, setIsInitialized] = useState(false); 

  // 1. Load Cart on Mount
  useEffect(() => {
    if (typeof window !== "undefined") {
      const savedCart = localStorage.getItem("myCart");
      if (savedCart) {
        try {
          setCart(JSON.parse(savedCart));
        } catch (error) {
          console.error("Gagal parse cart:", error);
          setCart([]);
        }
      }
      setIsInitialized(true); 
    }
  }, []);

  // 2. Sync to LocalStorage whenever cart changes
  useEffect(() => {
    if (isInitialized && typeof window !== "undefined") {
      localStorage.setItem("myCart", JSON.stringify(cart));
      
      // Dispatch custom event so Navbar can listen to changes immediately
      window.dispatchEvent(new Event("cart-updated"));
    }
  }, [cart, isInitialized]);


  const addToCart = (product, quantity = 1) => {
    setCart((prev) => {
      const existingItemIndex = prev.findIndex((item) => item.id === product.id);
      let newCart;
      if (existingItemIndex > -1) {
        newCart = [...prev];
        newCart[existingItemIndex].qty += quantity;
        
        // Remove item if qty becomes 0 or less
        if (newCart[existingItemIndex].qty <= 0) {
            newCart.splice(existingItemIndex, 1);
        }
      } else {
        if (quantity > 0) {
            newCart = [...prev, { ...product, qty: quantity }];
        } else {
            newCart = prev;
        }
      }
      return newCart;
    });
  };

  const removeFromCart = (productId) => {
    setCart((prev) => prev.filter((item) => item.id !== productId));
  };

  const removeItems = (idsToRemove) => {
    setCart((prev) => prev.filter((item) => !idsToRemove.includes(item.id)));
  };

  // Called after checkout success
  const clearCart = () => {
    setCart([]);
    if (typeof window !== "undefined") {
        localStorage.removeItem("myCart");
        window.dispatchEvent(new Event("cart-updated"));
    }
  };

  const totalItems = cart.reduce((acc, item) => acc + (item.qty || 1), 0);

  return (
    <CartContext.Provider value={{ cart, removeItems, addToCart, removeFromCart, clearCart, totalItems }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  return useContext(CartContext);
}