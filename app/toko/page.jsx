"use client";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Link from "next/link";
import { MapPin, Star, ArrowRight, Palette, Package, Clock } from "lucide-react";
import { SHOPS } from "@/app/utils/tenants"; 

export default function TenantListPage() {
  return (
    <main className="bg-cream-bg min-h-screen">
      <Navbar />

      <div className="pt-32 pb-20 px-4 md:px-6 max-w-5xl mx-auto">
        
        <div className="text-center mb-12">
            <span className="text-xs font-bold tracking-[0.2em] text-sage-green uppercase mb-3 block">Mall Directory</span>
            <h1 className="text-4xl md:text-6xl font-serif text-dark-green mb-4">
                Our <span className="italic font-light">Tenants</span>
            </h1>
            <p className="text-gray-500 max-w-xl mx-auto">
                Temukan florist terbaik pilihan kami dalam satu tempat.
            </p>
        </div>

        <div className="flex flex-col gap-6">
            {SHOPS.map((shop) => (
                <Link href={`/shop/${shop.id}`} key={shop.id} className="group block">
                    <div className="bg-white p-3 rounded-2xl border border-gray-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col md:flex-row gap-6 items-stretch">
                        

                        <div className="w-full md:w-[280px] h-64 md:h-auto shrink-0 relative rounded-sm overflow-hidden">
                            <img 
                                src={shop.image} 
                                alt={shop.name} 
                                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                            />
                            <div className="absolute inset-0 bg-black/10 group-hover:bg-transparent transition-colors"></div>
                            
          
                            <div className="absolute top-4 left-4">
                                {shop.can_customize ? (
                                    <span className="bg-sage-green/90 backdrop-blur-md text-white px-3 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-wider shadow-sm flex items-center gap-1.5">
                                        <Palette size={12} /> Custom Available
                                    </span>
                                ) : (
                                    <span className="bg-white/90 backdrop-blur-md text-dark-green px-3 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-wider shadow-sm flex items-center gap-1.5">
                                        <Package size={12} /> Ready Stock
                                    </span>
                                )}
                            </div>
                        </div>

                        <div className="flex-1 flex flex-col justify-center py-2 pr-4 pl-2 md:pl-0">
                            <div className="flex flex-col md:flex-row md:justify-between md:items-start mb-3 gap-2">
                                <div>
                                    <h3 className="text-2xl md:text-3xl font-serif font-bold text-dark-green group-hover:text-sage-green transition-colors">
                                        {shop.name}
                                    </h3>
                                    <div className="flex items-center gap-3 mt-2 text-sm text-gray-500">
                                        <div className="flex items-center gap-1">
                                            <MapPin size={14} className="text-sage-green" />
                                            {shop.location}
                                        </div>
                                        <span className="text-gray-300">•</span>
                                        <div className="flex items-center gap-1">
                                            <Clock size={14} className="text-sage-green" />
                                            {shop.openTime || "09:00 - 21:00"}
                                        </div>
                                    </div>
                                </div>

                      
                                <div className="flex items-center gap-1.5 bg-orange-50 text-orange-500 px-3 py-1.5 rounded-full font-bold text-sm self-start">
                                    <Star size={14} fill="currentColor" />
                                    <span>{shop.rating}</span>
                                    <span className="text-orange-300 font-normal text-xs ml-1">({shop.reviewCount})</span>
                                </div>
                            </div>

                            <hr className="border-gray-100 my-4" />

                        
                            <div className="flex justify-between items-end">
                                <div className="text-sm text-gray-400 font-light max-w-md">
                                    <p>Jarak dari lokasi kamu:</p>
                                    <p className="text-dark-green font-bold text-lg">{shop.distance || "2.5 km"}</p>
                                </div>

                          
                                <div className="flex items-center gap-2 text-dark-green font-bold text-xs uppercase tracking-widest group-hover:underline decoration-sage-green underline-offset-4 transition-all">
                                    Kunjungi Toko <div className="bg-dark-green text-white w-8 h-8 rounded-full flex items-center justify-center group-hover:bg-sage-green transition-colors"><ArrowRight size={14}/></div>
                                </div>
                            </div>

                        </div>
                    </div>
                </Link>
            ))}
        </div>

      </div>
      <Footer />
    </main>
  );
}