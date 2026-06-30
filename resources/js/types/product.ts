import type { ProductVariant } from "@/types/attribute";
import type { Umkm } from "@/types/umkm";
import type { Review } from "@/types/review";

export interface Product {
    id: number;
    umkm_id: number;
    category_id: number;
    promo_id: number | null;
    name: string;
    description: string;
    is_archived: boolean;
    sold_count: number;
    created_at: string;
    updated_at: string;

    category?: {
        id: number;
        name: string;
    };

    promo?: {
        id: number;
        umkm_id: number;
        name: string;
        type: 'DISKON' | 'PROMO';
        description: string;
        image: string | null;
        start_date: string;
        end_date: string;
        status: 'SEGERA HADIR' | 'BERLANGSUNG' | 'BERAKHIR';
        discount_percent: number | null;
    } | null;

    product_images?: {
        id: number;
        image: string;
        created_at: string;
        updated_at: string;
    }[];

    product_variants?: ProductVariant[];

    umkm?: Umkm;
    reviews?: Review[];
}