"use client";
import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toJpeg } from "html-to-image";

// --- DATA ASSETS (Tetap Sama) ---
const FLOWER_LIBRARY = [
  // ROMANCE
  { id: 'r1', name: "Red Rose", category: "romance", price: 85000, unit: "per 5 tangkai", image: "/assets/romance/red_rose.png", color: "bg-red-500" },
  { id: 'r2', name: "Peony Pink", category: "romance", price: 120000, unit: "per 3 tangkai", image: "/assets/romance/peony.png", color: "bg-pink-400" },
  { id: 'r3', name: "Red Tulip", category: "romance", price: 95000, unit: "per 5 tangkai", image: "/assets/romance/red_tulip.png", color: "bg-red-600" },
  { id: 'r4', name: "Calla Lily", category: "romance", price: 85000, unit: "per 5 tangkai", image: "/assets/romance/calla_lily.png", color: "bg-red-500" },
  { id: 'r5', name: "Deep Pink Rose", category: "romance", price: 120000, unit: "per 3 tangkai", image: "/assets/romance/deep_pink_rose.png", color: "bg-pink-400" },
  { id: 'r6', name: "Pink Orchid", category: "romance", price: 95000, unit: "per 5 tangkai", image: "/assets/romance/pink_orchid.png", color: "bg-red-600" },
  { id: 'r7', name: "Red Rose", category: "romance", price: 85000, unit: "per 5 tangkai", image: "/assets/romance/red_rose.png", color: "bg-red-500" },
  { id: 'r8', name: "Peony Pink", category: "romance", price: 120000, unit: "per 3 tangkai", image: "/assets/romance/peony.png", color: "bg-pink-400" },
  { id: 'r9', name: "Red Tulip", category: "romance", price: 95000, unit: "per 5 tangkai", image: "/assets/romance/red_tulip.png", color: "bg-red-600" },
  // GRATITUDE
  { id: 'g1', name: "Sunflower", category: "gratitude", price: 45000, unit: "per 1 tangkai besar", image: "/assets/gratitude/sunflower.png", color: "bg-yellow-400" },
  { id: 'g2', name: "White Orchid", category: "gratitude", price: 150000, unit: "per potong", image: "/assets/gratitude/white_orchid.png", color: "bg-white" },
  { id: 'g3', name: "Eucalyptus", category: "gratitude", price: 35000, unit: "per 1 ikat", image: "/assets/gratitude/eucalyptus.png", color: "bg-green-700" },
  // REGRET
  { id: 'rg1', name: "Baby's Breath", category: "regret", price: 40000, unit: "per 1 ikat besar", image: "/assets/regret/babys_breathe.png", color: "bg-gray-100" },
  { id: 'rg2', name: "Blue Hydrangea", category: "regret", price: 75000, unit: "per 1 tangkai", image: "/assets/regret/blue_hydrangea.png", color: "bg-blue-300" },
  { id: 'rg3', name: "Black Rose", category: "regret", price: 90000, unit: "per 3 tangkai", image: "/assets/regret/black_rose.png", color: "bg-gray-900" },
  // PEACE
  { id: 'p1', name: "Moonlight Serenity", category: "peace", price: 65000, unit: "per 5 tangkai", image: "/assets/bouquet/peace/moonlight_serenity.png", color: "bg-purple-200" },
];

const CANVAS_COLORS = [
    { name: "White", hex: "#FFFFFF", class: "bg-white" },
    { name: "Cream", hex: "#FDFBF7", class: "bg-[#FDFBF7]" },
    { name: "Soft Pink", hex: "#FFF0F5", class: "bg-[#FFF0F5]" },
    { name: "Soft Blue", hex: "#F0F8FF", class: "bg-[#F0F8FF]" },
    { name: "Grid", hex: "grid", class: "bg-gray-50" },
];

