"use client";
import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowLeft,
  Minus,
  Plus,
  ShoppingBag,
  Heart,
  Droplets,
  Leaf,
  BookOpen,
  MessageSquare, 
  Star, 
  User
} from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Link from "next/link"; // Jangan lupa import Link
import { allItems } from "@/app/utils/shop";
import { useCart } from "@/app/context/CartContext";
import { useToast } from "@/app/context/ToastContext";
import { useAuth } from "@/app/context/AuthContext";

export default function ProductDetailPage() {
  const { id } = useParams();
  const router = useRouter();
  const { addToCart } = useCart();
  const { showToast } = useToast();
  const { user } = useAuth();

  const [qty, setQty] = useState(1);
  const [activeTab, setActiveTab] = useState("story");

  // --- STATE REVIEW ---
  const [reviews, setReviews] = useState([]);
  const [newReview, setNewReview] = useState({ rating: 0, text: "" });
  const [hoverRating, setHoverRating] = useState(0);

  const product = allItems.find((p) => String(p.id) === String(id));

  // --- LOGIC REKOMENDASI PRODUK (You Might Also Like) ---
  const relatedProducts = product 
    ? allItems
        .filter((p) => p.category === product.category && String(p.id) !== String(id))
        .slice(0, 3) // Ambil maksimal 3
    : [];

  if (product && relatedProducts.length < 3) {
      const others = allItems.filter(p => String(p.id) !== String(id) && p.category !== product.category);
      while (relatedProducts.length < 3 && others.length > 0) {
          const randomIndex = Math.floor(Math.random() * others.length);
          relatedProducts.push(others[randomIndex]);
          others.splice(randomIndex, 1);
      }
  }

  // 1. Load Review
  useEffect(() => {
    if (product) {
        const storageKey = `reviews_${product.id}`;
        const savedReviews = localStorage.getItem(storageKey);
        
        if (savedReviews) {
            setReviews(JSON.parse(savedReviews));
        } else {
            setReviews([
                { id: 1, name: "Sinta Melati", rating: 5, text: "Bunganya segar banget, tahan lama!", date: "12 Okt 2025" },
                { id: 2, name: "Budi Santoso", rating: 4, text: "Pengiriman cepat, tapi packing agak penyok dikit.", date: "10 Okt 2025" }
            ]);
        }
    }
  }, [product]);

  // 2. Submit Review
  const handleSubmitReview = (e) => {
    e.preventDefault();
    if (!newReview.text.trim()) return;

    const reviewItem = {
        id: Date.now(),
        name: user ? user.name : "Anonymous Guest",
        rating: newReview.rating,
        text: newReview.text,
        date: new Date().toLocaleDateString("id-ID", { day: 'numeric', month: 'short', year: 'numeric' })
    };

    const updatedReviews = [reviewItem, ...reviews];
    setReviews(updatedReviews);
    localStorage.setItem(`reviews_${product.id}`, JSON.stringify(updatedReviews));
    setNewReview({ rating: 5, text: "" });
    showToast("Terima kasih atas ulasanmu!", "success");
  };

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

  const priceFormatted = new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumSignificantDigits: 3,
  }).format(product.price);

  const handleAddToCart = () => {
    addToCart(product, qty);
    showToast(`Berhasil menambahkan ${qty}x ${product.title} ke keranjang!`, "success");
  };

  const renderStars = (count) => {
    return [...Array(5)].map((_, i) => (
        <Star key={i} size={12} className={i < count ? "text-yellow-400 fill-current" : "text-gray-300"} />
    ));
  };

  return (
    <main className="bg-cream-bg min-h-screen">
      <Navbar />
      <div className="max-w-5xl mx-auto px-6 pt-32 pb-24">
        <motion.button
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          onClick={() => router.back()}
          className="flex items-center gap-2 text-sm font-bold text-gray-400 hover:text-dark-green mb-8 transition-colors group"
        >
          <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
          Back to Collection
        </motion.button>

        <div className="bg-white rounded-[2.5rem] shadow-xl overflow-hidden border border-white/50 p-6 md:p-10">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-16 items-start">
            
            {/* GAMBAR PRODUK */}
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
              <div className="absolute top-6 left-6">
                <span className={`px-4 py-2 rounded-full text-xs font-bold uppercase tracking-widest backdrop-blur-md shadow-sm text-white ${product.theme === "dark" ? "bg-dark-green/80" : "bg-sage-green/90"}`}>
                  {product.category} Mood
                </span>
              </div>
            </motion.div>

            {/* DETAIL PRODUK */}
            <div className="flex flex-col h-full pt-2">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <span className="text-xs font-bold text-sage-green tracking-[0.2em] uppercase mb-2 block">
                    {product.tag} Collection
                  </span>
                  <h1 className="text-4xl md:text-5xl font-serif font-bold text-dark-green leading-tight mb-2">
                    {product.title}
                  </h1>
                </div>
                <button className="w-10 h-10 rounded-full border border-gray-200 flex items-center justify-center text-gray-400 hover:border-red-200 hover:bg-red-50 hover:text-red-500 transition-colors">
                  <Heart size={20} />
                </button>
              </div>

              <p className="text-2xl font-sans font-medium text-gray-800 mb-6">{priceFormatted}</p>
              <p className="text-gray-500 leading-relaxed mb-8 font-light">{product.desc}</p>

              {/* --- TABS SECTION --- */}
              <div className="mb-8 bg-cream-bg/50 rounded-2xl p-2 border border-dark-green/5">
                <div className="flex gap-1 mb-4 border-b border-gray-200/50 px-2 overflow-x-auto">
                  {["story", "composition", "care", "reviews"].map((tab) => (
                    <button
                      key={tab}
                      onClick={() => setActiveTab(tab)}
                      className={`
                        flex-1 pb-3 text-xs font-bold uppercase tracking-wider transition-all relative min-w-[80px]
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

                <div className="px-2 pb-2 min-h-[120px] text-sm text-gray-600">
                  <AnimatePresence mode="wait">
                    
                    {/* TAB STORY */}
                    {activeTab === "story" && (
                      <motion.div key="story" initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -5 }} className="flex gap-3 items-start">
                        <BookOpen size={18} className="text-sage-green shrink-0 mt-0.5" />
                        <p className="leading-relaxed italic">"{product.story || product.desc}"</p>
                      </motion.div>
                    )}

                    {/* TAB COMPOSITION */}
                    {activeTab === "composition" && (
                      <motion.div key="composition" initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -5 }}>
                        <ul className="grid grid-cols-1 gap-2">
                          {product.composition ? (
                            product.composition.map((item, idx) => (
                              <li key={idx} className="flex items-center gap-2">
                                <Leaf size={14} className="text-sage-green" />
                                <span>{item}</span>
                              </li>
                            ))
                          ) : ( <p>Detail komposisi standar.</p> )}
                        </ul>
                      </motion.div>
                    )}

                    {/* TAB CARE */}
                    {activeTab === "care" && (
                      <motion.div key="care" initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -5 }} className="flex gap-3 items-start">
                        <Droplets size={18} className="text-blue-400 shrink-0 mt-0.5" />
                        <p className="leading-relaxed">{product.care || "Ganti air setiap hari dan potong batang."}</p>
                      </motion.div>
                    )}

                    {/* TAB REVIEWS */}
                    {activeTab === "reviews" && (
                        <motion.div key="reviews" initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -5 }}>
                            <form onSubmit={handleSubmitReview} className="mb-6 bg-white p-4 rounded-xl border border-gray-100 shadow-sm">
                                <p className="text-xs font-bold text-gray-400 uppercase mb-2">Tulis Ulasan</p>
                                <div className="flex gap-1 mb-3">
                                    {[1, 2, 3, 4, 5].map((star) => (
                                        <button 
                                            key={star} 
                                            type="button"
                                            onClick={() => setNewReview({...newReview, rating: star})}
                                            onMouseEnter={() => setHoverRating(star)}
                                            onMouseLeave={() => setHoverRating(0)}
                                            className="focus:outline-none transition-transform hover:scale-110"
                                        >
                                            <Star 
                                                size={20} 
                                                className={`${(hoverRating || newReview.rating) >= star ? "text-yellow-400 fill-current" : "text-gray-200"}`} 
                                            />
                                        </button>
                                    ))}
                                </div>
                                <textarea 
                                    placeholder="Ceritakan pengalamanmu..." 
                                    className="w-full text-sm bg-gray-50 rounded-lg p-3 focus:outline-none focus:ring-1 focus:ring-dark-green mb-3 resize-none h-20"
                                    value={newReview.text}
                                    onChange={(e) => setNewReview({...newReview, text: e.target.value})}
                                    required
                                />
                                <button type="submit" className="w-full bg-dark-green text-white py-2 rounded-lg text-xs font-bold uppercase tracking-wider hover:bg-sage-green transition">
                                    Kirim Ulasan
                                </button>
                            </form>

                            <div className="space-y-4 max-h-60 overflow-y-auto custom-scrollbar pr-2">
                                {reviews.length === 0 ? (
                                    <p className="text-center text-gray-400 italic text-xs py-4">Belum ada ulasan. Jadilah yang pertama!</p>
                                ) : (
                                    reviews.map((rev) => (
                                        <div key={rev.id} className="border-b border-gray-100 last:border-0 pb-4 last:pb-0">
                                            <div className="flex justify-between items-start mb-1">
                                                <div className="flex items-center gap-2">
                                                    <div className="w-6 h-6 rounded-full bg-gray-200 flex items-center justify-center text-gray-500">
                                                        <User size={12} />
                                                    </div>
                                                    <span className="font-bold text-dark-green text-xs">{rev.name}</span>
                                                </div>
                                                <span className="text-[10px] text-gray-400">{rev.date}</span>
                                            </div>
                                            <div className="flex gap-0.5 mb-1 pl-8">
                                                {renderStars(rev.rating)}
                                            </div>
                                            <p className="text-gray-600 text-xs pl-8 leading-relaxed">"{rev.text}"</p>
                                        </div>
                                    ))
                                )}
                            </div>
                        </motion.div>
                    )}

                  </AnimatePresence>
                </div>
              </div>

              <div className="mt-auto pt-6 border-t border-gray-100 flex gap-4">
                <div className="flex items-center gap-4 bg-gray-50 rounded-full px-4 py-3 border border-gray-200">
                  <button onClick={() => setQty(Math.max(1, qty - 1))} className="hover:text-dark-green transition">
                    <Minus size={16} />
                  </button>
                  <span className="font-bold w-4 text-center">{qty}</span>
                  <button onClick={() => setQty(qty + 1)} className="hover:text-dark-green transition">
                    <Plus size={16} />
                  </button>
                </div>

                <button onClick={handleAddToCart} className="flex-1 bg-dark-green text-white rounded-full font-bold uppercase tracking-wide hover:bg-sage-green transition-colors shadow-lg hover:shadow-xl flex items-center justify-center gap-2">
                  <ShoppingBag size={18} />
                  <span>Add to Cart</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* --- REKOMENDASI PRODUK (YOU MIGHT ALSO LIKE) - DIISI LOGIC --- */}
        <div className="mt-20 text-center">
          <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-8">You might also like</p>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {relatedProducts.map((item) => (
                <Link href={`/product/${item.id}`} key={item.id} className="group block bg-white rounded-2xl p-4 shadow-sm hover:shadow-xl transition-all border border-transparent hover:border-sage-green/30">
                    <div className="aspect-square bg-gray-100 rounded-xl overflow-hidden mb-4 relative">
                        <img 
                            src={item.image} 
                            alt={item.title} 
                            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" 
                        />
                        <div className="absolute top-2 right-2 bg-white/30 backdrop-blur-sm px-2 py-1 rounded-md text-[10px] font-bold text-white">
                            {item.category}
                        </div>
                    </div>
                    <div className="text-left">
                        <h4 className="font-serif font-bold text-dark-green text-lg leading-tight group-hover:text-sage-green transition-colors line-clamp-1">
                            {item.title}
                        </h4>
                        <p className="text-sm text-gray-500 mt-1">
                            {new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", maximumSignificantDigits: 3 }).format(item.price)}
                        </p>
                    </div>
                </Link>
            ))}
          </div>
        </div>

      </div>
      <Footer />
    </main>
  );
}