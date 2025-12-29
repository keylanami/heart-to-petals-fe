"use client";
import { createContext, useContext, useState, useEffect } from "react";

// --- DATA DUMMY AWAL (MOCK DB) ---
const INITIAL_PRODUCTS = [
  {
    id: 1, shopId: 101, type: "product", title: "Head Over Heels", price: 850000,
    image: "/assets/bouquet/peace/crimson_promise.png", category: "Warm", tag: "Romance",
    desc: "Cinta yang meledak-ledak.", flowers: ["Mawar Merah", "Baby Breath"], stock: 5
  },
  {
    id: 2, shopId: 102, type: "product", title: "Midnight Regret", price: 480000,
    image: "/assets/bouquet/regret/first_date_bloom.png", category: "Gloomy", tag: "Regret",
    desc: "Penyesalan yang dalam.", flowers: ["White Rose"], stock: 10
  }
];

const INITIAL_FLOWERS = [
  { id: "f1", shopId: 101, type: "flower", name: "Red Rose Premium", category: "romance", price: 15000, image: "/assets/flowers/red_rose.png", color: "#ef4444", stock: 100 },
  { id: "f2", shopId: 101, type: "flower", name: "Peony Pink", category: "romance", price: 120000, image: "/assets/flowers/peony_pink.png", color: "#f472b6", stock: 50 },
  { id: "f3", shopId: 101, type: "flower", name: "Sunflower", category: "joy", price: 25000, image: "/assets/flowers/sunflower.png", color: "#facc15", stock: 80 }
];

const INITIAL_PACKAGING = [
  {
    id: "p1", shopId: 101, type: "packaging", category: "wrapping", name: "Premium Paper", price: 15000, stock: 200,
    colors: [
        { name: "Pastel Pink", hex: "#FDF2F8", class: "bg-pink-50" },
        { name: "Cream", hex: "#FFFBEB", class: "bg-amber-50" },
        { name: "Black", hex: "#000000", class: "bg-gray-900" }
    ]
  },
  {
    id: "p2", shopId: 101, type: "packaging", category: "box", name: "Square Box", price: 45000, stock: 50,
    colors: [
        { name: "White", hex: "#FFFFFF", class: "bg-white border" },
        { name: "Pink", hex: "#FBCFE8", class: "bg-pink-200" }
    ]
  }
];

const InventoryContext = createContext();

export function InventoryProvider({ children }) {
  const [inventory, setInventory] = useState([]);
  const [isInitialized, setIsInitialized] = useState(false);

  // LOAD DATA
  useEffect(() => {
    if (typeof window !== "undefined") {
      const savedInv = localStorage.getItem("inventory");
      if (savedInv) {
        setInventory(JSON.parse(savedInv));
      } else {
        setInventory([...INITIAL_PRODUCTS, ...INITIAL_FLOWERS, ...INITIAL_PACKAGING]);
      }
      setIsInitialized(true);
    }
  }, []);

  // SYNC DATA
  useEffect(() => {
    if (isInitialized) {
      localStorage.setItem("inventory", JSON.stringify(inventory));
    }
  }, [inventory, isInitialized]);

  // --- ACTIONS ---

  const addItem = (item) => {
    setInventory((prev) => [item, ...prev]);
  };

  const deleteItem = (id) => {
    setInventory((prev) => prev.filter(item => item.id !== id));
  };

  const updateItem = (id, updatedFields) => {
    setInventory((prev) => prev.map(item => item.id === id ? { ...item, ...updatedFields } : item));
  };

  const updateStock = (itemId, amount) => {
    setInventory((prev) =>
      prev.map((item) =>
        item.id === itemId
          ? { ...item, stock: Math.max(0, (item.stock || 0) + amount) }
          : item
      )
    );
  };

  const getItemsByShop = (shopId, type = null) => {
      return inventory.filter(item => {
          const matchShop = String(item.shopId) === String(shopId);
          const matchType = type ? item.type === type : true;
          return matchShop && matchType;
      });
  };

  return (
    <InventoryContext.Provider value={{ inventory, addItem, deleteItem, updateItem, updateStock, getItemsByShop }}>
      {children}
    </InventoryContext.Provider>
  );
}

export const useInventory = () => useContext(InventoryContext);