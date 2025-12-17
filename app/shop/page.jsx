"use client";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ShoppingBag, ArrowUpRight, Sparkles } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Link from "next/link";

// --- ANIMATION VARIANTS ---
const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

const itemVariants = {
  hidden: { opacity: 0, scale: 0.9 },
  show: { opacity: 1, scale: 1 }
};

// --- COMPONENT: BENTO CARD ---
const BentoCard = ({ product, index, className }) => {
  const isDark = product.theme === 'dark';

  return (
    <motion.div
      layout
      variants={itemVariants}
      initial="hidden"
      animate="show"
      exit="hidden"
      transition={{ duration: 0.5, type: "spring", bounce: 0.3 }}
      className={`group relative overflow-hidden cursor-pointer h-full shadow-sm hover:shadow-2xl transition-shadow duration-500 ${className}`}
    >
      
      {/* 1. Image with Zoom */}
      <div className="absolute inset-0 overflow-hidden">
        <img 
          src={product.image} 
          alt={product.title} 
          className="w-full h-full object-cover transition-transform duration-700 ease-in-out group-hover:scale-110"
        />
      </div>

      {/* 2. Enhanced Gradient Overlay */}
      {/* Gradasi dibuat lebih kuat di bawah agar teks selalu terbaca */}
      <div className={`absolute inset-0 bg-gradient-to-t ${isDark ? 'from-[#0F1F18] via-[#0F1F18]/40' : 'from-[#8C8681] via-[#8C8681]/20'} to-transparent opacity-60 group-hover:opacity-80 transition-opacity duration-500`}></div>

      {/* 3. Glass Badge */}
      <div className="absolute top-5 left-5 z-20">
        <span className="bg-white/20 backdrop-blur-md border border-white/30 text-white text-[10px] font-bold uppercase tracking-widest px-3 py-1 rounded-full shadow-sm">
          {product.tag}
        </span>
      </div>

      {/* 4. Floating Arrow Button */}
      <div className="absolute top-5 right-5 z-20 translate-x-10 opacity-0 group-hover:translate-x-0 group-hover:opacity-100 transition-all duration-300 delay-100 ease-out">
        <button className="bg-white text-dark-green w-10 h-10 rounded-full flex items-center justify-center shadow-lg hover:bg-sage-green hover:text-white transition-colors">
           <ArrowUpRight size={20} />
        </button>
      </div>

      {/* 5. Content Wrapper */}
      <div className={`absolute bottom-0 left-0 w-full p-6 md:p-8 flex flex-col justify-end z-10 ${isDark ? 'text-cream-bg' : 'text-white'}`}>
        
        {/* Title & Price - Slide Up Effect */}
        <div className="transform transition-transform duration-500 group-hover:-translate-y-2">
           <h3 className="text-2xl md:text-3xl font-serif font-bold leading-tight mb-1 drop-shadow-lg">
             {product.title}
           </h3>
           <p className="font-sans font-medium text-lg opacity-90 mb-2">
             {new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", maximumSignificantDigits: 3 }).format(product.price)}
           </p>
        </div>

        {/* Hidden Actions - Reveal Effect */}
        <div className="grid grid-rows-[0fr] group-hover:grid-rows-[1fr] transition-[grid-template-rows] duration-500 ease-out">
            <div className="overflow-hidden">
                <p className="text-sm opacity-90 line-clamp-2 mb-5 leading-relaxed font-light">
                  {product.desc}
                </p>
                
                <div className="flex gap-3 pb-1"> 
                  <button className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-full text-xs font-bold uppercase tracking-wide backdrop-blur-md border transition-all active:scale-95 ${isDark ? 'bg-cream-bg/90 text-dark-green border-cream-bg hover:bg-white' : 'bg-dark-green/80 text-white border-dark-green/50 hover:bg-dark-green'}`}>
                    <ShoppingBag size={14} /> Add
                  </button>
                  <button className={`flex-1 py-3 rounded-full text-xs font-bold uppercase tracking-wide transition-all active:scale-95 ${isDark ? 'bg-transparent border border-cream-bg/50 text-cream-bg hover:bg-cream-bg hover:text-dark-green' : 'bg-white/20 border border-white/50 text-white hover:bg-white hover:text-dark-green'}`}>
                    Buy Now
                  </button>
                </div>
            </div>
        </div>

      </div>
    </motion.div>
  );
};


// --- COMPONENT: PROMO CARD ---
const PromoCard = ({ className }) => {
  return (
    <motion.div
      layout
      variants={itemVariants}
      initial="hidden"
      animate="show"
      exit="hidden"
      transition={{ duration: 0.5 }}
      className={`group relative overflow-hidden h-full bg-gradient-to-br from-[#8FA89B] to-[#1A2F24] text-white p-8 md:p-10 flex flex-col justify-center items-start text-left shadow-xl ${className}`}
    >
      {/* Decorative Noise/Pattern */}
      <div className="absolute inset-0 opacity-20 pointer-events-none mix-blend-overlay" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, rgba(255,255,255,0.8) 1px, transparent 0)', backgroundSize: '24px 24px' }}></div>
      <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-[80px] -translate-y-1/2 translate-x-1/2 pointer-events-none"></div>

      <span className="relative z-10 text-[10px] font-bold tracking-[0.2em] uppercase bg-white/20 border border-white/10 px-3 py-1 rounded-full mb-6 inline-block backdrop-blur-md">
        Exclusive Offer
      </span>
      
      <h3 className="relative z-10 text-3xl md:text-5xl font-serif font-bold mb-6 leading-[1.1]">
        Punya Cerita <br/> <span className="italic text-cream-bg">Sendiri?</span>
      </h3>
      
      <p className="relative z-10 text-base md:text-lg opacity-90 mb-10 leading-relaxed max-w-sm font-light">
        Jangan biarkan perasaanmu terpendam. Racik bouquet spesial yang hanya dimengerti olehmu dan dia.
      </p>
      
      <Link href="/custom" className="relative z-10 group/btn flex items-center gap-3 bg-cream-bg text-dark-green px-8 py-4 rounded-full font-bold text-sm hover:bg-white transition-all hover:scale-105 shadow-lg hover:shadow-xl">
        <span>Mulai Custom Sekarang</span>
        <ArrowUpRight size={18} className="transition-transform group-hover/btn:translate-x-1 group-hover/btn:-translate-y-1" />
      </Link>

      <Sparkles strokeWidth={1} size={180} className="absolute -bottom-10 -right-10 text-white/5 rotate-12 pointer-events-none group-hover:scale-110 group-hover:rotate-45 transition-transform duration-700 ease-in-out" />
    </motion.div>
  );
};


const ShopPage = () => {
  const [activeMood, setActiveMood] = useState("All");

  // --- DATA DUMMY ---
  const allItems = [
    {
      id: 1, type: 'product', title: "Head Over Heels", price: 850000,
      image: "/assets/bouquet/peace/crimson_promise.png",
      category: "Warm", tag: "Romance", desc: "Cinta yang meledak-ledak dan penuh gairah.", theme: "light"
    },
    {
      id: 2, type: 'product', title: "Forgive Me", price: 550000,
      image: "/assets/bouquet/regret/sweet_apology.png",
      category: "Gloomy", tag: "Apology", desc: "Sampaikan maaf yang tulus ketika kata tak lagi cukup.", theme: "dark"
    },
    {
      id: 3, type: 'product', title: "Bright Future", price: 450000,
      image: "/assets/bouquet/peace/sunset_harmony.png",
      category: "Warm", tag: "Graduation", desc: "Menyambut masa depan cerah dengan senyuman.", theme: "light"
    },
    {
      id: 4, type: 'product', title: "Silent Tears", price: 700000,
      image: "/assets/bouquet/peace/crimson_promise.png",
      category: "Gloomy", tag: "Grief", desc: "Penghormatan terakhir untuk jiwa yang tenang.", theme: "dark"
    },
    {
      id: 'promo-1', type: 'promo' 
    },
    {
      id: 5, type: 'product', title: "Sweet Gratitude", price: 350000,
      image: "/assets/bouquet/peace/moonlight_serenity.png",
      category: "Warm", tag: "Thank You", desc: "Terima kasih yang manis untuk dia yang spesial.", theme: "light"
    },
    {
      id: 6, type: 'product', title: "Midnight Regret", price: 480000,
      image: "/assets/bouquet/regret/first_date_bloom.png",
      category: "Gloomy", tag: "Regret", desc: "Penyesalan terdalam di tengah malam yang sunyi.", theme: "dark"
    },
    {
      id: 7, type: 'product', title: "Silent Tears", price: 700000,
      image: "/assets/bouquet/peace/crimson_promise.png",
      category: "Gloomy", tag: "Grief", desc: "Penghormatan terakhir untuk jiwa yang tenang.", theme: "dark"
    },
    {
      id: 8, type: 'product', title: "Sweet Gratitude", price: 350000,
      image: "/assets/bouquet/peace/moonlight_serenity.png",
      category: "Warm", tag: "Thank You", desc: "Terima kasih yang manis untuk dia yang spesial.", theme: "light"
    },
    {
      id: 9, type: 'product', title: "Midnight Regret", price: 480000,
      image: "/assets/bouquet/regret/first_date_bloom.png",
      category: "Gloomy", tag: "Regret", desc: "Penyesalan terdalam di tengah malam yang sunyi.", theme: "dark"
    },
    {
      id: 10, type: 'product', title: "Sweet Gratitude", price: 350000,
      image: "/assets/bouquet/peace/moonlight_serenity.png",
      category: "Warm", tag: "Thank You", desc: "Terima kasih yang manis untuk dia yang spesial.", theme: "light"
    },
    {
      id: 11, type: 'product', title: "Midnight Regret", price: 480000,
      image: "/assets/bouquet/regret/first_date_bloom.png",
      category: "Gloomy", tag: "Regret", desc: "Penyesalan terdalam di tengah malam yang sunyi.", theme: "dark"
    },
    {
      id: 12, type: 'product', title: "Silent Tears", price: 700000,
      image: "/assets/bouquet/peace/crimson_promise.png",
      category: "Gloomy", tag: "Grief", desc: "Penghormatan terakhir untuk jiwa yang tenang.", theme: "dark"
    },
    {
      id:13, type: 'product', title: "Sweet Gratitude", price: 350000,
      image: "/assets/bouquet/peace/moonlight_serenity.png",
      category: "Warm", tag: "Thank You", desc: "Terima kasih yang manis untuk dia yang spesial.", theme: "light"
    },
    {
      id: 'promo-2', type: 'promo' 
    },
    {
      id: 14, type: 'product', title: "Midnight Regret", price: 480000,
      image: "/assets/bouquet/regret/first_date_bloom.png",
      category: "Gloomy", tag: "Regret", desc: "Penyesalan terdalam di tengah malam yang sunyi.", theme: "dark"
    },
    {
      id: 15, type: 'product', title: "Midnight Regret", price: 480000,
      image: "/assets/bouquet/peace/moonlight_serenity.png",
      category: "Warm", tag: "Peace", desc: "Penyesalan terdalam di tengah malam yang sunyi.", theme: "dark"
    },
    {
      id: 16, type: 'product', title: "Midnight Regret", price: 480000,
      image: "/assets/bouquet/peace/moonlight_serenity.png",
      category: "Warm", tag: "Peace", desc: "Penyesalan terdalam di tengah malam yang sunyi.", theme: "dark"
    }
  ];

  const filteredItems = activeMood === "All" 
    ? allItems
    : allItems.filter(item => item.type === 'promo' || item.category === activeMood);

  // Logic Bento Class
  const getBentoClass = (index) => {
    const pattern = [
      "md:col-span-2 md:row-span-2 min-h-[640px]", // 0: Big
      "md:col-span-1 md:row-span-1 min-h-[320px]", // 1: Small
      "md:col-span-1 md:row-span-2 min-h-[640px]", // 2: Tall
      "md:col-span-2 md:row-span-2 min-h-[640px]", // 3: PROMO (BIG BOX)
      "md:col-span-2 md:row-span-1 min-h-[320px]", // 4: Wide
      "md:col-span-1 md:row-span-1 min-h-[320px]", // 5: Small
      "md:col-span-1 md:row-span-1 min-h-[320px]", // 6: Small
    ];
    return pattern[index % pattern.length];
  };

  return (
    <main className="bg-cream-bg min-h-screen relative">
      <Navbar />

      <div className="relative pt-32 pb-12 px-6 text-center z-10">
        <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
        >
            <span className="text-xs font-bold tracking-[0.2em] text-sage-green uppercase mb-3 block">Curated Florals</span>
            <h1 className="text-5xl md:text-7xl font-serif text-dark-green mb-8">
            The <span className="italic font-light">Collection</span>
            </h1>
        </motion.div>
        
        {/* TAB FILTER */}
        <div className="inline-flex bg-white/50 backdrop-blur-sm p-1.5 rounded-full border border-dark-green/10 shadow-sm relative">
          {["All", "Warm", "Gloomy"].map((mood) => {
             const isActive = activeMood === mood;
             return (
                <button
                    key={mood}
                    onClick={() => setActiveMood(mood)}
                    className={`
                        relative px-8 py-2.5 rounded-full text-sm font-bold transition-colors duration-300 z-10
                        ${isActive ? "text-white" : "text-gray-500 hover:text-dark-green"}
                    `}
                >
                    {isActive && (
                        <motion.div
                            layoutId="activeTab"
                            className="absolute inset-0 bg-dark-green rounded-full shadow-md"
                            transition={{ type: "spring", stiffness: 300, damping: 30 }}
                        />
                    )}
                    <span className="relative z-10 flex items-center gap-2">
                        {mood === "Warm" && <Sparkles size={12} className={isActive ? "text-yellow-300" : ""} />}
                        {mood}
                    </span>
                </button>
             );
          })}
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 pb-32">
        {/* ANIMATED GRID CONTAINER */}
        <motion.div 
            layout 
            variants={containerVariants}
            initial="hidden"
            animate="show"
            className="grid grid-cols-1 md:grid-cols-4 gap-6 grid-flow-dense"
        >
          <AnimatePresence mode="popLayout">
            {filteredItems.map((item, index) => {
               if (item.type === 'promo') {
                 return (
                   <PromoCard 
                      key={item.id}
                      className={getBentoClass(index)}
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

        {filteredItems.length === 0 && (
           <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-32 text-gray-400">
             <p className="text-xl font-serif italic">Belum ada bunga dengan mood ini.</p>
           </motion.div>
        )}
      </div>
      <Footer />
    </main>
  );
};

export default ShopPage;