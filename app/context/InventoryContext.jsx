"use client";
import { createContext, useContext, useState, useEffect } from "react";
import { allItems } from "@/app/utils/shop";
import { FLOWER_LIBRARY } from "../utils/flower";

const InventoryContext = createContext();

export function InventoryProvider({ children }) {
  const [inventory, setInventory] = useState([]);
  const [isInitialized, setIsInitialized] = useState(false);

  // 1. LOAD DATA ON MOUNT
  useEffect(() => {
    if (typeof window !== "undefined") {
      const savedInv = localStorage.getItem("inventory");
      if (savedInv) {
        try {
          setInventory(JSON.parse(savedInv));
        } catch (e) {
          console.error("Failed to parse inventory", e);
          setInventory([]);
        }
      }
      setIsInitialized(true);
    }
  }, []);


  const addItem = (item) => {
    setInventory((prev) => {
      const newInventory = [item, ...prev]; 
      if (typeof window !== "undefined") {
        localStorage.setItem("inventory", JSON.stringify(newInventory));
      }
      return newInventory;
    });
  };

  const deleteItem = (id) => {
    setInventory((prev) => {
      const newInventory = prev.filter((item) => item.id !== id);
      if (typeof window !== "undefined") {
        localStorage.setItem("inventory", JSON.stringify(newInventory));
      }
      return newInventory;
    });
  };

  const updateItem = (id, updatedFields) => {
    setInventory((prev) => {
      const newInventory = prev.map((item) =>
        item.id === id ? { ...item, ...updatedFields } : item
      );
      if (typeof window !== "undefined") {
        localStorage.setItem("inventory", JSON.stringify(newInventory));
      }
      return newInventory;
    });
  };

  const updateStock = (itemId, amount) => {
    setInventory((prev) => {
      const newInventory = prev.map((item) =>
        item.id === itemId
          ? { ...item, stock: Math.max(0, (item.stock || 0) + amount) }
          : item
      );
      if (typeof window !== "undefined") {
        localStorage.setItem("inventory", JSON.stringify(newInventory));
      }
      return newInventory;
    });
  };

  const getItemsByShop = (shopId) => {
    const contextItems = inventory.filter(
      (item) => String(item.shopId) === String(shopId)
    );

    // 2. From Mock Data (Legacy)
    const mockItems = [...allItems, ...FLOWER_LIBRARY]
      .filter((item) => {
        const itemShopId = item.shop?.id || item.shop_id || item.shopId;
        return String(itemShopId) === String(shopId);
      })
      .map((item) => ({
        ...item,
        shopId: shopId, 
        stock: item.stock || 50, 
      }));

    return [...contextItems, ...mockItems];
  };

  return (
    <InventoryContext.Provider
      value={{
        inventory,
        addItem,
        deleteItem,
        updateItem,
        updateStock,
        getItemsByShop,
      }}
    >
      {children}
    </InventoryContext.Provider>
  );
}

export const useInventory = () => useContext(InventoryContext);
