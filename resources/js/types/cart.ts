import type { User } from '@/types'; 

// ==========================================
// 🏬 KONTRAK DATA UMKM (Peta Relasi Produk)
// ==========================================
export interface Umkm {
    id: number;
    user_id: number;
    name: string;
    type: 'TETAP' | 'KELILING';
    is_active: boolean;
    created_at?: string;
    updated_at?: string;
}

// ==========================================
// 📦 KONTRAK DATA ATRIBUT VARIASI PRODUK
// ==========================================
export interface Attribute {
    id: number;
    name: string; // Contoh: "Level Pedas", "Ukuran"
}

export interface AttributeValue {
    id: number;
    attribute_id: number;
    value: string; // Contoh: "Level 5", "Jumbo"
    attribute?: Attribute;
}

// ==========================================
// 🏷️ KONTRAK DATA PRODUK & VARIANNYA
// ==========================================
export interface Product {
    id: number;
    umkm_id: number;
    name: string;
    price: number;
    description?: string;
    image?: string;
    umkm?: Umkm; // Eager loaded dari CartController
}

export interface ProductVariant {
    id: number;
    product_id: number;
    price: number;
    stock: number;
    product?: Product;
    attributeValues?: AttributeValue[]; // 🔥 FIX naming
}

// ==========================================
// 🛒 KONTRAK UTAMA: KERANJANG BELANJA (CART)
// ==========================================
export interface CartItem {
    id: number;
    cart_id: number;
    variant_id: number;
    quantity: number;
    created_at?: string;
    updated_at?: string;
    variant: ProductVariant;
}

export interface Cart {
    id: number;
    user_id: number;
    created_at?: string;
    updated_at?: string;
    
    // Eager Loaded Relations dari CartController
    cart_items: CartItem[];
    user?: User;
}

// Helper Interface untuk menangani State Checkbox di Frontend React nanti
export interface SelectedCartItemsMap {
    [cartItemId: number]: boolean;
}