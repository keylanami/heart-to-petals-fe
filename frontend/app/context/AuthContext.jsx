"use client";

import { createContext, useContext, useEffect, useState } from "react";
import api from "@/lib/axios";
import { useRouter } from "next/navigation";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  /* --------------------
     Fetch authenticated user
  -------------------- */
  const fetchUser = async () => {
    try {
      const res = await api.get("/api/user");
      setUser(res.data);
    } catch (err) {
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  /* --------------------
     Register
  -------------------- */
  const register = async (name, email, password) => {
    try {
      await api.get("/sanctum/csrf-cookie");
      await api.post("/api/register", {
        name,
        email,
        password,
        password_confirmation: password,
        role: "buyer",
      });

      router.push("/login");
      return true;
    } catch (err) {
      console.error(err.response?.data);
      return false;
    }
  };
  const registerTenant = async (name, email, password) => {
    try {
      await api.get("/sanctum/csrf-cookie");
      await api.post("/api/register-tenant", {
        name,
        email,
        password,
      });

      router.push("/login");
      return true;
    } catch (err) {
      console.error(err.response?.data);
      return false;
    }
  };

  /* --------------------
     Login
  -------------------- */
  const login = async (email, password) => {
    try {
      await api.get("/sanctum/csrf-cookie");
      await api.post("/api/login", {
        email,
        password,
      });

      await fetchUser();
      router.push("/");
      return true;
    } catch (err) {
      console.error(err.response?.data);
      return false;
    }
  };

  /* --------------------
     Logout
  -------------------- */
  const logout = async () => {
    try {
      await api.post("/api/logout");
    } catch (err) {
      console.error(err);
    } finally {
      setUser(null);
      router.push("/");
    }
  };

  useEffect(() => {
    fetchUser();
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        register,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
