import Link from "next/link";


const Navbar = () => {
    return (
      <header className="fixed top-8 left-0 right-0 z-50 flex justify-center px-4">
        <nav className="w-full max-w-7xl flex items-center justify-between px-6 py-3 bg-cream-bg/80 backdrop-blur-md border border-dark-green rounded-full shadow-sm transition-all">
          <div className="text-xl md:text-2xl font-serif font-bold tracking-wide text-dark-green">
            HeartToPetals
          </div>


          <div className="hidden md:flex space-x-8 text-sm font-medium tracking-wide text-dark-green">
            <Link href="/" className="hover:text-sage-green transition">Home</Link>
            <Link href="/shop" className="hover:text-sage-green transition">Shop</Link>
            <Link href="/about" className="hover:text-sage-green transition">About</Link>
          </div>

        
          <div className="flex gap-3">
            <button className="px-5 py-2 border border-dark-green rounded-full text-sm font-medium hover:bg-dark-green hover:text-white transition hover: cursor-pointer">
              Cart (0)
            </button>
            <button className="px-5 py-2 bg-dark-green text-white border border-dark-green rounded-full text-sm font-medium hover:bg-sage-green hover: cursor-pointer transition hidden sm:block">
              Login
            </button>
          </div>

        </nav>
      </header>
    );
}

export default Navbar;