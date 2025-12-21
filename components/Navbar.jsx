"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCart } from "@/app/context/CartContext";
import { motion, AnimatePresence } from "framer-motion";
import { ShoppingBag, User } from "lucide-react";
import { useState, useEffect } from "react";

const Navbar = () => {
  const pathname = usePathname();
  const { totalItems } = useCart(); // Ambil jumlah item dari context
  
  // Simulasi state user (Nanti diganti logic Auth beneran)
  const [isLoggedIn, setIsLoggedIn] = useState(false); 

  // Logic scroll buat shadow navbar (Opsional, biar cantik)
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { name: "Home", href: "/" },
    { name: "Florists", href: "/toko" },

  ];

  return (
    <header className={`fixed top-0 left-0 right-0 z-50 flex justify-center px-4 transition-all duration-300 ${scrolled ? "pt-4" : "pt-8"}`}>
      <nav 
        className={`
            w-full max-w-7xl flex items-center justify-between px-6 py-3 rounded-full transition-all duration-300
            ${scrolled 
                ? "bg-white/90 backdrop-blur-md border border-gray-200 shadow-md" 
                : "bg-cream-bg/80 backdrop-blur-md border border-dark-green shadow-sm"}
        `}
      >
      
        <Link href="/" className="text-xl md:text-2xl font-serif font-bold tracking-wide text-dark-green">
          HeartToPetals.
        </Link>

       
        <div className="hidden md:flex space-x-8 text-sm font-bold tracking-wide text-dark-green">
          {navLinks.map((link) => (
            <Link 
                key={link.name} 
                href={link.href} 
                className={`relative hover:text-sage-green transition-colors ${pathname === link.href ? "text-sage-green" : ""}`}
            >
              {link.name}
              {pathname === link.href && (
                  <motion.div layoutId="nav-dot" className="absolute -bottom-1 left-0 right-0 h-0.5 bg-sage-green rounded-full" />
              )}
            </Link>
          ))}
        </div>


        <div className="flex gap-3 items-center">    
          <Link href="/cart"> 
            <button className={`relative px-5 py-2 border rounded-full text-sm font-bold flex items-center gap-2 transition-all group
                ${scrolled ? "border-gray-300 hover:border-dark-green" : "border-dark-green hover:bg-dark-green hover:text-white text-dark-green"}
            `}>
              <ShoppingBag size={18} />
              <span className="hidden sm:inline">Cart</span>
             
              <AnimatePresence mode="wait">
                <motion.span 
                    key={totalItems}
                    initial={{ y: -10, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    exit={{ y: 10, opacity: 0 }}
                    className="ml-1 bg-sage-green text-white text-[10px] w-5 h-5 flex items-center justify-center rounded-full"
                >
                    {totalItems}
                </motion.span>
              </AnimatePresence>
            </button>
          </Link>

        
          {isLoggedIn ? (
             
             <div className="w-10 h-10 rounded-full bg-gray-200 overflow-hidden border border-gray-300 cursor-pointer hover:ring-2 hover:ring-sage-green transition" onClick={() => setIsLoggedIn(false)}>
                <img src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=100&q=80" alt="User" className="w-full h-full object-cover" />
             </div>
          ) : (
             
             <button 
                onClick={() => setIsLoggedIn(true)} // Simulasi Login
                className="px-6 py-2 bg-dark-green text-white border border-dark-green rounded-full text-sm font-bold hover:bg-sage-green hover:border-sage-green transition hidden sm:flex items-center gap-2 shadow-lg"
             >
               Login
             </button>
          )}
        </div>

      </nav>
    </header>
  );
}

export default Navbar;