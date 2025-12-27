"use client";
import { useState, useEffect, useRef } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search,
  MapPin,
  Star,
  ArrowRight,
  Sparkles,
  Store,
  User,
  Navigation,
  Flower2,
  PenTool,
  Gift,
  X,
} from "lucide-react";
import { allItems } from "@/app/utils/shop";
import { SHOPS } from "./utils/tenants";
import { PROMOS } from "./utils/data";
import { useAuth } from "./context/AuthContext";

const FloristSelectionModal = ({ isOpen, onClose }) => {
  // Filter toko yang bisa custom
  const customShops = SHOPS.filter((shop) => shop.can_customize);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-dark-green/60 backdrop-blur-sm z-[60] flex items-center justify-center p-4"
          />

          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="fixed z-[70] bg-white w-full max-w-2xl rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[80vh] top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
          >
            <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-[#FDFBF7]">
              <div>
                <h3 className="font-serif text-2xl font-bold text-dark-green">
                  Pilih Florist
                </h3>
                <p className="text-gray-500 text-sm">
                  Pilih partner florist untuk meracik buketmu.
                </p>
              </div>
              <button
                onClick={onClose}
                className="w-8 h-8 rounded-full bg-white border border-gray-200 flex items-center justify-center hover:bg-gray-100 transition"
              >
                <X size={18} className="text-gray-500" />
              </button>
            </div>

            <div className="p-6 overflow-y-auto custom-scrollbar bg-white">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {customShops.map((shop) => (
                  <Link
                    key={shop.id}
                    href={`/custom/${shop.id}`}
                    className="group flex items-center gap-4 p-3 rounded-2xl border border-gray-100 hover:border-dark-green hover:bg-[#FDFBF7] transition-all duration-300"
                  >
                    <div className="w-16 h-16 rounded-xl overflow-hidden shrink-0 shadow-sm group-hover:shadow-md">
                      <img
                        src={shop.image}
                        alt={shop.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-bold text-dark-green truncate">
                        {shop.name}
                      </h4>
                      <div className="flex items-center gap-2 text-xs text-gray-500 mt-1">
                        <span className="flex items-center gap-1">
                          <Star
                            size={10}
                            className="text-yellow-400 fill-current"
                          />{" "}
                          {shop.rating}
                        </span>
                        <span>•</span>
                        <span className="truncate">{shop.location}</span>
                      </div>
                    </div>
                    <div className="w-8 h-8 rounded-full bg-white border border-gray-200 flex items-center justify-center text-dark-green group-hover:bg-dark-green group-hover:text-white transition">
                      <ArrowRight size={14} />
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

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

const NeighborhoodMap = ({ shops }) => {
  return (
    <div className="relative w-full h-[300px] md:h-[400px] bg-[#E8F1EE] rounded-[2.5rem] overflow-hidden border border-sage-green/20 shadow-inner mb-8 group">
      <div
        className="absolute inset-0 opacity-10 pointer-events-none"
        style={{
          backgroundImage: "radial-gradient(#1A2F24 1px, transparent 1px)",
          backgroundSize: "20px 20px",
        }}
      />

      <div className="absolute top-1/2 left-0 w-full h-8 bg-white/40 -rotate-3 blur-sm"></div>
      <div className="absolute top-0 right-1/3 h-full w-8 bg-white/40 rotate-12 blur-sm"></div>

      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 flex flex-col items-center z-20">
        <div className="relative">
          <div className="w-4 h-4 bg-blue-500 rounded-full border-2 border-white shadow-lg z-10 relative"></div>
          <div className="absolute inset-0 bg-blue-500 rounded-full animate-ping opacity-50"></div>
          <div className="absolute inset-[-12px] bg-blue-500/20 rounded-full animate-pulse"></div>
        </div>
        <div className="mt-2 bg-white/90 backdrop-blur px-2 py-1 rounded-lg text-[10px] font-bold text-blue-600 shadow-sm border border-blue-100 flex items-center gap-1">
          <User size={10} /> You
        </div>
      </div>

      {shops.map((shop, idx) => {
        const positions = [
          { top: "30%", left: "20%" },
          { top: "20%", left: "70%" },
          { top: "70%", left: "30%" },
          { top: "60%", left: "80%" },
        ];
        const pos = positions[idx] || { top: "50%", left: "50%" };

        return (
          <motion.div
            key={shop.id}
            className="absolute flex flex-col items-center group/pin cursor-pointer"
            style={pos}
            initial={{ scale: 0, opacity: 0 }}
            whileInView={{ scale: 1, opacity: 1 }}
            transition={{ delay: idx * 0.2 }}
          >
            <div className="relative hover:-translate-y-2 transition-transform duration-300">
              <MapPin
                size={32}
                className="text-red-500 fill-red-500 drop-shadow-md"
              />
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-3 h-3 bg-white rounded-full"></div>
            </div>

            <div className="absolute top-full mt-2 bg-white p-2 rounded-xl shadow-xl border border-gray-100 flex items-center gap-2 w-max opacity-0 group-hover/pin:opacity-100 transition-opacity z-30 pointer-events-none transform translate-y-1 group-hover/pin:translate-y-0">
              <img
                src={shop.image}
                className="w-8 h-8 rounded-lg object-cover"
              />
              <div>
                <p className="text-[10px] font-bold text-dark-green leading-tight">
                  {shop.name}
                </p>
                <p className="text-[9px] text-gray-400">{shop.distance}</p>
              </div>
            </div>
          </motion.div>
        );
      })}

      <div className="absolute top-4 right-4 bg-white/80 backdrop-blur px-3 py-1.5 rounded-lg text-xs font-bold text-sage-green shadow-sm flex items-center gap-2">
        <Navigation size={14} /> Live Map View
      </div>
    </div>
  );
};

const CustomBouquetSection = ({ onOpenModal }) => {
  const steps = [
    {
      icon: Flower2,
      title: "Choose Blooms",
      desc: "Pilih bunga favoritmu dari katalog segar kami.",
    },
    {
      icon: Gift,
      title: "Wrap & Style",
      desc: "Tentukan kertas wrapping dan pita sesuai seleramu.",
    },
    {
      icon: PenTool,
      title: "Personal Touch",
      desc: "Tulis kartu ucapan tulus dari hati.",
    },
  ];

  return (
    <section className="relative py-24 px-6 overflow-hidden">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-px h-full bg-gradient-to-b from-transparent via-dark-green/20 to-transparent dashed-line"></div>

      <div className="max-w-4xl mx-auto relative z-10 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-16"
        >
          <span className="inline-block py-1 px-4 rounded-full bg-white border border-sage-green/30 text-sage-green text-xs font-bold uppercase tracking-widest mb-4 shadow-sm">
            The Atelier
          </span>
          <h2 className="text-4xl md:text-5xl font-serif font-bold text-dark-green mb-4">
            Craft Your <span className="italic font-light">Masterpiece</span>
          </h2>
          <p className="text-gray-500 max-w-lg mx-auto leading-relaxed">
            Jangan biarkan pilihan membatasimu. Jadilah florist untuk orang
            tersayang dengan fitur custom kami.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
          <div className="absolute top-12 left-0 w-full h-px bg-dark-green/10 hidden md:block -z-10"></div>

          {steps.map((step, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.2 }}
              viewport={{ once: true }}
              className="flex flex-col items-center group"
            >
              <div className="w-24 h-24 bg-white rounded-full border border-gray-100 shadow-xl flex items-center justify-center text-dark-green mb-6 relative group-hover:scale-110 transition-transform duration-300">
                <div className="absolute inset-0 bg-sage-green/5 rounded-full transform scale-0 group-hover:scale-100 transition-transform duration-300 rounded-full"></div>
                <step.icon size={32} strokeWidth={1.5} />
                <div className="absolute -top-1 -right-1 w-8 h-8 bg-dark-green text-white rounded-full flex items-center justify-center text-xs font-bold border-4 border-cream-bg">
                  {idx + 1}
                </div>
              </div>
              <h3 className="text-xl font-serif font-bold text-dark-green mb-2">
                {step.title}
              </h3>
              <p className="text-sm text-gray-500 leading-relaxed max-w-[200px]">
                {step.desc}
              </p>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.6 }}
          viewport={{ once: true }}
          className="mt-16"
        >
          <button
            onClick={onOpenModal}
            className="group relative inline-flex items-center gap-3 bg-dark-green text-white px-10 py-4 rounded-full font-bold shadow-xl hover:bg-sage-green transition-all overflow-hidden"
          >
            <span className="relative z-10">Mulai Kustomisasi</span>
            <ArrowRight
              size={18}
              className="relative z-10 group-hover:translate-x-1 transition-transform"
            />
            <div className="absolute top-0 -left-[100%] w-full h-full bg-gradient-to-r from-transparent via-white/20 to-transparent group-hover:animate-shine" />
          </button>
        </motion.div>
      </div>
    </section>
  );
};

export default function DashboardPage() {
  const [currentPromo, setCurrentPromo] = useState(0);
  const [isFloristModalOpen, setIsFloristModalOpen] = useState(false);
  const carouselRef = useRef(null);
  const { user } = useAuth();

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentPromo((prev) => (prev + 1) % PROMOS.length);
    }, 4000);
    return () => clearInterval(timer);
  }, []);

  const bestSellers = allItems.filter((i) => i.type !== "promo").slice(0, 5);
  const nearestShops = SHOPS.slice(0, 4);

  return (
    <main className="bg-cream-bg min-h-screen pb-24">
      <Navbar />

      <section className="relative pt-36 pb-10 px-4 md:px-6 overflow-hidden">
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="mb-10 mt-4 px-2">
            {user ? (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">
                  Welcome back, {user.name.split(" ")[0]}
                </p>
                <h1 className="text-4xl md:text-5xl font-serif font-bold text-dark-green mb-6">
                  Season's <span className="font-light italic">Greetings</span>{" "}
                  🎄
                </h1>
              </motion.div>
            ) : (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">
                  Make Someone's Day
                </p>
                <h1 className="text-4xl md:text-5xl font-serif font-bold text-dark-green mb-6">
                  Bloom{" "}
                  <span className="font-light italic text-sage-green">
                    Brighter.
                  </span>{" "}
                  🌸
                </h1>
              </motion.div>
            )}
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

      <CustomBouquetSection onOpenModal={() => setIsFloristModalOpen(true)} />

      <section className="mb-16 pl-6 md:pl-0 bg-white py-16 -mx-6 md:mx-0 md:rounded-[3rem]">
        <div className="max-w-7xl mx-auto md:px-6">
          <div className="flex justify-between items-end mb-8 pr-6">
            <div className="w-full">
              <div className="flex items-center gap-2 text-sage-green mb-2">
                <MapPin size={16} />
                <span className="text-xs font-bold uppercase tracking-widest">
                  Near You
                </span>
              </div>
              <h2 className="text-3xl font-serif font-bold text-dark-green mb-6">
                Florist Terdekat
              </h2>

              <NeighborhoodMap shops={nearestShops} />
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

      <FloristSelectionModal
        isOpen={isFloristModalOpen}
        onClose={() => setIsFloristModalOpen(false)}
      />
    </main>
  );
}
