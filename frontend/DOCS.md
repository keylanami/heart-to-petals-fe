# 🏗️ Frontend Information Architecture

## 1. Core Technology
Aplikasi ini dibangun menggunakan pendekatan **Client-Side Rendering** yang berat pada interaktivitas, memanfaatkan **Next.js App Router** untuk routing yang efisien.

### Libraries & Dependencies
| Library | Usage | Justification |
| :--- | :--- | :--- |
| **Next.js** | Core Framework | Server-side rendering capability, routing file-system, dan optimasi gambar otomatis. |
| **Tailwind CSS** | Styling | Utility-first CSS mempercepat development UI yang konsisten dan responsif. |
| **Framer Motion** | Animation | Digunakan untuk page transitions, modal popups, dan *micro-interactions* (hover effects, list reordering). |
| **Lucide React** | Iconography | Set ikon yang ringan, konsisten, dan mudah dikustomisasi (size/stroke). |
| **React Map GL** | Maps | Wrapper untuk Mapbox GL JS. Digunakan untuk fitur "Live Map" (Superadmin), "Draggable Pin" (Register Tenant), dan "Mini Map" (Shop Detail). |
| **React Colorful** | Color Picker | Komponen color picker ringan untuk fitur input varian packaging bagi Tenant. |

## 2. State Management Strategy
Karena aplikasi ini adalah prototipe Frontend-Heavy tanpa database SQL/NoSQL real, kami menggunakan **React Context API** yang dikombinasikan dengan **LocalStorage** untuk persistensi data.

### Contexts Created:
1.  **`AuthContext`**: Menangani sesi user, login, logout, register, dan proteksi route berdasarkan Role (User vs Tenant vs Superadmin).
2.  **`CartContext`**: Menangani logika keranjang belanja (add, remove, calculate total).
3.  **`InventoryContext`**: Menangani stok barang milik tenant (CRUD Flower, Packaging, Catalog).
4.  **`ShopContext`**: Menyimpan data profil toko dan status registrasi tenant.
5.  **`OrderContext`**: Simulasi siklus hidup pesanan (Pending -> Processing -> On Delivery -> Completed).
6.  **`ToastContext`**: Global notification system untuk feedback user.

## 3. Data Flow Architecture (Simulated)

```mermaid
graph TD
    UserAction[User Action] --> Context[React Context]
    Context --> StateUpdate[Update State]
    StateUpdate --> LocalStorage[Save to LocalStorage]
    LocalStorage --> Rehydrate[Rehydrate on Refresh]
    Rehydrate --> Context