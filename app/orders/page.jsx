"use client";
import { useOrder } from "@/app/context/OrderContext";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Link from "next/link";
import { Package, ChevronRight, Clock, CheckCircle2, XCircle, ShoppingBag } from "lucide-react";

export default function MyOrdersPage() {
  const { orders } = useOrder();

  const getStatusColor = (status) => {
    switch (status) {
      case "payment_pending": return "text-orange-600 bg-orange-50 border-orange-200"; // Should be rare now
      case "processing": return "text-blue-600 bg-blue-50 border-blue-200";
      case "on_delivery": return "text-purple-600 bg-purple-50 border-purple-200";
      case "completed": return "text-green-600 bg-green-50 border-green-200";
      case "cancelled": return "text-red-600 bg-red-50 border-red-200";
      default: return "text-gray-600 bg-gray-50 border-gray-200";
    }
  };

  const getStatusLabel = (status) => {
      switch(status) {
          case "payment_pending": return "Menunggu Konfirmasi";
          case "processing": return "Sedang Diproses";
          case "on_delivery": return "Sedang Dikirim";
          case "completed": return "Selesai";
          case "cancelled": return "Dibatalkan";
          default: return status;
      }
  }

  return (
    <div className="min-h-screen bg-dark-green/10 font-sans">
      <Navbar />
      
      <main className="max-w-4xl mx-auto px-6 py-28">
        <h1 className="text-3xl font-serif font-bold text-dark-green mb-8 flex items-center gap-3">
            <Package className="text-sage-green"/> Pesanan Saya
        </h1>

        {orders.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-3xl shadow-sm border border-gray-100">
            <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4 text-4xl">
                📦
            </div>
            <h3 className="font-bold text-gray-800 text-lg">Belum ada pesanan</h3>
            <p className="text-gray-400 text-sm mb-6">Yuk mulai belanja buket impianmu!</p>
            <Link href="/toko" className="px-6 py-3 bg-dark-green text-white rounded-full font-bold hover:bg-sage-green transition">
                Mulai Belanja
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {orders.map((order) => (
              <Link href={`/orders/${order.id}`} key={order.id}>
                <div className="bg-white p-5 mb-2 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md hover:border-sage-green transition group cursor-pointer">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                        <div className="flex items-center gap-2 mb-1">
                            <span className="font-mono text-xs text-gray-400">#{order.id}</span>
                            <span className="text-gray-300">•</span>
                            <span className="text-xs text-gray-500">{order.date}</span>
                        </div>
                        <h3 className="font-bold text-dark-green text-lg group-hover:text-sage-green transition">
                            {order.items && order.items[0] ? (order.items[0].title || order.items[0].name) : "Custom Bouquet"}
                            {order.items && order.items.length > 1 && <span className="text-xs text-gray-400 font-normal ml-2">+{order.items.length - 1} lainnya</span>}
                        </h3>
                    </div>
                    
                    <span className={`px-3 py-1 rounded-full text-xs font-bold border ${getStatusColor(order.status)}`}>
                        {getStatusLabel(order.status)}
                    </span>
                  </div>

                  <div className="flex justify-between items-end border-t border-gray-50 pt-4">
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                        <ShoppingBag size={16} className="text-gray-300"/>
                        {order.items && order.items[0]?.shop?.name || "Florist Partner"}
                    </div>
                    <div className="text-right">
                        <p className="text-xs text-gray-400 mb-0.5">Total Belanja</p>
                        <p className="font-bold text-dark-green">
                            {(order.financials?.grandTotal || order.totalPrice || 0).toLocaleString('id-ID', {style: 'currency', currency: 'IDR'})}
                        </p>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
}