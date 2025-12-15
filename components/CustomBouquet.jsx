
const CustomBouquet = () => {

  return (
    <section className="max-w-7xl mx-auto px-6 mb-24">
      <div className="bg-[#E6E2D6] rounded-[2rem] p-10 md:p-16 flex flex-col md:flex-row items-center justify-between relative overflow-hidden">
     
        <div className="absolute -right-20 -top-20 w-64 h-64 bg-white/30 rounded-full blur-3xl"></div>
  
        <div className="md:w-1/2 z-10 hover:cursor-default">
          <span className="text-xs font-bold tracking-widest uppercase text-gray-500 mb-2 block">Custom Builder</span>
          <h2 className="text-3xl md:text-5xl font-serif mb-6 leading-tight font-bold">Punya Ide Sendiri?<br />Racik Bouquetmu.</h2>
          <p className="text-gray-600 mb-8 max-w-md ">
            Pilih bunga favoritmu satu per satu. Mawar merah, Tulip, atau Lili? Kamu adalah senimannya.
          </p>
          <button className="border-b-2 border-dark-green pb-1 text-dark-green font-medium hover:text-sage-green hover:border-sage-green transition">
            Mulai Custom Sekarang &rarr;
          </button>
        </div>
        
        <div className="md:w-1/3 mt-10 md:mt-0 relative z-10">
          <img 
            src="assets/flower.png" 
            alt="Custom Bouquet" 
            className="rounded-2xl rotate-3 object-cover h-96 w-full"
          />
        </div>
      </div>
    </section>
  );
}



export default CustomBouquet;