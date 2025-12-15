"use client";
import { useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Link from "next/link";

const ShopPage = () => {
  const [activeMood, setActiveMood] = useState("All");

  // --- DATA DUMMY ---
  const products = [
    {
      id: 1,
      title: "Head Over Heels",
      price: 850000,
      image: "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?q=80&w=800",
      category: "Warm",
      tag: "Romance",
      desc: "Cinta yang meledak-ledak.",
      theme: "light"
    },
    {
      id: 2,
      title: "Forgive Me",
      price: 550000,
      image: "https://images.unsplash.com/photo-1606166270550-9366df06b0d1?q=80&w=800",
      category: "Gloomy",
      tag: "Apology",
      desc: "Maaf yang tulus.",
      theme: "dark"
    },
    {
      id: 3,
      title: "Bright Future",
      price: 450000,
      image: "https://images.unsplash.com/photo-1543616995-15638531109a?q=80&w=800",
      category: "Warm",
      tag: "Graduation",
      desc: "Menyambut masa depan cerah.",
      theme: "light"
    },
    {
      id: 4,
      title: "Silent Tears",
      price: 700000,
      image: "https://images.unsplash.com/photo-1596627685746-8cf926d1d4d3?q=80&w=800",
      category: "Gloomy",
      tag: "Grief",
      desc: "Penghormatan terakhir.",
      theme: "dark"
    },
    {
      id: 5,
      title: "Sweet Gratitude",
      price: 350000,
      image: "https://images.unsplash.com/photo-1563241527-300e263d9061?q=80&w=800",
      category: "Warm",
      tag: "Thank You",
      desc: "Terima kasih yang manis.",
      theme: "light"
    },
    {
      id: 6,
      title: "Midnight Regret",
      price: 480000,
      image: "https://images.unsplash.com/photo-1616627546872-bbaf0f95b5e6?q=80&w=800",
      category: "Gloomy",
      tag: "Regret",
      desc: "Penyesalan terdalam.",
      theme: "dark"
    }
  ];

  // --- LOGIC FILTER ---
  const filteredProducts = activeMood === "All" 
    ? products 
    : products.filter(p => p.category === activeMood);


  // --- LOGIC BENTO LAYOUT (Grid Spans) ---
  // Pola berulang setiap 6 item supaya grid-nya variatif tapi rapi
  const getBentoClass = (index) => {
    const pattern = [
      "md:col-span-2 md:row-span-2", // 0: Big Box (Utama)
      "md:col-span-1 md:row-span-1", // 1: Small Box
      "md:col-span-1 md:row-span-2", // 2: Tall Box (Tinggi)
      "md:col-span-2 md:row-span-1", // 3: Wide Box (Lebar)
      "md:col-span-1 md:row-span-1", // 4: Small Box
      "md:col-span-1 md:row-span-1", // 5: Small Box
    ];
    // Gunakan modulo (%) agar pola berulang terus menerus
    return pattern[index % pattern.length];
  };

  const formatRupiah = (price) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      maximumSignificantDigits: 3
    }).format(price);
  };

  return (
    <main className="bg-cream-bg min-h-screen">
      <Navbar />

      <div className="pt-32 pb-8 px-6 text-center">
        <h1 className="text-4xl md:text-5xl font-serif text-dark-green mb-6">The Collection</h1>
        
        {/* Mood Tabs */}
        <div className="inline-flex bg-white p-1 rounded-full border border-gray-200 shadow-sm mb-12">
          {["All", "Warm", "Gloomy"].map((mood) => (
            <button
              key={mood}
              onClick={() => setActiveMood(mood)}
              className={`
                px-6 py-2 rounded-full text-sm font-medium transition-all duration-300
                ${activeMood === mood 
                  ? "bg-dark-green text-white shadow-md" 
                  : "text-gray-500 hover:text-sage-green"}
              `}
            >
              {mood}
            </button>
          ))}
        </div>
      </div>

      {/* --- BENTO GRID SHOP AREA --- */}
      <div className="max-w-[1600px] mx-auto px-4 pb-24">
        
        {/* Grid Wrapper: Auto Flow Dense agar celah kosong terisi otomatis */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 auto-rows-[300px]">
          
          {filteredProducts.map((product, index) => {
            const isDark = product.theme === 'dark';
            
            return (
              <div 
                key={product.id}
                className={`
                  ${getBentoClass(index)} 
                  group relative rounded-3xl overflow-hidden border-2 border-transparent hover:border-dark-green
                  transition-all duration-300
                `}
              >
         
                <img 
                  src={product.image} 
                  alt={product.title} 
                  className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
                
               
                <div className={`absolute inset-0 bg-gradient-to-t ${isDark ? 'from-[#1A2F24] via-[#1A2F24]/50' : 'from-[#F2F0EA] via-[#F2F0EA]/50'} to-transparent opacity-80 group-hover:opacity-90 transition-opacity`}></div>

               
                <div className={`absolute bottom-0 left-0 w-full p-6 ${isDark ? 'text-cream-bg' : 'text-dark-green'}`}>
                  
                  <div className="flex justify-between items-center mb-2">
                    <span className={`text-[10px] font-bold uppercase tracking-widest px-2 py-1 rounded-md ${isDark ? 'bg-white/20 text-white' : 'bg-dark-green/10 text-dark-green'}`}>
                      {product.tag}
                    </span>
                    <span className="font-bold font-sans text-lg">{formatRupiah(product.price)}</span>
                  </div>

                  <h3 className="text-2xl font-serif font-bold leading-tight mb-1">{product.title}</h3>
                  <p className="text-sm opacity-80 line-clamp-2 mb-4 group-hover:line-clamp-none transition-all">
                    {product.desc}
                  </p>

                  <div className="grid grid-cols-2 gap-2 h-0 overflow-hidden group-hover:h-auto opacity-0 group-hover:opacity-100 transition-all duration-300">
                    <button className={`py-2 rounded-full text-xs font-bold border ${isDark ? 'border-cream-bg text-cream-bg hover:bg-cream-bg hover:text-dark-green' : 'border-dark-green text-dark-green hover:bg-dark-green hover:text-white'} transition`}>
                      Add to Cart
                    </button>
                    <button className={`py-2 rounded-full text-xs font-bold ${isDark ? 'bg-cream-bg text-dark-green hover:bg-white' : 'bg-dark-green text-white hover:bg-sage-green'} transition shadow-lg`}>
                      Buy Now
                    </button>
                  </div>

                </div>
              </div>
            );
          })}
        </div>


        {filteredProducts.length === 0 && (
           <div className="text-center py-20 text-gray-400">
             <p>Tidak ada bunga dengan mood ini.</p>
           </div>
        )}

      </div>

      <Footer />
    </main>
  );
};

export default ShopPage;