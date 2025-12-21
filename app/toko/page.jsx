"use client";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  MapPin,
  Star,
  ArrowRight,
  Palette,
  ShoppingBag,
  ArrowUpRight,
  Sparkles,
  Store,
} from "lucide-react";
import { SHOPS, allItems } from "@/app/utils/shop";
import { useCart } from "@/app/context/CartContext";

// --- ANIMATION VARIANTS ---
const pageVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.15, delayChildren: 0.1 }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  show: { 
    opacity: 1, 
    y: 0, 
    transition: { type: "spring", stiffness: 50, damping: 20 } 
  }
};

// --- ENHANCED COMPONENT: TOP SHOP CARD (PORTAL STYLE) ---
const TopShopCard = ({ shop }) => (
  <motion.div variants={itemVariants}>
    <Link
      href={`/shop/${shop.id}`}
      className="group relative flex-shrink-0 w-[240px] h-[320px] block cursor-pointer"
    >
  
      <div className="w-full h-full rounded-md mt-2 overflow-hidden relative shadow-md group-hover:shadow-2xl transition-all duration-500 transform group-hover:-translate-y-2">
    
        <img
          src={shop.image}
          alt={shop.name}
          className="w-full h-full object-cover "
        />
        
        <div className="absolute inset-0 bg-gradient-to-t from-[#1A2F24] via-[#1A2F24]/40 to-transparent opacity-80 transition-opacity duration-300 group-hover:opacity-90"></div>


        <div className="absolute top-4 right-4 bg-white/20 backdrop-blur-md border border-white/20 px-2 py-1 rounded-full flex items-center gap-1 text-[10px] font-bold text-white shadow-sm">
           <Star size={10} fill="currentColor" className="text-yellow-400" /> {shop.rating}
        </div>

      
        <div className="absolute bottom-0 left-0 w-full p-6 text-white text-center">
           <h3 className="font-serif text-xl font-bold leading-tight mb-1 group-hover:text-sage-green transition-colors">
             {shop.name}
           </h3>
           <p className="text-[10px] text-white/70 uppercase tracking-widest mb-4 flex items-center justify-center gap-1">
             <MapPin size={10} /> {shop.location}
           </p>
           
          
           <div className="h-0 group-hover:h-8 overflow-hidden transition-all duration-300">
              <div className="flex items-center justify-center gap-2 text-[10px] font-bold uppercase tracking-widest text-sage-green opacity-0 group-hover:opacity-100 transition-opacity delay-100">
                 Visit Flowershop <ArrowRight size={12} />
              </div>
           </div>
        </div>
      </div>
    </Link>
  </motion.div>
);

// --- COMPONENT: BENTO CARD (ORIGINAL LAYOUT, NEW BUTTONS) ---
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
      variants={itemVariants} // Pakai variants untuk entrance animation
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
      
      {/* LABEL TOKO (Top Left) */}
      <div className="absolute top-5 left-5 z-20 pointer-events-none flex flex-col items-start gap-2">
         {product.shop && (
            <div className="bg-white/90 backdrop-blur-md border border-white/50 text-dark-green py-1.5 px-3 rounded-full shadow-lg flex items-center gap-1.5">
                <Store size={10} />
                <span className="text-[9px] font-bold uppercase tracking-widest">{product.shop.name}</span>
            </div>
         )}
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
                className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-full text-xs font-bold uppercase tracking-wide transition-all active:scale-95 ${
                  isDark
                    ? "bg-transparent border border-cream-bg/50 text-cream-bg hover:bg-cream-bg hover:text-dark-green"
                    : "bg-white/20 border border-white/50 text-white hover:bg-white hover:text-dark-green"
                }`}
              >
                Checkout
              </button>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

// --- COMPONENT: PROMO CARD ---
const PromoCard = ({ className }) => (
  <motion.div
    layout
    variants={itemVariants}
    className={`group relative overflow-hidden h-full bg-gradient-to-br from-[#8FA89B] to-[#1A2F24] text-white p-8 md:p-12 flex flex-col justify-center items-start text-left shadow-2xl ${className}`}
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
      Limited Edition
    </span>
    <h3 className="relative z-10 text-3xl md:text-5xl font-serif font-bold mb-6 leading-[1.1] tracking-tight">
      Punya Cerita <br />{" "}
      <span className="italic text-cream-bg font-light">Sendiri?</span>
    </h3>
    <Link
      href="/custom"
      className="relative z-10 group/btn flex items-center gap-3 bg-cream-bg text-dark-green px-8 py-4 rounded-full font-bold text-xs uppercase tracking-widest hover:bg-white transition-all hover:scale-105 shadow-xl"
    >
      <span>Mulai Custom</span>
      <ArrowUpRight size={16} />
    </Link>
    <Sparkles
      strokeWidth={1}
      size={200}
      className="absolute -bottom-10 -right-10 text-white/5 rotate-12 pointer-events-none group-hover:scale-110 group-hover:rotate-45 transition-transform duration-1000 ease-in-out"
    />
  </motion.div>
);

