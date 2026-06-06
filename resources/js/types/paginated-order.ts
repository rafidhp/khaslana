import type { Order } from "@/types/order";

export interface PaginatedOrders {
    data: Order[];

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