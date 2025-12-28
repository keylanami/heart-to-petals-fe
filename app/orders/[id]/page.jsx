"use client";
import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import {
  CheckCircle2,
  Clock,
  AlertCircle,
  ChevronRight,
  Image as ImageIcon,
  XCircle,
  ShoppingBag,
  Info,
} from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useToast } from "@/app/context/ToastContext";

// --- 1. DUMMY DATA (Penyelamat Error Null) ---
// State awal pakai ini dulu biar UI ga kaget/crash saat data asli lagi diambil
const LOADING_STATE = {
  id: "Loading...",
  itemTitle: "Mengambil data pesanan...",
  shopName: "...",
  totalPrice: 0,
  dpAmount: 0,
  remainingAmount: 0,
  status: "loading", // status khusus
  timeline: [],
  financials: {
    // Struktur dari checkout
    payNowTotal: 0,
    dpAmount: 0,
    remainingAmount: 0,
    subtotalCustom: 0,
    subtotalCatalog: 0,
  },
};

export default function OrderProgressPage() {
  const router = useRouter();
  const params = useParams();
  const { showToast } = useToast();

  // Inisialisasi dengan LOADING_STATE (Bukan Null!)
  const [order, setOrder] = useState(LOADING_STATE);

  const [rejectReason, setRejectReason] = useState("");
  const [isRejecting, setIsRejecting] = useState(false);

  // --- 2. LOGIC PENGAMBILAN DATA (Robust) ---
  useEffect(() => {
    if (typeof window !== "undefined" && params?.id) {
      // A. Coba ambil dari "Jalur Cepat" (Data barusan checkout)
      const activeData = localStorage.getItem("active_order");
      let found = false;

      if (activeData) {
        try {
          const parsed = JSON.parse(activeData);
          // Cek ID cocok ga?
          if (String(parsed.id) === String(params.id)) {
            setOrder(parsed);
            found = true;
          }
        } catch (e) {
          console.error(e);
        }
      }

      // B. Kalau jalur cepat gagal, cari di "Database Utama" (orders)
      if (!found) {
        const allOrders = localStorage.getItem("orders");
        if (allOrders) {
          try {
            const parsedOrders = JSON.parse(allOrders);
            const targetOrder = parsedOrders.find(
              (o) => String(o.id) === String(params.id)
            );
            if (targetOrder) {
              setOrder(targetOrder);
              found = true;
            }
          } catch (e) {
            console.error(e);
          }
        }
      }

      // C. Kalau gak ketemu dimanapun
      if (!found) {
        // Biarkan user tau (bisa set state error atau redirect)
        console.log("Order tidak ditemukan di storage");
      }
    }
  }, [params?.id]);

  // --- ACTIONS (Update State & Storage) ---

  // Helper untuk update state sekaligus update localStorage agar sinkron
  const updateOrderData = (newData) => {
    setOrder(newData);

    // 1. Update Active Order (Cache)
    localStorage.setItem("active_order", JSON.stringify(newData));

    // 2. Update Global Orders
    const allOrders = JSON.parse(localStorage.getItem("orders") || "[]");
    const updatedList = allOrders.map((o) =>
      o.id === newData.id ? newData : o
    );
    localStorage.setItem("orders", JSON.stringify(updatedList));
  };

  const handleApprove = () => {
    // Clone timeline dengan aman
    const currentTimeline = order.timeline || [];
    const updatedTimeline = currentTimeline.map((t) =>
      t.type === "approval" && t.status === "pending"
        ? { ...t, status: "approved", desc: t.desc + " (Disetujui User)" }
        : t
    );

    updatedTimeline.unshift({
      id: Date.now(),
      date: "Baru saja",
      title: "Menunggu Pelunasan",
      desc: "Yeay! Desain disetujui. Silakan selesaikan pembayaran sisa & ongkir untuk pengiriman.",
      type: "info",
      status: "active",
    });

    updateOrderData({
      ...order,
      timeline: updatedTimeline,
      status: "payment_pending",
    });

    showToast("Desain disetujui! Lanjut ke pelunasan ya.", "success");
  };

  const handleReject = () => {
    if (!rejectReason.trim())
      return showToast("Isi alasan revisi dulu ya!", "error");

    const currentTimeline = order.timeline || [];
    const updatedTimeline = currentTimeline.map((t) =>
      t.type === "approval" && t.status === "pending"
        ? {
            ...t,
            status: "rejected",
            desc: t.desc + `\n\nCatatan Revisi: "${rejectReason}"`,
          }
        : t
    );

    updatedTimeline.unshift({
      id: Date.now(),
      date: "Baru saja",
      title: "Revisi Diminta",
      desc: `User meminta revisi: ${rejectReason}`,
      type: "info",
      status: "warning",
    });

    updateOrderData({
      ...order,
      timeline: updatedTimeline,
      status: "revision",
    });

    setIsRejecting(false);
    showToast("Permintaan revisi dikirim ke Florist.", "info");
  };

  const goToCheckout = () => {
    showToast("Mengalihkan ke halaman pembayaran...", "success");
    router.push(`/checkout/settlement/${order.id}`);
  };

  // --- UI HELPER (Menghitung Harga dengan Aman) ---
  const getDisplayData = () => {
    // Ambil data item pertama untuk judul
    const firstItem = Array.isArray(order.items) ? order.items[0] : null;
    const itemTitle = firstItem
      ? firstItem.title || firstItem.name
      : order.itemTitle || "Custom Bouquet";
    const shopName =
      firstItem?.shop?.name || order.shopName || "Florist Partner";

    // Ambil data financials (prioritas data dari checkout)
    const fin = order.financials || {};

    // Fallback logic yang kuat
    const dpVal =
      fin.dpAmount !== undefined ? fin.dpAmount : order.dpAmount || 0;
    const remainVal =
      fin.remainingAmount !== undefined
        ? fin.remainingAmount
        : order.remainingAmount || 0;

    // Hitung total value
    let totalVal = 0;
    if (fin.subtotalCustom || fin.subtotalCatalog) {
      totalVal = (fin.subtotalCustom || 0) + (fin.subtotalCatalog || 0);
    } else {
      totalVal = order.totalPrice || 0;
    }

    return { itemTitle, shopName, totalVal, dpVal, remainVal };
  };

  const { itemTitle, shopName, totalVal, dpVal, remainVal } = getDisplayData();

  // --- RENDER UI (Persis Request Kamu) ---
  return (
    <div className="min-h-screen bg-cream-bg font-sans">
      <Navbar />

      <main className="max-w-4xl mx-auto mt-10 px-6 py-24">
        <div className="mb-8">
          <div className="flex items-center gap-2 text-sm text-gray-400 mb-2">
            <span>Orders</span>
            <ChevronRight size={14} />
            
            <span className="truncate max-w-[200px] font-mono">{order.id}</span>
          </div>
          <h1 className="text-3xl font-serif font-bold text-dark-green mb-2">
            Progress Pesanan
          </h1>
          <p className="text-gray-500">
            Pantau proses pembuatan buket custom-mu di sini.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* KOLOM KIRI: TIMELINE */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 relative overflow-hidden">
              <div className="absolute left-9 top-6 bottom-6 w-0.5 bg-gray-100"></div>

              <div className="space-y-8 relative">
                {order.timeline && order.timeline.length > 0 ? (
                  order.timeline.map((event, idx) => (
                    <div key={idx} className="flex gap-4 relative">
                      <div
                        className={`w-8 h-8 rounded-full border-2 flex items-center justify-center shrink-0 z-10 bg-white
                            ${
                              event.status === "completed" ||
                              event.status === "approved"
                                ? "border-sage-green text-sage-green"
                                : event.status === "rejected"
                                ? "border-red-400 text-red-400"
                                : event.status === "warning"
                                ? "border-yellow-400 text-yellow-400"
                                : "border-gray-300 text-gray-300"
                            }
                        `}
                      >
                        {event.status === "completed" ||
                        event.status === "approved" ? (
                          <CheckCircle2 size={16} />
                        ) : event.status === "rejected" ? (
                          <XCircle size={16} />
                        ) : (
                          <Clock size={16} />
                        )}
                      </div>

                      <div className="flex-1 pt-1">
                        <div className="flex justify-between items-start mb-1">
                          <h4 className="font-bold text-dark-green text-sm md:text-base">
                            {event.title}
                          </h4>
                          <span className="text-[10px] text-gray-400 bg-gray-50 px-2 py-1 rounded-full">
                            {event.date}
                          </span>
                        </div>

                        <p className="text-sm text-gray-500 leading-relaxed mb-3 whitespace-pre-wrap">
                          {event.desc}
                        </p>

                        {event.image && (
                          <div className="mb-4 rounded-xl overflow-hidden border border-gray-100 w-fit max-w-full">
                            <img
                              src={event.image}
                              alt="Progress"
                              className="h-48 object-cover hover:scale-105 transition duration-500"
                            />
                          </div>
                        )}

                        {/* APPROVAL BOX */}
                        {event.type === "approval" &&
                          event.status === "pending" && (
                            <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4 mt-2 animate-in fade-in slide-in-from-top-2">
                              <div className="flex items-start gap-3 mb-3">
                                <AlertCircle
                                  className="text-yellow-600 shrink-0 mt-0.5"
                                  size={18}
                                />
                                <div>
                                  <h5 className="font-bold text-yellow-800 text-sm">
                                    Butuh Persetujuanmu
                                  </h5>
                                  <p className="text-xs text-yellow-700 mt-1">
                                    Mohon cek foto/deskripsi di atas. Apakah
                                    sudah sesuai keinginanmu?
                                  </p>
                                  <p className="text-[10px] text-yellow-600 mt-1 italic">
                                    *Kesempatan revisi hanya 1x.
                                  </p>
                                </div>
                              </div>

                              {!isRejecting ? (
                                <div className="flex gap-3">
                                  <button
                                    onClick={() => setIsRejecting(true)}
                                    className="flex-1 py-2 px-4 bg-white border border-red-200 text-red-500 rounded-lg text-sm font-bold hover:bg-red-50 transition"
                                  >
                                    Minta Revisi
                                  </button>
                                  <button
                                    onClick={handleApprove}
                                    className="flex-1 py-2 px-4 bg-dark-green text-white rounded-lg text-sm font-bold hover:bg-sage-green transition shadow-md"
                                  >
                                    Setujui & Lanjut
                                  </button>
                                </div>
                              ) : (
                                <div className="bg-white p-3 rounded-lg border border-gray-200">
                                  <label className="text-xs font-bold text-gray-500 mb-1 block">
                                    Detail Revisi (Max 1x)
                                  </label>
                                  <textarea
                                    value={rejectReason}
                                    onChange={(e) =>
                                      setRejectReason(e.target.value)
                                    }
                                    className="w-full text-sm p-2 border border-gray-200 rounded-md focus:outline-none focus:border-sage-green mb-2"
                                    rows="3"
                                    placeholder="Bagian mana yang ingin diubah?"
                                  />
                                  <div className="flex gap-2 justify-end">
                                    <button
                                      onClick={() => setIsRejecting(false)}
                                      className="text-xs text-gray-400 hover:text-gray-600 px-3 py-1"
                                    >
                                      Batal
                                    </button>
                                    <button
                                      onClick={handleReject}
                                      className="text-xs bg-red-500 text-white px-3 py-1 rounded-md font-bold hover:bg-red-600"
                                    >
                                      Kirim Revisi
                                    </button>
                                  </div>
                                </div>
                              )}
                            </div>
                          )}
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-center text-gray-400 py-10 text-xs">
                    {order.status === "loading"
                      ? "Memuat timeline..."
                      : "Belum ada aktivitas."}
                  </p>
                )}
              </div>
            </div>

            <div className="flex items-start gap-2 text-xs text-gray-400 px-2">
              <ShoppingBag className="w-4 h-4" />
              <p>Timeline ini diupdate langsung oleh Florist.</p>
            </div>
          </div>

          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 sticky top-24">
              <h3 className="font-serif font-bold text-dark-green text-xl mb-4">
                Rincian Order
              </h3>

              <div className="mb-6 pb-6 border-b border-gray-100">
                <p className="text-xs text-gray-400 uppercase tracking-wider font-bold mb-1">
                  Item
                </p>
                <p className="font-medium text-gray-700 line-clamp-2">
                  {itemTitle}
                </p>
                <p className="text-xs text-sage-green mt-1 flex items-center gap-1">
                  <ShoppingBag size={12} /> {shopName}
                </p>
              </div>

              <div className="space-y-3 mb-6">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Total Nilai</span>
                  <span className="font-medium">
                    {totalVal.toLocaleString("id-ID", {
                      style: "currency",
                      currency: "IDR",
                    })}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">
                    DP (40%){" "}
                    <span className="text-[10px] text-green-600 bg-green-50 px-1 rounded">
                      Lunas
                    </span>
                  </span>
                  <span className="font-medium text-green-600">
                    -
                    {dpVal.toLocaleString("id-ID", {
                      style: "currency",
                      currency: "IDR",
                    })}
                  </span>
                </div>
                <div className="border-t border-dashed border-gray-200 pt-3 flex justify-between items-center">
                  <span className="font-bold text-dark-green">
                    Sisa Tagihan
                  </span>
                  <span className="font-bold text-xl text-dark-green">
                    {remainVal.toLocaleString("id-ID", {
                      style: "currency",
                      currency: "IDR",
                    })}
                  </span>
                </div>
                <p className="text-[10px] text-gray-400 text-right">
                  *Belum termasuk ongkir
                </p>
              </div>

              {order.status === "payment_pending" ? (
                <div className="animate-bounce-slow">
                  <button
                    onClick={goToCheckout}
                    className="w-full py-4 bg-dark-green text-white rounded-xl font-bold text-sm hover:bg-sage-green transition shadow-lg shadow-green-900/20 flex items-center justify-center gap-2"
                  >
                    <ShoppingBag size={18} />
                    Bayar Pelunasan & Kirim
                  </button>
                  <p className="text-xs text-center text-sage-green mt-2 font-medium">
                    *Selesaikan pembayaran agar pesanan dikirim.
                  </p>
                </div>
              ) : (
                <button
                  disabled
                  className="w-full py-3 bg-gray-100 text-gray-400 rounded-xl font-bold text-sm cursor-not-allowed border border-gray-200"
                >
                  {order.status === "revision"
                    ? "Menunggu Revisi Florist..."
                    : order.status === "processing" ||
                      order.status === "waiting_approval"
                    ? "Menunggu Approval/Proses..."
                    : "Menunggu Approval Final..."}
                </button>
              )}
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
