"use client";
import { useState } from "react";
import Link from "next/link";

// --- DUMMY DATA BUNGA (Assets) ---
// Note: Nanti ganti 'image' dengan URL file PNG transparan (tanpa background) biar hasilnya nyata.
const FLOWER_LIBRARY = [
  { id: 1, name: "Peony Pink", price: 50000, color: "bg-pink-300", image: "https://images.unsplash.com/photo-1563241527-300e263d9061?q=80&w=200&auto=format&fit=crop" },
  { id: 2, name: "White Rose", price: 35000, color: "bg-gray-100", image: "https://images.unsplash.com/photo-1596627685746-8cf926d1d4d3?q=80&w=200&auto=format&fit=crop" },
  { id: 3, name: "Red Rose", price: 40000, color: "bg-red-500", image: "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?q=80&w=200&auto=format&fit=crop" },
  { id: 4, name: "Eucalyptus", price: 15000, color: "bg-green-700", image: "https://images.unsplash.com/photo-1615893386618-50800689b936?q=80&w=200&auto=format&fit=crop" },
  { id: 5, name: "Baby Breath", price: 20000, color: "bg-white", image: "https://images.unsplash.com/photo-1591886960571-74d43a9d4166?q=80&w=200&auto=format&fit=crop" },
  { id: 6, name: "Sunflower", price: 30000, color: "bg-yellow-400", image: "https://images.unsplash.com/photo-1543616995-15638531109a?q=80&w=200&auto=format&fit=crop" },
];

