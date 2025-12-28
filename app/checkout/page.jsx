"use client";
import { useCart } from "@/app/context/CartContext";
import { useAuth } from "@/app/context/AuthContext"; 
import { useOrder } from "@/app/context/OrderContext"; 
import { useToast } from "@/app/context/ToastContext";
import { ArrowLeft, MapPin, Store, Trash2, ShieldCheck, CreditCard, Truck, AlertTriangle, LogIn, LogOut, Info } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState, Suspense } from "react";
import Link from "next/link"; 
import { motion, AnimatePresence } from "framer-motion";

const shippingOptions = [
  { name: "Instant", cost: 25000, eta: "3-6 Jam" },
  { name: "Same Day", cost: 15000, eta: "6-12 Jam" },
  { name: "Reguler", cost: 9000, eta: "2-3 Hari" },
];

function CheckoutContent() {
  const { cart, removeFromCart, clearCart } = useCart();
  const { user } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isClient, setIsClient] = useState(false);
  const [shippingSelection, setShippingSelection] = useState({});
  const { showToast } = useToast();
  const { addOrder } = useOrder(); 

  const [isCancelModalOpen, setIsCancelModalOpen] = useState(false);
  const [selectedCheckoutIds, setSelectedCheckoutIds] = useState([]);

  useEffect(() => {
    setIsClient(true);
    // Ambil data item yang dicentang dari localStorage
    if (typeof window !== "undefined") {
        const ids = localStorage.getItem("checkoutIds");
        if (ids) {
            setSelectedCheckoutIds(JSON.parse(ids));
        }
    }
  }, []);

  const isDirectBuy = searchParams.get("direct") === "true";
  const directId = searchParams.get("id");

  // --- LOGIC FILTER ITEM YANG AKAN DIBAYAR ---
  const displayItems = isDirectBuy && directId 
    ? cart.filter(item => String(item.id) === String(directId))
    : cart.filter(item => selectedCheckoutIds.includes(item.id));

  // --- SPLIT LOGIC: CUSTOM VS CATALOG ---
  // Kita pisahkan untuk perhitungan DP
  const customItems = displayItems.filter(item => item.isCustom);
  const catalogItems = displayItems.filter(item => !item.isCustom);

  // Grouping per toko (Visual Only)
  const groupedCart = displayItems.reduce((acc, item) => {
    const shopId = item.shop?.id || "unknown";
    if (!acc[shopId]) {
      acc[shopId] = { shop: item.shop, items: [] };
    }
    acc[shopId].items.push(item);
    return acc;
  }, {});

  const shopKeys = Object.keys(groupedCart);

  useEffect(() => {
    if (shopKeys.length > 0) {
      setShippingSelection((prev) => {
        const next = { ...prev };
        let hasChange = false;
        shopKeys.forEach((shopId) => {
          if (!next[shopId]) {
            next[shopId] = shippingOptions[1];
            hasChange = true;
          }
        });
        return hasChange ? next : prev;
      });
    }
  }, [shopKeys.length]);

  const handleChangeShipping = (shopId, option) => {
    setShippingSelection((prev) => ({ ...prev, [shopId]: option }));
  };

  // --- FINANCIAL CALCULATION (CORE LOGIC) ---
  
  // 1. Hitung Subtotal Asli
  const subtotalCatalog = catalogItems.reduce((acc, item) => acc + (item.price * (item.qty || item.quantity || 1)), 0);
  const subtotalCustom = customItems.reduce((acc, item) => acc + (item.price * (item.qty || item.quantity || 1)), 0);
  
  // 2. Hitung Ongkir
  const totalShipping = shopKeys.reduce((acc, shopId) => {
    const selectedOption = shippingSelection[shopId];
    return acc + (selectedOption?.cost || 0);
  }, 0);

  const serviceFee = 2000;

  // 3. ATURAN PEMBAYARAN:
  // - Catalog: Bayar Full 100%
  // - Custom: Bayar DP 40%
  // - Ongkir: Bayar NANTI (masuk pelunasan)
  
  const dpAmountCustom = subtotalCustom * 0.4; 
  const payNowTotal = subtotalCatalog + dpAmountCustom + serviceFee;
  const remainingBill = (subtotalCustom - dpAmountCustom) + totalShipping;

  const toRupiah = (num) => new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", maximumSignificantDigits: 3 }).format(num || 0);

  const handleCancelClick = () => {
    setIsCancelModalOpen(true); 
  };

  const confirmCancelOrder = () => {
    setIsCancelModalOpen(false);
    router.back();
    setTimeout(() => {
        showToast("Pesanan dibatalkan. Keranjang aman! 👌", "info");
    }, 200);
  };

  const handlePayment = async () => {
    if (!user) {
        showToast("Login terlebih dahulu untuk melanjutkan pembayaran.", "error");
        router.push("/get-started"); // Atau /login
        return;
    }

    // GENERATE ORDER ID (Penting buat routing)
    const newOrderId = `ORD-${Date.now()}-${Math.floor(Math.random() * 1000)}`;

    await new Promise(resolve => setTimeout(resolve, 1000)); // Simulasi Loading

    // Create Order Object
    const newOrderData = {
        id: newOrderId,
        customer: user.name,
        date: new Date().toLocaleDateString("id-ID"),
        items: displayItems,
        
        // Simpan Data Keuangan Lengkap untuk Page Tracking
        financials: {
            subtotalCatalog,
            subtotalCustom,
            totalShipping,
            serviceFee,
            dpAmount: dpAmountCustom,
            payNowTotal: payNowTotal, // Yang dibayar user saat ini
            remainingAmount: remainingBill, // Yang harus dilunasi nanti
            isPaidOff: remainingBill <= 0 // Flag lunas atau belum
        },

        // Logic Status
        // Kalau ada custom -> waiting_approval (Flow Pre-order)
        // Kalau cuma catalog -> processing (Flow Normal)
        status: customItems.length > 0 ? "waiting_approval" : "processing", 
        type: customItems.length > 0 ? "Pre-Order" : "Instant",

        // Timeline Awal
        timeline: [
            {
                id: 1,
                date: new Date().toLocaleString("id-ID"),
                title: "Pesanan Dibuat & Pembayaran Diterima",
                desc: customItems.length > 0 
                    ? `Pembayaran Awal (DP) sebesar ${toRupiah(payNowTotal)} berhasil. Menunggu konfirmasi florist.`
                    : `Pembayaran lunas sebesar ${toRupiah(payNowTotal)}. Pesanan akan diproses.`,
                type: "info",
                status: "completed"
            }
        ]
    };

    addOrder(newOrderData); 

    // CLEANUP CART (Hanya hapus yang dibeli)
    if (isDirectBuy && directId) {
        removeFromCart(directId); // Pastikan tipe data ID cocok
    } else {
        // Hapus item yang ada di list selectedCheckoutIds
        selectedCheckoutIds.forEach(id => removeFromCart(id));
        localStorage.removeItem("checkoutIds");
    }
    
    showToast("Pembayaran Berhasil! Mengalihkan ke tracking...", "success");
    
    // REDIRECT KE PRE-ORDER PAGE
    // router.push(`/orders/${newOrderId}`);
    router.push(`/checkout/order-success?id=${newOrderId}`);
  };

  if (!isClient) return <div className="min-h-screen bg-gray-50"></div>;

  return (
    <main className="bg-gray-50 min-h-screen pb-32 font-sans">
   
      <header className="fixed top-0 left-0 w-full bg-white border-b border-gray-100 px-4 md:px-8 py-4 z-50 flex items-center justify-between shadow-sm">
        <button
          onClick={handleCancelClick}
          className="flex items-center gap-2 text-gray-500 hover:text-red-500 transition-colors font-bold text-sm"
        >
          <ArrowLeft size={18} /> Batal
        </button>
        <div className="flex items-center gap-2 text-dark-green font-serif font-bold text-lg">
          Checkout {customItems.length > 0 ? "(Pre-Order)" : ""}
        </div>
        <div className="w-10"></div>
      </header>

      <div className="pt-28 px-4 md:px-6 max-w-6xl mx-auto flex flex-col lg:flex-row gap-8">
        <div className="flex-1 space-y-6">
          <section className="bg-white p-6 rounded-[2rem] shadow-sm border border-gray-100">
            <h2 className="font-bold text-lg text-dark-green mb-4 flex items-center gap-2">
              <MapPin size={18} /> Alamat Pengiriman
            </h2>
            
            {user ? (
                <div className="bg-gray-50 p-4 rounded-xl border border-gray-200 group cursor-pointer hover:border-sage-green transition-colors">
                    <p className="font-bold text-gray-900 mb-1 flex justify-between">
                        {user.name} (Rumah) 
                        <span className="text-xs text-sage-green font-normal underline">Ubah</span>
                    </p>
                    <p className="text-sm text-gray-600">
                        {user.address?.street || "Jl. Dago Asri No. 102"}, {user.address?.city || "Bandung"}, {user.address?.zip || "40135"}
                    </p>
                    <p className="text-sm text-gray-500 mt-1">{user.email}</p>
                </div>
            ) : (
                <div className="bg-yellow-50 p-5 rounded-2xl border border-yellow-100">
                    <div className="flex items-start gap-3 mb-4">
                        <AlertTriangle className="text-yellow-600 shrink-0 mt-0.5" size={20}/>
                        <div>
                            <p className="text-sm text-yellow-800 font-bold">Aduh, kamu belum login</p>
                            <p className="text-xs text-yellow-700 mt-1 leading-relaxed">
                                Untuk memproses pesanan dan menggunakan alamat yang tersimpan, masuk atau daftarkan akunmu dulu.
                            </p>
                        </div>
                    </div>
                    
                    <Link href="/login" className="w-full flex items-center justify-center gap-2 bg-yellow-600 text-white py-3 rounded-xl font-bold text-sm hover:bg-yellow-700 transition shadow-sm">
                        <LogIn size={16} /> Login Sekarang
                    </Link>
                </div>
            )}
          </section>

          {displayItems.length === 0 ? (
            <div className="text-center py-20 bg-white rounded-[2rem]">
              <p className="text-gray-400 mb-4">Tidak ada barang yang akan dibeli.</p>
              <button
                onClick={() => router.push("/toko")}
                className="text-dark-green font-bold underline"
              >
                Belanja Dulu
              </button>
            </div>
          ) : (
            shopKeys.map((shopId) => {
              const group = groupedCart[shopId];
              return (
                <div
                  key={shopId}
                  className="bg-white p-6 rounded-[2rem] shadow-sm border border-gray-100"
                >
                  <h2 className="font-bold text-md text-dark-green mb-6 flex items-center gap-2 pb-4 border-b border-gray-50">
                    <Store size={18} className="text-sage-green" />
                    {group.shop?.name || "Florist Partner"}
                  </h2>

                  <div className="space-y-6">
                    {group.items.map((item, idx) => (
                      <div key={idx} className="flex gap-4">
                        <div className="w-20 h-24 rounded-2xl overflow-hidden bg-gray-100 flex-shrink-0 relative">
                          <img
                            src={item.image}
                            alt={item.title}
                            className="w-full h-full object-cover"
                          />
                          {/* Label Custom */}
                          {item.isCustom && (
                             <div className="absolute top-0 left-0 bg-sage-green text-white text-[10px] font-bold px-2 py-0.5 rounded-br-lg z-10">
                                 Custom
                             </div>
                          )}
                        </div>
                        <div className="flex-1">
                          <h3 className="font-serif font-bold text-lg text-dark-green leading-tight">
                            {item.title}
                          </h3>
                          <p className="text-xs text-gray-400 mt-1">
                            {item.isCustom ? "Custom Request" : "Ready Stock"} • {item.category || "Bouquet"}
                          </p>
                          <div className="flex justify-between items-end mt-2">
                            <p className="font-bold text-dark-green">
                              {toRupiah(item.price)}
                              <span className="text-xs text-gray-400 font-normal">
                                {" "}x {item.qty || item.quantity || 1}
                              </span>
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="mt-6 pt-4 border-t border-dashed border-gray-200 bg-blue-50/30 -mx-6 px-6 pb-4 rounded-b-[2rem]">
                    <div className="flex items-center gap-2 text-sm font-bold text-gray-700 mb-3 pt-3">
                      <Truck size={16} />
                      <span>Opsi Pengiriman</span>
                    </div>

                    <div className="flex flex-wrap gap-3">
                      {shippingOptions.map((opt) => (
                        <button
                          key={opt.name}
                          onClick={() => handleChangeShipping(shopId, opt)}
                          className={`
                            flex-1 min-w-[120px] text-left p-3 rounded-lg border text-xs transition-all relative
                            ${
                              shippingSelection[shopId]
                              ?.name === opt.name
                              ? "border-sage-green bg-white text-dark-green ring-2 ring-sage-green ring-offset-1"
                              : "border-gray-200 bg-white text-gray-500 hover:border-gray-300"
                            }
                          `}
                        >
                          <div className="font-bold">{opt.name}</div>
                          <div className="text-[10px] opacity-70">
                            {opt.eta}
                          </div>
                          <div className="mt-1 font-bold text-sage-green">
                            {toRupiah(opt.cost)}
                          </div>

                          {shippingSelection[shopId]?.name === opt.name && (
                            <div className="absolute top-2 right-2 text-sage-green">
                              <ShieldCheck size={12} />
                            </div>
                          )}
                        </button>
                      ))}
                    </div>

                    <div className="mt-4 flex items-center gap-3 bg-white p-2 rounded-lg border border-gray-200">
                      <label className="text-xs text-gray-500 whitespace-nowrap pl-2">
                        Pesan:
                      </label>
                      <input
                        type="text"
                        placeholder="(Opsional) Ucapan kartu ucapan..."
                        className="w-full text-sm bg-transparent focus:outline-none focus:text-dark-green py-1"
                      />
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>


        <div className="lg:w-[380px]">
          <div className="bg-white p-6 rounded-[2rem] shadow-lg border border-gray-100 sticky top-28">
            <h3 className="font-serif font-bold text-xl text-dark-green mb-6">
              Ringkasan Pembayaran
            </h3>

            {/* ALERT CUSTOM INFO */}
            {customItems.length > 0 && (
                <div className="mb-6 p-3 bg-sage-green/10 rounded-xl border border-sage-green/20 text-xs text-dark-green flex gap-2 items-start">
                    <Info size={16} className="shrink-0 mt-0.5"/>
                    <p>
                        Pesanan ini mengandung barang <b>Custom</b>. Bayar <b>DP 40%</b> sekarang. Sisa & Ongkir dibayar saat pelunasan.
                    </p>
                </div>
            )}

            <div className="space-y-3 text-sm text-gray-600 mb-6">
              <div className="flex justify-between">
                <span>Total Catalog (Ready Stock)</span>
                <span className="font-medium">{toRupiah(subtotalCatalog)}</span>
              </div>
              <div className="flex justify-between">
                <span>Total Custom (Pre-Order)</span>
                <span className="font-medium">{toRupiah(subtotalCustom)}</span>
              </div>
              
              <div className="flex justify-between text-gray-400 italic text-xs pt-2 border-t border-dashed border-gray-100">
                 <span>Ongkos Kirim (Bayar Nanti)</span>
                 <span>+{toRupiah(totalShipping)}</span>
              </div>
              
              <div className="flex justify-between text-gray-800 pt-2 font-bold">
                <span>Biaya Layanan</span>
                <span className="font-medium">{toRupiah(serviceFee)}</span>
              </div>
              
              {/* SISA TAGIHAN INFO */}
              {customItems.length > 0 && (
                  <div className="flex justify-between text-green-600 font-bold bg-green-50 p-2 rounded-lg mt-2">
                    <span>Sisa Tagihan (Pelunasan)</span>
                    <span>- {toRupiah(remainingBill)}</span>
                  </div>
              )}

              <div className="border-t border-dashed border-gray-200 my-4 pt-4 flex justify-between items-center text-dark-green font-bold text-lg">
                <span>Bayar Sekarang (DP)</span>
                <span>{toRupiah(payNowTotal)}</span>
              </div>
            </div>

            <div className="bg-blue-50 p-3 rounded-xl flex items-start gap-3 text-xs text-blue-800 mb-6 border border-blue-100">
              <ShieldCheck size={16} className="shrink-0 mt-0.5" />
              <p className="leading-tight">
                Pembayaranmu aman. Uang ditahan sistem sampai pesanan selesai.
              </p>
            </div>

            <button
              onClick={handlePayment}
              disabled={displayItems.length === 0}
              className="w-full bg-dark-green text-white py-4 rounded-full font-bold shadow-lg hover:bg-sage-green transition-all flex items-center justify-center gap-2 transform active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <CreditCard size={18} /> {customItems.length > 0 ? "Bayar DP & Proses" : "Bayar Sekarang"}
            </button>
          </div>
        </div>
      </div>


      <AnimatePresence>
        {isCancelModalOpen && (
            <>
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setIsCancelModalOpen(false)}
                className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[60] flex items-center justify-center p-4"
            />
            
            <motion.div
                initial={{ opacity: 0, scale: 0.9, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9, y: 20 }}
                className="fixed z-[70] bg-white w-full max-w-sm rounded-3xl shadow-2xl overflow-hidden top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 p-6 text-center"
            >
                <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-4 text-red-500">
                    <LogOut size={28} className="ml-1" /> 
                </div>
                
                <h3 className="font-serif text-2xl font-bold text-dark-green mb-2">
                    Yakin mau batal?
                </h3>
                <p className="text-gray-500 text-sm mb-8 leading-relaxed">
                    Pesananmu belum tersimpan loh. Tenang aja, isi keranjangmu gak akan hilang kok!
                </p>

                <div className="flex gap-3">
                    <button 
                        onClick={() => setIsCancelModalOpen(false)}
                        className="flex-1 py-3 rounded-full font-bold text-sm border border-gray-200 text-gray-600 hover:bg-gray-50 transition"
                    >
                        Gak Jadi
                    </button>
                    <button 
                        onClick={confirmCancelOrder}
                        className="flex-1 py-3 rounded-full font-bold text-sm bg-red-600 text-white hover:bg-red-300 shadow-lg hover:shadow-red-500/30 transition"
                    >
                        Ya, Batalkan
                    </button>
                </div>
            </motion.div>
            </>
        )}
      </AnimatePresence>

    </main>
  );
}

export default function CheckoutPage() {
  return (
    <Suspense fallback={
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
            <div className="text-gray-400 font-bold animate-pulse">Memuat Pembayaran...</div>
        </div>
    }>
      <CheckoutContent />
    </Suspense>
  );
}