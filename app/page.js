"use client";
import { useState, useEffect, useRef } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search,
  MapPin,
  Star,
  ArrowRight,
  Sparkles,
  Store,
} from "lucide-react";
import { allItems } from "@/app/utils/shop";
import { SHOPS } from "./utils/tenants";
import { PROMOS } from "./utils/data";

// --- KOMPONEN BARU: DASHBOARD PRODUCT CARD (Gallery Style) ---
const DashboardProductCard = ({ item }) => {
  return (
    <Link
      href={`/product/${item.id}`}
      className="group relative flex-shrink-0 w-[260px] md:w-[300px] h-[480px] cursor-pointer mr-8"
    >
      <div className="absolute -top-3 -left-3 z-20">
        <div className="bg-white border border-gray-100 shadow-md py-2 px-4 rounded-tr-xl rounded-bl-xl flex items-center gap-2 transform group-hover:-translate-y-1 transition-transform duration-300">
          <div className="bg-sage-green/20 p-1 rounded-full text-dark-green">
            <Store size={12} />
          </div>
          <span className="text-xs font-bold text-dark-green tracking-wide uppercase">
            {item.shop?.name || "Official Store"}
          </span>
        </div>
      </div>

      <div className="w-full h-[85%] rounded-[2rem] overflow-hidden relative shadow-sm group-hover:shadow-2xl transition-all duration-500 border border-gray-100">
        <motion.img
          src={item.image}
          alt={item.title}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
        />

        <div className="absolute inset-0 bg-black/10 group-hover:bg-transparent transition-colors"></div>

        <div className="absolute bottom-0 right-0 bg-white/90 backdrop-blur-md px-5 py-3 rounded-tl-[2rem] text-dark-green font-bold font-sans">
          {new Intl.NumberFormat("id-ID", {
            style: "currency",
            currency: "IDR",
            maximumSignificantDigits: 3,
          }).format(item.price)}
        </div>
      </div>

      <div className="mt-4 px-2">
        <div className="flex justify-between items-start">
          <div>
            <h3 className="text-2xl font-serif font-bold text-dark-green leading-none mb-1 group-hover:text-sage-green transition-colors">
              {item.title}
            </h3>
            <p className="text-xs text-gray-400 uppercase tracking-[0.2em] font-medium">
              {item.category} Collection
            </p>
          </div>

          <div className="opacity-0 group-hover:opacity-100 transition-opacity transform translate-y-2 group-hover:translate-y-0 duration-300">
            <ArrowRight size={20} className="text-sage-green -rotate-45" />
          </div>
        </div>
      </div>
    </Link>
  );
};


const Snowfall = () => {
const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient) return null; 

  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
      {[...Array(10)].map((_, i) => (
        <motion.div
          key={i}
          initial={{ y: -10, opacity: 0 }}
          animate={{ y: "100vh", opacity: [0, 1, 0] }}
          transition={{
            duration: Math.random() * 5 + 5,
            repeat: Infinity,
            delay: Math.random() * 5,
            ease: "linear",
          }}
          className="absolute text-white/30"
          style={{
            left: `${Math.random() * 100}%`,
            fontSize: `${Math.random() * 20 + 10}px`,
          }}
        >
          ❄
        </motion.div>
      ))}
    </div>
  );
};

