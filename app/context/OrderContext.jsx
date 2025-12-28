"use client";
import { createContext, useContext, useState, useEffect } from "react";

const OrderContext = createContext();

export function OrderProvider({ children }) {
  const [orders, setOrders] = useState([]);
  const [isInitialized, setIsInitialized] = useState(false);

  // 1. Load data dari LocalStorage saat refresh
  useEffect(() => {
    if (typeof window !== "undefined") {
      const savedOrders = localStorage.getItem("orders");
      if (savedOrders) {
        try {
          setOrders(JSON.parse(savedOrders));
        } catch (e) {
          console.error("Gagal load orders", e);
        }
      }
      setIsInitialized(true);
    }
  }, []);

  // 2. Save data ke LocalStorage saat ada order baru
  useEffect(() => {
    if (isInitialized && typeof window !== "undefined") {
      localStorage.setItem("orders", JSON.stringify(orders));
    }
  }, [orders, isInitialized]);

  // 3. Fungsi Menambah Order (Hanya menerima data jadi)
  const addOrder = (newOrder) => {
    // PENTING: Gunakan ID dari checkout, jangan diganti lagi
    const finalId = newOrder.id || (Date.now().toString() + Math.random().toString(36).substring(2, 9));

    const orderData = {
      ...newOrder,
      id: finalId, 
      // Fallback date jika tidak ada
      date: newOrder.date || new Date().toLocaleDateString("id-ID", { day: 'numeric', month: 'short', year: 'numeric' }),
      // Fallback status
      status: newOrder.status || (newOrder.type === "Custom" ? "waiting_approval" : "processing"),
    };

    setOrders((prev) => [orderData, ...prev]);
  };

  const updateOrderStatus = (orderId, newStatus) => {
    setOrders((prev) => 
      prev.map(order => 
        order.id === orderId ? { ...order, status: newStatus } : order
      )
    );
  };

  
  return (
    <OrderContext.Provider value={{ orders, addOrder, updateOrderStatus, isInitialized }}>
      {children}
    </OrderContext.Provider>
  );
}

export const useOrder = () => useContext(OrderContext);