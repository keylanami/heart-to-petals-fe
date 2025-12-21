"use client";
import { createContext, useContext, useState, useEffect } from "react";
import { useRouter } from "next/navigation";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null); // Data user yang lagi login
  const router = useRouter();

  // 1. Cek User Pas Loading Awal
  useEffect(() => {
    const loggedInUser = localStorage.getItem("currentUser");
    if (loggedInUser) {
      setUser(JSON.parse(loggedInUser));
    }
  }, []);

  // 2. Logic REGISTER
  const register = (name, email, password) => {
    // Ambil database user dummy yg udah ada
    const existingUsers = JSON.parse(localStorage.getItem("users") || "[]");
    
    // Cek email kembar
    const isExist = existingUsers.find((u) => u.email === email);
    if (isExist) {
      alert("Email sudah terdaftar!");
      return false;
    }

    // Simpan user baru
    const newUser = { id: Date.now(), name, email, password };
    existingUsers.push(newUser);
    localStorage.setItem("users", JSON.stringify(existingUsers));
    
    alert("Register Berhasil! Silakan Login.");
    router.push("/login");
    return true;
  };

  // 3. Logic LOGIN
  const login = (email, password) => {
    const existingUsers = JSON.parse(localStorage.getItem("users") || "[]");
    
    // Cari user yang cocok
    const validUser = existingUsers.find(
      (u) => u.email === email && u.password === password
    );

    if (validUser) {
      // Simpan sesi login
      localStorage.setItem("currentUser", JSON.stringify(validUser));
      setUser(validUser);
      alert(`Welcome back, ${validUser.name}!`);
      router.push("/toko"); // Redirect ke halaman toko
      return true;
    } else {
      alert("Email atau Password salah!");
      return false;
    }
  };

  // 4. Logic LOGOUT
  const logout = () => {
    localStorage.removeItem("currentUser");
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