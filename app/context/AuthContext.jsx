"use client";
import { createContext, useContext, useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useToast } from "@/app/context/ToastContext"; 
import { SHOPS } from "@/app/utils/shop";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const router = useRouter();
  const { showToast } = useToast(); 

  const getStorage = (key) => typeof window !== "undefined" ? localStorage.getItem(key) : null;
  const setStorage = (key, value) => typeof window !== "undefined" && localStorage.setItem(key, value);
  const removeStorage = (key) => typeof window !== "undefined" && localStorage.removeItem(key);

  useEffect(() => {
    try {
      const loggedInUser = getStorage("currentUser");
      if (loggedInUser) setUser(JSON.parse(loggedInUser));
    } catch (error) {
      removeStorage("currentUser");
    }

    const rawUsers = getStorage("users");
    let existingUsers = rawUsers ? JSON.parse(rawUsers) : [];

    const rosyGardenExists = existingUsers.find(u => u.email === "rosy@florist.com");
    
    if (!rosyGardenExists) {
        const dummyTenants = SHOPS.map(shop => ({
            id: Date.now() + shop.id, 
            name: `Owner ${shop.name}`,
            email: `admin@${shop.name.replace(/\s+/g, '').toLowerCase()}.com`, // admin@rosygardenbandung.com
            password: "123",
            role: "tenant",
            status: "active", 
            shop: {
                id: shop.id, // PENTING: ID ini harus sama dengan ID di allItems (101, 102, dst)
                name: shop.name,
                location: shop.location,
                image: shop.image,
                rating: shop.rating,
                can_customize: shop.can_customize
            }
        }));

        // Gabungkan user lama dengan dummy tenants baru
        const newUsersList = [...existingUsers, ...dummyTenants];
        setStorage("users", JSON.stringify(newUsersList));
        console.log("Seeded Dummy Tenants:", dummyTenants); // Cek console buat liat emailnya apa aja
    }

  }, []);

  // --- REGISTER LOGIC (Updated) ---
  const register = (name, email, password, role = "user", shopData = null) => {
    try {
      const rawData = getStorage("users");
      const existingUsers = rawData ? JSON.parse(rawData) : [];
      
      const isExist = existingUsers.find((u) => u.email === email);
      if (isExist) {
        showToast("Email sudah terdaftar!", "error");
        return false;
      }

      const newId = Date.now();

      const newUser = { 
        id: newId, 
        name, 
        email, 
        password,
        role: role, 
        // PENTING: Tenant defaultnya pending
        status: role === "tenant" ? "pending" : "active",
        phone: "", 
        address: { street: "", city: "", province: "", zip: "", label: "Rumah" },

        ...(role === "tenant" && shopData ? {
            shop: {
                id: `SHOP-${newId}`, // ID Toko Unik
                name: shopData.name,
                location: shopData.location,
                image: "/assets/flowershop/placeholder_store.png",
                rating: 0,
                can_customize: shopData.can_customize,
                desc: shopData.desc,
                openTime: shopData.openTime
            }
        } : {})
      };

      existingUsers.push(newUser);
      setStorage("users", JSON.stringify(existingUsers));
      
      if (role === "tenant") {
          // JANGAN auto login
          showToast("Pendaftaran Berhasil! Mohon tunggu persetujuan Admin.", "success");
          router.push("/login"); // Lempar ke login biar dia nunggu
      } else {
          // User biasa auto login (opsional, tapi lebih aman lempar ke login juga)
          showToast("Register Berhasil! Silakan Login.", "success");
          router.push("/login");
      }
      
      return true;
    } catch (e) {
      console.error(e);
      showToast("Gagal register.", "error");
      return false;
    }
  };

  // --- LOGIN LOGIC (Updated) ---
  const login = (email, password) => {
    try {
      const rawData = getStorage("users");
      const existingUsers = rawData ? JSON.parse(rawData) : [];
      
      // Super Admin Hardcoded
      if (email === "super@admin.com" && password === "admin123") {
         const superAdmin = { id: 999, name: "Super Admin", email, role: "superadmin", status: "active" };
         setStorage("currentUser", JSON.stringify(superAdmin));
         setUser(superAdmin);
         router.push("/admin/super");
         return true;
      }

      const validUser = existingUsers.find(
        (u) => u.email === email && u.password === password
      );

      if (validUser) {
        // CEK STATUS: Kalau tenant masih pending, tolak login
        if (validUser.role === "tenant" && validUser.status === "pending") {
            showToast("Akun Toko Anda sedang ditinjau Superadmin. Mohon tunggu.", "warning");
            return false;
        }

        setStorage("currentUser", JSON.stringify(validUser));
        setUser(validUser);
        
        // Redirect based on role
        if (validUser.role === "tenant") {
            showToast(`Halo, ${validUser.shop.name}! Selamat berjualan.`, "success");
            router.push("/admin/florist");
        } else {
            showToast(`Welcome back, ${validUser.name}!`, "success");
            router.push("/toko"); 
        }
        return true;
      } else {
        showToast("Email atau Password salah!", "error");
        return false;
      }
    } catch (e) {
      return false;
    }
  };

  const logout = () => {
    removeStorage("currentUser");
    setUser(null);
    showToast("Berhasil Logout", "info");
    router.push("/get-started");
  };

  const updateUser = (newUserData) => {
    if (!user) return;
    try {
        const updatedUser = { ...user, ...newUserData };
        setUser(updatedUser);
        setStorage("currentUser", JSON.stringify(updatedUser));
        
        // Update juga di database 'users'
        const rawData = getStorage("users");
        if (rawData) {
            const users = JSON.parse(rawData);
            const userIndex = users.findIndex((u) => u.email === user.email);
            if (userIndex !== -1) {
                users[userIndex] = updatedUser; 
                setStorage("users", JSON.stringify(users)); 
            }
        }
    } catch (error) {
        console.error(error);
    }
  };

  return (
    <AuthContext.Provider value={{ user, register, login, logout, updateUser }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);