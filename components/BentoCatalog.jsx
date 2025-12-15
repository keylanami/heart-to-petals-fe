"use client";

const BentoItem = ({ 
  title, 
  category, 
  philosophy, 
  composition, 
  image, 
  price,
  className, 
  theme = "light" // 'light' (Warm) atau 'dark' (Gloomy)
}) => {
  // Logic warna berdasarkan tema mood
  const textColor = theme === 'dark' ? 'text-cream-bg' : 'text-dark-green';
  const bgColor = theme === 'dark' ? 'bg-[#2C3E36]' : 'bg-[#EAE7DC]';
  const borderColor = theme === 'dark' ? 'hover:border-cream-bg' : 'hover:border-dark-green';
  const badgeColor = theme === 'dark' ? 'bg-cream-bg text-dark-green' : 'bg-dark-green text-white';

  return (
    <div className={`
      relative group overflow-hidden rounded-3xl transition-all duration-300
      border-2 border-transparent ${borderColor} /* SOLUSI KEMBANG KEMPIS */
      ${className}
    `}>
      {/* Background Image */}
      <img 
        src={image} 
        alt={title} 
        className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
      />
      
      {/* Overlay Gradient supaya tulisan terbaca */}
      <div className={`absolute inset-0 bg-gradient-to-t ${theme === 'dark' ? 'from-[#1A2F24] via-[#1A2F24]/60' : 'from-[#F2F0EA] via-[#F2F0EA]/60'} to-transparent opacity-90`}></div>

      {/* Content Content */}
      <div className={`absolute bottom-0 left-0 p-6 md:p-8 w-full ${textColor}`}>
        
        {/* Category Badge */}
        <span className={`${badgeColor} text-[10px] uppercase tracking-widest font-bold px-3 py-1 rounded-full mb-3 inline-block`}>
          {category}
        </span>

        <div className="flex justify-between items-end mb-2">
          <h3 className="text-2xl md:text-3xl font-serif font-bold leading-tight">{title}</h3>
          <p className="text-lg font-medium">{price}</p>
        </div>

        {/* Philosophy & Composition (Muncul detailnya pelan-pelan) */}
        <div className="space-y-3 mt-4">
          <div>
            <p className="text-xs font-bold uppercase opacity-70 mb-1">Filosofi</p>
            <p className="text-sm italic leading-relaxed opacity-90">"{philosophy}"</p>
          </div>
          
          <div className="h-0 group-hover:h-auto overflow-hidden transition-all duration-300 opacity-0 group-hover:opacity-100">
            <div className="w-full h-[1px] bg-current opacity-20 my-3"></div>
            <p className="text-xs font-bold uppercase opacity-70 mb-1">Rakitan Bunga</p>
            <p className="text-sm opacity-90">{composition}</p>
          </div>
        </div>

        {/* Action Button Icon */}
        <div className="absolute top-6 right-6 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
           <div className={`w-10 h-10 rounded-full ${badgeColor} flex items-center justify-center shadow-lg cursor-pointer`}>
             <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
               <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
             </svg>
           </div>
        </div>

      </div>
    </div>
  );
};

