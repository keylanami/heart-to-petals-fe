"use client";
import { useState, useEffect } from "react";
import { useCart } from "@/app/context/CartContext";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import {
  MapPin,
  Store,
  Truck,
  ChevronRight,
  CreditCard,
  Banknote,
} from "lucide-react";
import { motion } from "framer-motion";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function CheckoutPage() {
  const router = useRouter();
  const { cart, removeItems } = useCart();
  const [checkoutItems, setCheckoutItems] = useState([]);
  const [shippingSelection, setShippingSelection] = useState({});

  useEffect(() => {
    const selectedIds = JSON.parse(localStorage.getItem("checkoutIds") || "[]");

    const itemsToBuy = cart.filter((item) => selectedIds.includes(item.id));
    setCheckoutItems(itemsToBuy);

    const initialShipping = {};
    itemsToBuy.forEach((item) => {
      const shopId = item.shop?.id || "unknown";
      if (!initialShipping[shopId]) {
        initialShipping[shopId] = {
          name: "Reguler",
          cost: 12000,
          eta: "3-5 Hari",
        };
      }
    });
    setShippingSelection(initialShipping);
  }, [cart]);

  // grouping each toko
  const groupedCheckout = checkoutItems.reduce((acc, item) => {
    const shopId = item.shop?.id || "unknown";
    if (!acc[shopId]) {
      acc[shopId] = { shop: item.shop, items: [] };
    }
    acc[shopId].items.push(item);
    return acc;
  }, {});

  const subTotalProduct = checkoutItems.reduce(
    (sum, item) => sum + item.price * item.qty,
    0
  );
  const totalShippingCost = Object.values(shippingSelection).reduce(
    (sum, option) => sum + option.cost,
    0
  );
  const grandTotal = subTotalProduct + totalShippingCost + 1000; 
  const toRupiah = (num) =>
    new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      maximumSignificantDigits: 3,
    }).format(num);

  const shippingOptions = [
    { name: "Reguler", cost: 12000, eta: "3-5 Hari" },
    { name: "Instant", cost: 35000, eta: "3 Jam" },
    { name: "Kargo", cost: 8000, eta: "5-7 Hari" },
  ];

  // Handler ganti pengiriman
  const handleChangeShipping = (shopId, option) => {
    setShippingSelection((prev) => ({
      ...prev,
      [shopId]: option,
    }));
  };

  const handlePlaceOrder = () => {
    // 1. (Opsional) Disini harusnya ada logic API ke backend

    const confirm = window.confirm("Konfirmasi pesanan?");

    if (confirm) {
      const idsBought = checkoutItems.map((item) => item.id);
      removeItems(idsBought);
      localStorage.removeItem("checkoutIds");
      router.push("/checkout/order-success");
    }
  };

  return (
    <main className="bg-[#F5F5F5] min-h-screen pb-32">
      <Navbar />

      <div className="max-w-6xl mx-auto px-4 pt-32 grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white p-6 rounded-xl shadow-sm border-t-4 border-dark-green">
            <div className="flex items-center gap-2 text-dark-green mb-3">
              <MapPin size={20} />
              <h2 className="font-bold text-lg">Alamat Pengiriman</h2>
            </div>
            <div className="pl-7">
              <p className="font-bold text-gray-800">Kei (0812-3456-7890)</p>
              <p className="text-gray-600 text-sm mt-1">
                Jalan Bunga Mawar No. 123, Kecamatan Lowokwaru, <br />
                Kota Malang, Jawa Timur, 65141
              </p>
              <button className="text-xs font-bold text-sage-green mt-3 border border-sage-green px-3 py-1 rounded hover:bg-sage-green hover:text-white transition">
                Ubah Alamat
              </button>
            </div>
          </div>

          {Object.entries(groupedCheckout).map(([shopId, group]) => (
            <div key={shopId} className="bg-white p-6 rounded-xl shadow-sm">
              <div className="flex items-center gap-2 mb-4 pb-4 border-b border-gray-100">
                <Store size={18} className="text-gray-600" />
                <span className="font-bold text-gray-800">
                  {group.shop?.name || "Unknown Shop"}
                </span>
              </div>

              <div className="space-y-4">
                {group.items.map((item) => (
                  <div key={item.id} className="flex gap-4">
                    <div className="w-20 h-20 bg-gray-100 rounded-lg overflow-hidden shrink-0 border border-gray-100">
                      <img
                        src={item.image}
                        alt={item.title}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-medium text-gray-800 line-clamp-1">
                        {item.title}
                      </h3>
                      <p className="text-xs text-gray-400 mb-1">
                        {item.category || "Custom"}
                      </p>
                      <div className="flex justify-between items-center">
                        <p className="text-sm text-gray-500">
                          {item.qty} x {toRupiah(item.price)}
                        </p>
                        <p className="font-bold text-dark-green">
                          {toRupiah(item.price * item.qty)}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-6 pt-4 border-t border-dashed border-gray-200 bg-blue-50/50 -mx-6 px-6 pb-2">
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
                                        flex-1 min-w-[120px] text-left p-3 rounded-lg border text-xs transition-all
                                        ${
                                          shippingSelection[shopId]?.name ===
                                          opt.name
                                            ? "border-sage-green bg-white text-dark-green ring-1 ring-sage-green"
                                            : "border-gray-200 bg-white text-gray-500 hover:border-gray-300"
                                        }
                                    `}
                    >
                      <div className="font-bold">{opt.name}</div>
                      <div className="text-[10px] opacity-70">{opt.eta}</div>
                      <div className="mt-1 font-bold text-sage-green">
                        {toRupiah(opt.cost)}
                      </div>
                    </button>
                  ))}
                </div>

                <div className="mt-4 flex items-center gap-3">
                  <label className="text-xs text-gray-500 whitespace-nowrap">
                    Pesan:
                  </label>
                  <input
                    type="text"
                    placeholder="(Opsional) Tinggalkan pesan ke penjual..."
                    className="w-full text-sm border-b border-gray-300 bg-transparent focus:outline-none focus:border-dark-green py-1"
                  />
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="lg:col-span-1">
          <div className="bg-white p-6 rounded-xl shadow-sm sticky top-28">
            <h3 className="font-bold text-lg mb-4 text-dark-green">
              Ringkasan Pesanan
            </h3>

            <div className="mb-6">
              <button className="w-full flex justify-between items-center p-3 border border-gray-200 rounded-lg hover:border-dark-green transition group">
                <div className="flex items-center gap-3">
                  <CreditCard
                    size={18}
                    className="text-gray-500 group-hover:text-dark-green"
                  />
                  <span className="text-sm font-bold text-gray-700">
                    Pilih Pembayaran
                  </span>
                </div>
                <ChevronRight size={16} className="text-gray-400" />
              </button>
            </div>

            <div className="space-y-3 text-sm text-gray-600 border-b border-gray-100 pb-4 mb-4">
              <div className="flex justify-between">
                <span>
                  Total Harga (
                  {checkoutItems.reduce((acc, i) => acc + i.qty, 0)} barang)
                </span>
                <span>{toRupiah(subTotalProduct)}</span>
              </div>
              <div className="flex justify-between">
                <span>Total Ongkos Kirim</span>
                <span>{toRupiah(totalShippingCost)}</span>
              </div>
              <div className="flex justify-between">
                <span>Biaya Layanan</span>
                <span>{toRupiah(1000)}</span>
              </div>
            </div>

            <div className="flex justify-between items-center mb-6">
              <span className="font-bold text-lg text-gray-800">
                Total Tagihan
              </span>
              <span className="font-bold text-xl text-dark-green">
                {toRupiah(grandTotal)}
              </span>
            </div>

            <button
              onClick={handlePlaceOrder}
              className="w-full py-3.5 bg-dark-green text-white rounded-full font-bold shadow-lg hover:bg-sage-green transition transform active:scale-95 flex justify-center items-center gap-2"
            >
              <Banknote size={18} />
              Buat Pesanan
            </button>
          </div>
        </div>
      </div>
    </main>
  );
}
