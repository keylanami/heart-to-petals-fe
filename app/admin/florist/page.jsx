"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  LayoutDashboard,
  Package,
  Palette,
  ShoppingBag,
  Plus,
  Check,
  X,
  DollarSign,
  User,
  ArrowLeft,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useToast } from "@/app/context/ToastContext";
import { useOrder } from "@/app/context/OrderContext";
import { useInventory } from "@/app/context/InventoryContext";
import { useAuth } from "@/app/context/AuthContext";

export default function FloristAdminPage() {
  // --- 1. DECLARE ALL HOOKS ---
  const [activeTab, setActiveTab] = useState("overview");
  const { showToast } = useToast();
  const router = useRouter();

  const { user } = useAuth();
  const { orders, updateOrderStatus } = useOrder();
  const { inventory, addItem, updateStock } = useInventory();

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [newProduct, setNewProduct] = useState({
    title: "",
    type: "flower",
    price: "",
    stock: "",
  });
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // --- 2. REDIRECT LOGIC ---
  useEffect(() => {
    if (mounted && user && user.role !== "tenant") {
      router.push("/");
    }
  }, [user, router, mounted]);

  // --- 3. DATA PROCESSING ---
  const SHOP_ID = user?.shop?.id;

  // Filter Orders: Hanya tampilkan order yang mengandung item dari toko ini
  const myOrders = SHOP_ID
    ? orders.filter(
        (order) =>
          order.items &&
          order.items.some((item) => String(item.shop?.id) === String(SHOP_ID))
      )
    : [];

  // Filter Inventory: Hanya tampilkan item milik toko ini
  const myInventory = SHOP_ID
    ? inventory.filter((item) => String(item.shopId) === String(SHOP_ID))
    : [];

  // --- 4. HANDLERS ---
  const handleAddProduct = (e) => {
    e.preventDefault();
    if (!SHOP_ID) return;

    addItem({
      ...newProduct,
      id: Date.now(),
      shopId: SHOP_ID,
      shop: { name: user.shop.name, id: SHOP_ID, location: user.shop.location },
      price: parseInt(newProduct.price),
      stock: parseInt(newProduct.stock),
      category: "New",
      image:
        "https://images.unsplash.com/photo-1596073419667-9d77d59f033f?auto=format&fit=crop&q=80&w=300",
    });
    setIsAddModalOpen(false);
    setNewProduct({ title: "", type: "flower", price: "", stock: "" });
    showToast("Item berhasil ditambahkan!", "success");
  };

  const handleApproveOrder = (orderId) => {
    updateOrderStatus(orderId, "approved"); 
    showToast("Pesanan disetujui.", "success");
  };

  const handleRejectOrder = (orderId) => {
    updateOrderStatus(orderId, "cancelled");
    showToast("Pesanan ditolak.", "error");
  };

  // --- 5. RENDER GUARD ---
  if (!mounted) return null;

  if (!user || !user.shop) {
    return (
      <div className="min-h-screen bg-cream-bg flex items-center justify-center text-gray-400">
        hmmm kayaknya km harus login dulu! atau daftar sebagai tenants :D
      </div>
    );
  }

  // --- 6. VIEW COMPONENTS ---

  const OverviewView = () => {
    const totalRevenue = myOrders
      .filter((o) => o.status === "completed") 
      .reduce((acc, order) => {
        const shopSubtotal = order.items
          .filter((i) => String(i.shop?.id) === String(SHOP_ID))
          .reduce((sum, i) => sum + i.price * (i.qty || 1), 0);
        return acc + shopSubtotal;
      }, 0);

    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-green-100 text-green-600 rounded-full">
                <DollarSign />
              </div>
              <div>
                <p className="text-gray-500 text-xs font-bold uppercase">
                  Pendapatan Toko
                </p>
                <h3 className="text-2xl font-bold text-dark-green">
                  {new Intl.NumberFormat("id-ID", {
                    style: "currency",
                    currency: "IDR",
                    maximumSignificantDigits: 3,
                  }).format(totalRevenue)}
                </h3>
              </div>
            </div>
          </div>
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-blue-100 text-blue-600 rounded-full">
                <ShoppingBag />
              </div>
              <div>
                <p className="text-gray-500 text-xs font-bold uppercase">
                  Total Transaksi
                </p>
                <h3 className="text-2xl font-bold text-dark-green">
                  {myOrders.length}
                </h3>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <h3 className="font-bold text-dark-green mb-4">
            Log Penjualan ({user.shop.name})
          </h3>
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="text-xs text-gray-500 uppercase bg-gray-50 border-b">
                <tr>
                  <th className="px-4 py-3">ID Order</th>
                  <th className="px-4 py-3">Customer</th>
                  <th className="px-4 py-3">Item (Toko Ini)</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3">Date</th>
                </tr>
              </thead>
              <tbody>
                {myOrders.length === 0 ? (
                  <tr>
                    <td colSpan="5" className="text-center py-4 text-gray-400">
                      Belum ada penjualan.
                    </td>
                  </tr>
                ) : (
                  myOrders.map((order) => {
                    const myItems = order.items.filter(
                      (i) => String(i.shop?.id) === String(SHOP_ID)
                    );
                    return (
                      <tr
                        key={order.id}
                        className="border-b border-gray-100 hover:bg-gray-50"
                      >
                        <td className="px-4 py-3 font-bold font-mono">
                          #{order.id}
                        </td>
                        <td className="px-4 py-3">{order.customer}</td>
                        <td className="px-4 py-3 text-xs text-gray-500">
                          {myItems
                            .map((i) => `${i.title} (x${i.qty || 1})`)
                            .join(", ")}
                        </td>
                        <td className="px-4 py-3">
                          <span
                            className={`px-2 py-1 rounded-full text-[10px] font-bold uppercase 
                                ${
                                  order.status === "completed"
                                    ? "bg-green-100 text-green-600"
                                    : order.status === "waiting_approval"
                                    ? "bg-yellow-100 text-yellow-600"
                                    : "bg-gray-100 text-gray-600"
                                }`}
                          >
                            {order.status}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-gray-500">
                          {order.date}
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    );
  };

  const RequestsView = () => {
    const pendingOrders = myOrders.filter(
      (o) => o.status === "waiting_approval" || o.status === "processing"
    );

    return (
      <div className="space-y-6">
        <h2 className="text-2xl font-bold text-dark-green">Pesanan Masuk</h2>
        {pendingOrders.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-2xl border border-dashed border-gray-200">
            <p className="text-gray-400">
              Tidak ada pesanan baru yang perlu diproses.
            </p>
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
                    <span className="bg-purple-100 text-purple-600 text-[10px] font-bold px-2 py-1 rounded">
                      ORD #{order.id}
                    </span>
                    <span className="text-xs text-gray-400">{order.date}</span>
                  </div>
                  <h3 className="text-lg font-bold text-dark-green">
                    {order.customer}
                  </h3>
                  <div className="mt-2 text-sm text-gray-600 bg-gray-50 p-3 rounded-lg border border-gray-100">
                    <p className="font-bold mb-1">Items:</p>
                    <ul className="list-disc list-inside">
                      {order.items
                        .filter((i) => String(i.shop?.id) === String(SHOP_ID))
                        .map((item, idx) => (
                          <li key={idx}>
                            {item.title} (x{item.qty || 1})
                          </li>
                        ))}
                    </ul>
                  </div>
                </div>

                <div className="flex flex-row md:flex-col justify-center gap-3 min-w-[140px]">
                  <button
                    onClick={() => handleApproveOrder(order.id)}
                    className="flex-1 bg-dark-green text-white px-4 py-2 rounded-lg text-sm font-bold hover:bg-sage-green transition flex items-center justify-center gap-2"
                  >
                    <Check size={16} /> Proses
                  </button>
                  <button
                    onClick={() => handleRejectOrder(order.id)}
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
        <h2 className="text-2xl font-bold text-dark-green">
          Stok Toko: {user.shop.name}
        </h2>
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
            {myInventory.length === 0 ? (
              <tr>
                <td colSpan="4" className="text-center py-8 text-gray-400">
                  Inventory kosong. Tambahkan item baru.
                </td>
              </tr>
            ) : (
              myInventory.map((item) => (
                <tr
                  key={item.id}
                  className="border-b border-gray-100 hover:bg-gray-50"
                >
                  <td className="px-6 py-4 font-bold text-dark-green">
                    {item.title || item.name}
                  </td>
                  <td className="px-6 py-4">
                    <span className="bg-gray-100 text-gray-600 px-2 py-1 rounded text-xs capitalize">
                      {item.type || "Product"}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`font-bold ${
                        !item.stock || item.stock < 5
                          ? "text-red-500"
                          : "text-dark-green"
                      }`}
                    >
                      {item.stock || 0}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <div className="flex justify-center gap-3">
                      <button
                        onClick={() => updateStock(item.id, -1)}
                        className="w-8 h-8 rounded-xl bg-gray-100 hover:bg-gray-200 font-bold"
                      >
                        -
                      </button>
                      <button
                        onClick={() => updateStock(item.id, 1)}
                        className="w-8 h-8 rounded-xl bg-dark-green text-white hover:bg-sage-green font-bold"
                      >
                        +
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );

  return (
    <div className="bg-cream-bg min-h-screen font-sans flex">
      {/* SIDEBAR FIXED */}
      <aside className="w-64 bg-white border-r border-gray-200 fixed h-full z-10 hidden md:flex flex-col">
        <div className="p-6 border-b border-gray-100">
          <h1 className="font-serif font-bold text-xl text-dark-green">
            Florist Admin
          </h1>
          <p
            className="text-xs text-gray-400 mt-1 truncate"
            title={user.shop.id}
          >
            ID: {user.shop.id}
          </p>
        </div>

        <nav className="p-4 space-y-2 flex-1">
          <button
            onClick={() => setActiveTab("overview")}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold transition ${
              activeTab === "overview"
                ? "bg-dark-green text-white"
                : "text-gray-500 hover:bg-gray-50"
            }`}
          >
            <LayoutDashboard size={18} /> Overview
          </button>
          <button
            onClick={() => setActiveTab("requests")}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold transition ${
              activeTab === "requests"
                ? "bg-dark-green text-white"
                : "text-gray-500 hover:bg-gray-50"
            }`}
          >
            <Palette size={18} /> Pesanan
          </button>
          <button
            onClick={() => setActiveTab("inventory")}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold transition ${
              activeTab === "inventory"
                ? "bg-dark-green text-white"
                : "text-gray-500 hover:bg-gray-50"
            }`}
          >
            <Package size={18} /> Inventory
          </button>
        </nav>

        <div className="p-4 border-t border-gray-100">
          <Link href="/profile">
            <div className="flex items-center gap-3 mb-4 px-3 rounded-2xl border border-gray-200 p-2 cursor-pointer hover:border-sage-green transition">
              <div className="w-10 h-10 rounded-full bg-green-50 flex items-center justify-center text-dark-green border border-green-100">
                <User size={20} />
              </div>
              <div className="min-w-0">
                <p className="text-sm font-bold text-dark-green leading-none mb-1 truncate">
                  {user.shop.name}
                </p>
                <p className="text-xs text-gray-400">Owner</p>
              </div>
            </div>
          </Link>

          <Link
            href="/"
            className="flex items-center justify-center gap-2 w-full py-3 rounded-xl border border-gray-200 text-gray-500 hover:bg-white hover:text-dark-green hover:shadow-md transition-all text-sm font-bold group bg-gray-50"
          >
            <ArrowLeft
              size={16}
              className="group-hover:-translate-x-1 transition-transform"
            />
            Back to Site
          </Link>
        </div>
      </aside>

      {/* MAIN CONTENT */}
      <main className="flex-1 md:ml-64 p-8">
        <div className="mb-8">
          <h1 className="text-2xl font-bold capitalize text-dark-green">
            {activeTab}
          </h1>
        </div>
        <motion.div
          key={activeTab}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          {activeTab === "overview" && <OverviewView />}
          {activeTab === "requests" && <RequestsView />}
          {activeTab === "inventory" && <InventoryView />}
        </motion.div>
      </main>

      {/* MODAL ADD PRODUCT (Sesuai UI kamu) */}
      <AnimatePresence>
        {isAddModalOpen && (
          <div className="fixed inset-0 bg-[#1A2F24]/40 z-50 flex items-center justify-center backdrop-blur-sm p-4">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white/90 backdrop-blur-xl p-8 rounded-[2rem] w-full max-w-md shadow-2xl border border-white/50 relative overflow-hidden"
            >
              <div className="absolute top-0 right-0 w-32 h-32 bg-sage-green/10 rounded-full blur-2xl -mr-10 -mt-10 pointer-events-none"></div>

              <div className="relative z-10">
                <h3 className="font-serif font-bold text-2xl text-dark-green mb-1">
                  Tambah Stok
                </h3>
                <p className="text-sm text-gray-500 mb-6">
                  Input item untuk {user.shop.name}
                </p>

                <form onSubmit={handleAddProduct} className="space-y-4">
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-gray-500 uppercase tracking-wider ml-1">
                      Nama Item
                    </label>
                    <input
                      required
                      placeholder="Contoh: Mawar Merah"
                      className="w-full bg-white border border-gray-200 p-3.5 rounded-xl focus:outline-none focus:ring-2 focus:ring-sage-green focus:border-transparent transition-all shadow-sm"
                      value={newProduct.title}
                      onChange={(e) =>
                        setNewProduct({ ...newProduct, title: e.target.value })
                      }
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-gray-500 uppercase tracking-wider ml-1">
                      Kategori
                    </label>
                    <select
                      className="w-full bg-white border border-gray-200 p-3.5 rounded-xl focus:outline-none focus:ring-2 focus:ring-sage-green focus:border-transparent transition-all shadow-sm text-gray-700"
                      value={newProduct.type}
                      onChange={(e) =>
                        setNewProduct({ ...newProduct, type: e.target.value })
                      }
                    >
                      <option value="flower">Bunga (Flower)</option>
                      <option value="filler">Filler/Daun</option>
                      <option value="product">Bouquet Jadi</option>
                    </select>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-gray-500 uppercase tracking-wider ml-1">
                        Harga (Rp)
                      </label>
                      <input
                        required
                        type="number"
                        placeholder="0"
                        className="w-full bg-white border border-gray-200 p-3.5 rounded-xl focus:outline-none focus:ring-2 focus:ring-sage-green focus:border-transparent transition-all shadow-sm"
                        value={newProduct.price}
                        onChange={(e) =>
                          setNewProduct({
                            ...newProduct,
                            price: e.target.value,
                          })
                        }
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-gray-500 uppercase tracking-wider ml-1">
                        Stok Awal
                      </label>
                      <input
                        required
                        type="number"
                        placeholder="0"
                        className="w-full bg-white border border-gray-200 p-3.5 rounded-xl focus:outline-none focus:ring-2 focus:ring-sage-green focus:border-transparent transition-all shadow-sm"
                        value={newProduct.stock}
                        onChange={(e) =>
                          setNewProduct({
                            ...newProduct,
                            stock: e.target.value,
                          })
                        }
                      />
                    </div>
                  </div>

                  <div className="flex gap-3 pt-6">
                    <button
                      type="button"
                      onClick={() => setIsAddModalOpen(false)}
                      className="flex-1 py-3.5 bg-white border border-gray-200 text-gray-500 rounded-xl font-bold hover:bg-gray-50 transition shadow-sm"
                    >
                      Batal
                    </button>
                    <button
                      type="submit"
                      className="flex-1 py-3.5 bg-dark-green text-white rounded-xl font-bold hover:bg-sage-green shadow-lg transition transform active:scale-95"
                    >
                      Simpan
                    </button>
                  </div>
                </form>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
