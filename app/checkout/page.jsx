"use client";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState, Suspense } from "react";
import { ArrowLeft, MapPin, Store, Trash2, ShieldCheck, CreditCard, Truck, AlertTriangle } from "lucide-react";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import { useCart } from "@/app/context/CartContext";
import { useAuth } from "@/app/context/AuthContext";


const shippingOptions = [
  { id: "reg", name: "Reguler (JNE/J&T)", price: 15000, est: "2-3 Hari" },
  { id: "instant", name: "Instant (Gojek/Grab)", price: 35000, est: "3-6 Jam" },
  { id: "cargo", name: "Kargo (SiCepat)", price: 50000, est: "5-7 Hari" },
];


function CheckoutContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { cart, totalPrice, clearCart } = useCart();
  const { user } = useAuth();

  const [shipping, setShipping] = useState(shippingOptions[0]);
  const [isProcessing, setIsProcessing] = useState(false);

  // Ambil ID dari URL (Contoh: ?id=171xxxx)
  // Kalau ada ID, berarti checkout Draft. Kalau null, berarti checkout Cart biasa.
  const draftId = searchParams.get("id"); 

  const totalPayment = totalPrice + shipping.price;

  const handlePayment = async () => {
    setIsProcessing(true);
    
    // Simulasi loading bayar
    await new Promise(resolve => setTimeout(resolve, 2000));

    // Kalau ini checkout dari Cart, kita kosongkan keranjang
    if (!draftId) {
        clearCart();
    }

    // TODO: Di sini nanti logic hapus draft kalau checkout dari draft
    
    alert("Pembayaran Berhasil! Pesanan diproses.");
    router.push("/success"); // Arahkan ke halaman sukses
  };

  if (cart.length === 0 && !draftId) {
    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-[#F3F4F6]">
            <p className="text-gray-400 mb-4">Keranjang kosong</p>
            <Link href="/toko" className="text-dark-green font-bold hover:underline">Belanja dulu yuk</Link>
        </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#F3F4F6] pb-20">
      <Navbar />

      <div className="max-w-4xl mx-auto px-6 pt-32">
        <Link href="/cart" className="inline-flex items-center text-gray-400 hover:text-dark-green mb-6 text-sm gap-2">
          <ArrowLeft size={16} /> Kembali ke Keranjang
        </Link>

        <h1 className="text-3xl font-serif font-bold text-dark-green mb-8">Checkout</h1>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          
          <div className="md:col-span-2 space-y-6">
            
                    <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
              <h3 className="font-bold text-dark-green flex items-center gap-2 mb-4">
                <MapPin size={18} /> Alamat Pengiriman
              </h3>
              
              {user ? (
                <div className="bg-gray-50 p-4 rounded-xl border border-gray-200">
                    <p className="font-bold text-dark-green">{user.name} <span className="font-normal text-gray-500">| (+62) 812-3456-7890</span></p>
                    <p className="text-sm text-gray-500 mt-1">Jl. Bunga Melati No. 12, Bandung Wetan, Jawa Barat, 40115</p>
                    <button className="text-xs text-sage-green font-bold mt-2 hover:underline">Ubah Alamat</button>
                </div>
              ) : (
                <div className="bg-yellow-50 p-4 rounded-xl border border-yellow-100 flex items-start gap-3">
                    <AlertTriangle className="text-yellow-600 shrink-0" size={20}/>
                    <div>
                        <p className="text-sm text-yellow-800 font-bold">Anda belum login</p>
                        <p className="text-xs text-yellow-700 mt-1">Silakan login untuk menggunakan alamat yang tersimpan.</p>
                    </div>
                </div>
              )}
            </div>

            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
              <h3 className="font-bold text-dark-green flex items-center gap-2 mb-4">
                <Store size={18} /> Rincian Pesanan
              </h3>
              
              <div className="space-y-4">
                {cart.map((item) => (
                    <div key={item.id} className="flex gap-4 border-b border-gray-50 pb-4 last:border-0 last:pb-0">
                        <div className="w-16 h-16 bg-gray-100 rounded-lg overflow-hidden shrink-0">
                            <img src={item.image} alt={item.title} className="w-full h-full object-cover" />
                        </div>
                        <div className="flex-1">
                            <h4 className="font-bold text-dark-green text-sm line-clamp-1">{item.title}</h4>
                            <p className="text-xs text-gray-400">{item.shop?.name}</p>
                            <p className="text-xs font-bold text-sage-green mt-1">
                                {item.quantity} x {item.price.toLocaleString("id-ID")}
                            </p>
                        </div>
                        <p className="font-bold text-dark-green text-sm">
                            {(item.price * item.quantity).toLocaleString("id-ID")}
                        </p>
                    </div>
                ))}
              </div>
            </div>

         
             <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
              <h3 className="font-bold text-dark-green flex items-center gap-2 mb-4">
                <Truck size={18} /> Metode Pengiriman
              </h3>
              <div className="space-y-3">
                {shippingOptions.map((opt) => (
                    <label key={opt.id} className={`flex items-center justify-between p-4 rounded-xl border cursor-pointer transition-all ${shipping.id === opt.id ? "border-dark-green bg-green-50" : "border-gray-200 hover:border-gray-300"}`}>
                        <div className="flex items-center gap-3">
                            <input 
                                type="radio" 
                                name="shipping" 
                                className="accent-dark-green"
                                checked={shipping.id === opt.id}
                                onChange={() => setShipping(opt)}
                            />
                            <div>
                                <p className="font-bold text-sm text-dark-green">{opt.name}</p>
                                <p className="text-xs text-gray-500">Estimasi: {opt.est}</p>
                            </div>
                        </div>
                        <span className="font-bold text-sm text-dark-green">Rp {opt.price.toLocaleString()}</span>
                    </label>
                ))}
              </div>
            </div>

          </div>

        
          <div className="md:col-span-1">
             <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-100 sticky top-32">
                <h3 className="font-bold text-dark-green flex items-center gap-2 mb-6">
                    <ShieldCheck size={18} /> Ringkasan Pembayaran
                </h3>

                <div className="space-y-3 text-sm mb-6">
                    <div className="flex justify-between text-gray-500">
                        <span>Total Harga ({cart.length} barang)</span>
                        <span>Rp {totalPrice.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between text-gray-500">
                        <span>Biaya Pengiriman</span>
                        <span>Rp {shipping.price.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between text-gray-500">
                        <span>Biaya Layanan</span>
                        <span>Rp 1.000</span>
                    </div>
                    <div className="border-t border-dashed border-gray-200 my-2 pt-2 flex justify-between font-bold text-lg text-dark-green">
                        <span>Total Tagihan</span>
                        <span>Rp {(totalPayment + 1000).toLocaleString()}</span>
                    </div>
                </div>

                <button 
                    onClick={handlePayment}
                    disabled={isProcessing}
                    className="w-full py-4 bg-dark-green text-white rounded-xl font-bold hover:bg-sage-green transition shadow-lg flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    {isProcessing ? "Memproses..." : (
                        <>
                            <CreditCard size={18}/> Bayar Sekarang
                        </>
                    )}
                </button>
             </div>
          </div>

        </div>
      </div>
    </div>
  );
}


export default function CheckoutPage() {
  return (
    <Suspense fallback={
        <div className="min-h-screen flex items-center justify-center bg-[#F3F4F6]">
            <div className="animate-pulse flex flex-col items-center">
                <div className="w-12 h-12 bg-gray-300 rounded-full mb-4"></div>
                <div className="h-4 w-32 bg-gray-300 rounded"></div>
            </div>
        </div>
    }>
      <CheckoutContent />
    </Suspense>
  );
}