export default function CustomBuilder() {
  const router = useRouter();
  const canvasRef = useRef(null);

  // --- STATE ---
  const [selectedFlowers, setSelectedFlowers] = useState([]);
  const [activeCategory, setActiveCategory] = useState("romance");
  const [bouquetName, setBouquetName] = useState("Untitled Bouquet");
  const [zoom, setZoom] = useState(100);
  const [canvasBg, setCanvasBg] = useState(CANVAS_COLORS[1]); 

  // Interaction State
  const [activeId, setActiveId] = useState(null); 
  const [editingId, setEditingId] = useState(null); 
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });

  // --- NEW STATE: MENYIMPAN ID DRAFT YANG SEDANG DIEDIT ---
  const [currentDraftId, setCurrentDraftId] = useState(null);

  // --- LOAD DRAFT (CONTINUE EDITING) ---
  useEffect(() => {
    const editId = localStorage.getItem("editDraftId");
    
    if (editId) {
        const drafts = JSON.parse(localStorage.getItem("flowerDrafts") || "[]");
        // Convert editId ke number karena Date.now() itu number
        const draftToLoad = drafts.find(d => d.id === Number(editId));
        
        if (draftToLoad) {
            setSelectedFlowers(draftToLoad.items);
            setBouquetName(draftToLoad.name);
            if (draftToLoad.canvasBg) setCanvasBg(draftToLoad.canvasBg);
            
            // PENTING: Set ID draft ini biar nanti pas save dia tau ini update, bukan create
            setCurrentDraftId(draftToLoad.id);
        }
        
        localStorage.removeItem("editDraftId");
    }
  }, []);


  // --- LOGIC: ADD & REMOVE ---
  const addFlower = (flower) => {
    const randomOffset = () => Math.floor(Math.random() * 60) - 30;
    const randomRotate = () => Math.floor(Math.random() * 40) - 20;
    const uniqueId = `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

    const newFlower = {
      ...flower,
      uid: uniqueId, 
      x: 0, y: 0,
      rotation: randomRotate(),
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

  // --- LOGIC: DRAG & DROP ---
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

  // --- LOGIC: EDIT ---
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

  

  // --- LOGIC: LAYERING ---
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

  // --- LOGIC: SAVE (PAKE HTML-TO-IMAGE) ---
  const handleSaveDraft = async () => {
    if (selectedFlowers.length === 0) { alert("Kanvas kosong!"); return; }
    
    // 1. Matikan seleksi
    setActiveId(null);
    setEditingId(null);
    
    // 2. Delay sekejap biar React render (ilangin border)
    await new Promise(resolve => setTimeout(resolve, 100));

    let previewImage = null;

    if (canvasRef.current) {
        try {
            // LIBRARY BARU: html-to-image
            // Dia lebih pinter nangkap CSS modern
            previewImage = await toJpeg(canvasRef.current, {
                quality: 0.6, // Kompres dikit biar ringan (0.6 = 60%)
                backgroundColor: canvasBg.hex === 'grid' ? '#ffffff' : canvasBg.hex, // Handle background
                style: {
                    // INI MAGICNYA:
                    // Kita paksa elemen yang difoto untuk "lupa" kalau dia lagi di-zoom
                    transform: 'scale(1)', 
                    transformOrigin: 'top left',
                    width: '500px',
                    height: '600px',
                    margin: '0' 
                }
            });
        } catch (err) {
            console.error("Gagal generate gambar:", err);
            // Kalau gagal, tetep lanjut save tanpa gambar (atau pake placeholder)
        }
    }

    // 3. Siapkan Data Payload
    const draftPayload = {
      name: bouquetName,
      date: new Date().toLocaleDateString("id-ID"),
      items: selectedFlowers,
      totalPrice: selectedFlowers.reduce((sum, item) => sum + item.price, 0),
      previewImage: previewImage, 
      canvasBg: canvasBg
    };

    // 4. Save Logic (Create / Update)
    try {
        const existingDrafts = JSON.parse(localStorage.getItem("flowerDrafts") || "[]");

        if (currentDraftId) {
            // UPDATE
            const updatedDrafts = existingDrafts.map(d => {
                if (d.id === currentDraftId) {
                    return { ...d, ...draftPayload };
                }
                return d;
            });
            localStorage.setItem("flowerDrafts", JSON.stringify(updatedDrafts));
        } else {
            // CREATE NEW
            const newDraft = { id: Date.now(), ...draftPayload };
            localStorage.setItem("flowerDrafts", JSON.stringify([newDraft, ...existingDrafts]));
        }
        
        router.push("/custom/drafts");

    } catch (e) {
        alert("Gagal menyimpan! LocalStorage penuh?");
        console.error(e);
    }
  };

  // Helpers
  const filteredLibrary = FLOWER_LIBRARY.filter(f => f.category === activeCategory);
  const totalPrice = selectedFlowers.reduce((sum, item) => sum + item.price, 0);
  const editingFlower = selectedFlowers.find(f => f.uid === editingId);

  return (
    <div 
        className="flex h-screen bg-[#F3F4F6] overflow-hidden font-sans"
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
    >
      
      {/* 1. SIDEBAR */}
      <aside className="w-80 bg-white border-r border-gray-200 flex flex-col z-20 shadow-xl">
        <div className="p-6 border-b border-gray-100">
          <Link href="/" className="text-gray-400 text-sm hover:text-dark-green mb-2 inline-block">&larr; Back to Home</Link>
          <h2 className="text-2xl font-serif font-bold text-dark-green">Flower Library</h2>
        </div>
        
        <div className="flex overflow-x-auto px-6 py-3 gap-2 border-b border-gray-100 scrollbar-hide">
          {["romance", "gratitude", "regret", "peace"].map((cat) => (
            <button key={cat} onClick={() => setActiveCategory(cat)} className={`px-3 py-1 text-xs font-bold uppercase rounded-full whitespace-nowrap transition-all ${activeCategory === cat ? "bg-dark-green text-white" : "bg-gray-100 text-gray-400"}`}>{cat}</button>
          ))}
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {filteredLibrary.map((flower) => (
            <div key={flower.id} onClick={() => addFlower(flower)} className="flex items-center gap-3 p-2 rounded-xl hover:bg-cream-bg cursor-pointer border border-transparent hover:border-sage-green group relative">
              <div className="w-14 h-14 bg-gray-50 rounded-lg overflow-hidden border border-gray-100"><img src={flower.image} className="w-full h-full object-cover p-1" /></div>
              <div className="flex-1">
                <h3 className="font-bold text-dark-green text-sm">{flower.name}</h3>
                <p className="text-xs text-gray-500 mt-0.5">{flower.price.toLocaleString()} <span className="text-[10px] bg-gray-100 px-1 rounded ml-1">{flower.unit}</span></p>
              </div>
              <button className="w-6 h-6 rounded-full bg-gray-100 flex items-center justify-center text-dark-green group-hover:bg-dark-green group-hover:text-white transition text-xs">+</button>
            </div>
          ))}
        </div>

        <div className="p-6 border-t bg-white">
            <div className="flex justify-between items-center mb-4">
                <span className="text-sm text-gray-500">Estimasi</span>
                <span className="text-lg font-bold text-dark-green">{totalPrice.toLocaleString('id-ID', {style: 'currency', currency: 'IDR'})}</span>
            </div>
            {/* Ubah teks tombol biar user tau dia lagi edit atau bikin baru */}
            <button onClick={handleSaveDraft} className="w-full py-3 bg-dark-green text-white rounded-full font-bold shadow-lg hover:bg-sage-green transition">
                {currentDraftId ? "Update Draft" : "Save as New Draft"}
            </button>
        </div>
      </aside>

      {/* 2. MAIN AREA */}
      <main className="flex-1 relative flex flex-col bg-white">
        
        {/* Top Bar */}
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

        {/* CANVAS */}
        <div className="flex-1 relative overflow-hidden flex items-center justify-center bg-[#F3F4F6]">
            
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

            {/* EDIT PANEL */}
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