export default function TenantListPage() {
  const getBentoClass = (index) => {
    const pattern = [
      "md:col-span-2 md:row-span-2 min-h-[640px]",
      "md:col-span-1 md:row-span-1 min-h-[320px]",
      "md:col-span-1 md:row-span-2 min-h-[640px]",
      "md:col-span-1 md:row-span-1 min-h-[320px]",
      "md:col-span-2 md:row-span-1 min-h-[320px]",
      "md:col-span-1 md:row-span-1 min-h-[320px]",
      "md:col-span-3 md:row-span-1 min-h-[320px]",
    ];
    return pattern[index % 7];
  };

  return (
    <main className="bg-cream-bg min-h-screen">
      <Navbar />

      <style jsx global>{`
        .custom-scrollbar::-webkit-scrollbar {
          height: 8px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: rgba(143, 188, 143, 0.1);
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #1A2F24;
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #2F4F4F;
        }
      `}</style>

      <div className="pt-36 pb-24 px-4 md:px-6 max-w-7xl mx-auto">
        
        <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
        >
          <span className="text-xs font-bold tracking-[0.3em] text-sage-green uppercase mb-4 block">
            Florist Network
          </span>
          <h1 className="text-5xl md:text-7xl font-serif text-dark-green mb-6 tracking-tight">
            Marketplace{" "}
            <span className="italic font-light text-sage-green">&</span>{" "}
            Community
          </h1>
          <p className="text-gray-500 max-w-lg mx-auto text-lg font-light leading-relaxed">
            Jelajahi karya terbaik dari florist lokal pilihan kami.
          </p>
        </motion.div>

    
        <motion.section 
            variants={pageVariants}
            initial="hidden"
            animate="show"
            className="mb-24"
        >
          <motion.div variants={itemVariants} className="flex items-end justify-between mb-8 px-2">
            <h2 className="text-2xl font-serif font-bold text-dark-green flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-dark-green text-white flex items-center justify-center text-xs">
                1
              </span>
              Top Visited{" "}
              <span className="italic font-light text-sage-green">
                Florists
              </span>
            </h2>
            
          </motion.div>

          <motion.div 
            className="flex gap-6 overflow-x-auto pb-10 -mx-4 px-4 md:mx-0 md:px-0 custom-scrollbar"
            variants={pageVariants}
          >
            {SHOPS.map((shop) => (
              <TopShopCard key={shop.id} shop={shop} />
            ))}
          </motion.div>
        </motion.section>

        {/* --- SECTION 2: ETALASE BOUQUET --- */}
        <motion.section
            variants={pageVariants}
            initial="hidden"
            animate="show"
        >
          <motion.div variants={itemVariants} className="flex items-end justify-between mb-10 px-2">
            <h2 className="text-2xl font-serif font-bold text-dark-green flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-dark-green text-white flex items-center justify-center text-xs">
                2
              </span>
              All Collections{" "}
              <span className="italic font-light text-sage-green">
                Showcase
              </span>
            </h2>
          </motion.div>

          <motion.div
            className="grid grid-cols-1 md:grid-cols-4 gap-6 grid-flow-dense"
            variants={pageVariants}
          >
            <AnimatePresence>
                {allItems.map((item, index) => {
                if (item.type === "promo") {
                    return <PromoCard key={item.id} className={getBentoClass(index)} />;
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
        </motion.section>
      </div>
      <Footer />
    </main>
  );
}