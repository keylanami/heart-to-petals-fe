import { Playfair_Display, DM_Sans, Lora, Inter_Tight, Inter} from "next/font/google";
import { CartProvider } from "@/app/context/CartContext";
import "./globals.css";

const playfair = Lora({ 
  subsets: ["latin"],
  variable: "--font-playfair", 
  display: "swap",
});

const dmSans = Inter({
  subsets: ["latin"],
  variable: "--font-dm-sans",
  display: "swap",
});

export const metadata = {
  title: "HeartToPetals The Sentiment Florist",
  description: "Ungkapkan perasaanmu lewat bunga.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="id">
      <body className={`${playfair.variable} ${dmSans.variable} font-sans bg-cream-bg text-dark-green antialiased`}>
        <CartProvider>
        {children}
        </CartProvider>
      </body>
    </html>
  );
}