"use client";
import { createContext, useContext, useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useToast } from "@/app/context/ToastContext"; 

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
      const newUser = { 
        id: Date.now(), 
        name, 
        email, 
        password,
        phone: "", 
        address: { street: "", city: "", province: "", zip: "", label: "Rumah" } 
      };

      existingUsers.push(newUser);
      setStorage("users", JSON.stringify(existingUsers));
      
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


  const updateUser = (newUserData) => {
    if (!user) return;

    try {
        
        const updatedUser = { ...user, ...newUserData };
        setUser(updatedUser);
        setStorage("currentUser", JSON.stringify(updatedUser));
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
        console.error("Gagal update user", error);
        showToast("Gagal menyimpan perubahan profile", "error");
    }
  };

  return (
    <AuthContext.Provider value={{ user, register, login, logout, updateUser }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);