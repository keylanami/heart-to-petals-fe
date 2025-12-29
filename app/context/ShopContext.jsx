"use client";
import { createContext, useContext, useState, useEffect } from "react";
import { SHOPS as INITIAL_SHOPS } from "@/app/utils/shop"; // Asumsi file data dummy kamu di sini

const ShopContext = createContext();

export function ShopProvider({ children }) {
  const [shops, setShops] = useState([]);
  const [isInitialized, setIsInitialized] = useState(false);

  // 1. Load Data
  useEffect(() => {
    if (typeof window !== "undefined") {
      const savedShops = localStorage.getItem("shops");
      if (savedShops) {
        setShops(JSON.parse(savedShops));
      } else {
        // Inject status 'active' ke data dummy lama
        const formattedShops = INITIAL_SHOPS.map(s => ({ ...s, status: 'active' }));
        setShops(formattedShops);
      }
      setIsInitialized(true);
    }
  }, []);

  // 2. Sync ke LocalStorage
  useEffect(() => {
    if (isInitialized) {
      localStorage.setItem("shops", JSON.stringify(shops));
    }
  }, [shops, isInitialized]);

  // --- ACTIONS ---

  // Register Toko Baru
  const registerShop = (newShopData) => {
    const newShop = {
      ...newShopData,
      id: Date.now(), // Generate Unique ID
      rating: 0,
      reviewCount: 0,
      distance: "Baru", // Nanti pake API Maps
      status: "active", // HARUSNYA 'pending', tapi kita set 'active' biar langsung muncul untuk demo
      items: [] // Toko baru belum punya barang
    };
    setShops(prev => [newShop, ...prev]);
    return newShop;
  };

  // Toggle Fitur Custom
  const toggleCustomFeature = (shopId, status) => {
    setShops(prev => prev.map(shop => 
      shop.id === shopId ? { ...shop, can_customize: status } : shop
    ));
  };

  return (
    <ShopContext.Provider value={{ shops, registerShop, toggleCustomFeature }}>
      {children}
    </ShopContext.Provider>
  );
}

export const useShop = () => useContext(ShopContext);