"use client";
import { useState } from "react";
import Link from "next/link";
import { useAuth } from "@/app/context/AuthContext";

export default function RegisterPage() {
  const { register } = useAuth();
  const [formData, setFormData] = useState({ name: "", email: "", password: "" });

  const handleSubmit = (e) => {
    e.preventDefault();
    register(formData.name, formData.email, formData.password);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#F3F4F6] px-6">
      <div className="bg-white p-8 rounded-3xl shadow-xl w-full max-w-md border border-gray-100">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-serif font-bold text-dark-green">Join Us</h1>
          <p className="text-gray-400 text-sm mt-2">Buat akun untuk mulai meracik bunga.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Nama Lengkap</label>
            <input 
              type="text" 
              required
              className="w-full bg-gray-50 border border-gray-200 rounded-lg px-4 py-3 focus:outline-none focus:border-dark-green text-dark-green font-medium"
              placeholder="Ex: Budi Florist"
              value={formData.name}
              onChange={(e) => setFormData({...formData, name: e.target.value})}
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Email</label>
            <input 
              type="email" 
              required
              className="w-full bg-gray-50 border border-gray-200 rounded-lg px-4 py-3 focus:outline-none focus:border-dark-green text-dark-green font-medium"
              placeholder="budi@example.com"
              value={formData.email}
              onChange={(e) => setFormData({...formData, email: e.target.value})}
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Password</label>
            <input 
              type="password" 
              required
              className="w-full bg-gray-50 border border-gray-200 rounded-lg px-4 py-3 focus:outline-none focus:border-dark-green text-dark-green font-medium"
              placeholder="••••••••"
              value={formData.password}
              onChange={(e) => setFormData({...formData, password: e.target.value})}
            />
          </div>

          <button type="submit" className="w-full bg-dark-green text-white py-3.5 rounded-xl font-bold hover:bg-sage-green transition shadow-lg mt-4">
            Create Account
          </button>
        </form>

        <p className="text-center text-gray-400 text-sm mt-6">
          Sudah punya akun? <Link href="/login" className="text-dark-green font-bold hover:underline">Login disini</Link>
        </p>
      </div>
    </div>
  );
}