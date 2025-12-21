"use client";
import { createContext, useContext, useState, useEffect } from "react";
import { useRouter } from "next/navigation";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const router = useRouter();

  // --- HELPER AMAN BUAT VERCEL ---
  // Kita bungkus localStorage biar gak error di Server
  const getStorage = (key) => {
    if (typeof window !== "undefined") {
      return localStorage.getItem(key);
    }
    return null;
  };

  const setStorage = (key, value) => {
    if (typeof window !== "undefined") {
      localStorage.setItem(key, value);
    }
  };

  const removeStorage = (key) => {
    if (typeof window !== "undefined") {
      localStorage.removeItem(key);
    }
  };

  // 1. Cek User Pas Loading Awal
  useEffect(() => {
    // Pakai try-catch biar kalau data corrupt gak bikin blank putih
    try {
      const loggedInUser = getStorage("currentUser");
      if (loggedInUser) {
        setUser(JSON.parse(loggedInUser));
      }
    } catch (error) {
      console.error("Error reading user from storage:", error);
      removeStorage("currentUser"); // Bersihin data error
    }
  }, []);

  // 2. Logic REGISTER
  const register = (name, email, password) => {
    try {
      // Ambil database user dummy (Safe Parsing)
      const rawData = getStorage("users");
      const existingUsers = rawData ? JSON.parse(rawData) : [];
      
      // Cek email kembar
      const isExist = existingUsers.find((u) => u.email === email);
      if (isExist) {
        alert("Email sudah terdaftar!");
        return false;
      }

      // Simpan user baru
      const newUser = { id: Date.now(), name, email, password };
      existingUsers.push(newUser);
      
      setStorage("users", JSON.stringify(existingUsers));
      
      alert("Register Berhasil! Silakan Login.");
      router.push("/login");
      return true;
    } catch (e) {
      alert("Gagal register, coba clear cache browser.");
      return false;
    }
  };

  // 3. Logic LOGIN
  const login = (email, password) => {
    try {
      const rawData = getStorage("users");
      const existingUsers = rawData ? JSON.parse(rawData) : [];
      
      // Cari user yang cocok
      const validUser = existingUsers.find(
        (u) => u.email === email && u.password === password
      );

      if (validUser) {
        // Simpan sesi login
        setStorage("currentUser", JSON.stringify(validUser));
        setUser(validUser);
        alert(`Welcome back, ${validUser.name}!`);
        router.push("/toko"); 
        return true;
      } else {
        alert("Email atau Password salah!");
        return false;
      }
    } catch (e) {
      console.error(e);
      return false;
    }
  };

  // 4. Logic LOGOUT
  const logout = () => {
    removeStorage("currentUser");
    setUser(null);
    router.push("/login");
  };

  return (
    <AuthContext.Provider value={{ user, register, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);