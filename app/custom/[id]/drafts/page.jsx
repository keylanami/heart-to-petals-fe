"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter, useParams } from "next/navigation";
import Navbar from "@/components/Navbar";
import { useCart } from "@/app/context/CartContext";
import { useToast } from "@/app/context/ToastContext";
import { ShoppingBag, Trash2, Edit3, ArrowLeft } from "lucide-react";

export default function DraftListPage() {
  const router = useRouter();
  const params = useParams();
  const { addToCart } = useCart();
  const { showToast } = useToast();
  const [drafts, setDrafts] = useState([]);

  useEffect(() => {
    const saved = localStorage.getItem("flowerDrafts");
    if (saved) {
      setDrafts(JSON.parse(saved));
    }
  }, []);

  const handleDelete = (id) => {
    if (confirm("Yakin mau hapus draft ini?")) {
      const updated = drafts.filter((d) => d.id !== id);
      setDrafts(updated);
      localStorage.setItem("flowerDrafts", JSON.stringify(updated));

      showToast("Draft berhasil dihapus.", "success");
    }
  };

  const handleDeleteDraft = (id) => {
    const updated = drafts.filter((d) => d.id !== id);
    setDrafts(updated);
    localStorage.setItem("flowerDrafts", JSON.stringify(updated));
  };

  const handleEdit = (draft) => {
    localStorage.setItem("editDraftId", draft.id);
    const targetShopId = draft.shop?.id || params.id;
    router.push(`/custom/${targetShopId}`);
  };

  const handleMoveToCart = (draft) => {
    if (!draft || !draft.items || draft.items.length === 0) {
      showToast("Draft kosong, tidak bisa diproses!", "error");
      return;
    }

    const cartItem = {
      id: `custom-${draft.id}`,
      title: draft.name || "Custom Bouquet",
      price: draft.totalPrice, 
      image: draft.previewImage || draft.designImage,
      qty: 1,
      category: "Custom Order",
      shop: draft.shop,
      isCustom: true,

      customData: {
        flowers: draft.items,
        packaging: draft.packaging,
        canvasBg: draft.canvasBg,
        refImage: draft.refImagePreview,
      },
    };

    addToCart(cartItem);
    handleDeleteDraft(draft.id);

    showToast("Berhasil dipindahkan ke Keranjang!", "success");
    router.push("/cart");
  };

  return (
    <div className="min-h-screen bg-[#F3F4F6] font-sans">
      <Navbar />

      <div className="max-w-6xl mx-auto px-6 py-40">
        <div className="flex flex-col md:flex-row justify-between items-end mb-8 gap-4">
          <div>
            <Link
              href={`/custom/${params.id}`}
              className="text-gray-400 text-sm hover:text-dark-green mb-2 flex items-center gap-1"
            >
              <ArrowLeft size={14} /> Back to Builder
            </Link>
            <h1 className="text-4xl font-serif font-bold text-dark-green">
              Your Drafts
            </h1>
            <p className="text-gray-500 mt-2">
              Lanjutkan kreasimu yang tertunda.
            </p>
          </div>

          <Link
            href={`/custom/${params.id}`}
            className="px-6 py-3 bg-dark-green text-white rounded-full font-bold hover:bg-sage-green transition shadow-lg flex items-center gap-2"
          >
            <span>+ New Bouquet</span>
          </Link>
        </div>

        {drafts.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {drafts.map((draft) => (
              <div
                key={draft.id}
                className="group bg-white rounded-2xl p-4 shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 flex flex-col"
              >
                <div
                  className="relative h-56 bg-gray-50 rounded-xl mb-4 overflow-hidden flex items-center justify-center border border-gray-100"
                  style={{
                    backgroundColor:
                      draft.canvasBg?.hex !== "grid"
                        ? draft.canvasBg?.hex || "#ffffff"
                        : "#f9fafb",
                  }}
                >
                  {draft.canvasBg?.hex === "grid" && (
                    <div
                      className="absolute inset-0 opacity-10"
                      style={{
                        backgroundImage:
                          "radial-gradient(#000 1px, transparent 1px)",
                        backgroundSize: "20px 20px",
                      }}
                    ></div>
                  )}

                  {draft.previewImage ? (
                    <img
                      src={draft.previewImage}
                      alt="Preview"
                      className="w-full h-full object-contain p-4 group-hover:scale-105 transition-transform duration-500"
                    />
                  ) : (
                    <span className="text-4xl">🥀</span>
                  )}

                  <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 gap-2">
                    <button
                      onClick={() => handleEdit(draft)}
                      className="bg-white text-dark-green px-4 py-2 rounded-full font-bold text-sm shadow-lg transform scale-90 group-hover:scale-100 transition flex items-center gap-2"
                    >
                      <Edit3 size={14} /> Edit
                    </button>
                  </div>
                </div>

                <div className="flex-1 flex flex-col">
                  <div className="flex justify-between items-start mb-1">
                    <h3
                      className="font-bold text-dark-green text-lg truncate w-3/4"
                      title={draft.name}
                    >
                      {draft.name}
                    </h3>
                    <button
                      onClick={() => handleDelete(draft.id)}
                      className="text-gray-300 hover:text-red-500 transition"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>

                  <p className="text-xs text-sage-green font-bold uppercase tracking-wider mb-1">
                    {draft.shop?.name || "Unknown Store"}
                  </p>
                  <p className="text-[10px] text-gray-400 mb-4">
                    Modified: {draft.date}
                  </p>

                  <div className="mt-auto pt-3 border-t border-gray-100 flex justify-between items-center">
                    <div>
                      <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">
                        {draft.items.length} Items
                      </p>
                      <p className="text-sm font-bold text-dark-green">
                        {draft.totalPrice.toLocaleString("id-ID", {
                          style: "currency",
                          currency: "IDR",
                          maximumSignificantDigits: 3,
                        })}
                      </p>
                    </div>

                    <button
                      onClick={() => handleMoveToCart(draft)}
                      className="w-10 h-10 rounded-full bg-gray-100 hover:bg-dark-green hover:text-white text-dark-green flex items-center justify-center transition-all shadow-sm active:scale-95"
                      title="Add to Cart"
                    >
                      <ShoppingBag size={18} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-24 bg-white rounded-3xl border-2 border-dashed border-gray-200">
            <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4 text-3xl">
              📝
            </div>
            <h3 className="text-xl font-serif font-bold text-dark-green mb-2">
              Belum ada Draft
            </h3>
            <p className="text-gray-400 mb-8 max-w-md mx-auto">
              Semua racikan bungamu yang belum selesai akan disimpan di sini.
            </p>

            <Link
              href={`/custom/${params.id}`}
              className="px-8 py-3 bg-dark-green text-white rounded-full font-bold hover:bg-sage-green transition shadow-lg"
            >
              Mulai Meracik
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
