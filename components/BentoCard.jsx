const BentoCard = ({ product, index, className }) => {
  const isDark = product.theme === 'dark';

  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      className={`group relative rounded-[2rem] overflow-hidden cursor-pointer ${className}`}
    >
     
      <div className="absolute inset-0 overflow-hidden">
        <img 
          src={product.image} 
          alt={product.title} 
          className="w-full h-full object-cover transition-transform duration-400 group-hover:scale-110"
        />
      </div>

     
      <div className={`absolute inset-0 bg-gradient-to-t ${isDark ? 'from-[#1A2F24] via-[#1A2F24]/40' : 'from-[#A8A39D] via-[#A8A39D]/10'} to-transparent opacity-60 group-hover:opacity-80 transition-opacity duration-500`}></div>

     
      <div className="absolute top-4 left-4">
        <span className="bg-white/30 backdrop-blur-md border border-white/20 text-white text-[10px] font-bold uppercase tracking-widest px-3 py-1 rounded-full shadow-sm">
          {product.tag}
        </span>
      </div>


      <div className="absolute top-4 right-4 translate-x-10 opacity-0 group-hover:translate-x-0 group-hover:opacity-100 transition-all duration-300 delay-75">
        <button className="bg-white text-dark-green w-10 h-10 rounded-full flex items-center justify-center shadow-lg hover:scale-110 transition">
           <ArrowUpRight size={20} />
        </button>
      </div>

    
      <div className={`absolute bottom-0 left-0 w-full p-6 md:p-8 flex flex-col justify-end ${isDark ? 'text-cream-bg' : 'text-white'}`}>
        
      
        <div className="transform transition-transform duration-300 group-hover:-translate-y-2">
           <h3 className="text-2xl md:text-3xl font-serif font-bold leading-tight mb-1 drop-shadow-md">
             {product.title}
           </h3>
           <p className="font-sans font-medium text-lg opacity-90 mb-2">
             {new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", maximumSignificantDigits: 3 }).format(product.price)}
           </p>
        </div>

      
        <div className="h-0 overflow-hidden opacity-0 group-hover:h-auto group-hover:opacity-100 transition-all duration-500 ease-in-out">
            <p className="text-sm opacity-90 line-clamp-2 mb-4 leading-relaxed">
              {product.desc}
            </p>
            
            <div className="flex gap-3">
              <button className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-full text-xs font-bold uppercase tracking-wide backdrop-blur-md border transition-all hover:scale-105 ${isDark ? 'bg-cream-bg/90 text-dark-green border-cream-bg' : 'bg-dark-green/90 text-white border-dark-green'}`}>
                <ShoppingBag size={14} /> Add
              </button>
              <button className={`flex-1 py-3 rounded-full text-xs font-bold uppercase tracking-wide transition-all hover:scale-105 ${isDark ? 'bg-transparent border border-cream-bg text-cream-bg hover:bg-cream-bg hover:text-dark-green' : 'bg-white text-dark-green hover:bg-gray-100'}`}>
                Buy Now
              </button>
            </div>
        </div>

      </div>
    </motion.div>
  );
};


export default BentoCard;