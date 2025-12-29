"use client";
import { createContext, useContext, useState, useEffect } from "react";

// --- DATA DUMMY AWAL (MOCK DB) ---

// 1. ITEMS CATALOG (BOUQUET JADI)
const INITIAL_PRODUCTS = [
  {
    id: 1,
    shopId: 101, // Rosy Garden
    type: "product",
    title: "Head Over Heels",
    price: 850000,
    image: "/assets/bouquet/peace/crimson_promise.png",
    category: "Warm",
    tag: "Romance",
    desc: "Cinta yang meledak-ledak.",
    flowers: ["Mawar Merah", "Baby Breath"],
    stock: 5
  },
  {
    id: 2,
    shopId: 102, // Eternal Florist
    type: "product",
    title: "Midnight Regret",
    price: 480000,
    image: "/assets/bouquet/regret/first_date_bloom.png",
    category: "Gloomy",
    tag: "Regret",
    desc: "Penyesalan yang dalam.",
    flowers: ["White Rose"],
    stock: 10
  }
];

// 2. RAW FLOWERS (BUNGA TANGKAI) - Khusus Toko Custom
const INITIAL_FLOWERS = [
  {
    id: "f1",
    shopId: 101,
    type: "flower",
    name: "Red Rose Premium",
    category: "romance",
    price: 15000,
    image: "/assets/flowers/red_rose.png", // Pastikan file ini ada atau ganti placeholder
    color: "bg-red-500",
    stock: 100
  },
  {
    id: "f2",
    shopId: 101,
    type: "flower",
    name: "Peony Pink",
    category: "romance",
    price: 120000,
    image: "/assets/flowers/peony_pink.png",
    color: "bg-pink-400",
    stock: 50
  },
  {
    id: "f3",
    shopId: 101,
    type: "flower",
    name: "Sunflower",
    category: "joy",
    price: 25000,
    image: "/assets/flowers/sunflower.png",
    color: "bg-yellow-400",
    stock: 80
  }
];

// 3. PACKAGING (KEMASAN) - Khusus Toko Custom
const INITIAL_PACKAGING = [
  {
    id: "p1",
    shopId: 101,
    type: "packaging",
    category: "wrapping", // wrapping / box / ribbon
    name: "Premium Paper",
    price: 15000,
    colors: [
        { name: "Pastel Pink", hex: "#FDF2F8", class: "bg-pink-50" },
        { name: "Cream", hex: "#FFFBEB", class: "bg-amber-50" },
        { name: "Black", hex: "#000000", class: "bg-gray-900" }
    ],
    stock: 200
  },
  {
    id: "p2",
    shopId: 101,
    type: "packaging",
    category: "box",
    name: "Square Box",
    price: 45000,
    colors: [
        { name: "White", hex: "#FFFFFF", class: "bg-white border" },
        { name: "Pink", hex: "#FBCFE8", class: "bg-pink-200" }
    ],
    stock: 50
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
        // Gabungkan semua jadi satu array besar
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

  const updateStock = (itemId, amount) => {
    setInventory((prev) =>
      prev.map((item) =>
        item.id === itemId
          ? { ...item, stock: Math.max(0, (item.stock || 0) + amount) }
          : item
      )
    );
  };

  // Helper: Ambil item berdasarkan Shop ID dan Type
  const getItemsByShop = (shopId, type = null) => {
      return inventory.filter(item => {
          const matchShop = String(item.shopId) === String(shopId);
          const matchType = type ? item.type === type : true;
          return matchShop && matchType;
      });
  };

  return (
    <InventoryContext.Provider value={{ inventory, addItem, updateStock, getItemsByShop }}>
      {children}
    </InventoryContext.Provider>
  );
}

export const useInventory = () => useContext(InventoryContext);