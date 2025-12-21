"use client";
import { useState, useRef, useEffect } from "react";
import Link from "next/link";
// PERBAIKAN 1: Tambahkan useParams
import { useRouter, useSearchParams, useParams } from "next/navigation";
import { toJpeg } from "html-to-image";
import { FLOWER_LIBRARY } from "../../utils/flower"; 
import { SHOPS } from "../../utils/shop"; 
import { Info, Store, ArrowLeft } from "lucide-react";

const CANVAS_COLORS = [
    { name: "White", hex: "#FFFFFF", class: "bg-white" },
    { name: "Cream", hex: "#FDFBF7", class: "bg-[#FDFBF7]" },
    { name: "Soft Pink", hex: "#FFF0F5", class: "bg-[#FFF0F5]" },
    { name: "Soft Blue", hex: "#F0F8FF", class: "bg-[#F0F8FF]" },
    { name: "Grid", hex: "grid", class: "bg-gray-50" },
];

export default function CustomBuilder() {
  const router = useRouter();
  // PERBAIKAN 2: Ambil params dari URL (ini yang menangkap angka 103 dari custom/103)
  const params = useParams(); 
  const canvasRef = useRef(null);

  // --- 1. SETUP SHOP ID ---
  const [selectedShopId, setSelectedShopId] = useState(null);
  
  // State lainnya
  const [selectedFlowers, setSelectedFlowers] = useState([]);
  const [activeCategory, setActiveCategory] = useState("romance");
  const [bouquetName, setBouquetName] = useState("Untitled Bouquet");
  const [zoom, setZoom] = useState(100);
  const [canvasBg, setCanvasBg] = useState(CANVAS_COLORS[1]); 
  
  const [activeId, setActiveId] = useState(null); 
  const [editingId, setEditingId] = useState(null); 
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [currentDraftId, setCurrentDraftId] = useState(null);

  // --- 2. DETEKSI TOKO (DRAFT vs URL) ---
  useEffect(() => {
    const editId = localStorage.getItem("editDraftId");
    
    if (editId) {
        // --- LOGIC A: DARI DRAFT (Prioritas Utama) ---
        const drafts = JSON.parse(localStorage.getItem("flowerDrafts") || "[]");
        const draftToLoad = drafts.find(d => String(d.id) === String(editId));
        
        if (draftToLoad) {
            setSelectedFlowers(draftToLoad.items);
            setBouquetName(draftToLoad.name);
            if (draftToLoad.canvasBg) setCanvasBg(draftToLoad.canvasBg);
            setCurrentDraftId(draftToLoad.id);
            
            if (draftToLoad.shop?.id) {
                setSelectedShopId(draftToLoad.shop.id);
            }
        }
        localStorage.removeItem("editDraftId");

    } else {
        // --- LOGIC B: DARI URL (NEW CUSTOM) ---
        // PERBAIKAN 3: Cek params.id, bukan searchParams
        if (params?.id) {
            setSelectedShopId(params.id); 
        } else {
            // Fallback (Jaga-jaga kalau error)
            setSelectedShopId(SHOPS[0].id);
        }
    }
  }, [params]); // Dependency ganti ke params

  // --- 3. HELPER: CARI TOKO AKTIF (SAFE MATCH) ---
  const activeShop = SHOPS.find(s => String(s.id) === String(selectedShopId)) || SHOPS[0];

  // --- 4. HELPER: FILTER LIBRARY (SAFE MATCH) ---
  const filteredLibrary = FLOWER_LIBRARY.filter(f => 
    f.category === activeCategory && 
    String(f.shop_id) === String(activeShop.id) 
  );

  const totalPrice = selectedFlowers.reduce((sum, item) => sum + item.price, 0);
  const editingFlower = selectedFlowers.find(f => f.uid === editingId);


  // --- ACTIONS (SAMA SEPERTI SEBELUMNYA) ---
  const addFlower = (flower) => {
    const uniqueId = `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    const newFlower = {
      ...flower,
      uid: uniqueId, 
      x: 0, y: 0,
      rotation: (Math.random() * 40) - 20,
      scale: 1, 
    };
    setSelectedFlowers([...selectedFlowers, newFlower]); 
    setActiveId(uniqueId); 
  };

  const removeFlower = (uid) => {
    setSelectedFlowers(prev => prev.filter((item) => item.uid !== uid));
    if (activeId === uid) setActiveId(null);
    if (editingId === uid) setEditingId(null);
  };

  const handleMouseDown = (e, uid, x, y) => {
    e.stopPropagation();
    setActiveId(uid);    
    setIsDragging(true); 
    setDragOffset({ x: e.clientX - x, y: e.clientY - y });
  };

  const handleMouseMove = (e) => {
    if (!isDragging || !activeId) return;
    setSelectedFlowers(prevFlowers => prevFlowers.map(flower => {
      if (flower.uid === activeId) {
        return { ...flower, x: e.clientX - dragOffset.x, y: e.clientY - dragOffset.y };
      }
      return flower;
    }));
  };

  const handleMouseUp = () => setIsDragging(false);

  const handleDoubleClick = (e, uid) => {
    e.stopPropagation();
    setEditingId(uid); 
  };

  const updateFlowerProps = (key, value) => {
    setSelectedFlowers(prevFlowers => prevFlowers.map(flower => {
      if (flower.uid === editingId) {
        return { ...flower, [key]: parseFloat(value) };
      }
      return flower;
    }));
  };

  const bringToFront = () => {
    if (!editingId) return;
    const index = selectedFlowers.findIndex(f => f.uid === editingId);
    if (index === -1 || index === selectedFlowers.length - 1) return; 
    const newArr = [...selectedFlowers];
    const [item] = newArr.splice(index, 1);
    newArr.push(item); 
    setSelectedFlowers(newArr);
  };

  const sendToBack = () => {
    if (!editingId) return;
    const index = selectedFlowers.findIndex(f => f.uid === editingId);
    if (index === -1 || index === 0) return; 
    const newArr = [...selectedFlowers];
    const [item] = newArr.splice(index, 1);
    newArr.unshift(item); 
    setSelectedFlowers(newArr);
  };

  const handleSaveDraft = async () => {
    if (selectedFlowers.length === 0) { alert("Kanvas kosong!"); return; }
    
    setActiveId(null);
    setEditingId(null);
    await new Promise(resolve => setTimeout(resolve, 100));

    let previewImage = null;
    if (canvasRef.current) {
        try {
            previewImage = await toJpeg(canvasRef.current, {
                quality: 0.6, 
                backgroundColor: canvasBg.hex === 'grid' ? '#ffffff' : canvasBg.hex, 
                style: { transform: 'scale(1)', width: '500px', height: '600px', margin: '0' }
            });
        } catch (err) { console.error(err); }
    }

    const draftPayload = {
      name: bouquetName,
      date: new Date().toLocaleDateString("id-ID"),
      items: selectedFlowers,
      totalPrice: totalPrice,
      previewImage: previewImage, 
      canvasBg: canvasBg,
      shop: activeShop 
    };

    try {
        const existingDrafts = JSON.parse(localStorage.getItem("flowerDrafts") || "[]");
        if (currentDraftId) {
            const updatedDrafts = existingDrafts.map(d => d.id === currentDraftId ? { ...d, ...draftPayload } : d);
            localStorage.setItem("flowerDrafts", JSON.stringify(updatedDrafts));
        } else {
            const newDraft = { id: Date.now(), ...draftPayload };
            localStorage.setItem("flowerDrafts", JSON.stringify([newDraft, ...existingDrafts]));
        }
        
        router.push(`/custom/${activeShop.id}/drafts`);
    } catch (e) {
        alert("Gagal menyimpan!");
    }
  };

  return (
    <div 
        className="flex h-screen bg-[#F3F4F6] overflow-hidden font-sans"
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
    >
    
      <aside className="w-80 bg-white border-r border-gray-200 flex flex-col z-20 shadow-xl">
        <div className="p-6 border-b border-gray-100">
          {/* LINK BACK DIPERBAIKI: Mengarah kembali ke halaman toko yang benar */}
          <Link href={`/shop/${activeShop.id}`} className="text-gray-400 text-sm hover:text-dark-green mb-2 flex items-center gap-1">
             <ArrowLeft size={14}/> Back to Shop
          </Link>
          <h2 className="text-2xl font-serif font-bold text-dark-green">Flower Library</h2>
          
          <div className="mt-3 flex items-center gap-2 bg-gray-50 px-3 py-2 rounded-lg border border-gray-100">
             <Store size={16} className="text-sage-green" />
             <div className="flex flex-col">
                <span className="text-[10px] uppercase text-gray-400 font-bold tracking-wider">Vendor</span>
                <span className="text-sm font-bold text-dark-green leading-none">{activeShop.name}</span>
             </div>
          </div>
        </div>
        
        <div className="flex overflow-x-auto px-6 py-3 gap-2 border-b border-gray-100 scrollbar-hide">
          {["romance", "gratitude", "regret", "peace"].map((cat) => (
            <button key={cat} onClick={() => setActiveCategory(cat)} className={`px-3 py-1 text-xs font-bold uppercase rounded-full whitespace-nowrap transition-all ${activeCategory === cat ? "bg-dark-green text-white" : "bg-gray-100 text-gray-400"}`}>{cat}</button>
          ))}
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {filteredLibrary.length > 0 ? filteredLibrary.map((flower) => (
            <div key={flower.id} onClick={() => addFlower(flower)} className="flex items-center gap-3 p-2 rounded-xl hover:bg-cream-bg cursor-pointer border border-transparent hover:border-sage-green group relative">
              <div className="w-14 h-14 bg-gray-50 rounded-lg overflow-hidden border border-gray-100"><img src={flower.image} className="w-full h-full object-cover p-1" /></div>
              <div className="flex-1">
                <h3 className="font-bold text-dark-green text-sm">{flower.name}</h3>
                <p className="text-xs text-gray-500 mt-0.5">{flower.price.toLocaleString()} <span className="text-[10px] bg-gray-100 px-1 rounded ml-1">{flower.unit}</span></p>
              </div>
              <button className="w-6 h-6 rounded-full bg-gray-100 flex items-center justify-center text-dark-green group-hover:bg-dark-green group-hover:text-white transition text-xs">+</button>
            </div>
          )) : (
            <div className="text-center py-10 flex flex-col items-center justify-center text-gray-400 text-xs gap-2">
                <span className="text-2xl">🥀</span>
                <p>Stok bunga kategori ini<br/>kosong di {activeShop.name}</p>
            </div>
          )}
        </div>

        <div className="p-6 border-t bg-white">
            <div className="flex justify-between items-center mb-4">
                <span className="text-sm text-gray-500">Estimasi</span>
                <span className="text-lg font-bold text-dark-green">{totalPrice.toLocaleString('id-ID', {style: 'currency', currency: 'IDR'})}</span>
            </div>
            <button onClick={handleSaveDraft} className="w-full py-3 bg-dark-green text-white rounded-full font-bold shadow-lg hover:bg-sage-green transition">
                {currentDraftId ? "Update Draft" : "Save as New Draft"}
            </button>
        </div>
      </aside>


      <main className="flex-1 relative flex flex-col bg-white">
      
        <header className="h-16 bg-white border-b border-gray-200 flex justify-between items-center px-6 z-10 shadow-sm">
            <div className="flex items-center gap-2">
                <span className="text-gray-400 text-sm">Name:</span>
                <input type="text" value={bouquetName} onChange={(e) => setBouquetName(e.target.value)} className="font-bold text-dark-green focus:outline-none border-b border-transparent focus:border-sage-green w-48" />
            </div>

            <div className="flex items-center gap-3 bg-gray-50 px-3 py-1.5 rounded-full border border-gray-200">
                <span className="text-[10px] uppercase font-bold text-gray-400">Canvas:</span>
                <div className="flex gap-2">
                    {CANVAS_COLORS.map((color) => (
                        <button 
                            key={color.name} 
                            onClick={() => setCanvasBg(color)}
                            title={color.name}
                            className={`w-5 h-5 rounded-full border border-gray-300 shadow-sm transition-transform hover:scale-110 ${color.hex === 'grid' ? 'bg-gray-100' : ''} ${canvasBg.name === color.name ? 'ring-2 ring-dark-green ring-offset-1' : ''}`}
                            style={color.hex !== 'grid' ? { backgroundColor: color.hex } : {}}
                        >
                            {color.hex === 'grid' && <span className="block text-[8px] text-center text-gray-400">#</span>}
                        </button>
                    ))}
                </div>
            </div>

            <div className="flex items-center gap-2 bg-gray-100 rounded-lg px-2 py-1">
                <button onClick={() => setZoom(Math.max(50, zoom - 10))} className="w-6 h-6 flex items-center justify-center font-bold text-gray-500 hover:text-dark-green">-</button>
                <span className="text-xs font-bold w-8 text-center text-dark-green">{zoom}%</span>
                <button onClick={() => setZoom(Math.min(200, zoom + 10))} className="w-6 h-6 flex items-center justify-center font-bold text-gray-500 hover:text-dark-green">+</button>
            </div>
        </header>

    
        <div className="flex-1 relative overflow-hidden flex items-center justify-center bg-[#F3F4F6]">
            
            <div className="absolute top-6 right-6 bg-white/80 backdrop-blur-md p-4 rounded-2xl shadow-sm border border-white/50 z-10 w-56 animate-in fade-in zoom-in duration-500 pointer-events-none select-none">
                <h4 className="font-bold text-dark-green mb-2 flex items-center gap-2 text-xs uppercase tracking-widest">
                    <Info size={14} /> Cara Edit
                </h4>
                <ul className="space-y-1.5 list-disc pl-4 text-[10px] text-gray-500 leading-relaxed font-medium">
                    <li><span className="font-bold text-dark-green">Drag</span> bunga untuk memindahkan posisi.</li>
                    <li><span className="font-bold text-dark-green">Double Click</span> bunga untuk membuka menu edit (Ukuran, Rotasi, Layer).</li>
                    <li>Klik area kosong untuk <span className="font-bold text-dark-green">Unselect</span>.</li>
                </ul>
            </div>

            <div className="absolute inset-0 z-0" onClick={() => { setActiveId(null); setEditingId(null); }}></div>

            <div 
                ref={canvasRef}
                id="canvas-root"
                className={`relative w-[500px] h-[600px] flex items-center justify-center shadow-2xl transition-colors duration-300 ${canvasBg.class}`}
                style={{ 
                    transform: `scale(${zoom / 100})`, 
                    backgroundColor: canvasBg.hex !== 'grid' ? canvasBg.hex : undefined 
                }}
            >
                {canvasBg.hex === 'grid' && <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(#000 1px, transparent 1px)', backgroundSize: '20px 20px' }}></div>}
                
                {selectedFlowers.length > 0 && <div className="absolute bottom-10 w-16 h-48 bg-gradient-to-t from-green-900/20 to-transparent blur-2xl rounded-full z-0 pointer-events-none"></div>}

                {selectedFlowers.map((item, index) => (
                    <div 
                        key={item.uid}
                        onMouseDown={(e) => handleMouseDown(e, item.uid, item.x, item.y)}
                        onDoubleClick={(e) => handleDoubleClick(e, item.uid)}
                        className="absolute cursor-move group select-none"
                        style={{
                            transform: `translate(${item.x}px, ${item.y}px) rotate(${item.rotation}deg) scale(${item.scale})`,
                            zIndex: index + 10, 
                            transformOrigin: 'center center'
                        }}
                    >
                        <img 
                            src={item.image} 
                            className={`w-40 h-40 object-contain drop-shadow-xl pointer-events-none transition-filter duration-200 ${activeId === item.uid ? 'brightness-110 drop-shadow-2xl' : ''}`}
                        />
                        {activeId === item.uid && <div className="absolute -inset-2 border-2 border-dashed border-sage-green rounded-lg opacity-60 pointer-events-none"></div>}
                        
                        <div onClick={(e) => { e.stopPropagation(); removeFlower(item.uid); }} className="absolute -top-3 -right-3 bg-white text-red-500 border border-red-100 w-6 h-6 rounded-full flex items-center justify-center text-xs opacity-0 group-hover:opacity-100 shadow-md cursor-pointer hover:bg-red-50 z-[1000]">✕</div>
                    </div>
                ))}
                
                {selectedFlowers.length === 0 && (
                    <div className="text-center text-gray-300 select-none pointer-events-none">
                        <p className="text-4xl mb-2">🌸</p>
                        <p className="font-serif italic">Canvas Kosong</p>
                    </div>
                )}
            </div>

          
            {editingId && editingFlower && (
                <div className="absolute bottom-6 right-6 bg-white p-5 rounded-2xl shadow-2xl border border-gray-100 w-72 z-[1000] animate-in slide-in-from-bottom-5">
                    
                    <div className="flex justify-between items-center mb-4 pb-2 border-b border-gray-100">
                        <div>
                            <span className="text-[10px] font-bold text-gray-400 uppercase">Editing</span>
                            <h3 className="font-bold text-dark-green text-sm truncate w-40">{editingFlower.name}</h3>
                        </div>
                        <button onClick={() => setEditingId(null)} className="text-gray-400 hover:text-dark-green bg-gray-100 w-6 h-6 rounded-full flex items-center justify-center">✕</button>
                    </div>
                    
                    <div className="space-y-5">
                        <div>
                            <span className="text-[10px] font-bold text-gray-400 uppercase mb-2 block">Layer Order</span>
                            <div className="flex gap-2">
                                <button onClick={sendToBack} className="flex-1 py-1.5 bg-gray-50 border border-gray-200 rounded-lg text-xs font-bold text-gray-600 hover:bg-gray-100 hover:text-dark-green transition flex items-center justify-center gap-1">
                                    <span>↓</span> To Back
                                </button>
                                <button onClick={bringToFront} className="flex-1 py-1.5 bg-gray-50 border border-gray-200 rounded-lg text-xs font-bold text-gray-600 hover:bg-gray-100 hover:text-dark-green transition flex items-center justify-center gap-1">
                                    To Front <span>↑</span>
                                </button>
                            </div>
                        </div>
                        <div>
                            <div className="flex justify-between text-xs mb-1">
                                <span className="text-gray-500 font-medium">Size</span>
                                <span className="font-bold text-dark-green">{Math.round(editingFlower.scale * 100)}%</span>
                            </div>
                            <input type="range" min="0.5" max="2" step="0.1" value={editingFlower.scale} onChange={(e) => updateFlowerProps('scale', e.target.value)} className="w-full h-1.5 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-dark-green" />
                        </div>
                        <div>
                            <div className="flex justify-between text-xs mb-1">
                                <span className="text-gray-500 font-medium">Rotation</span>
                                <span className="font-bold text-dark-green">{editingFlower.rotation}°</span>
                            </div>
                            <input type="range" min="-180" max="180" step="5" value={editingFlower.rotation} onChange={(e) => updateFlowerProps('rotation', e.target.value)} className="w-full h-1.5 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-dark-green" />
                        </div>
                    </div>
                </div>
            )}
        </div>
      </main>
    </div>
  );
}