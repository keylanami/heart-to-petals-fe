"use client";
import Link from "next/link";
import { usePathname, useParams } from "next/navigation";
import { useCart } from "@/app/context/CartContext";
import { useAuth } from "@/app/context/AuthContext"; 
import { motion, AnimatePresence } from "framer-motion";
import { ShoppingBag, FileText, LogOut, User as UserIcon } from "lucide-react";
import { useState, useEffect } from "react";

const Navbar = () => {
  const pathname = usePathname();
  const params = useParams();
  const { totalItems } = useCart();
  const { user, logout } = useAuth();
  
  const [scrolled, setScrolled] = useState(false);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { name: "Home", href: "/" },
    { name: "Florists", href: "/toko" },
  ];

  const draftLink = params?.id 
  ? `/custom/${params.id}/drafts` 
  : `/custom/101/drafts`;

 
  const iconBtnClass = `h-10 w-10 sm:w-auto sm:px-4 border rounded-full text-sm font-bold flex items-center justify-center gap-2 transition-all duration-300 relative ${
    scrolled 
      ? "border-gray-200 text-gray-600 hover:border-dark-green hover:text-dark-green bg-transparent" 
      : "border-dark-green/30 text-dark-green hover:bg-dark-green hover:text-white bg-white/20"
  }`;

  const loginBtnClass = `h-10 px-6 rounded-full text-sm font-bold border transition-all duration-300 flex items-center ${
    scrolled
      ? "border-gray-300 text-gray-600 hover:border-dark-green hover:text-dark-green"
      : "border-dark-green text-dark-green hover:bg-dark-green/10"
  }`;

  // Style untuk tombol Sign Up (Primary - Solid)
  const signUpBtnClass = `h-10 px-6 rounded-full text-sm font-bold border transition-all duration-300 flex items-center shadow-lg hover:shadow-xl hover:-translate-y-0.5 ${
    scrolled
      ? "bg-dark-green border-dark-green text-white hover:bg-sage-green hover:border-sage-green"
      : "bg-dark-green border-dark-green text-white hover:bg-sage-green hover:border-sage-green"
  }`;

  return (
    <header className={`fixed top-0 left-0 right-0 z-50 flex justify-center px-4 transition-all duration-500 ease-in-out ${scrolled ? "pt-4" : "pt-8"}`}>
      <nav 
        className={`
            w-full max-w-7xl flex items-center justify-between px-4 sm:px-6 py-2.5 rounded-full transition-all duration-500
            ${scrolled 
                ? "bg-white/90 backdrop-blur-xl border border-gray-200/50 shadow-md" 
                : "bg-cream-bg/80 backdrop-blur-md border border-dark-green/20 shadow-sm"}
        `}
      >
      
       
        <Link href="/" className="text-xl md:text-2xl font-serif font-bold tracking-tight text-dark-green flex-shrink-0">
          HeartToPetals.
        </Link>

     
        <div className="hidden md:flex absolute left-1/2 transform -translate-x-1/2 space-x-8 text-sm font-bold tracking-wide text-dark-green">
          {navLinks.map((link) => (
            <Link 
                key={link.name} 
                href={link.href} 
                className={`relative hover:text-sage-green transition-colors py-1 ${pathname === link.href ? "text-sage-green" : ""}`}
            >
              {link.name}
              {pathname === link.href && (
                  <motion.div layoutId="nav-dot" className="absolute -bottom-1 left-0 right-0 h-0.5 bg-sage-green rounded-full" />
              )}
            </Link>
          ))}
        </div>

 
        <div className="flex items-center gap-2 sm:gap-3">    

          <Link href="/cart"> 
            <button className={iconBtnClass}>
              <ShoppingBag size={18} />
              <span className="hidden sm:inline">Cart</span>
              
              <AnimatePresence>
                {isClient && totalItems > 0 && (
                  <motion.span 
                    key={totalItems}
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    exit={{ scale: 0 }}
                    className="absolute -top-1 -right-1 sm:top-0 sm:right-0 sm:relative sm:ml-1 bg-sage-green text-white text-[10px] w-5 h-5 flex items-center justify-center rounded-full shadow-sm border border-white"
                  >
                    {totalItems}
                  </motion.span>
                )}
              </AnimatePresence>
            </button>
          </Link>

          {isClient && user ? (
            
             <>
                {/* DRAFT BUTTON (Hanya kalau login) */}
                {/* Note: Kita arahkan ke /custom sementara, atau halaman list draft umum */}
                <Link href={draftLink}> 
                    <button className={`${iconBtnClass} hidden sm:flex`}>
                        <FileText size={18} />
                        <span className="hidden sm:inline">Drafts</span>
                    </button>
                </Link>

                {/* USER PROFILE PILL */}
                <div 
                  onClick={logout} // Klik logout
                  className={`
                    h-10 cursor-pointer flex items-center gap-3 pl-1 pr-4 rounded-full border transition-all duration-300 group select-none
                    ${scrolled 
                      ? "border-gray-200 bg-gray-50/50 hover:border-red-200 hover:bg-red-50" 
                      : "border-dark-green/30 bg-white/40 hover:bg-white/80 hover:text-red-500 text-dark-green"}
                  `}
                  title="Click to Logout"
                >
                  {/* Avatar */}
                  <div className="relative w-8 h-8 rounded-full overflow-hidden border border-white shadow-sm group-hover:scale-105 transition-transform duration-300 bg-gray-200 flex items-center justify-center text-gray-400">
                     {/* Fallback kalau ga ada image */}
                     <UserIcon size={16} /> 
                  </div>

                  <div className="flex flex-col items-start justify-center h-full max-w-[80px]">
                     <span className="text-[9px] uppercase tracking-widest font-bold leading-none mb-0.5 opacity-60 group-hover:text-red-400 transition-colors">
                       Hi,
                     </span>
                     <span className="text-xs font-serif font-bold leading-none truncate w-full group-hover:text-red-600 transition-colors">
                       {user.name.split(' ')[0]} {/* Ambil nama depan aja biar rapi */}
                     </span>
                  </div>
                  
                  {/* Logout Icon (Muncul pas hover biar keren) */}
                  <LogOut size={14} className="hidden group-hover:block text-red-500 animate-in fade-in zoom-in duration-200" />
               </div>
             </>
          ) : (
             // --- IF NOT LOGGED IN ---
             <div className="flex items-center gap-2 ml-2">
                <Link href="/login">
                    <button className={loginBtnClass}>
                        Log In
                    </button>
                </Link>
                <Link href="/register" className="hidden sm:block">
                    <button className={signUpBtnClass}>
                        Sign Up
                    </button>
                </Link>
             </div>
          )}
        </div>

      </nav>
    </header>
  );
}

export default Navbar;