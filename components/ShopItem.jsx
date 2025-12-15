"use client";
import { useState } from "react";

const ShopItem = ({ title, description, basePrice, image, tags }) => {
  // State untuk Tipe Harga (Varian)
  const [variant, setVariant] = useState("Standard");

  // Logic Harga Berubah sesuai Varian
  const getPrice = () => {
    let multiplier = 1;
    if (variant === "Premium") multiplier = 1.5;
    if (variant === "Luxury") multiplier = 2;
    
    // Format Rupiah
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      maximumSignificantDigits: 3 // Biar angkanya cantik (Rp 850rb)
    }).format(basePrice * multiplier);
  };

  return (
    <div className="group flex flex-col md:flex-row bg-white rounded-3xl overflow-hidden shadow-sm hover:shadow-xl transition-shadow duration-300 border border-gray-100">
      
      {/* BAGIAN KIRI: GAMBAR */}
      <div className="w-full md:w-5/12 relative overflow-hidden">
        <img 
          src={image} 
          alt={title} 
          className="w-full h-64 md:h-full object-cover transition-transform duration-700 group-hover:scale-105"
        />
        {/* Badge Mood/Tags */}
        <div className="absolute top-4 left-4 flex gap-2">
            {tags.map((tag, idx) => (
                <span key={idx} className="bg-white/90 backdrop-blur text-xs font-bold px-3 py-1 rounded-full text-dark-green uppercase tracking-wider">
                    {tag}
                </span>
            ))}
        </div>
      </div>

      {/* BAGIAN KANAN: KONTEN */}
      <div className="w-full md:w-7/12 p-6 md:p-8 flex flex-col justify-between">
        
        <div>
          <div className="flex justify-between items-start mb-2">
            <h3 className="text-2xl md:text-3xl font-serif font-bold text-dark-green">{title}</h3>
            {/* Harga Besar */}
            <span className="text-xl font-sans font-bold text-sage-green">
                {getPrice()}
            </span>
          </div>

          <p className="text-gray-500 text-sm leading-relaxed mb-6">
            {description}
          </p>

          {/* Selector Tipe Harga */}
          <div className="mb-6">
            <span className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-2 block">Pilih Ukuran</span>
            <div className="flex gap-2">
                {["Standard", "Premium", "Luxury"].map((type) => (
                    <button 
                        key={type}
                        onClick={() => setVariant(type)}
                        className={`
                            px-4 py-2 text-sm rounded-lg border transition-all
                            ${variant === type 
                                ? "bg-dark-green text-white border-dark-green" 
                                : "bg-transparent text-gray-500 border-gray-200 hover:border-sage-green"}
                        `}
                    >
                        {type}
                    </button>
                ))}
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-4 pt-4 border-t border-gray-100">
            <button className="flex-1 px-6 py-3 border-2 border-dark-green rounded-full text-dark-green font-medium hover:bg-dark-green hover:text-white transition-colors duration-300">
                Add to Cart
            </button>
            <button className="flex-1 px-6 py-3 bg-dark-green rounded-full text-white font-medium hover:bg-sage-green transition-colors duration-300 shadow-lg shadow-sage-green/30">
                Beli Sekarang
            </button>
        </div>

      </div>
    </div>
  );
};

export default ShopItem;