"use client";
import { useState, useEffect } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useAuth } from "@/app/context/AuthContext";
import { useToast } from "@/app/context/ToastContext";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { User, MapPin, Lock, LogOut, Save, Camera, ChevronRight, Store, LayoutDashboard } from "lucide-react";


export default function ProfilePage() {
  const { user, logout, updateUser } = useAuth();
  const { showToast } = useToast();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("personal");
  const [isLoading, setIsLoading] = useState(false);

  const [formData, setFormData] = useState({
    name: "", email: "", phone: "",
    street: "", city: "", province: "", zip: "", label: ""
  });

  useEffect(() => {
    if (user) {
        setFormData({
            name: user.name || "",
            email: user.email || "",
            phone: user.phone || "",
            street: user.address?.street || "",
            city: user.address?.city || "",
            province: user.address?.province || "",
            zip: user.address?.zip || "",
            label: user.address?.label || "Rumah"
        });
    } else {
        router.push("/"); 
    }
  }, [user, router]);

  const handleSave = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    await new Promise(r => setTimeout(r, 800));

    updateUser({
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        address: {
            street: formData.street,
            city: formData.city,
            province: formData.province,
            zip: formData.zip,
            label: formData.label
        }
    });

    setIsLoading(false);
    showToast("Profil berhasil diperbarui! ✨", "success");
  };

  const handleLogout = () => {
    if (window.confirm("Yakin mau keluar?")) {
        logout();
        router.push("/");
    }
  };

  if (!user) return null;

  const getRoleBadge = () => {
    if (user.role === 'superadmin') return { label: 'Super Admin', color: 'bg-red-100 text-red-600' };
    if (user.role === 'tenant') return { label: 'Florist Partner', color: 'bg-sage-green/20 text-dark-green' };
    return { label: 'Member', color: 'bg-gray-100 text-gray-500' };
  };

  const badge = getRoleBadge();

  return (
    <main className="bg-[#FDFBF7] min-h-screen">
      <Navbar />
      
      <div className="pt-32 pb-24 px-4 md:px-6 max-w-5xl mx-auto">
        
        <div className="flex flex-col md:flex-row items-center gap-6 mb-12">
            <div className="relative group">
                <div className="w-28 h-28 rounded-full bg-dark-green text-white flex items-center justify-center text-4xl font-serif font-bold shadow-xl border-4 border-white">
                    {user.name.charAt(0)}
                </div>
                <button className="absolute bottom-0 right-0 bg-sage-green text-white p-2 rounded-full shadow-md hover:bg-dark-green transition-colors">
                    <Camera size={16} />
                </button>
            </div>
            <div className="text-center md:text-left">
                <h1 className="text-3xl font-serif font-bold text-dark-green">{user.name}</h1>
                <p className="text-gray-500">{user.email}</p>
                <div className="flex flex-col md:flex-row items-center gap-2 mt-3">
                    <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${badge.color}`}>
                        {badge.label}
                    </span>
                    
                    {user.role === 'tenant' && user.shop && (
                        <span className="flex items-center gap-1 text-xs font-bold text-sage-green">
                            <Store size={14}/> {user.shop.name}
                        </span>
                    )}
                </div>
            </div>

            {(user.role === 'tenant' || user.role === 'superadmin') && (
                <button 
                    onClick={() => router.push(user.role === 'tenant' ? '/admin/florist' : '/admin/super')}
                    className="md:ml-auto flex items-center gap-2 bg-dark-green text-white px-6 py-3 rounded-full font-bold text-sm hover:bg-sage-green transition shadow-lg"
                >
                    <LayoutDashboard size={18} />
                    Buka Dashboard Toko
                </button>
            )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="md:col-span-1 space-y-2">
                {[
                    { id: "personal", label: "Personal Info", icon: User },
                    { id: "address", label: "Alamat Saya", icon: MapPin },
                    { id: "security", label: "Keamanan", icon: Lock },
                ].map((tab) => (
                    <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className={`w-full flex items-center justify-between p-4 rounded-2xl transition-all duration-300 font-bold text-sm ${
                            activeTab === tab.id 
                            ? "bg-dark-green text-white shadow-lg" 
                            : "bg-white text-gray-500 hover:bg-white/60"
                        }`}
                    >
                        <div className="flex items-center gap-3">
                            <tab.icon size={18} />
                            {tab.label}
                        </div>
                        {activeTab === tab.id && <ChevronRight size={16} />}
                    </button>
                ))}

                <button 
                    onClick={handleLogout}
                    className="w-full flex items-center gap-3 p-4 rounded-2xl text-red-500 hover:bg-red-50 transition-all font-bold text-sm mt-8 border border-transparent hover:border-red-100"
                >
                    <LogOut size={18} />
                    Log Out
                </button>
            </div>

            <div className="md:col-span-3">
                <motion.div
                    key={activeTab}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3 }}
                    className="bg-white p-8 rounded-[2rem] shadow-sm border border-gray-100 relative overflow-hidden"
                >
          
                    {activeTab === "personal" && (
                        <form onSubmit={handleSave} className="space-y-6">
                            <h2 className="text-xl font-bold text-dark-green mb-6 border-b border-gray-100 pb-4">Edit Personal Info</h2>
                            
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Nama Lengkap</label>
                                    <input type="text" value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-sage-green" />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Nomor HP</label>
                                    <input type="tel" value={formData.phone} onChange={(e) => setFormData({...formData, phone: e.target.value})} className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-sage-green" />
                                </div>
                                <div className="space-y-2 md:col-span-2">
                                    <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Email Address</label>
                                    <input type="email" value={formData.email} disabled className="w-full bg-gray-100 border border-gray-200 rounded-xl px-4 py-3 text-gray-400 cursor-not-allowed" />
                                </div>
                            </div>
                            <div className="pt-6 flex justify-end">
                                <button type="submit" disabled={isLoading} className="bg-dark-green text-white px-8 py-3 rounded-full font-bold hover:bg-sage-green transition shadow-lg">{isLoading ? "Menyimpan..." : "Simpan Perubahan"}</button>
                            </div>
                        </form>
                    )}

                    {activeTab === "address" && (
                         <form onSubmit={handleSave} className="space-y-6">
                             <h2 className="text-xl font-bold text-dark-green mb-6 border-b border-gray-100 pb-4">Atur Alamat Pribadi</h2>
                             <div className="space-y-2">
                                <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Alamat Lengkap</label>
                                <textarea value={formData.street} onChange={(e) => setFormData({...formData, street: e.target.value})} rows={3} className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-sage-green" />
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                <input type="text" placeholder="Kota" value={formData.city} onChange={(e) => setFormData({...formData, city: e.target.value})} className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3" />
                                <input type="text" placeholder="Provinsi" value={formData.province} onChange={(e) => setFormData({...formData, province: e.target.value})} className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3" />
                                <input type="text" placeholder="Kode Pos" value={formData.zip} onChange={(e) => setFormData({...formData, zip: e.target.value})} className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3" />
                            </div>
                            <div className="pt-6 flex justify-end">
                                <button type="submit" disabled={isLoading} className="bg-dark-green text-white px-8 py-3 rounded-full font-bold hover:bg-sage-green transition shadow-lg">{isLoading ? "Menyimpan..." : "Update Alamat"}</button>
                            </div>
                         </form>
                    )}

                    {activeTab === "security" && (
                         <div className="space-y-6">
                            <h2 className="text-xl font-bold text-dark-green mb-6 border-b border-gray-100 pb-4">Ganti Password</h2>
                            <p className="text-gray-500">Fitur ini belum tersedia di demo.</p>
                         </div>
                    )}
                </motion.div>
            </div>
        </div>
      </div>
      <Footer />
    </main>
  );
}