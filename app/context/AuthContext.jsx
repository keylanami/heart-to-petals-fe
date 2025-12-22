"use client";
import { createContext, useContext, useState, useEffect } from "react";
import { useRouter } from "next/navigation";
// Pastikan path import ini benar. Kalau satu folder, "./ToastContext" oke.
// Kalau ragu, pakai absolute path: "@/app/context/ToastContext"
import { useToast } from "@/app/context/ToastContext"; 

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const router = useRouter();
  const { showToast } = useToast(); // Panggil Hook Toast

  // ... (Helper Storage Aman tetap sama) ...
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
  }, []);

  const register = (name, email, password) => {
    try {
      const rawData = getStorage("users");
      const existingUsers = rawData ? JSON.parse(rawData) : [];
      
      const isExist = existingUsers.find((u) => u.email === email);
      if (isExist) {
        showToast("Email sudah terdaftar!", "error");
        return false;
      }

      const newUser = { id: Date.now(), name, email, password };
      existingUsers.push(newUser);
      setStorage("users", JSON.stringify(existingUsers));
      
      // 🔴 PERBAIKAN DISINI: showToasts -> showToast
      showToast("Register Berhasil! Silakan Login.", "success");
      
      router.push("/login");
      return true;
    } catch (e) {
      showToast("Gagal register.", "error");
      return false;
    }
  };

  const login = (email, password) => {
    try {
      const rawData = getStorage("users");
      const existingUsers = rawData ? JSON.parse(rawData) : [];
      
      const validUser = existingUsers.find(
        (u) => u.email === email && u.password === password
      );

      if (validUser) {
        setStorage("currentUser", JSON.stringify(validUser));
        setUser(validUser);
        showToast(`Welcome back, ${validUser.name}!`, "success");
        router.push("/toko"); 
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
    router.push("/login");
  };

  return (
    <AuthContext.Provider value={{ user, register, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);