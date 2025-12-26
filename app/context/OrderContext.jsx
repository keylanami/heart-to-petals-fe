"use client";
import { createContext, useContext, useState, useEffect } from "react";

const OrderContext = createContext();

export function OrderProvider({ children }) {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    const savedOrders = localStorage.getItem("orders");
    if (savedOrders) {
      setOrders(JSON.parse(savedOrders));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("orders", JSON.stringify(orders));
  }, [orders]);

  const addOrder = (newOrder) => {
    const orderData = {
      id: Date.now().toString() + Math.random().toString(36).substring(2, 9), 
      date: new Date().toLocaleDateString("id-ID", { day: 'numeric', month: 'short', year: 'numeric' }),
      status: newOrder.type === "Custom" ? "Pending Approval" : "Completed", 
      ...newOrder
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
    <OrderContext.Provider value={{ orders, addOrder, updateOrderStatus }}>
      {children}
    </OrderContext.Provider>
  );
}

export const useOrder = () => useContext(OrderContext);