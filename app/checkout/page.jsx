"use client";
import { useCart } from "@/app/context/CartContext";
import { useAuth } from "@/app/context/AuthContext"; // 1. Import Auth
import { ArrowLeft, MapPin, Store, Trash2, ShieldCheck, CreditCard, Truck, AlertTriangle, LogIn } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState, Suspense } from "react";
import Link from "next/link"; // 2. Import Link buat tombol login

const shippingOptions = [
  { name: "Instant", cost: 25000, eta: "3-6 Jam" },
  { name: "Same Day", cost: 15000, eta: "6-12 Jam" },
  { name: "Reguler", cost: 9000, eta: "2-3 Hari" },
];

function CheckoutContent() {
  const { cart, removeFromCart, clearCart } = useCart();
  const { user } = useAuth(); // 3. Ambil data User
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isClient, setIsClient] = useState(false);
  const [shippingSelection, setShippingSelection] = useState({});
  
  // LOGIC FILTER DISPLAY ITEM
  const isDirectBuy = searchParams.get("direct") === "true";
  const directId = searchParams.get("id");

  const displayItems = isDirectBuy && directId 
    ? cart.filter(item => String(item.id) === String(directId))
    : cart;

  useEffect(() => {
    setIsClient(true);
  }, []);

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

  const subtotal = displayItems.reduce((acc, item) => acc + (item.price || 0) * (item.qty || item.quantity || 1), 0);
  
  const totalShipping = shopKeys.reduce((acc, shopId) => {
    const selectedOption = shippingSelection[shopId];
    return acc + (selectedOption?.cost || 0);
  }, 0);

  const serviceFee = 2000;
  const grandTotal = subtotal + totalShipping + serviceFee;

  const toRupiah = (num) => new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", maximumSignificantDigits: 3 }).format(num || 0);

  const handleCancelOrder = () => {
    if (window.confirm("Yakin batalkan pesanan? Keranjang kamu masih tersimpan kok.")) {
      router.back();
    }
  };

  const handlePayment = async () => {
    // Validasi Login sebelum bayar
    if (!user) {
        alert("Silakan login terlebih dahulu untuk melanjutkan pembayaran.");
        router.push("/login");
        return;
    }

    await new Promise(resolve => setTimeout(resolve, 1000));

    if (isDirectBuy && directId) {
        removeFromCart(parseInt(directId));
    } else {
        clearCart();
    }
    router.push("/checkout/order-success");
  };

  if (!isClient) return <div className="min-h-screen bg-gray-50"></div>;

  return (
    <main className="bg-gray-50 min-h-screen pb-32 font-sans">
      <header className="fixed top-0 left-0 w-full bg-white border-b border-gray-100 px-4 md:px-8 py-4 z-50 flex items-center justify-between shadow-sm">
        <button
          onClick={handleCancelOrder}
          className="flex items-center gap-2 text-gray-500 hover:text-red-500 transition-colors font-bold text-sm"
        >
          <ArrowLeft size={18} /> Batal
        </button>
        <div className="flex items-center gap-2 text-dark-green font-serif font-bold text-lg">
          Proses pemesananmu!
        </div>
        <div className="w-10"></div>
      </header>

      <div className="pt-28 px-4 md:px-6 max-w-6xl mx-auto flex flex-col lg:flex-row gap-8">
        <div className="flex-1 space-y-6">
          
          {/* --- SECTION ALAMAT (DENGAN LOGIC LOGIN) --- */}
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
                        Jl. Dago Asri No. 102, Coblong, Bandung, Jawa Barat, 40135
                    </p>
                    <p className="text-sm text-gray-500 mt-1">{user.email}</p>
                </div>
            ) : (
 
                <div className="bg-yellow-50 p-5 rounded-2xl border border-yellow-50">
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
                        <div className="w-20 h-24 rounded-2xl overflow-hidden bg-gray-100 flex-shrink-0">
                          <img
                            src={item.image}
                            alt={item.title}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div className="flex-1">
                          <h3 className="font-serif font-bold text-lg text-dark-green leading-tight">
                            {item.title}
                          </h3>
                          <p className="text-xs text-gray-400 mt-1">
                            {item.tag} • {item.category}
                          </p>
                          <div className="flex justify-between items-end mt-2">
                            <p className="font-bold text-dark-green">
                              {toRupiah(item.price)}
                              <span className="text-xs text-gray-400 font-normal">
                                {" "}x {item.qty || item.quantity || 1}
                              </span>
                            </p>
                            {!isDirectBuy && (
                                <button
                                onClick={() => removeFromCart(item.id)}
                                className="text-red-400 text-xs flex items-center gap-1 hover:text-red-600"
                                >
                                <Trash2 size={14} /> Hapus
                                </button>
                            )}
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

            <div className="space-y-3 text-sm text-gray-600 mb-6">
              <div className="flex justify-between">
                <span>Total Harga Barang</span>
                <span className="font-medium">{toRupiah(subtotal)}</span>
              </div>

              <div className="flex justify-between text-sage-green font-bold">
                <span>Total Ongkos Kirim</span>
                <span>{toRupiah(totalShipping)}</span>
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

            <div className="bg-blue-50 p-3 rounded-xl flex items-start gap-3 text-xs text-blue-800 mb-6 border border-blue-100">
              <ShieldCheck size={16} className="shrink-0 mt-0.5" />
              <p className="leading-tight">
                Pembayaranmu aman. Penjual baru menerima uang setelah kamu
                konfirmasi pesanan diterima.
              </p>
            </div>

            <button
              onClick={handlePayment}
              disabled={displayItems.length === 0}
              className="w-full bg-dark-green text-white py-4 rounded-full font-bold shadow-lg hover:bg-sage-green transition-all flex items-center justify-center gap-2 transform active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <CreditCard size={18} /> Bayar Sekarang
            </button>
          </div>
        </div>
      </div>
    </main>
  );
}

export default function CheckoutPage() {
  return (
    <Suspense fallback={
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
            <div className="text-gray-400 font-bold animate-pulse">Memuat Pesanan...</div>
        </div>
    }>
      <CheckoutContent />
    </Suspense>
  );
}