// --- MAIN DASHBOARD PAGE ---
export default function DashboardPage() {
  const [currentPromo, setCurrentPromo] = useState(0);
  const carouselRef = useRef(null);

  // Auto Slide Promo
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentPromo((prev) => (prev + 1) % PROMOS.length);
    }, 4000);
    return () => clearInterval(timer);
  }, []);

  // Data Filter
  const bestSellers = allItems.filter((i) => i.type !== "promo").slice(0, 5);
  // Pastikan data 'nearestShops' juga diurutkan berdasarkan jarak (string "1.2 km" perlu diparse kalau mau akurat, ini simulasi aja)
  const nearestShops = SHOPS.slice(0, 4);

  return (
    <main className="bg-cream-bg min-h-screen pb-24">
      <Navbar />

      <section className="relative pt-36 pb-10 px-4 md:px-6 overflow-hidden">
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="flex justify-between items-end mb-6 px-2">
            <div>
              <p className="text-sage-green text-xs font-bold tracking-widest uppercase mb-3">
                Welcome back, Kei
              </p>
              <h1 className="text-3xl md:text-5xl font-serif font-bold text-dark-green mb-4">
                Season's <span className="italic font-light">Greetings</span> 🎄
              </h1>
            </div>
          </div>

          <div className="relative w-full h-[400px] md:h-[500px] rounded-[2.5rem] overflow-hidden shadow-2xl mb-10">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentPromo}
                initial={{ opacity: 0, scale: 1.05 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.8 }}
                className={`absolute inset-0 w-full h-full ${PROMOS[currentPromo].bg} flex items-center`}
              >
                <div className="absolute inset-0 opacity-40 mix-blend-overlay">
                  <img
                    src={PROMOS[currentPromo].image}
                    className="w-full h-full object-cover"
                  />
                </div>
                <Snowfall />
                <div className="relative z-10 px-8 md:px-16 max-w-2xl">
                  <span
                    className={`text-xs font-bold tracking-[0.2em] uppercase border border-current px-3 py-1 rounded-full mb-4 inline-block ${PROMOS[currentPromo].text}`}
                  >
                    Special Offer
                  </span>
                  <h2
                    className={`text-4xl md:text-7xl font-serif font-bold mb-6 leading-tight ${PROMOS[currentPromo].text}`}
                  >
                    {PROMOS[currentPromo].title}
                  </h2>
                  <p
                    className={`text-lg md:text-xl opacity-90 mb-10 font-light ${PROMOS[currentPromo].text}`}
                  >
                    {PROMOS[currentPromo].subtitle}
                  </p>
                  <Link
                    href="/toko"
                    className="bg-white text-dark-green px-8 py-3.5 rounded-full font-bold shadow-lg hover:bg-cream-bg transition inline-flex items-center gap-2"
                  >
                    Shop Now <ArrowRight size={16} />
                  </Link>
                </div>
              </motion.div>
            </AnimatePresence>
            <div className="absolute bottom-6 left-0 w-full flex justify-center gap-2 z-20">
              {PROMOS.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setCurrentPromo(idx)}
                  className={`w-2 h-2 rounded-full transition-all duration-300 ${
                    currentPromo === idx ? "w-8 bg-white" : "bg-white/50"
                  }`}
                />
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="mb-20 pl-4 md:pl-0 overflow-hidden">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-end mb-16 pt-10 pr-6 pl-10">
            <div className="relative">
              <div className="absolute -left-6 top-1 w-1 h-full bg-dark-green rounded-full hidden md:block"></div>
              <h2 className="text-4xl md:text-5xl font-serif font-bold text-dark-green mb-2">
                Curated{" "}
                <span className="italic font-light text-sage-green">
                  Favorites
                </span>
              </h2>
              <p className="text-gray-500 max-w-md">
                Koleksi terpopuler dari berbagai tenant pilihan.
              </p>
            </div>
            <Link
              href="/toko"
              className="hidden md:flex items-center gap-2 text-sm font-bold text-dark-green border-b border-dark-green pb-1 hover:text-sage-green hover:border-sage-green transition-all mt-4 md:mt-0"
            >
              LIHAT SEMUA <ArrowRight size={14} />
            </Link>
          </div>

          <motion.div
            ref={carouselRef}
            className="cursor-grab active:cursor-grabbing"
            whileTap={{ cursor: "grabbing" }}
          >
            <motion.div
              drag="x"
              dragConstraints={{ right: 0, left: -1000 }}
              className="flex touch-pan-x pl-2 pb-10"
            >
              {bestSellers.map((item, idx) => (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, x: 50 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, delay: idx * 0.1 }}
                  viewport={{ once: true }}
                >
                  <DashboardProductCard item={item} />
                </motion.div>
              ))}

              <Link
                href="/toko"
                className="flex-shrink-0 w-40 h-[400px] flex flex-col items-center justify-center rounded-[2rem] border-2 border-dashed border-dark-green/30 text-dark-green hover:bg-dark-green hover:text-white transition-all group ml-4 mr-10 mt-4"
              >
                <span className="font-serif font-bold text-lg text-center">
                  Explore
                  <br />
                  More
                </span>
                <div className="w-10 h-10 rounded-full border border-current flex items-center justify-center mt-4 group-hover:rotate-45 transition-transform">
                  <ArrowRight size={18} />
                </div>
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </section>

      <section className="mb-16 pl-6 md:pl-0 bg-white py-16 -mx-6 md:mx-0 md:rounded-[3rem]">
        <div className="max-w-7xl mx-auto md:px-6">
          <div className="flex justify-between items-end mb-8 pr-6">
            <div>
              <div className="flex items-center gap-2 text-sage-green mb-2">
                <MapPin size={16} />
                <span className="text-xs font-bold uppercase tracking-widest">
                  Near You
                </span>
              </div>
              <h2 className="text-3xl font-serif font-bold text-dark-green">
                Florist Terdekat
              </h2>
            </div>
          </div>

          <div className="flex gap-6 overflow-x-auto pb-4 pr-6 md:pr-0 scrollbar-hide">
            {nearestShops.map((shop) => (
              <Link
                href={`/shop/${shop.id}`}
                key={shop.id}
                className="flex-shrink-0 w-72 group cursor-pointer"
              >
                <div className="h-48 rounded-xl overflow-hidden relative mb-4">
                  <img
                    src={shop.image}
                    className="w-full h-full object-cover group-hover:opacity-60 transition-opacity "
                  />
                  <div className="absolute top-3 left-3 bg-white/90 backdrop-blur text-[10px] font-bold px-2 py-1 rounded-md shadow-sm">
                    {shop.distance}
                  </div>
                </div>
                <h3 className="text-xl font-serif font-bold text-dark-green leading-tight group-hover:text-sage-green">
                  {shop.name}
                </h3>
                <div className="flex items-center gap-1 text-orange-400 text-sm mt-1">
                  <Star size={12} fill="currentColor" /> {shop.rating}
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
