"use client";
import { createContext, useContext, useState, useEffect } from "react";

const CartContext = createContext();

export function CartProvider({ children }) {
  const [cart, setCart] = useState([]);

 
  useEffect(() => {
    if (typeof window !== "undefined") {
      const savedCart = localStorage.getItem("myCart");
      if (savedCart) {
        try {
          setCart(JSON.parse(savedCart));
        } catch (error) {
          console.error("Gagal parse cart:", error);
          localStorage.removeItem("myCart");
        }
      }
    }
  }, []);


  const updateCart = (newCart) => {
    setCart(newCart);
    if (typeof window !== "undefined") {
      localStorage.setItem("myCart", JSON.stringify(newCart));
    }
  };
  

  const addToCart = (product, quantity = 1) => {    
    let newCart = [...cart];
    const existingItemIndex = newCart.findIndex((item) => item.id === product.id);

    if (existingItemIndex > -1) {
      newCart[existingItemIndex].qty += quantity;
    } else {
      newCart.push({ ...product, qty: quantity });
    }
    updateCart(newCart);
  };

  const removeFromCart = (productId) => {
    const newCart = cart.filter((item) => item.id !== productId);
    updateCart(newCart);
  };

  const removeItems = (idsToRemove) => {
    const newCart = cart.filter((item) => !idsToRemove.includes(item.id));
    updateCart(newCart);
  };

  
  const totalItems = cart.reduce((acc, item) => acc + item.qty, 0);

  return (
    <CartContext.Provider value={{ cart, removeItems, addToCart, removeFromCart, totalItems }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  return useContext(CartContext);
}