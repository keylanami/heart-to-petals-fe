"use client";
import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  ShoppingBag,
  ArrowUpRight,
  Sparkles,
  MapPin,
  Palette,
  Star,
  ArrowLeft,
  Store,
} from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Link from "next/link";
import { allItems, SHOPS } from "@/app/utils/shop";
import { useCart } from "@/app/context/CartContext";

// --- ANIMATION VARIANTS ---
const containerVariants = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.1 } },
};
const itemVariants = {
  hidden: { opacity: 0, scale: 0.9 },
  show: { opacity: 1, scale: 1 },
};

// --- COMPONENT: BENTO CARD ---
const BentoCard = ({ product, index, className }) => {
  const isDark = product.theme === "dark";
  const { addToCart } = useCart();

  const handleAddToCart = (e) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart(product, 1);
    alert(`${product.title} masuk keranjang!`);
  };

  return (
    <motion.div
      layout
      variants={itemVariants}
      initial="hidden"
      animate="show"
      exit="hidden"
      className={`group relative overflow-hidden cursor-pointer h-full shadow-sm hover:shadow-2xl transition-shadow duration-500 ${className}`}
    >
      <Link href={`/product/${product.id}`} className="absolute inset-0 z-10" />

      <div className="absolute inset-0 overflow-hidden">
        <img
          src={product.image}
          alt={product.title}
          className="w-full h-full object-cover transition-transform duration-700 ease-in-out group-hover:scale-110"
        />
      </div>
      <div
        className={`absolute inset-0 bg-gradient-to-t ${
          isDark
            ? "from-[#0F1F18] via-[#0F1F18]/40"
            : "from-[#8C8681] via-[#8C8681]/20"
        } to-transparent opacity-60 group-hover:opacity-80 transition-opacity duration-500`}
      ></div>
      <div className="absolute top-5 left-5 z-20 pointer-events-none">
        <span className="bg-white/20 backdrop-blur-md border border-white/30 text-white text-[10px] font-bold uppercase tracking-widest px-3 py-1 rounded-full shadow-sm">
          {product.tag}
        </span>
      </div>

      <div
        className={`absolute bottom-0 left-0 w-full p-6 md:p-8 flex flex-col justify-end z-20 pointer-events-none ${
          isDark ? "text-cream-bg" : "text-white"
        }`}
      >
        <div className="transform transition-transform duration-500 group-hover:-translate-y-2">
          <h3 className="text-2xl md:text-3xl font-serif font-bold leading-tight mb-1 drop-shadow-lg">
            {product.title}
          </h3>
          <p className="font-sans font-medium text-lg opacity-90 mb-2">
            {new Intl.NumberFormat("id-ID", {
              style: "currency",
              currency: "IDR",
              maximumSignificantDigits: 3,
            }).format(product.price)}
          </p>
        </div>
        <div className="grid grid-rows-[0fr] group-hover:grid-rows-[1fr] transition-[grid-template-rows] duration-500 ease-out">
          <div className="overflow-hidden">
            <p className="text-sm opacity-90 line-clamp-2 mb-5 leading-relaxed font-light">
              {product.desc}
            </p>
            <div className="flex gap-3 pb-1 pointer-events-auto">
              <button
                onClick={handleAddToCart}
                className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-full text-xs font-bold uppercase tracking-wide backdrop-blur-md border transition-all active:scale-95 ${
                  isDark
                    ? "bg-cream-bg/90 text-dark-green border-cream-bg hover:bg-white"
                    : "bg-dark-green/80 text-white border-dark-green/50 hover:bg-dark-green"
                }`}
              >
                <ShoppingBag size={14} /> Add
              </button>
              <button
                className={`flex-1 py-3 rounded-full text-xs font-bold uppercase tracking-wide transition-all active:scale-95 ${
                  isDark
                    ? "bg-transparent border border-cream-bg/50 text-cream-bg hover:bg-cream-bg hover:text-dark-green"
                    : "bg-white/20 border border-white/50 text-white hover:bg-white hover:text-dark-green"
                }`}
              >
                Buy Now
              </button>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

// --- COMPONENT: PROMO CARD (SUDAH DIPERBAIKI) ---
// Perhatikan: sekarang menerima props "shopId"
const PromoCard = ({ className, shopId }) => {
  return (
    <motion.div
      layout
      variants={itemVariants}
      initial="hidden"
      animate="show"
      exit="hidden"
      className={`group relative overflow-hidden h-full bg-gradient-to-br from-[#8FA89B] to-[#1A2F24] text-white p-8 md:p-10 flex flex-col justify-center items-start text-left shadow-xl ${className}`}
    >
      <div
        className="absolute inset-0 opacity-20 pointer-events-none mix-blend-overlay"
        style={{
          backgroundImage:
            "radial-gradient(circle at 2px 2px, rgba(255,255,255,0.8) 1px, transparent 0)",
          backgroundSize: "24px 24px",
        }}
      ></div>
      <span className="relative z-10 text-[10px] font-bold tracking-[0.2em] uppercase bg-white/20 border border-white/10 px-3 py-1 rounded-full mb-6 inline-block backdrop-blur-md">
        Exclusive Offer
      </span>
      <h3 className="relative z-10 text-3xl md:text-5xl font-serif font-bold mb-6 leading-[1.1]">
        Punya Cerita <br />{" "}
        <span className="italic text-cream-bg">Sendiri?</span>
      </h3>
      
      {/* UPDATE LINK DI SINI: Mengarah ke /custom/[shopId] */}
      <Link
        href={shopId ? `/custom/${shopId}` : "/custom"} 
        className="relative z-10 group/btn flex items-center gap-3 bg-cream-bg text-dark-green px-8 py-4 rounded-full font-bold text-sm hover:bg-white transition-all hover:scale-105 shadow-lg hover:shadow-xl"
      >
        <span>Mulai Custom Sekarang</span>
        <ArrowUpRight size={18} />
      </Link>
      <Sparkles
        strokeWidth={1}
        size={180}
        className="absolute -bottom-10 -right-10 text-white/5 rotate-12 pointer-events-none group-hover:scale-110 group-hover:rotate-45 transition-transform duration-700 ease-in-out"
      />
    </motion.div>
  );
};

