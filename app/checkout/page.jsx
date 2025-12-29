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
  const { cart } = useCart();
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
    if (typeof window !== "undefined") {
        const ids = localStorage.getItem("checkoutIds");
        if (ids) setSelectedCheckoutIds(JSON.parse(ids));
    }
  }, []);

  const isDirectBuy = searchParams.get("direct") === "true";
  const directId = searchParams.get("id");

  // --- FILTER ITEM ---
  const displayItems = isDirectBuy && directId 
    ? cart.filter(item => String(item.id) === String(directId))
    : cart.filter(item => selectedCheckoutIds.includes(item.id));

  // --- GROUPING PER TOKO ---
  const groupedCart = displayItems.reduce((acc, item) => {
    const shopId = item.shop?.id || "unknown";
    if (!acc[shopId]) {
      acc[shopId] = { shop: item.shop, items: [] };
    }
    acc[shopId].items.push(item);
    return acc;
  }, {});

  const shopKeys = Object.keys(groupedCart);

  // Set Default Shipping
  useEffect(() => {
    if (shopKeys.length > 0) {
      setShippingSelection((prev) => {
        const next = { ...prev };
        let hasChange = false;
        shopKeys.forEach((shopId) => {
          if (!next[shopId]) {
            next[shopId] = shippingOptions[1]; // Default Same Day
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

  // --- FINANCIAL CALCULATION (NEW: FULL PAYMENT) ---
  const calculateTotal = () => {
    // 1. Total Harga Barang
    const itemsTotal = displayItems.reduce((sum, item) => sum + (item.price * (item.qty || 1)), 0);
    
    // 2. Ongkir (Sum of selected shipping per shop)
    let shippingTotal = 0;
    shopKeys.forEach(shopId => {
        const selected = shippingSelection[shopId];
        if (selected) shippingTotal += selected.cost;
    });

    // 3. Service Fee
    const serviceFee = 2000;

    // 4. Grand Total (Lunas)
    const grandTotal = itemsTotal + shippingTotal + serviceFee;

    return { itemsTotal, shippingTotal, serviceFee, grandTotal };
  };

  const { itemsTotal, shippingTotal, serviceFee, grandTotal } = calculateTotal();
  const toRupiah = (num) => new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", maximumSignificantDigits: 3 }).format(num || 0);

  const handlePayment = async () => {
    if (!user) {
        showToast("Login terlebih dahulu untuk melanjutkan pembayaran.", "error");
        router.push("/login"); 
        return;
    }

    const newOrderId = `ORD-${Date.now()}`;
    // Simulate API Call
    await new Promise(resolve => setTimeout(resolve, 1000)); 

    // Create Order Object
    const orderData = {
          id: newOrderId,
          date: new Date().toLocaleDateString("id-ID", { day: 'numeric', month: 'short', year: 'numeric' }),
          customer: user.name, 
          status: "processing", // DEFAULT LANGSUNG PROCESSING (Lunas)
          payment_status: "paid", 
          items: displayItems,
          financials: {
              itemsTotal,
              shippingTotal,
              serviceFee,
              grandTotal 
          },
          timeline: [
              {
                  title: "Pembayaran Berhasil",
                  date: "Baru saja",
                  desc: "Pesanan lunas & diteruskan ke penjual.",
                  status: "completed"
              },
              {
                  title: "Menunggu Proses Penjual",
                  date: "Est. 10 Menit",
                  desc: "Penjual akan menyiapkan pesananmu.",
                  status: "active" 
              }
          ]
      };

      addOrder(orderData);
      router.push(`/checkout/order-success?id=${newOrderId}`);
  };

  if (!isClient) return null;

  return (
    <main className="bg-gray-50 min-h-screen pb-32 font-sans">
      <header className="fixed top-0 left-0 w-full bg-white border-b border-gray-100 px-4 md:px-8 py-4 z-50 flex items-center justify-between shadow-sm">
        <button onClick={() => router.back()} className="flex items-center gap-2 text-gray-500 hover:text-red-500 transition-colors font-bold text-sm">
          <ArrowLeft size={18} /> Batal
        </button>
        <div className="flex items-center gap-2 text-dark-green font-serif font-bold text-lg">Checkout</div>
        <div className="w-10"></div>
      </header>

      <div className="pt-28 px-4 md:px-6 max-w-6xl mx-auto flex flex-col lg:flex-row gap-8">
        
        {/* LIST ITEM */}
        <div className="flex-1 space-y-6">
          <section className="bg-white p-6 rounded-[2rem] shadow-sm border border-gray-100">
            <h2 className="font-bold text-lg text-dark-green mb-4 flex items-center gap-2">
              <MapPin size={18} /> Alamat Pengiriman
            </h2>
            {user ? (
                <div className="bg-gray-50 p-4 rounded-xl border border-gray-200">
                    <p className="font-bold text-gray-900 mb-1">{user.name} (Rumah)</p>
                    <p className="text-sm text-gray-600">{user.address?.street || "Jl. Dago Asri No. 102"}, {user.address?.city || "Bandung"}</p>
                </div>
            ) : (
                <div className="bg-yellow-50 p-4 rounded-xl border border-yellow-100 text-sm text-yellow-800">
                    Silakan login untuk menggunakan alamat tersimpan.
                </div>
            )}
          </section>

          {displayItems.length === 0 ? (
            <div className="text-center py-20 bg-white rounded-[2rem]">
              <p className="text-gray-400 mb-4">Keranjang kosong.</p>
              <button onClick={() => router.push("/toko")} className="text-dark-green font-bold underline">Belanja Dulu</button>
            </div>
          ) : (
            shopKeys.map((shopId) => {
              const group = groupedCart[shopId];
              return (
                <div key={shopId} className="bg-white p-6 rounded-[2rem] shadow-sm border border-gray-100">
                  <h2 className="font-bold text-md text-dark-green mb-6 flex items-center gap-2 pb-4 border-b border-gray-50">
                    <Store size={18} className="text-sage-green" /> {group.shop?.name || "Florist Partner"}
                  </h2>

                  <div className="space-y-6">
                    {group.items.map((item, idx) => (
                      <div key={idx} className="flex gap-4">
                        <div className="w-20 h-24 rounded-2xl overflow-hidden bg-gray-100 flex-shrink-0 relative">
                          <img src={item.image} alt={item.title} className="w-full h-full object-cover"/>
                          {item.isCustom && <div className="absolute top-0 left-0 bg-sage-green text-white text-[10px] font-bold px-2 py-0.5 rounded-br-lg z-10">Custom</div>}
                        </div>
                        <div className="flex-1">
                          <h3 className="font-serif font-bold text-lg text-dark-green leading-tight">{item.title}</h3>
                          <p className="text-xs text-gray-400 mt-1">{item.isCustom ? "Custom Request" : "Ready Stock"} • {item.category || "Bouquet"}</p>
                          <div className="flex justify-between items-end mt-2">
                            <p className="font-bold text-dark-green">{toRupiah(item.price)} <span className="text-xs text-gray-400 font-normal">x {item.qty || 1}</span></p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="mt-6 pt-4 border-t border-dashed border-gray-200 bg-blue-50/30 -mx-6 px-6 pb-4 rounded-b-[2rem]">
                    <div className="flex items-center gap-2 text-sm font-bold text-gray-700 mb-3 pt-3">
                      <Truck size={16} /> <span>Opsi Pengiriman</span>
                    </div>
                    <div className="flex flex-wrap gap-3">
                      {shippingOptions.map((opt) => (
                        <button key={opt.name} onClick={() => handleChangeShipping(shopId, opt)}
                          className={`flex-1 min-w-[120px] text-left p-3 rounded-lg border text-xs transition-all relative ${shippingSelection[shopId]?.name === opt.name ? "border-sage-green bg-white text-dark-green ring-2 ring-sage-green" : "border-gray-200 bg-white text-gray-500"}`}
                        >
                          <div className="font-bold">{opt.name}</div>
                          <div className="text-[10px] opacity-70">{opt.eta}</div>
                          <div className="mt-1 font-bold text-sage-green">{toRupiah(opt.cost)}</div>
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* SUMMARY CARD (FULL PAYMENT) */}
        <div className="lg:w-[380px]">
          <div className="bg-white p-6 rounded-[2rem] shadow-lg border border-gray-100 sticky top-28">
            <h3 className="font-serif font-bold text-xl text-dark-green mb-6">Ringkasan Pembayaran</h3>

            <div className="space-y-3 text-sm text-gray-600 mb-6">
              <div className="flex justify-between">
                <span>Total Harga Barang</span>
                <span className="font-medium">{toRupiah(itemsTotal)}</span>
              </div>
              <div className="flex justify-between">
                <span>Total Ongkos Kirim</span>
                <span className="font-medium">{toRupiah(shippingTotal)}</span>
              </div>
              <div className="flex justify-between">
                <span>Biaya Layanan</span>
                <span className="font-medium">{toRupiah(serviceFee)}</span>
              </div>
              
              <div className="border-t border-dashed border-gray-200 my-4 pt-4 flex justify-between items-center text-dark-green font-bold text-lg">
                <span>Total Tagihan</span>
                <span>{toRupiah(grandTotal)}</span>
              </div>
            </div>

            <div className="bg-green-50 p-3 rounded-xl flex items-start gap-3 text-xs text-green-800 mb-6 border border-green-100">
              <ShieldCheck size={16} className="shrink-0 mt-0.5" />
              <p>Pembayaran Full di muka (Aman & Bergaransi).</p>
            </div>

            <button
              onClick={handlePayment}
              disabled={displayItems.length === 0}
              className="w-full bg-dark-green text-white py-4 rounded-full font-bold shadow-lg hover:bg-sage-green transition-all flex items-center justify-center gap-2 transform active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <CreditCard size={18} /> Bayar Sekarang ({toRupiah(grandTotal)})
            </button>
          </div>
        </div>
      </div>
    </main>
  );
}

export default function CheckoutPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center bg-gray-50">Loading...</div>}>
      <CheckoutContent />
    </Suspense>
  );
}