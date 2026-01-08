🌹 HeartToPetals

Digitalizing the Language of Flowers

“Where code becomes the trellis for affection, and every pixel blooms.”

HeartToPetals is a web-based floral marketplace designed to translate emotions into carefully crafted bouquets. Built with Next.js 14, the platform connects local florists (Tenants) with customers (Buyers) through an immersive, interactive experience—while Admins ensure the ecosystem remains curated and trustworthy.

This project emphasizes user flow, visual storytelling, and state-driven UI, all wrapped in a single-page application experience powered by persistent local state.

🌿 Tech Stack (The Soil & Roots)

A modern stack chosen for performance, scalability, and expressive UI:

Framework — The Trellis
Next.js 16 (App Router)
Provides structured routing, server components, and scalable architecture.

Styling — The Pigment
Tailwind CSS
Utility-first styling for rapid UI development and responsive layouts.

Animation — The Wind
Framer Motion
Smooth transitions, shared layout animations (layoutId), and polished micro-interactions.

Maps & Location — The Terrain
React Map GL (Mapbox GL JS)
Enables real-time geographic visualization of florist locations.

State Management — The Nutrients
React Context API + LocalStorage
Lightweight yet persistent state handling for authentication, cart logic, and inventory—without Redux overhead.

💐 Features (The Arrangement)
🌸 Buyer — The Seeker

Bento Grid Showcase
A responsive masonry layout presenting bouquets as curated art pieces.

Custom Bouquet Builder
Interactive bouquet composition: flowers, wrappers, ribbons, and colors.

Real-time Stock Filtering
Automatically hides unavailable items to prevent broken expectations.

🌼 Tenant — The Cultivator

Florist Dashboard (Atelier)
Manage products, inventory, and storefront presence.

Draggable Map Location
Pinpoint shop location directly on an interactive map.

Inventory Orchestration
Control flower types, packaging variants, and color customization via hex picker.

🌺 Admin — The Groundskeeper

Ecosystem Overview (God Mode)
Centralized control panel for platform oversight.

Live Coverage Map
Visualize all active florists with distinct markers for custom-enabled shops.

Approval & Moderation Flow
Review and approve tenant onboarding requests to maintain quality.

🌱 Installation (Germination)

Run the project locally in a few simple steps:

Clone the Repository

git clone https://github.com/yourusername/heart-to-petals.git
cd heart-to-petals


Install Dependencies

npm install
# or
yarn install


Environment Variables
Create a .env.local file:

NEXT_PUBLIC_MAPBOX_TOKEN=pk.your_mapbox_public_token_here


Run Development Server

npm run dev


Open the App

http://localhost:3000

🌳 Project Structure (The Anatomy)
├── app/
│   ├── about/         # Page Dedicated for us, developers
│   ├── admin/         # Admin-only protected pages
│   ├── checkout/      # Detailed order and receipts informations before purchasing
│   ├── context/       # Global state (Auth, Cart, Inventory, Order, Shop, Toast) & helpers
│   ├── custom/[id]    # Bouquet builder logic
│   ├── get-started/   # Wrapper page of Log In and Register both as Buyer and Tenants
│   ├── login/         # Log In page both as Buyer and Tenants
│   ├── orders/[id]    # Order details per Buyer ID
│   ├── profile/       # Profile pages as Buyer, Tenants, and Superadmin
│   ├── product/       # Product detail pages
│   ├── register/      # Register pages as Buyer and Tenants
│   ├── shop/          # Tenant storefronts
│   ├── toko/          # All florist and collections page
│   ├── utils/         # Mock data
│   └── page.js        # Landing page
│
├── components/
│   ├── ui/            # Reusable UI components (Button, Maps, Separator)
│   └── Footer.jsx     # Footer Components
│   ├── Navbar.jsx     # Navbar Components
│
└── public/            # Static assets


📜 License

This project was created for portfolio and educational purposes.
Feel free to explore the codebase for inspiration and learning.

“In the arithmetic of love, one plus one equals everything, and two minus one equals nothing.”
— HeartToPetals