export default function CustomBuilder() {
  const [selectedFlowers, setSelectedFlowers] = useState([]);
  const [zoom, setZoom] = useState(100);

  // --- LOGIC: ADD FLOWER ---
  const addFlower = (flower) => {
    // Generate posisi acak sedikit biar numpuknya natural kayak buket
    const randomOffset = () => Math.floor(Math.random() * 60) - 30; // -30px to 30px
    const randomRotate = () => Math.floor(Math.random() * 40) - 20; // -20deg to 20deg

    const newFlower = {
      ...flower,
      uid: Date.now(), // Unique ID untuk instance ini
      x: randomOffset(), 
      y: randomOffset(),
      rotation: randomRotate(),
    };
    setSelectedFlowers([...selectedFlowers, newFlower]);
  };

  // --- LOGIC: REMOVE FLOWER ---
  const removeFlower = (uid) => {
    setSelectedFlowers(selectedFlowers.filter((item) => item.uid !== uid));
  };

  // --- TOTAL PRICE ---
  const totalPrice = selectedFlowers.reduce((sum, item) => sum + item.price, 0);

  return (
    <div className="flex h-screen bg-[#F3F4F6] overflow-hidden font-sans">
      
      {/* 1. SIDEBAR (Tools) */}
      <aside className="w-80 bg-white border-r border-gray-200 flex flex-col z-20 shadow-xl">
        
        {/* Header Sidebar */}
        <div className="p-6 border-b border-gray-100">
          <Link href="/" className="flex items-center text-gray-400 hover:text-dark-green mb-4 transition">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Back to Home
          </Link>
          <h2 className="text-2xl font-serif font-bold text-dark-green">Flowers</h2>
          <p className="text-xs text-gray-500 mt-1">Klik bunga untuk menambahkan ke kanvas.</p>
        </div>

        {/* Filter / Search (Visual Only) */}
        <div className="px-6 py-4">
            <input type="text" placeholder="Search flowers..." className="w-full bg-gray-50 px-4 py-2 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-dark-green mb-4" />
            <div className="flex gap-2">
                <span className="w-6 h-6 rounded-full bg-pink-300 cursor-pointer border hover:scale-110 transition"></span>
                <span className="w-6 h-6 rounded-full bg-red-500 cursor-pointer border hover:scale-110 transition"></span>
                <span className="w-6 h-6 rounded-full bg-white cursor-pointer border hover:scale-110 transition"></span>
                <span className="w-6 h-6 rounded-full bg-yellow-400 cursor-pointer border hover:scale-110 transition"></span>
            </div>
        </div>

        {/* List Bunga (Scrollable) */}
        <div className="flex-1 overflow-y-auto px-6 pb-6 space-y-4">
          {FLOWER_LIBRARY.map((flower) => (
            <div 
              key={flower.id} 
              onClick={() => addFlower(flower)}
              className="group flex items-center gap-4 p-3 rounded-xl hover:bg-cream-bg cursor-pointer transition-all border border-transparent hover:border-gray-200"
            >
              {/* Thumbnail Image */}
              <div className="w-14 h-14 bg-gray-100 rounded-lg overflow-hidden shrink-0">
                <img src={flower.image} alt={flower.name} className="w-full h-full object-cover mix-blend-multiply" />
              </div>
              
              {/* Info */}
              <div className="flex-1">
                <h3 className="font-bold text-dark-green text-sm group-hover:text-sage-green transition">{flower.name}</h3>
                <p className="text-xs text-gray-400">Rp {flower.price.toLocaleString()}</p>
              </div>

              {/* Add Button */}
              <button className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-gray-400 group-hover:bg-dark-green group-hover:text-white transition">
                +
              </button>
            </div>
          ))}
        </div>

        {/* Total Price Widget */}
        <div className="p-6 border-t border-gray-100 bg-gray-50">
            <div className="flex justify-between items-center mb-4">
                <span className="text-sm text-gray-500">Estimasi Harga</span>
                <span className="text-xl font-bold text-dark-green">Rp {totalPrice.toLocaleString()}</span>
            </div>
            <button className="w-full py-3 bg-dark-green text-white rounded-full font-bold shadow-lg hover:bg-sage-green transition">
                Checkout Bouquet
            </button>
        </div>
      </aside>

      {/* 2. MAIN CANVAS (Editor Area) */}
      <main className="flex-1 relative flex flex-col">
        
        {/* Top Bar (Actions) */}
        <header className="h-16 bg-white border-b border-gray-200 flex justify-between items-center px-8 z-10">
            <div className="flex items-center gap-2">
                <span className="text-gray-400 text-sm">Draft / </span>
                <input type="text" defaultValue="Untitled Bouquet" className="font-bold text-dark-green focus:outline-none border-b border-transparent focus:border-gray-300" />
            </div>
            <div className="flex gap-3">
                <button className="px-4 py-2 text-sm font-bold text-dark-green border border-gray-300 rounded-lg hover:bg-gray-50 transition">
                    Preview
                </button>
                <button className="px-4 py-2 text-sm font-bold text-white bg-sage-green rounded-lg hover:bg-opacity-90 transition shadow-md">
                    Save & Exit
                </button>
            </div>
        </header>

        {/* Canvas Area */}
        <div className="flex-1 relative overflow-hidden flex items-center justify-center bg-[#F3F4F6] cursor-crosshair">
            
            {/* Grid Pattern Background (Optional Decoration) */}
            <div className="absolute inset-0 opacity-5" style={{ backgroundImage: 'radial-gradient(#000 1px, transparent 1px)', backgroundSize: '20px 20px' }}></div>

            {/* THE BOUQUET CONTAINER */}
            {/* Kita scale berdasarkan state Zoom */}
            <div 
                className="relative w-[500px] h-[600px] flex items-center justify-center transition-transform duration-200"
                style={{ transform: `scale(${zoom / 100})` }}
            >
                {/* Batang Bawah (Visual Dummy) */}
                {selectedFlowers.length > 0 && (
                     <div className="absolute bottom-10 w-8 h-32 bg-green-900/20 blur-xl rounded-full z-0"></div>
                )}

                {/* Render Selected Flowers */}
                {selectedFlowers.map((item, index) => (
                    <div 
                        key={item.uid}
                        onClick={() => removeFlower(item.uid)}
                        className="absolute cursor-pointer hover:scale-110 transition-transform drop-shadow-xl group"
                        style={{
                            // Logic posisi acak agar terlihat menumpuk natural
                            transform: `translate(${item.x}px, ${item.y}px) rotate(${item.rotation}deg)`,
                            zIndex: index + 10 // Semakin baru ditambahkan, semakin di depan
                        }}
                    >
                        {/* Image Bunga */}
                        {/* NOTE: Gunakan class 'rounded-full' jika gambar kotak, idealnya pakai PNG transparan */}
                        <img 
                            src={item.image} 
                            alt={item.name} 
                            className="w-32 h-32 object-cover rounded-full border-2 border-white/50 shadow-sm"
                        />
                        
                        {/* Tombol Hapus (Muncul saat Hover) */}
                        <div className="absolute -top-2 -right-2 bg-red-500 text-white w-6 h-6 rounded-full flex items-center justify-center text-xs opacity-0 group-hover:opacity-100 transition shadow-md">
                            ✕
                        </div>
                    </div>
                ))}

                
                {selectedFlowers.length === 0 && (
                    <div className="text-center text-gray-400">
                        <p className="text-lg font-serif italic mb-2">Kanvas Kosong</p>
                        <p className="text-xs">Pilih bunga di sebelah kiri untuk mulai merangkai.</p>
                    </div>
                )}
            </div>

            {/* Zoom Controls (Floating) */}
            <div className="absolute bottom-8 bg-white px-4 py-2 rounded-full shadow-xl flex items-center gap-4 border border-gray-100">
                <button onClick={() => setZoom(Math.max(50, zoom - 10))} className="text-xl font-bold text-gray-500 hover:text-dark-green">-</button>
                <span className="text-sm font-bold w-12 text-center text-dark-green">{zoom}%</span>
                <button onClick={() => setZoom(Math.min(200, zoom + 10))} className="text-xl font-bold text-gray-500 hover:text-dark-green">+</button>
            </div>

        </div>
      </main>
    </div>
  );
}