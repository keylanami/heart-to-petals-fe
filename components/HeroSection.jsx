"use client";


const HeroSection = () => {
    
    return (
      <header className="relative px-6 pt-30 pb-24 md:pt-40 md:pb-32 max-w-4xl mx-auto text-center">
        <h1 className="text-4xl md:text-6xl font-serif leading-tight mb-4 hover: cursor-default">
          Bunga yang Mengerti <br /> <span className="italic text-gray-500">Perasaanmu.</span>
        </h1>
        <p className="text-gray-600 mb-10 max-w-lg mx-auto">
          Mau ceritakan ceritamu atau tulis pesannya langsung, AI kami akan meracik bouquet yang mewakili emosimu.
        </p>
    
      
        <div className="bg-white/60 backdrop-blur-md border border-white/50 p-2 rounded-3xl hover:shadow-xl hover:border-b-2 hover:border-dark-green active:border-dark-green max-w-2xl mx-auto">
          <div className="relative">
            <textarea 
              className="w-full bg-transparent p-6 text-lg focus:outline-none resize-none placeholder-gray-400 font-serif text-dark-green h-32"
              placeholder="Aku mau minta maaf ke pacarku karena lupa anniversary..."
            ></textarea>
            
            <div className="flex justify-between items-center px-6 pb-4">
              <div className="flex items-center space-x-2 text-xs text-gray-500">
                <span>Budget:</span>
                <select className="bg-transparent border-b border-gray-300 focus:outline-none cursor-pointer">
                  <option>Standard</option>
                  <option>Premium</option>
                  <option>Luxury</option>
                </select>
              </div>
    
              <button className="bg-dark-green text-white px-6 py-3 rounded-full font-medium text-sm flex items-center gap-2 hover:bg-sage-green transform hover:scale-[1.04] hover: cursor-pointer transition duration-200 shadow-lg">
                <span>Analisa</span>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </header>
    );
}


export default HeroSection;