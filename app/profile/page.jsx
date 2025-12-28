"use client";
import { useState, useEffect } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useAuth } from "@/app/context/AuthContext";
import { useToast } from "@/app/context/ToastContext";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { useOrder } from "@/app/context/OrderContext";
import Link from "next/link";
import {
  User,
  MapPin,
  Lock,
  LogOut,
  Camera,
  ChevronRight,
  Store,
  LayoutDashboard,
  Box,
  Package,
  ShoppingBag,
  Truck,
  CheckCircle2,
  Clock,
  AlertCircle
} from "lucide-react";

export default function ProfilePage() {
  const { user, logout, updateUser } = useAuth();
  const { showToast } = useToast();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("personal");
  const [orderFilter, setOrderFilter] = useState("all"); 
  
  const [isLoading, setIsLoading] = useState(false);
  const { orders } = useOrder();

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
      router.push("/");
    }
  }, [user, router]);

  const handleSave = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    await new Promise((r) => setTimeout(r, 800));

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
      router.push("/");
    }
  };

  if (!user) return null;

  const getRoleBadge = () => {
    if (user.role === "superadmin")
      return { label: "Super Admin", color: "bg-red-100 text-red-600" };
    if (user.role === "tenant")
      return {
        label: "Florist Partner",
        color: "bg-sage-green/20 text-dark-green",
      };
    return { label: "Member", color: "bg-gray-100 text-gray-500" };
  };

  const badge = getRoleBadge();

  // --- LOGIC WARNA STATUS BARU (LEBIH BEDA) ---
  const getStatusStyle = (status) => {
    switch (status) {
      case "payment_pending":
        return { color: "text-orange-600 bg-orange-50 border-orange-200", icon: Clock };
      case "waiting_approval": // Menunggu Konfirmasi (Kuning Emas)
        return { color: "text-yellow-700 bg-yellow-50 border-yellow-200", icon: AlertCircle };
      case "processing": // Sedang Diproses (Biru Langit/Teal)
        return { color: "text-blue-600 bg-blue-50 border-blue-200", icon: Box };
      case "revision": // Revisi (Merah)
        return { color: "text-rose-600 bg-rose-50 border-rose-200", icon: AlertCircle };
      case "on_delivery": // Dikirim (Ungu/Indigo)
        return { color: "text-indigo-600 bg-indigo-50 border-indigo-200", icon: Truck };
      case "completed": // Selesai (Hijau Sage)
        return { color: "text-emerald-700 bg-emerald-50 border-emerald-200", icon: CheckCircle2 };
      default:
        return { color: "text-gray-600 bg-gray-50 border-gray-200", icon: Box };
    }
  };

  const getStatusLabel = (status) => {
    switch (status) {
      case "payment_pending": return "Menunggu Pembayaran";
      case "waiting_approval": return "Menunggu Konfirmasi";
      case "processing": return "Sedang Diproses";
      case "revision": return "Perlu Revisi";
      case "on_delivery": return "Sedang Dikirim";
      case "completed": return "Selesai";
      default: return status;
    }
  };

  // --- LOGIC FILTER ORDER ---
  const getFilteredOrders = () => {
    if (orderFilter === "all") return orders;
    
    return orders.filter(o => {
        if (orderFilter === "packed") {
            // Group: Dikemas (Termasuk pending payment, approval, processing, revision)
            return ["payment_pending", "waiting_approval", "processing", "revision"].includes(o.status);
        }
        if (orderFilter === "shipped") {
            // Group: Dikirim
            return ["on_delivery"].includes(o.status);
        }
        if (orderFilter === "completed") {
            // Group: Selesai
            return ["completed"].includes(o.status);
        }
        return true;
    });
  };

  const filteredOrders = getFilteredOrders();

  return (
    <main className="bg-[#FDFBF7] min-h-screen">
      <Navbar />

      <div className="pt-32 pb-24 px-4 md:px-6 max-w-5xl mx-auto">
        {/* HEADER PROFILE */}
        <div className="flex flex-col md:flex-row items-center gap-6 mb-12 animate-in fade-in slide-in-from-bottom-4 duration-700">
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
            <div className="flex flex-col md:flex-row items-center gap-2 mt-3">
              <span
                className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${badge.color}`}
              >
                {badge.label}
              </span>

              {user.role === "tenant" && user.shop && (
                <span className="flex items-center gap-1 text-xs font-bold text-sage-green">
                  <Store size={14} /> {user.shop.name}
                </span>
              )}
            </div>
          </div>

          {(user.role === "tenant" || user.role === "superadmin") && (
            <button
              onClick={() =>
                router.push(
                  user.role === "tenant" ? "/admin/florist" : "/admin/super"
                )
              }
              className="md:ml-auto flex items-center gap-2 bg-dark-green text-white px-6 py-3 rounded-full font-bold text-sm hover:bg-sage-green transition shadow-lg"
            >
              <LayoutDashboard size={18} />
              Buka Dashboard Toko
            </button>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* SIDEBAR NAV */}
          <div className="md:col-span-1 space-y-2">
            {[
              { id: "personal", label: "Personal Info", icon: User },
              { id: "address", label: "Alamat Saya", icon: MapPin },
              { id: "security", label: "Keamanan", icon: Lock },
              { id: "order", label: "Pesanan Saya", icon: Package },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`w-full flex items-center justify-between p-4 rounded-2xl transition-all duration-300 font-bold text-sm ${
                  activeTab === tab.id
                    ? "bg-dark-green text-white shadow-lg shadow-green-900/10"
                    : "bg-white text-gray-500 hover:bg-white/60 hover:pl-5"
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

          {/* MAIN CONTENT AREA */}
          <div className="md:col-span-3">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3 }}
              className="bg-white p-8 rounded-[2rem] shadow-sm border border-gray-100 relative overflow-hidden min-h-[500px]"
            >
              {/* --- TAB PERSONAL INFO --- */}
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
                        className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-sage-green"
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
                        className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-sage-green"
                      />
                    </div>
                    <div className="space-y-2 md:col-span-2">
                      <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">
                        Email Address
                      </label>
                      <input
                        type="email"
                        value={formData.email}
                        disabled
                        className="w-full bg-gray-100 border border-gray-200 rounded-xl px-4 py-3 text-gray-400 cursor-not-allowed"
                      />
                    </div>
                  </div>
                  <div className="pt-6 flex justify-end">
                    <button
                      type="submit"
                      disabled={isLoading}
                      className="bg-dark-green text-white px-8 py-3 rounded-full font-bold hover:bg-sage-green transition shadow-lg"
                    >
                      {isLoading ? "Menyimpan..." : "Simpan Perubahan"}
                    </button>
                  </div>
                </form>
              )}

              {/* --- TAB ALAMAT --- */}
              {activeTab === "address" && (
                <form onSubmit={handleSave} className="space-y-6">
                  <h2 className="text-xl font-bold text-dark-green mb-6 border-b border-gray-100 pb-4">
                    Atur Alamat Pribadi
                  </h2>
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
                      className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-sage-green"
                    />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <input
                      type="text"
                      placeholder="Kota"
                      value={formData.city}
                      onChange={(e) =>
                        setFormData({ ...formData, city: e.target.value })
                      }
                      className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3"
                    />
                    <input
                      type="text"
                      placeholder="Provinsi"
                      value={formData.province}
                      onChange={(e) =>
                        setFormData({ ...formData, province: e.target.value })
                      }
                      className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3"
                    />
                    <input
                      type="text"
                      placeholder="Kode Pos"
                      value={formData.zip}
                      onChange={(e) =>
                        setFormData({ ...formData, zip: e.target.value })
                      }
                      className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3"
                    />
                  </div>
                  <div className="pt-6 flex justify-end">
                    <button
                      type="submit"
                      disabled={isLoading}
                      className="bg-dark-green text-white px-8 py-3 rounded-full font-bold hover:bg-sage-green transition shadow-lg"
                    >
                      {isLoading ? "Menyimpan..." : "Update Alamat"}
                    </button>
                  </div>
                </form>
              )}

              {/* --- TAB SECURITY --- */}
              {activeTab === "security" && (
                <div className="space-y-6">
                  <h2 className="text-xl font-bold text-dark-green mb-6 border-b border-gray-100 pb-4">
                    Ganti Password
                  </h2>
                  <p className="text-gray-500">
                    Fitur ini belum tersedia di demo.
                  </p>
                </div>
              )}
              
              {/* --- TAB ORDER (UPDATED ARTSY UI) --- */}
              {activeTab === "order" && (
                <div className="space-y-6">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6 border-b border-gray-100 pb-4">
                      <h2 className="text-xl font-serif font-bold text-dark-green flex items-center gap-2">
                        <Package size={22} className="text-sage-green" /> Riwayat Pesanan
                      </h2>
                      
                      {/* FILTER TABS */}
                      <div className="flex bg-gray-50 p-1 rounded-full border border-gray-200">
                          {["all", "packed", "shipped", "completed"].map((filter) => (
                              <button
                                key={filter}
                                onClick={() => setOrderFilter(filter)}
                                className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all ${
                                    orderFilter === filter 
                                    ? "bg-dark-green text-white shadow-md" 
                                    : "text-gray-500 hover:text-dark-green"
                                }`}
                              >
                                {filter === "all" ? "Semua" : 
                                 filter === "packed" ? "Dikemas" :
                                 filter === "shipped" ? "Dikirim" : "Selesai"}
                              </button>
                          ))}
                      </div>
                  </div>

                  {filteredOrders.length === 0 ? (
                    <div className="text-center py-20 bg-gray-50/50 rounded-3xl border-2 border-dashed border-gray-200">
                      <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto mb-3 text-3xl shadow-sm">
                        🥀
                      </div>
                      <h3 className="font-bold text-gray-700">
                        {orderFilter === "all" ? "Belum ada pesanan" : "Tidak ada pesanan di status ini"}
                      </h3>
                      <p className="text-gray-400 text-sm mb-6">
                        Cek tab lain atau mulai belanja sekarang.
                      </p>
                      <Link
                        href="/toko"
                        className="px-6 py-2 bg-dark-green text-white rounded-full text-sm font-bold hover:bg-sage-green transition shadow-md"
                      >
                        Mulai Belanja
                      </Link>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 gap-4 max-h-[600px] overflow-y-auto custom-scrollbar pr-2">
                      <AnimatePresence>
                      {filteredOrders.map((order) => {
                        const statusStyle = getStatusStyle(order.status);
                        const StatusIcon = statusStyle.icon;

                        return (
                        <motion.div
                          key={order.id}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, scale: 0.95 }}
                          transition={{ duration: 0.2 }}
                        >
                        <Link href={`/orders/${order.id}`} className="block group">
                          <div className="bg-white border border-gray-100 rounded-3xl p-5 hover:border-sage-green hover:shadow-lg hover:shadow-green-900/5 transition-all duration-300 relative overflow-hidden">
                            {/* Decorative Background Accent */}
                            <div className="absolute top-0 right-0 w-24 h-24 bg-gray-50 rounded-bl-[4rem] -mr-4 -mt-4 transition-colors group-hover:bg-sage-green/10"></div>

                            {/* Header Card */}
                            <div className="flex justify-between items-start mb-4 relative z-10">
                              <div className="flex flex-col">
                                <span className="font-mono text-[10px] text-gray-400 uppercase tracking-widest mb-1">
                                  ID: {order.id}
                                </span>
                                <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold border w-fit ${statusStyle.color}`}>
                                  <StatusIcon size={12}/>
                                  {getStatusLabel(order.status)}
                                </span>
                              </div>
                              <span className="text-[10px] text-gray-400 font-medium bg-white/80 px-2 py-1 rounded-lg backdrop-blur-sm">
                                {order.date}
                              </span>
                            </div>

                            {/* Divider Artsy */}
                            <div className="h-px w-full bg-gradient-to-r from-transparent via-gray-200 to-transparent mb-4"></div>

                            {/* Body Card */}
                            <div className="flex justify-between items-center relative z-10">
                              <div className="flex items-center gap-4">
                                <div className="w-12 h-12 rounded-2xl bg-cream-bg flex items-center justify-center text-dark-green border border-gray-100 shadow-sm group-hover:scale-105 transition-transform">
                                  <ShoppingBag size={20} />
                                </div>
                                <div>
                                  <h4 className="font-serif font-bold text-gray-800 text-base group-hover:text-dark-green transition-colors line-clamp-1">
                                    {order.items && order.items[0]
                                      ? order.items[0].title || order.items[0].name
                                      : "Custom Bouquet"}
                                  </h4>
                                  <p className="text-xs text-gray-400 mt-0.5">
                                    {order.items && order.items.length > 1
                                      ? `+${order.items.length - 1} item lainnya`
                                      : "Single Item"}
                                  </p>
                                </div>
                              </div>

                              <div className="text-right">
                                <p className="text-[10px] text-gray-400 uppercase tracking-wider mb-0.5">Total</p>
                                <p className="font-bold text-dark-green text-sm font-sans">
                                  {(
                                    order.financials?.payNowTotal ||
                                    order.totalPrice ||
                                    0
                                  ).toLocaleString("id-ID", {
                                    style: "currency",
                                    currency: "IDR",
                                  })}
                                </p>
                              </div>
                            </div>
                          </div>
                        </Link>
                        </motion.div>
                      )})}
                      </AnimatePresence>
                    </div>
                  )}
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