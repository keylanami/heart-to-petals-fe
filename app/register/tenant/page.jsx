"use client";
import { useState } from "react";
import Link from "next/link";
import { useAuth } from "@/app/context/AuthContext";
import { motion } from "framer-motion";
import { Store, User, Mail, Lock, MapPin } from "lucide-react";

export default function TenantRegisterPage() {
  const { register } = useAuth();
  
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    shopName: "",
    location: ""
  });

  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    // Simulasi delay
    await new Promise(r => setTimeout(r, 1000));

    // Panggil register dengan role 'tenant'
    register(
        formData.name, 
        formData.email, 
        formData.password, 
        "tenant", // Role
        { shopName: formData.shopName, location: formData.location } // Shop Data
    );

    setIsLoading(false);
  };

  return (
    <div className="min-h-screen bg-[#1A2F24] flex items-center justify-center p-4 relative overflow-hidden">
        {/* Decor */}
        <div className="absolute -left-20 top-0 w-96 h-96 bg-sage-green/20 rounded-full blur-[100px]" />

        <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white w-full max-w-lg rounded-3xl shadow-2xl overflow-hidden flex flex-col relative z-10"
        >
            <div className="p-8 pb-0">
                <div className="w-12 h-12 bg-sage-green/10 rounded-xl flex items-center justify-center text-sage-green mb-4">
                    <Store size={24} />
                </div>
                <h2 className="text-3xl font-serif font-bold text-dark-green">Mitra Florist</h2>
                <p className="text-gray-500 mt-2 text-sm">Daftarkan tokomu dan mulai berjualan di HeartToPetals.</p>
            </div>

            <form onSubmit={handleSubmit} className="p-8 space-y-4">
                
                {/* SECTION: OWNER INFO */}
                <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Info Pemilik</p>
                <div className="relative">
                    <User className="absolute left-4 top-3.5 text-gray-400" size={18} />
                    <input required type="text" placeholder="Nama Lengkap Pemilik" 
                        className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-sage-green"
                        value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})}
                    />
                </div>
                <div className="relative">
                    <Mail className="absolute left-4 top-3.5 text-gray-400" size={18} />
                    <input required type="email" placeholder="Email Address" 
                        className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-sage-green"
                        value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})}
                    />
                </div>
                <div className="relative">
                    <Lock className="absolute left-4 top-3.5 text-gray-400" size={18} />
                    <input required type="password" placeholder="Password" 
                        className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-sage-green"
                        value={formData.password} onChange={e => setFormData({...formData, password: e.target.value})}
                    />
                </div>

                {/* SECTION: SHOP INFO */}
                <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mt-6 mb-2">Info Toko</p>
                <div className="relative">
                    <Store className="absolute left-4 top-3.5 text-gray-400" size={18} />
                    <input required type="text" placeholder="Nama Flowershop" 
                        className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-sage-green"
                        value={formData.shopName} onChange={e => setFormData({...formData, shopName: e.target.value})}
                    />
                </div>
                <div className="relative">
                    <MapPin className="absolute left-4 top-3.5 text-gray-400" size={18} />
                    <input required type="text" placeholder="Lokasi (Kota)" 
                        className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-sage-green"
                        value={formData.location} onChange={e => setFormData({...formData, location: e.target.value})}
                    />
                </div>

                <button 
                    type="submit" disabled={isLoading}
                    className="w-full bg-dark-green text-white font-bold py-4 rounded-xl shadow-lg hover:bg-sage-green transition-all mt-4 disabled:opacity-50 flex items-center justify-center gap-2"
                >
                    {isLoading ? "Memproses..." : "Daftar sebagai Mitra"}
                </button>
            </form>

            <div className="bg-gray-50 p-6 text-center text-sm text-gray-500">
                Salah pilih? <Link href="/get-started" className="text-dark-green font-bold underline">Kembali</Link>
            </div>
        </motion.div>
    </div>
  );
}