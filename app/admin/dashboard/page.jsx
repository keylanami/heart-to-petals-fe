"use client";
import { useState } from "react";
import { 
  LayoutDashboard, Package, Palette, ShoppingBag, Plus, Check, X, DollarSign, Search
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useToast } from "@/app/context/ToastContext";
import { useOrder } from "@/app/context/OrderContext"; // 👈 Pake Order Context
import { useInventory } from "@/app/context/InventoryContext"; // 👈 Pake Inventory Context

export default function FloristAdminPage() {
  const [activeTab, setActiveTab] = useState("overview");
  const { showToast } = useToast();
  
  // AMBIL DATA DARI CONTEXT (REALTIME)
  const { orders, updateOrderStatus } = useOrder();
  const { inventory, updateStock, addItem } = useInventory();

  // Filter Order sesuai Shop ID (Simulasi kita login sebagai Shop ID 1)
  // Karena data dummy cart user belum ada shopID yang konsisten, kita tampilin semua dulu aja buat demo.
  const myOrders = orders; 

  // State Modal Tambah Produk
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [newProduct, setNewProduct] = useState({ title: "", type: "flower", price: "", stock: "" });

  const handleAddProduct = (e) => {
    e.preventDefault();
    addItem({
        ...newProduct,
        price: parseInt(newProduct.price),
        stock: parseInt(newProduct.stock),
        category: "New"
    });
    setIsAddModalOpen(false);
    setNewProduct({ title: "", type: "flower", price: "", stock: "" });
    showToast("Item berhasil ditambahkan!", "success");
  };

  // --- VIEWS ---

  const OverviewView = () => {
    const totalRevenue = myOrders
        .filter(o => o.status === "Completed")
        .reduce((acc, curr) => acc + (curr.total || 0), 0);
    
    return (
      <div className="space-y-6">
        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
             <div className="flex items-center gap-4">
               <div className="p-3 bg-green-100 text-green-600 rounded-full"><DollarSign/></div>
               <div>
                 <p className="text-gray-500 text-xs font-bold uppercase">Pendapatan</p>
                 <h3 className="text-2xl font-bold text-dark-green">
                   {new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", maximumSignificantDigits: 3 }).format(totalRevenue)}
                 </h3>
               </div>
             </div>
          </div>
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
             <div className="flex items-center gap-4">
               <div className="p-3 bg-blue-100 text-blue-600 rounded-full"><ShoppingBag/></div>
               <div>
                 <p className="text-gray-500 text-xs font-bold uppercase">Total Order</p>
                 <h3 className="text-2xl font-bold text-dark-green">{myOrders.length}</h3>
               </div>
             </div>
          </div>
        </div>

        {/* Log Penjualan */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <h3 className="font-bold text-dark-green mb-4">Log Penjualan Live</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="text-xs text-gray-500 uppercase bg-gray-50 border-b">
                <tr>
                  <th className="px-4 py-3">ID</th>
                  <th className="px-4 py-3">Customer</th>
                  <th className="px-4 py-3">Items</th>
                  <th className="px-4 py-3">Total</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3">Date</th>
                </tr>
              </thead>
              <tbody>
                {myOrders.length === 0 ? (
                    <tr><td colSpan="6" className="text-center py-4 text-gray-400">Belum ada penjualan.</td></tr>
                ) : (
                    myOrders.map((order) => (
                    <tr key={order.id} className="border-b hover:bg-gray-50">
                        <td className="px-4 py-3 font-bold">#{order.id.toString().slice(-4)}</td>
                        <td className="px-4 py-3">{order.customer}</td>
                        <td className="px-4 py-3 text-xs text-gray-500">
                            {order.items.map(i => i.title).join(", ")}
                        </td>
                        <td className="px-4 py-3 font-medium">
                        {new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", maximumSignificantDigits: 3 }).format(order.total)}
                        </td>
                        <td className="px-4 py-3">
                        <span className={`px-2 py-1 rounded-full text-[10px] font-bold uppercase 
                            ${order.status === 'Completed' ? 'bg-green-100 text-green-600' : 
                            order.status === 'Pending Approval' ? 'bg-yellow-100 text-yellow-600' : 
                            'bg-red-100 text-red-600'}`}>
                            {order.status}
                        </span>
                        </td>
                        <td className="px-4 py-3 text-gray-500">{order.date}</td>
                    </tr>
                    ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    );
  };

  const RequestsView = () => {
    // Filter yang statusnya Pending Approval
    const pendingOrders = myOrders.filter(o => o.status === "Pending Approval");

    return (
      <div className="space-y-6">
        <h2 className="text-2xl font-bold text-dark-green">Approval Custom Bouquet</h2>
        {pendingOrders.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-2xl border border-dashed border-gray-200">
            <p className="text-gray-400">Aman! Tidak ada permintaan custom baru.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4">
            {pendingOrders.map((order) => (
              <motion.div 
                key={order.id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col md:flex-row justify-between gap-6"
              >
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <span className="bg-purple-100 text-purple-600 text-[10px] font-bold px-2 py-1 rounded">REQ #{order.id}</span>
                    <span className="text-xs text-gray-400">{order.date}</span>
                  </div>
                  <h3 className="text-lg font-bold text-dark-green">{order.customer}</h3>
                  <div className="mt-2 text-sm text-gray-600 bg-gray-50 p-3 rounded-lg border border-gray-100">
                    <p className="font-bold mb-1">Items:</p>
                    <ul className="list-disc list-inside">
                        {order.items.map((item, idx) => (
                            <li key={idx}>{item.title} (x{item.qty || 1})</li>
                        ))}
                    </ul>
                  </div>
                </div>
                
                <div className="flex flex-row md:flex-col justify-center gap-3 min-w-[140px]">
                  <button 
                    onClick={() => {
                        updateOrderStatus(order.id, "Completed"); // Set jadi Accepted/Completed
                        showToast("Pesanan diterima!", "success");
                    }}
                    className="flex-1 bg-dark-green text-white px-4 py-2 rounded-lg text-sm font-bold hover:bg-sage-green transition flex items-center justify-center gap-2"
                  >
                    <Check size={16} /> Setujui
                  </button>
                  <button 
                    onClick={() => {
                        updateOrderStatus(order.id, "Rejected");
                        showToast("Pesanan ditolak.", "error");
                    }}
                    className="flex-1 border border-red-200 text-red-500 px-4 py-2 rounded-lg text-sm font-bold hover:bg-red-50 transition flex items-center justify-center gap-2"
                  >
                    <X size={16} /> Tolak
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    );
  };

  const InventoryView = () => (
    <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-bold text-dark-green">Stok Bouquet & Bunga</h2>
          <button 
            onClick={() => setIsAddModalOpen(true)}
            className="bg-dark-green text-white px-4 py-2 rounded-lg font-bold text-sm flex items-center gap-2 hover:bg-sage-green transition shadow-lg"
          >
            <Plus size={18} /> Tambah Item
          </button>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <table className="w-full text-sm text-left">
            <thead className="text-xs text-gray-500 uppercase bg-gray-50 border-b">
              <tr>
                <th className="px-6 py-4">Nama Item</th>
                <th className="px-6 py-4">Tipe</th>
                <th className="px-6 py-4">Stok</th>
                <th className="px-6 py-4 text-center">Update</th>
              </tr>
            </thead>
            <tbody>
              {inventory.map((item) => (
                <tr key={item.id} className="border-b hover:bg-gray-50">
                  <td className="px-6 py-4 font-bold text-dark-green">{item.title || item.name}</td>
                  <td className="px-6 py-4">
                    <span className="bg-gray-100 text-gray-600 px-2 py-1 rounded text-xs capitalize">
                        {item.type || "Product"}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`font-bold ${!item.stock || item.stock < 5 ? "text-red-500" : "text-dark-green"}`}>
                        {item.stock || 0}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <div className="flex justify-center gap-3">
                      <button onClick={() => updateStock(item.id, -1)} className="w-8 h-8 rounded bg-gray-100 hover:bg-gray-200 font-bold">-</button>
                      <button onClick={() => updateStock(item.id, 1)} className="w-8 h-8 rounded bg-dark-green text-white hover:bg-sage-green font-bold">+</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
    </div>
  );

  return (
    <div className="bg-gray-50 min-h-screen font-sans flex">
      {/* SIDEBAR */}
      <aside className="w-64 bg-white border-r border-gray-200 fixed h-full z-10 hidden md:block">
        <div className="p-6 border-b border-gray-100">
          <h1 className="font-serif font-bold text-xl text-dark-green">Florist Admin</h1>
        </div>
        <nav className="p-4 space-y-2">
          <button onClick={() => setActiveTab("overview")} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold transition ${activeTab === "overview" ? "bg-dark-green text-white" : "text-gray-500 hover:bg-gray-50"}`}>
            <LayoutDashboard size={18} /> Overview
          </button>
          <button onClick={() => setActiveTab("requests")} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold transition ${activeTab === "requests" ? "bg-dark-green text-white" : "text-gray-500 hover:bg-gray-50"}`}>
            <Palette size={18} /> Custom Requests
          </button>
          <button onClick={() => setActiveTab("inventory")} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold transition ${activeTab === "inventory" ? "bg-dark-green text-white" : "text-gray-500 hover:bg-gray-50"}`}>
            <Package size={18} /> Inventory
          </button>
        </nav>
      </aside>

      {/* MAIN */}
      <main className="flex-1 md:ml-64 p-8">
        <div className="mb-8"><h1 className="text-2xl font-bold capitalize">{activeTab}</h1></div>
        <motion.div key={activeTab} initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            {activeTab === "overview" && <OverviewView />}
            {activeTab === "requests" && <RequestsView />}
            {activeTab === "inventory" && <InventoryView />}
        </motion.div>
      </main>

      {/* MODAL ADD PRODUCT */}
      <AnimatePresence>
        {isAddModalOpen && (
          <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center backdrop-blur-sm">
            <div className="bg-white p-6 rounded-2xl w-full max-w-md shadow-2xl">
                <h3 className="font-bold text-lg mb-4">Tambah Stok / Varian Bunga</h3>
                <form onSubmit={handleAddProduct} className="space-y-3">
                    <input required placeholder="Nama Item" className="w-full border p-2 rounded" 
                        value={newProduct.title} onChange={e => setNewProduct({...newProduct, title: e.target.value})} />
                    <select className="w-full border p-2 rounded" value={newProduct.type} onChange={e => setNewProduct({...newProduct, type: e.target.value})}>
                        <option value="flower">Bunga (Flower)</option>
                        <option value="filler">Filler/Daun</option>
                        <option value="product">Bouquet Jadi</option>
                    </select>
                    <input required type="number" placeholder="Harga" className="w-full border p-2 rounded" 
                        value={newProduct.price} onChange={e => setNewProduct({...newProduct, price: e.target.value})} />
                    <input required type="number" placeholder="Stok Awal" className="w-full border p-2 rounded" 
                        value={newProduct.stock} onChange={e => setNewProduct({...newProduct, stock: e.target.value})} />
                    
                    <div className="flex gap-2 pt-2">
                        <button type="button" onClick={() => setIsAddModalOpen(false)} className="flex-1 py-2 bg-gray-200 rounded font-bold">Batal</button>
                        <button type="submit" className="flex-1 py-2 bg-dark-green text-white rounded font-bold">Simpan</button>
                    </div>
                </form>
            </div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}