"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Navbar from "@/components/Navbar"; // Pastikan path import ini benar sesuai folder kamu

export default function DraftListPage() {
  const router = useRouter();
  const [drafts, setDrafts] = useState([]);

  // Load data pas halaman dibuka
  useEffect(() => {
    const saved = localStorage.getItem("flowerDrafts");
    if (saved) {
      setDrafts(JSON.parse(saved));
    }
  }, []);

  // Logic Hapus Draft
  const handleDelete = (id) => {
    if (confirm("Yakin mau hapus draft ini?")) {
        const updated = drafts.filter(d => d.id !== id);
        setDrafts(updated);
        localStorage.setItem("flowerDrafts", JSON.stringify(updated));
    }
  };

  // --- LOGIC CONTINUE EDITING (FIXED) ---
  const handleEdit = (draft) => {
    // 1. Simpan ID draft yang mau diedit ke LocalStorage sementara
    localStorage.setItem("editDraftId", draft.id);
    
    // 2. Pindah ke halaman builder
    router.push("/custom"); 
  };

  return (
    <div className="min-h-screen bg-[#F3F4F6] font-sans">
      <Navbar/>
      
      <div className="max-w-6xl mx-auto px-6 py-40">
        <div className="flex justify-between items-end mb-8">
            <div>
                <h1 className="text-4xl font-serif font-bold text-dark-green">Your Drafts</h1>
                <p className="text-gray-500 mt-2">Lanjutkan kreasimu yang tertunda.</p>
            </div>
            <Link href="/custom" className="px-6 py-3 bg-dark-green text-white rounded-full font-bold hover:bg-sage-green transition shadow-lg flex items-center gap-2">
                <span>+ New Bouquet</span>
            </Link>
        </div>

        {/* GRID DRAFTS */}
        {drafts.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {drafts.map((draft) => (
                    <div key={draft.id} className="group bg-white rounded-2xl p-4 shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 flex flex-col">
                        
                        {/* THUMBNAIL AREA */}
                        <div 
                            className="relative h-56 bg-gray-50 rounded-xl mb-4 overflow-hidden flex items-center justify-center border border-gray-100"
                            // Fallback color kalo canvasBg ga ada
                            style={{ backgroundColor: draft.canvasBg?.hex !== 'grid' ? (draft.canvasBg?.hex || '#ffffff') : '#f9fafb' }}
                        >
                            {/* Grid pattern kalo backgroundnya grid */}
                            {draft.canvasBg?.hex === 'grid' && (
                                <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(#000 1px, transparent 1px)', backgroundSize: '20px 20px' }}></div>
                            )}

                            {draft.previewImage ? (
                                <img src={draft.previewImage} alt="Preview" className="w-full h-full object-contain p-4 group-hover:scale-105 transition-transform duration-500" />
                            ) : (
                                <span className="text-4xl">🥀</span>
                            )}
                            
                            {/* Overlay Edit Button */}
                            <button 
                                onClick={() => handleEdit(draft)}
                                className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                            >
                                <span className="bg-white text-dark-green px-4 py-2 rounded-full font-bold text-sm shadow-lg transform scale-90 group-hover:scale-100 transition">
                                    Continue Editing
                                </span>
                            </button>
                        </div>

                        {/* INFO AREA */}
                        <div className="flex-1 flex flex-col">
                            <div className="flex justify-between items-start mb-1">
                                <h3 className="font-bold text-dark-green text-lg truncate w-3/4" title={draft.name}>{draft.name}</h3>
                                <button onClick={() => handleDelete(draft.id)} className="text-gray-300 hover:text-red-500 transition">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                        <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                                    </svg>
                                </button>
                            </div>
                            
                            <p className="text-xs text-gray-400 mb-3">Modified: {draft.date}</p>
                            
                            <div className="mt-auto pt-3 border-t border-gray-100 flex justify-between items-center">
                                <span className="text-xs font-bold text-gray-500">{draft.items.length} Items</span>
                                <span className="text-sm font-bold text-sage-green">
                                    {draft.totalPrice.toLocaleString('id-ID', {style: 'currency', currency: 'IDR', maximumSignificantDigits: 3})}
                                </span>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        ) : (
            // EMPTY STATE
            <div className="text-center py-24 bg-white rounded-3xl border-2 border-dashed border-gray-200">
                <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4 text-3xl">📝</div>
                <h3 className="text-xl font-serif font-bold text-dark-green mb-2">Belum ada Draft</h3>
                <p className="text-gray-400 mb-8 max-w-md mx-auto">Semua racikan bungamu yang belum selesai akan disimpan di sini.</p>
                <Link href="/custom" className="px-8 py-3 bg-dark-green text-white rounded-full font-bold hover:bg-sage-green transition shadow-lg">
                    Mulai Meracik
                </Link>
            </div>
        )}
      </div>
    </div>
  );
}