// --- MAIN PAGE: STORE FRONT ---
export default function ShopEtalasePage() {
  const { id } = useParams();
  const router = useRouter();
  const [activeMood, setActiveMood] = useState("All");

  // 1. Ambil Data Toko
  const currentShop = SHOPS.find((s) => String(s.id) === String(id));

  // 2. Ambil Barang Toko (DENGAN FILTER PROMO)
  const shopProducts = allItems.filter((item) => {
    if (!currentShop) return false;
    if (item.type === "promo") {
      return currentShop.can_customize;
    }
    return item.shop?.id === currentShop.id;
  });

  const filteredItems =
    activeMood === "All"
    ? shopProducts
    : shopProducts.filter(
        (item) => item.type === "promo" || item.category === activeMood
      );

  const getBentoClass = (index) => {
    if (index % 6 === 0) return "md:col-span-2 md:row-span-2 min-h-[640px]";
    if (index % 5 === 0) return "md:col-span-2 md:row-span-1 min-h-[320px]";
    if (index % 3 === 0) return "md:col-span-1 md:row-span-2 min-h-[640px]";
    return "md:col-span-1 md:row-span-1 min-h-[320px]";
  };

  if (!currentShop)
    return <div className="text-center py-40">Toko tidak ditemukan</div>;

  return (
    <main className="bg-cream-bg min-h-screen relative">
      <Navbar />

      <div className="fixed top-0 left-0 w-full z-50 pointer-events-none h-screen">
        <div className="max-w-6xl mx-auto px-6 relative h-full">
          <div className="absolute top-32 pointer-events-auto">
            <button
              onClick={() => router.push("/toko")}
              className="w-12 h-12 bg-white/50 backdrop-blur-md border border-white/60 rounded-full flex items-center justify-center text-dark-green hover:bg-dark-green hover:text-white transition-all shadow-sm group"
            >
              <ArrowLeft
                size={22}
                className="group-hover:-translate-x-1 transition-transform"
              />
            </button>
          </div>
        </div>
      </div>

      <div className="relative pt-36 pb-12 px-6 text-center z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="w-24 h-24 mx-auto bg-gray-200 rounded-full overflow-hidden mb-6 border-4 border-white shadow-xl">
            <img
              src={currentShop.image}
              alt={currentShop.name}
              className="w-full h-full object-cover"
            />
          </div>
          <h1 className="text-4xl md:text-6xl font-serif text-dark-green mb-3">
            {currentShop.name}
          </h1>
          <div className="flex items-center justify-center gap-4 text-gray-500 text-sm mb-8">
            <span className="flex items-center gap-1">
              <MapPin size={14} /> {currentShop.location}
            </span>
            <span className="flex items-center gap-1 text-orange-500 font-bold bg-orange-50 px-2 py-0.5 rounded">
              <Star size={12} fill="currentColor" /> {currentShop.rating}
            </span>
          </div>

          {/* Tombol Custom Header (SUDAH DIPERBAIKI) */}
          {currentShop.can_customize && (
            <div className="mb-10">
              <Link
                // UPDATE LINK DI SINI: Mengarah ke /custom/[id]
                href={`/custom/${currentShop.id}`}
                className="inline-flex items-center gap-2 bg-dark-green text-white px-8 py-3 rounded-full font-bold hover:bg-sage-green transition shadow-lg"
              >
                <Palette size={18} /> Racik Buket Sendiri
              </Link>
            </div>
          )}
        </motion.div>

        {/* Filter Mood */}
        <div className="inline-flex bg-white/50 backdrop-blur-sm p-1.5 rounded-full border border-dark-green/10 shadow-sm relative mt-4">
          {["All", "Warm", "Gloomy"].map((mood) => {
            const isActive = activeMood === mood;
            return (
              <button
                key={mood}
                onClick={() => setActiveMood(mood)}
                className={`relative px-8 py-2.5 rounded-full text-sm font-bold transition-colors duration-300 z-10 ${
                  isActive
                    ? "text-white"
                    : "text-gray-500 hover:text-dark-green"
                }`}
              >
                {isActive && (
                  <motion.div
                    layoutId="activeTab"
                    className="absolute inset-0 bg-dark-green rounded-full shadow-md"
                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                  />
                )}
                <span className="relative z-10 flex items-center gap-2">
                  {mood === "Warm" && (
                    <Sparkles
                      size={12}
                      className={isActive ? "text-yellow-300" : ""}
                    />
                  )}
                  {mood}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 pb-32">
        <motion.div
          layout
          variants={containerVariants}
          initial="hidden"
          animate="show"
          className="grid grid-cols-1 md:grid-cols-4 gap-6 grid-flow-dense"
        >
          <AnimatePresence mode="popLayout">
            {filteredItems.map((item, index) => {
              if (item.type === "promo") {
                return (
                  // PENTING: Pass 'shopId' ke PromoCard
                  <PromoCard 
                    key={item.id} 
                    className={getBentoClass(index)} 
                    shopId={currentShop.id} 
                  />
                );
              }
              return (
                <BentoCard
                  key={item.id}
                  product={item}
                  index={index}
                  className={getBentoClass(index)}
                />
              );
            })}
          </AnimatePresence>
        </motion.div>

        {filteredItems.filter((i) => i.type !== "promo").length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-32 text-gray-400"
          >
            <p className="text-xl font-serif italic">
              Belum ada koleksi bunga untuk kategori ini di {currentShop.name}.
            </p>
          </motion.div>
        )}
      </div>
      <Footer />
    </main>
  );
}