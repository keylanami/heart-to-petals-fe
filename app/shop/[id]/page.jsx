"use client";
import { useState } from "react";
import { useParams, useRouter } from "next/navigation"; // useParams buat ambil ID dari URL
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, Minus, Plus, ShoppingBag, Heart, Droplets, Leaf, BookOpen } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { PRODUCTS } from "@/utils/data"; // Import data dummy

export default function ProductDetailPage() {
  const { id } = useParams(); // Ambil ID dari URL (misal: /shop/1 -> id = 1)
  const router = useRouter();
  
  // State
  const [qty, setQty] = useState(1);
  const [activeTab, setActiveTab] = useState("story"); // story | care | composition

  // Cari produk yang cocok dengan ID
  const product = PRODUCTS.find((p) => String(p.id) === String(id));

  // Handle jika produk tidak ditemukan (misal user asal ketik URL)
  if (!product) {
    return (
      <main className="bg-cream-bg min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-serif text-dark-green mb-4">Bunga Tidak Ditemukan 🥀</h1>
          <button onClick={() => router.back()} className="text-sage-green underline">Kembali ke Shop</button>
        </div>
      </main>
    );
  }

  // Format Harga
  const priceFormatted = new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", maximumSignificantDigits: 3 }).format(product.price);

  return (
    <main className="bg-cream-bg min-h-screen">
      <Navbar />

      {/* CONTAINER: Centered & Contained (Gak Full Screen) */}
      <div className="max-w-5xl mx-auto px-6 pt-32 pb-24">
        
        {/* Back Button */}
        <motion.button 
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            onClick={() => router.back()}
            className="flex items-center gap-2 text-sm font-bold text-gray-400 hover:text-dark-green mb-8 transition-colors group"
        >
            <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" /> 
            Back to Collection
        </motion.button>

        {/* MAIN LAYOUT: 2 Columns */}
        <div className="bg-white rounded-[2.5rem] shadow-xl overflow-hidden border border-white/50 p-6 md:p-10">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-16 items-start">
                
                {/* --- LEFT: IMAGE --- */}
                <motion.div 
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5 }}
                    className="relative aspect-[4/5] rounded-[2rem] overflow-hidden bg-gray-100 shadow-inner group"
                >
                    <img 
                        src={product.image} 
                        alt={product.title} 
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                    
                    {/* Badge Mood */}
                    <div className="absolute top-6 left-6">
                        <span className={`px-4 py-2 rounded-full text-xs font-bold uppercase tracking-widest backdrop-blur-md shadow-sm text-white ${product.theme === 'dark' ? 'bg-dark-green/80' : 'bg-sage-green/90'}`}>
                            {product.category} Mood
                        </span>
                    </div>
                </motion.div>


                {/* --- RIGHT: INFO --- */}
                <div className="flex flex-col h-full pt-2">
                    
                    {/* Header */}
                    <div className="flex justify-between items-start mb-4">
                        <div>
                            <span className="text-xs font-bold text-sage-green tracking-[0.2em] uppercase mb-2 block">{product.tag} Collection</span>
                            <h1 className="text-4xl md:text-5xl font-serif font-bold text-dark-green leading-tight mb-2">{product.title}</h1>
                        </div>
                        <button className="w-10 h-10 rounded-full border border-gray-200 flex items-center justify-center text-gray-400 hover:border-red-200 hover:bg-red-50 hover:text-red-500 transition-colors">
                            <Heart size={20} />
                        </button>
                    </div>

                    {/* Price */}
                    <p className="text-2xl font-sans font-medium text-gray-800 mb-6">{priceFormatted}</p>

                    {/* Short Desc */}
                    <p className="text-gray-500 leading-relaxed mb-8 font-light">
                        {product.desc}
                    </p>

                    {/* --- TABS SYSTEM (Story / Care / Composition) --- */}
                    <div className="mb-8 bg-cream-bg/50 rounded-2xl p-2 border border-dark-green/5">
                        <div className="flex gap-1 mb-4 border-b border-gray-200/50 px-2">
                            {['story', 'composition', 'care'].map((tab) => (
                                <button
                                    key={tab}
                                    onClick={() => setActiveTab(tab)}
                                    className={`
                                        flex-1 pb-3 text-xs font-bold uppercase tracking-wider transition-all relative
                                        ${activeTab === tab ? "text-dark-green" : "text-gray-400 hover:text-gray-600"}
                                    `}
                                >
                                    {tab}
                                    {activeTab === tab && (
                                        <motion.div layoutId="underline" className="absolute bottom-0 left-0 w-full h-[2px] bg-dark-green" />
                                    )}
                                </button>
                            ))}
                        </div>

                        {/* Tab Content */}
                        <div className="px-2 pb-2 min-h-[120px] text-sm text-gray-600">
                             <AnimatePresence mode="wait">
                                {activeTab === 'story' && (
                                    <motion.div 
                                        key="story" initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -5 }}
                                        className="flex gap-3 items-start"
                                    >
                                        <BookOpen size={18} className="text-sage-green shrink-0 mt-0.5" />
                                        <p className="leading-relaxed italic">"{product.story || product.desc}"</p>
                                    </motion.div>
                                )}
                                {activeTab === 'composition' && (
                                    <motion.div 
                                        key="composition" initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -5 }}
                                    >
                                        <ul className="grid grid-cols-1 gap-2">
                                            {product.composition ? product.composition.map((item, idx) => (
                                                <li key={idx} className="flex items-center gap-2">
                                                    <Leaf size={14} className="text-sage-green" />
                                                    <span>{item}</span>
                                                </li>
                                            )) : <p>Detail komposisi standar.</p>}
                                        </ul>
                                    </motion.div>
                                )}
                                {activeTab === 'care' && (
                                    <motion.div 
                                        key="care" initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -5 }}
                                        className="flex gap-3 items-start"
                                    >
                                        <Droplets size={18} className="text-blue-400 shrink-0 mt-0.5" />
                                        <p className="leading-relaxed">{product.care || "Ganti air setiap hari dan potong batang."}</p>
                                    </motion.div>
                                )}
                             </AnimatePresence>
                        </div>
                    </div>

                   
                    <div className="mt-auto pt-6 border-t border-gray-100 flex gap-4">
                
                        <div className="flex items-center gap-4 bg-gray-50 rounded-full px-4 py-3 border border-gray-200">
                            <button onClick={() => setQty(Math.max(1, qty - 1))} className="hover:text-dark-green transition"><Minus size={16} /></button>
                            <span className="font-bold w-4 text-center">{qty}</span>
                            <button onClick={() => setQty(qty + 1)} className="hover:text-dark-green transition"><Plus size={16} /></button>
                        </div>

                        <button className="flex-1 bg-dark-green text-white rounded-full font-bold uppercase tracking-wide hover:bg-sage-green transition-colors shadow-lg hover:shadow-xl flex items-center justify-center gap-2">
                            <ShoppingBag size={18} />
                            <span>Add to Cart</span>
                        </button>
                    </div>

                </div>
            </div>
        </div>

       
        <div className="mt-20 text-center">
            <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-4">You might also like</p>
            <div className="flex justify-center gap-4 opacity-50 hover:opacity-100 transition-opacity duration-500">
                <div className="w-12 h-12 rounded-full bg-gray-200"></div>
                <div className="w-12 h-12 rounded-full bg-gray-200"></div>
                <div className="w-12 h-12 rounded-full bg-gray-200"></div>
            </div>
        </div>

      </div>
      
      <Footer />
    </main>
  );
}