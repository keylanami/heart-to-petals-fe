"use client";
import { useState, useEffect } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useAuth } from "@/app/context/AuthContext";
import { useToast } from "@/app/context/ToastContext";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  User,
  MapPin,
  Lock,
  LogOut,
  Save,
  Camera,
  ChevronRight,
} from "lucide-react";


export default function ProfilePage() {
  const { user, logout, updateUser } = useAuth();
  const { showToast } = useToast();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("personal");
  const [isLoading, setIsLoading] = useState(false);

 
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    street: "",
    city: "",
    province: "",
    zip: "",
    label: "",
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
        label: user.address?.label || "Rumah",
      });
    } else {
      router.push("/get-started"); 
    }
  }, [user, router]);

  const handleSave = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    // Simulasi loading
    await new Promise((r) => setTimeout(r, 800));

    // Update Global State via Context
    updateUser({
      name: formData.name,
      email: formData.email,
      phone: formData.phone,
      address: {
        street: formData.street,
        city: formData.city,
        province: formData.province,
        zip: formData.zip,
        label: formData.label,
      },
    });

    setIsLoading(false);
    showToast("Profil berhasil diperbarui! ✨", "success");
  };

  const handleLogout = () => {
    if (window.confirm("Yakin mau keluar?")) {
      logout();
      showToast("Sampai jumpa lagi! 👋", "info");
      router.push("/get-started");
    }
  };

  if (!user) return null;

  return (
    <main className="bg-cream-bg min-h-screen">
      <Navbar />

      <div className="pt-32 pb-24 px-4 md:px-6 max-w-5xl mx-auto">
        {/* HEADER PROFILE */}
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
            <h1 className="text-3xl font-serif font-bold text-dark-green">
              {user.name}
            </h1>
            <p className="text-gray-500">{user.email}</p>
            <div className="flex items-center justify-center md:justify-start gap-2 mt-2">
              <span className="bg-sage-green/10 text-sage-green px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider">
                Member
              </span>
            </div>
          </div>
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
                  <h2 className="text-xl font-bold text-dark-green mb-6 border-b border-gray-100 pb-4">
                    Edit Personal Info
                  </h2>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">
                        Nama Lengkap
                      </label>
                      <input
                        type="text"
                        value={formData.name}
                        onChange={(e) =>
                          setFormData({ ...formData, name: e.target.value })
                        }
                        className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-sage-green focus:border-transparent transition-all"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">
                        Nomor HP
                      </label>
                      <input
                        type="tel"
                        value={formData.phone}
                        onChange={(e) =>
                          setFormData({ ...formData, phone: e.target.value })
                        }
                        className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-sage-green focus:border-transparent transition-all"
                      />
                    </div>
                    <div className="space-y-2 md:col-span-2">
                      <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">
                        Email Address
                      </label>
                      <input
                        type="email"
                        value={formData.email}
                        onChange={(e) =>
                          setFormData({ ...formData, email: e.target.value })
                        }
                        className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-sage-green focus:border-transparent transition-all opacity-70 cursor-not-allowed"
                        disabled // Email biasanya gabisa ganti sembarangan
                        title="Hubungi admin untuk ganti email"
                      />
                    </div>
                  </div>

                  <div className="pt-6 flex justify-end">
                    <button
                      type="submit"
                      disabled={isLoading}
                      className="bg-dark-green text-white px-8 py-3 rounded-full font-bold flex items-center gap-2 hover:bg-sage-green transition-all shadow-lg active:scale-95 disabled:opacity-50"
                    >
                      {isLoading ? (
                        "Menyimpan..."
                      ) : (
                        <>
                          <Save size={18} /> Simpan Perubahan
                        </>
                      )}
                    </button>
                  </div>
                </form>
              )}

              {activeTab === "address" && (
                <form onSubmit={handleSave} className="space-y-6">
                  <h2 className="text-xl font-bold text-dark-green mb-6 border-b border-gray-100 pb-4">
                    Atur Alamat
                  </h2>

                  <div className="space-y-2">
                    <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">
                      Label Alamat
                    </label>
                    <div className="flex gap-3">
                      {["Rumah", "Kantor", "Apartemen"].map((l) => (
                        <button
                          type="button"
                          key={l}
                          onClick={() => setFormData({ ...formData, label: l })}
                          className={`px-4 py-2 rounded-lg text-xs font-bold border transition-all ${
                            formData.label === l
                              ? "bg-sage-green text-white border-sage-green"
                              : "bg-white text-gray-500 border-gray-200 hover:border-sage-green"
                          }`}
                        >
                          {l}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">
                      Alamat Lengkap
                    </label>
                    <textarea
                      value={formData.street}
                      onChange={(e) =>
                        setFormData({ ...formData, street: e.target.value })
                      }
                      rows={3}
                      className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-sage-green focus:border-transparent transition-all resize-none"
                      placeholder="Nama jalan, nomor rumah, RT/RW..."
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">
                        Kota
                      </label>
                      <input
                        type="text"
                        value={formData.city}
                        onChange={(e) =>
                          setFormData({ ...formData, city: e.target.value })
                        }
                        className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-sage-green focus:border-transparent transition-all"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">
                        Provinsi
                      </label>
                      <input
                        type="text"
                        value={formData.province}
                        onChange={(e) =>
                          setFormData({ ...formData, province: e.target.value })
                        }
                        className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-sage-green focus:border-transparent transition-all"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">
                        Kode Pos
                      </label>
                      <input
                        type="text"
                        value={formData.zip}
                        onChange={(e) =>
                          setFormData({ ...formData, zip: e.target.value })
                        }
                        className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-sage-green focus:border-transparent transition-all"
                      />
                    </div>
                  </div>

                  <div className="pt-6 flex justify-end">
                    <button
                      type="submit"
                      disabled={isLoading}
                      className="bg-dark-green text-white px-8 py-3 rounded-full font-bold flex items-center gap-2 hover:bg-sage-green transition-all shadow-lg active:scale-95 disabled:opacity-50"
                    >
                      {isLoading ? (
                        "Menyimpan..."
                      ) : (
                        <>
                          <Save size={18} /> Update Alamat
                        </>
                      )}
                    </button>
                  </div>
                </form>
              )}


              {activeTab === "security" && (
                <div className="space-y-6">
                  <h2 className="text-xl font-bold text-dark-green mb-6 border-b border-gray-100 pb-4">
                    Ganti Password
                  </h2>

                  <div className="space-y-4">
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">
                        Password Lama
                      </label>
                      <input
                        type="password"
                        placeholder="••••••••"
                        className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-sage-green transition-all"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">
                        Password Baru
                      </label>
                      <input
                        type="password"
                        placeholder="••••••••"
                        className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-sage-green transition-all"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">
                        Konfirmasi Password Baru
                      </label>
                      <input
                        type="password"
                        placeholder="••••••••"
                        className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-sage-green transition-all"
                      />
                    </div>
                  </div>

                  <div className="pt-6 flex justify-end">
                    <button
                      onClick={() => {
                        setIsLoading(true);
                        setTimeout(() => {
                          setIsLoading(false);
                          showToast("Password berhasil diganti! 🔒", "success");
                        }, 1000);
                      }}
                      disabled={isLoading}
                      className="bg-dark-green text-white px-8 py-3 rounded-full font-bold flex items-center gap-2 hover:bg-sage-green transition-all shadow-lg active:scale-95 disabled:opacity-50"
                    >
                      {isLoading ? "Memproses..." : "Ganti Password"}
                    </button>
                  </div>
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
