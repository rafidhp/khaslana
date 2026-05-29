export interface Product {
    id: number;
    category_id: number;
    promo_id: number;
    name: string;
    description: string;
    is_archived: boolean;

    product_images?: {
        id: number;
        image: string;
    }[];

    product_variants?: {
        id: number;
        price: number;
        stock: number;
    }[];

    promo?: {
        id: number;
        name: string;
        type: 'DISKON' | 'PROMO';
        image: string | null;
        status: 'SEGERA HADIR' | 'BERLANGSUNG' | 'BERAKHIR';
        discount_percent: number | null;
    };
}