import type { User } from '@/types'; 

export interface Umkm {
    id: number;
    user_id: number;
    store_name: string; 
    name?: string;   
    type: 'TETAP' | 'KELILING';
    is_active: boolean;
    created_at?: string;
    updated_at?: string;
}

export interface Attribute {
    id: number;
    name: string; 
}

export interface AttributeValue {
    id: number;
    attribute_id: number;
    value: string; 
    attribute?: Attribute;
}

export interface Product {
    id: number;
    umkm_id: number;
    name: string;
    price: number;
    description?: string;
    image?: string;
    umkm?: Umkm;
    product_images?: ProductImage[];
}
export interface ProductImage {
    id: number;
    image: string;
}

export interface ProductVariant {
    id: number;
    product_id: number;
    price: number;
    stock: number;
    product?: Product;
    attribute_values?: AttributeValue[];
}

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
    cart_items: CartItem[];
    user?: User;
}
export interface SelectedCartItemsMap {
    [cartItemId: number]: boolean;
}