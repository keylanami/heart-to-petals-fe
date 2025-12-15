import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import CustomBouquet from "@/components/CustomBouquet";
import CatalogSection from "@/components/CatalogSection";
import Footer from "@/components/Footer";

const landingPage = () => {
  return (
    <main className="font-sans">
      <Navbar />
      <HeroSection />
      <CustomBouquet />
      <CatalogSection />
      <Footer />
    </main>
  );
};

export default landingPage;
