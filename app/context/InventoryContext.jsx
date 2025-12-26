"use client";
import { createContext, useContext, useState, useEffect } from "react";
import { allItems } from "@/app/utils/shop"; 

const InventoryContext = createContext();

export function InventoryProvider({ children }) {
  const initialData = [
    ...allItems,
    { id: 901, title: "Mawar Merah (Red Rose)", type: "flower", price: 15000, stock: 50, category: "Fresh" },
    { id: 902, title: "Baby Breath", type: "filler", price: 35000, stock: 25, category: "Dried" },
    { id: 903, title: "Sunflower", type: "flower", price: 20000, stock: 15, category: "Fresh" },
  ];

  const [inventory, setInventory] = useState([]);

  useEffect(() => {
    const savedInv = localStorage.getItem("inventory");
    if (savedInv) {
      setInventory(JSON.parse(savedInv));
    } else {
      setInventory(initialData); 
    }
  }, []);

  useEffect(() => {
    if (inventory.length > 0) {
      localStorage.setItem("inventory", JSON.stringify(inventory));
    }
  }, [inventory]);


  const updateStock = (id, amount) => {
    setInventory(prev => prev.map(item => 
      item.id === id ? { ...item, stock: (item.stock || 0) + amount } : item
    ));
  };

  
  const addItem = (newItem) => {
    setInventory(prev => [...prev, { ...newItem, id: Date.now() }]);
  };

  return (
    <InventoryContext.Provider value={{ inventory, updateStock, addItem }}>
      {children}
    </InventoryContext.Provider>
  );
}

export const useInventory = () => useContext(InventoryContext);