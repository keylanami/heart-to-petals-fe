"use client";
import { useState, useEffect } from "react";
import { 
  LayoutGrid, Map, Store, Check, X, Trash2, Search, MapPin, TrendingUp, Users, AlertCircle
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useToast } from "@/app/context/ToastContext";
import { useRouter } from "next/navigation";

export default function SuperAdminPage() {
  const [activeTab, setActiveTab] = useState("requests"); 
  const { showToast } = useToast();
  const router = useRouter();

  const [tenants, setTenants] = useState([]);
  const [pendingTenants, setPendingTenants] = useState([]);

  const loadData = () => {
    if (typeof window !== "undefined") {
      const rawUsers = localStorage.getItem("users");
      if (rawUsers) {
        const allUsers = JSON.parse(rawUsers);
        
        const active = allUsers.filter(u => u.role === "tenant" && u.status === "active").map((u, i) => ({
            ...u,
            x: u.shop?.x || 20 + (i * 15) % 80, 
            y: u.shop?.y || 30 + (i * 20) % 60
        }));
        
        const pending = allUsers.filter(u => u.role === "tenant" && u.status === "pending");

        setTenants(active);
        setPendingTenants(pending);
      }
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleApprove = (email) => {
    const rawUsers = JSON.parse(localStorage.getItem("users"));
    const updatedUsers = rawUsers.map(u => {
        if (u.email === email) {
            return { ...u, status: "active" }; 
        }
        return u;
    });

    localStorage.setItem("users", JSON.stringify(updatedUsers));
    loadData(); // Reload state
    showToast("Tenant berhasil disetujui! Mereka sekarang bisa login.", "success");
  };


  const handleReject = (email) => {
    if(!window.confirm("Yakin tolak dan hapus pendaftaran ini?")) return;

    const rawUsers = JSON.parse(localStorage.getItem("users"));
    const updatedUsers = rawUsers.filter(u => u.email !== email); 

    localStorage.setItem("users", JSON.stringify(updatedUsers));
    loadData();
    showToast("Pendaftaran tenant ditolak.", "error");
  };


  const RequestsView = () => (
    <div className="space-y-6">
        <h2 className="text-2xl font-serif font-bold text-dark-green flex items-center gap-2">
            Incoming Tenant Requests 
            {pendingTenants.length > 0 && (
                <span className="bg-red-500 text-white text-xs px-2 py-1 rounded-full">{pendingTenants.length}</span>
            )}
        </h2>

        {pendingTenants.length === 0 ? (
            <div className="text-center py-20 bg-white rounded-2xl border border-dashed border-gray-200">
                <p className="text-gray-400">Tidak ada pendaftaran baru saat ini.</p>
            </div>
        ) : (
            <div className="grid grid-cols-1 gap-4">
                {pendingTenants.map((t) => (
                    <motion.div 
                        key={t.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="bg-white p-6 rounded-2xl shadow-sm border-l-4 border-amber-400 flex flex-col md:flex-row justify-between items-start md:items-center gap-4"
                    >
                        <div>
                            <div className="flex items-center gap-2 mb-1">
                                <h3 className="font-bold text-lg text-dark-green">{t.shop?.name || "Nama Toko"}</h3>
                                <span className="bg-yellow-100 text-yellow-700 text-[10px] px-2 py-0.5 rounded font-bold uppercase">Pending</span>
                            </div>
                            <p className="text-sm text-gray-600 flex items-center gap-1">
                                <Users size={14}/> Owner: {t.name}
                            </p>
                            <p className="text-sm text-gray-500 flex items-center gap-1">
                                <MapPin size={14}/> Lokasi: {t.shop?.location}
                            </p>
                            <p className="text-xs text-gray-400 mt-1">{t.email}</p>
                        </div>

                        <div className="flex gap-3 w-full md:w-auto">
                            <button 
                                onClick={() => handleApprove(t.email)}
                                className="flex-1 md:flex-none px-6 py-2 bg-dark-green text-white rounded-lg font-bold text-sm hover:bg-sage-green transition flex items-center justify-center gap-2 shadow-lg"
                            >
                                <Check size={16} /> Approve
                            </button>
                            <button 
                                onClick={() => handleReject(t.email)}
                                className="flex-1 md:flex-none px-6 py-2 border border-red-200 text-red-500 rounded-lg font-bold text-sm hover:bg-red-50 transition flex items-center justify-center gap-2"
                            >
                                <X size={16} /> Reject
                            </button>
                        </div>
                    </motion.div>
                ))}
            </div>
        )}
    </div>
  );

  const ActiveTenantsView = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-serif font-bold text-dark-green">Active Florist Partners</h2>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <table className="w-full text-sm text-left">
          <thead className="text-xs text-gray-500 uppercase bg-gray-50 border-b border-gray-400">
            <tr>
              <th className="px-6 py-4">Nama Toko</th>
              <th className="px-6 py-4">Owner</th>
              <th className="px-6 py-4">Lokasi</th>
              <th className="px-6 py-4">Status</th>
              <th className="px-6 py-4 text-center">Aksi</th>
            </tr>
          </thead>
          <tbody>
            {tenants.length === 0 ? (
                <tr><td colSpan="5" className="text-center py-8 text-gray-400">Belum ada tenant aktif.</td></tr>
            ) : (
                tenants.map((shop) => (
                <tr key={shop.id} className="border-b border-gray-200 hover:bg-gray-50">
                    <td className="px-6 py-4 font-bold text-dark-green flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-sage-green/20 flex items-center justify-center text-dark-green font-bold">
                        {shop.shop?.name?.charAt(0)}
                    </div>
                    {shop.shop?.name}
                    </td>
                    <td className="px-6 py-4">{shop.name}</td>
                    <td className="px-6 py-4">{shop.shop?.location}</td>
                    <td className="px-6 py-4">
                    <span className="bg-green-100 text-green-600 px-2 py-1 rounded-full text-xs font-bold flex items-center gap-1 w-fit">
                        <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"/> Active
                    </span>
                    </td>
                    <td className="px-6 py-4 text-center">
                    <button onClick={() => handleReject(shop.email)} className="p-2 text-red-500 hover:bg-red-50 rounded-full" title="Hapus Akses">
                        <Trash2 size={16} />
                    </button>
                    </td>
                </tr>
                ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );

  const MapView = () => (
    <div className="space-y-6">
      <h2 className="text-2xl font-serif font-bold text-dark-green">Live Map Visualization</h2>
      
      <div className="relative w-full h-[500px] bg-[#E5F0EC] rounded-3xl overflow-hidden border border-sage-green/20 shadow-inner group">
        <div className="absolute inset-0 opacity-10 pointer-events-none" 
             style={{ backgroundImage: "radial-gradient(#1A2F24 1px, transparent 1px)", backgroundSize: "24px 24px" }}>
        </div>
        
        <div className="absolute top-20 left-20 w-64 h-64 bg-white/40 rounded-full blur-3xl"></div>
        <div className="absolute bottom-10 right-10 w-80 h-80 bg-green-200/30 rounded-full blur-3xl"></div>

        {tenants.map((shop) => (
          <motion.div
            key={shop.id}
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="absolute cursor-pointer flex flex-col items-center group/marker"
            style={{ left: `${shop.x}%`, top: `${shop.y}%` }}
            whileHover={{ scale: 1.2, zIndex: 10 }}
          >
            <div className="absolute bottom-full mb-3 bg-white px-4 py-2 rounded-xl shadow-xl text-xs font-bold whitespace-nowrap opacity-0 group-hover/marker:opacity-100 transition-opacity pointer-events-none z-20 flex items-center gap-2 transform translate-y-2 group-hover/marker:translate-y-0 duration-200">
               <Store size={14} className="text-sage-green"/>
               <div>
                 <p className="text-dark-green font-bold text-sm">{shop.shop?.name}</p>
                 <p className="text-[10px] text-gray-400 font-normal">{shop.shop?.location}</p>
               </div>
               <div className="absolute top-full left-1/2 -translate-x-1/2 w-0 h-0 border-l-[6px] border-l-transparent border-r-[6px] border-r-transparent border-t-[6px] border-t-white"></div>
            </div>

        
            <div className="relative">
                <MapPin size={36} className="text-red-500 drop-shadow-lg fill-red-500" />
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-4 h-4 bg-white rounded-full flex items-center justify-center -mt-1">
                    <Store size={10} className="text-red-500"/>
                </div>
            </div>
            
            <div className="absolute top-full left-1/2 -translate-x-1/2 -mt-1">
                <div className="w-8 h-8 bg-red-500/20 rounded-full animate-ping" />
            </div>
          </motion.div>
        ))}

        <div className="absolute bottom-6 left-6 bg-white/90 backdrop-blur px-4 py-2 rounded-xl text-xs font-bold text-dark-green shadow-lg border border-white flex items-center gap-2">
           <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
           Live Monitoring: {tenants.length} Active Stores
        </div>
      </div>
    </div>
  );

  return (
    <div className="bg-cream-bg min-h-screen font-sans flex">
      <aside className="w-64 bg-white border-r border-gray-200 fixed h-full z-10 hidden md:block">
        <div className="p-6 border-b border-gray-100">
          <h1 className="font-serif font-bold text-xl text-dark-green">Super Admin</h1>
          <p className="text-xs text-gray-400 mt-1">Platform Manager</p>
        </div>
        <nav className="p-4 space-y-2">
          <button 
            onClick={() => setActiveTab("requests")}
            className={`w-full flex items-center justify-between px-4 py-3 rounded-xl text-sm font-bold transition-all ${activeTab === "requests" ? "bg-dark-green text-white shadow-md" : "text-gray-500 hover:bg-gray-50"}`}
          >
            <div className="flex items-center gap-3"><AlertCircle size={18} /> Requests</div>
            {pendingTenants.length > 0 && (
                <span className="bg-red-500 text-white text-[10px] px-2 py-0.5 rounded-full">{pendingTenants.length}</span>
            )}
          </button>

          <button 
            onClick={() => setActiveTab("active")}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold transition-all ${activeTab === "active" ? "bg-dark-green text-white shadow-md" : "text-gray-500 hover:bg-gray-50"}`}
          >
            <Store size={18} /> Active Tenants
          </button>
          
          <button 
            onClick={() => setActiveTab("map")}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold transition-all ${activeTab === "map" ? "bg-dark-green text-white shadow-md" : "text-gray-500 hover:bg-gray-50"}`}
          >
            <Map size={18} /> Live Map
          </button>
        </nav>
      </aside>


      <main className="flex-1 md:ml-64 p-8">
        <div className="flex justify-between items-center mb-8">
            <div>
                <h1 className="text-2xl font-bold text-gray-800 capitalize">
                    {activeTab === 'requests' ? 'Registration Requests' : activeTab === 'active' ? 'Active Tenants' : 'Coverage Map'}
                </h1>
                <p className="text-sm text-gray-500">Superadmin Control Panel</p>
            </div>
            <div className="flex items-center gap-3">
                <span className="text-xs text-right hidden sm:block">
                    <p className="font-bold text-dark-green">Administrator</p>
                    <p className="text-gray-400">super@admin.com</p>
                </span>
                <div className="w-10 h-10 bg-gradient-to-br from-dark-green to-sage-green rounded-full flex items-center justify-center text-white font-bold shadow-lg border-2 border-white">
                    SA
                </div>
            </div>
        </div>

        <motion.div
          key={activeTab}
          initial={{ opacity: 0, x: 10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3 }}
        >
          {activeTab === "requests" && <RequestsView />}
          {activeTab === "active" && <ActiveTenantsView />}
          {activeTab === "map" && <MapView />}
        </motion.div>
      </main>
    </div>
  );
}