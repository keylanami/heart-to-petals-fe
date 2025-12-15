import FlowerCard from "@/components/FlowerCard";

const DUMMY_FLOWERS = [
  {
    title: "Blushing Peony",
    desc: "Peony, Mawar Pink, Eucalyptus",
    price: "Rp 450.000",
    image:
      "https://asset.bloomnation.com/c_pad,d_vendor:global:catalog:product:image.png,f_auto,fl_preserve_transparency,q_auto/v1734242103/vendor/3612/catalog/product/2/0/20240510030230_file_663d8e460b9d1_663d8ef06cd9f.webp",
    isBestSeller: true,
  },
  {
    title: "Autumn Whisper",
    desc: "Krisan, Mawar Orange, Daun Kering",
    price: "Rp 385.000",
    image:
      "https://images.unsplash.com/photo-1561181286-d3fee7d55364?q=80&w=800&auto=format&fit=crop",
    isBestSeller: false,
  },
  {
    title: "Pure Serenity",
    desc: "Lili Putih, Baby Breath",
    price: "Rp 520.000",
    image:
      "https://images.unsplash.com/photo-1591886960571-74d43a9d4166?q=80&w=800&auto=format&fit=crop",
    isBestSeller: false,
  },
  {
    title: "Blushing Peony",
    desc: "Peony, Mawar Pink, Eucalyptus",
    price: "Rp 450.000",
    image:
      "https://asset.bloomnation.com/c_pad,d_vendor:global:catalog:product:image.png,f_auto,fl_preserve_transparency,q_auto/v1734242103/vendor/3612/catalog/product/2/0/20240510030230_file_663d8e460b9d1_663d8ef06cd9f.webp",
    isBestSeller: true,
  },
  {
    title: "Autumn Whisper",
    desc: "Krisan, Mawar Orange, Daun Kering",
    price: "Rp 385.000",
    image:
      "https://images.unsplash.com/photo-1561181286-d3fee7d55364?q=80&w=800&auto=format&fit=crop",
    isBestSeller: false,
  },
  {
    title: "Pure Serenity",
    desc: "Lili Putih, Baby Breath",
    price: "Rp 520.000",
    image:
      "https://images.unsplash.com/photo-1591886960571-74d43a9d4166?q=80&w=800&auto=format&fit=crop",
    isBestSeller: false,
  },
  {
    title: "Blushing Peony",
    desc: "Peony, Mawar Pink, Eucalyptus",
    price: "Rp 450.000",
    image:
      "https://asset.bloomnation.com/c_pad,d_vendor:global:catalog:product:image.png,f_auto,fl_preserve_transparency,q_auto/v1734242103/vendor/3612/catalog/product/2/0/20240510030230_file_663d8e460b9d1_663d8ef06cd9f.webp",
    isBestSeller: true,
  },
  {
    title: "Autumn Whisper",
    desc: "Krisan, Mawar Orange, Daun Kering",
    price: "Rp 385.000",
    image:
      "https://images.unsplash.com/photo-1561181286-d3fee7d55364?q=80&w=800&auto=format&fit=crop",
    isBestSeller: false,
  },
  {
    title: "Pure Serenity",
    desc: "Lili Putih, Baby Breath",
    price: "Rp 520.000",
    image:
      "https://images.unsplash.com/photo-1591886960571-74d43a9d4166?q=80&w=800&auto=format&fit=crop",
    isBestSeller: false,
  },
  {
    title: "Blushing Peony",
    desc: "Peony, Mawar Pink, Eucalyptus",
    price: "Rp 450.000",
    image:
      "https://asset.bloomnation.com/c_pad,d_vendor:global:catalog:product:image.png,f_auto,fl_preserve_transparency,q_auto/v1734242103/vendor/3612/catalog/product/2/0/20240510030230_file_663d8e460b9d1_663d8ef06cd9f.webp",
    isBestSeller: true,
  },
  {
    title: "Autumn Whisper",
    desc: "Krisan, Mawar Orange, Daun Kering",
    price: "Rp 385.000",
    image:
      "https://images.unsplash.com/photo-1561181286-d3fee7d55364?q=80&w=800&auto=format&fit=crop",
    isBestSeller: false,
  },
  {
    title: "Pure Serenity",
    desc: "Lili Putih, Baby Breath",
    price: "Rp 520.000",
    image:
      "https://images.unsplash.com/photo-1591886960571-74d43a9d4166?q=80&w=800&auto=format&fit=crop",
    isBestSeller: false,
  },
];

const CatalogSection = () => {
  return (
    <section className="max-w-7xl mx-auto px-6 pb-24">
      <div className="flex justify-between items-end mb-10">
        <h2 className="text-3xl font-serif">Koleksi Terkini</h2>
        <a
          href="#"
          className="text-sm underline decoration-1 underline-offset-4 text-gray-500 hover:text-dark-green"
        >
          Lihat Semua
        </a>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3">
        {DUMMY_FLOWERS.map((flower, index) => (
          <FlowerCard key={index} {...flower} />
        ))}
      </div>
    </section>
  );
};

export default CatalogSection;
