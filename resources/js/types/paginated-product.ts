import type { Product } from "@/types/product";

export interface PaginatedProducts {
    data: Product[];

    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
    prev_page_url: string | null;
    next_page_url: string | null;
    from: number;

    links: {
        url: string | null;
        label: string;
        active: boolean;
    }[];
}