export default function BentoCatalog() {
  return (
    <section className="w-full px-4 py-20 max-w-[1600px] mx-auto"> {/* Full Width tapi dibatasin dikit biar ga pecah di monitor ultrawide */}
      
      {/* --- MOOD: WARM (Happy/Love) --- */}
      <div className="mb-20">
        <div className="mb-8 pl-2 border-l-4 border-sage-green">
          <h2 className="text-4xl font-serif text-dark-green">Warm Collection</h2>
          <p className="text-gray-500 mt-1">Rayakan kebahagiaan, cinta, dan momen manis.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 md:grid-rows-2 gap-4 h-auto md:h-[600px]">
          
          {/* Item 1: Head Over Heels (Utama - Besar) */}
          <BentoItem 
            className="md:col-span-2 md:row-span-2 min-h-[400px]"
            title="Head Over Heels"
            category="Deep Romance"
            price="Rp 850.000"
            philosophy="Cinta yang meledak-ledak dan tak terbendung. Untuk dia yang membuat duniamu berhenti berputar."
            composition="15 Mawar Merah Ekuador, 5 Tulip Pink, Filler Baby Breath, Pita Satin Maroon Panjang."
            image="https://images.unsplash.com/photo-1518709268805-4e9042af9f23?q=80&w=1200&auto=format&fit=crop"
            theme="light"
          />

          {/* Item 2: Graduation */}
          <BentoItem 
            className="md:col-span-1 md:row-span-2 min-h-[300px]"
            title="Bright Future"
            category="Graduation"
            price="Rp 450.000"
            philosophy="Warna kuning melambangkan kesuksesan, optimisme, dan awal perjalanan baru yang cerah."
            composition="5 Bunga Matahari Besar, Chamomile, Solidago, Wrapping Kertas Kraft Premium."
            image="https://images.unsplash.com/photo-1543616995-15638531109a?q=80&w=800&auto=format&fit=crop"
            theme="light"
          />

          {/* Item 3: Appreciation */}
          <BentoItem 
            className="md:col-span-1 md:row-span-1 min-h-[250px]"
            title="Sweet Gratitude"
            category="Appreciation"
            price="Rp 350.000"
            philosophy="Cara paling manis untuk bilang 'Terima Kasih' tanpa kata-kata."
            composition="Gerbera Pink, Krisan Putih, Eucalyptus."
            image="https://images.unsplash.com/photo-1563241527-300e263d9061?q=80&w=800&auto=format&fit=crop"
            theme="light"
          />

           {/* Item 4: Get Well Soon */}
           <BentoItem 
            className="md:col-span-1 md:row-span-1 min-h-[250px]"
            title="Healing Breeze"
            category="Get Well Soon"
            price="Rp 400.000"
            philosophy="Warna lembut yang menenangkan jiwa, membawa doa kesembuhan."
            composition="Lili Putih, Mawar Peach, Daun Silver Dollar."
            image="https://images.unsplash.com/photo-1469334031218-e382a71b716b?q=80&w=800&auto=format&fit=crop"
            theme="light"
          />

        </div>
      </div>


      {/* --- MOOD: GLOOMY (Apology/Grief) --- */}
      <div className="mb-20">
        <div className="mb-8 pl-2 border-l-4 border-gray-600">
          <h2 className="text-4xl font-serif text-dark-green">Gloomy Collection</h2>
          <p className="text-gray-500 mt-1">Sampaikan maaf, penyesalan, dan duka yang terdalam.</p>
        </div>

        {/* Layout berbeda untuk variasi */}
        <div className="grid grid-cols-1 md:grid-cols-3 md:grid-rows-2 gap-4 h-auto md:h-[600px]">
          
          {/* Item 1: The Apology (Lebar di atas) */}
          <BentoItem 
            className="md:col-span-2 md:row-span-1 min-h-[300px]"
            title="Forgive Me"
            category="Sincere Apology"
            price="Rp 550.000"
            philosophy="Hyacinth ungu melambangkan permohonan maaf yang tulus dan keinginan memperbaiki kesalahan."
            composition="10 Hyacinth Ungu, 5 Mawar Putih, Filler Daun Pakis, Pita Beludru Hitam."
            image="https://images.unsplash.com/photo-1606166270550-9366df06b0d1?q=80&w=1200&auto=format&fit=crop"
            theme="dark" // Pake tema gelap
          />

           {/* Item 2: Sorrow/Grief (Tinggi di kanan) */}
           <BentoItem 
            className="md:col-span-1 md:row-span-2 min-h-[400px]"
            title="Silent Tears"
            category="Deepest Condolences"
            price="Rp 700.000"
            philosophy="Ketulusan dan penghormatan terakhir. Putih suci untuk mengantar kepergian."
            composition="Lili Casablanca Premium, Mawar Putih, Krisan, Kartu Ucapan Duka Cita."
            image="https://images.unsplash.com/photo-1596627685746-8cf926d1d4d3?q=80&w=800&auto=format&fit=crop"
            theme="dark"
          />

          {/* Item 3: Regret (Kecil di bawah) */}
          <BentoItem 
            className="md:col-span-2 md:row-span-1 min-h-[300px]"
            title="Midnight Regret"
            category="Regret"
            price="Rp 480.000"
            philosophy="Mawar biru yang sulit didapat, seperti kesempatan kedua yang kuminta darimu."
            composition="Mawar Biru (Dyed), Hydrangea Biru, Eryngium, Pembungkus Hitam Transparan."
            image="https://images.unsplash.com/photo-1616627546872-bbaf0f95b5e6?q=80&w=1200&auto=format&fit=crop"
            theme="dark"
          />

        </div>
      </div>

    </section>
  );
}