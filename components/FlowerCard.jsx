const FlowerCard = ({ title, desc, price, image, isBestSeller }) => {

    return (
      <div className="group cursor-pointer p-5 border-[1] hover:bg-dark-green hover:text-sage-green"> 
      {/* HOVER CHOICES ->  hover: shadow-xl  hover:border-2 hover:border-dark-green hover:shadow-dark-green hover:scale-[1.01] */}
        <div className="relative overflow-hidden rounded-md h-80 bg-gray-200 mb-6 ">
          <img 
            src={image} 
            alt={title} 
            className="w-full h-full object-cover"
          />
          {isBestSeller && (
            <div className="absolute top-4 right-4 bg-white/80 px-3 py-1 rounded-full text-xs font-bold">
              Best Seller
            </div>
          )}
        </div>
        <h3 className="text-xl font-serif">{title}</h3>
        <p className="text-gray-500 text-sm mb-2">{desc}</p>
        <div className="flex justify-between items-center">
          <span className="font-medium">{price}</span>
          <button className="w-8 h-8 rounded-full border-2 border-gray-300 flex items-center justify-center hover:bg-sage-green hover:text-dark-green hover:cursor-pointer hover:scale-[1.05] transition">
            +
          </button>
        </div>
      </div>
    );
}

export default FlowerCard;