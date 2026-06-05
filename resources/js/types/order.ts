import type { OrderItem } from '@/types/order-item';
import type { Payment } from '@/types/payment';
import type { Umkm } from '@/types/umkm';

export interface Order {
    id: number;
    user_id: number;
    umkm_id: number;

    invoice_number: string;
    type: 'DIAMBIL' | 'DIANTAR';
    total_price: number;

    status:
        | 'TERTUNDA'
        | 'MENUNGGU PEMBAYARAN'
        | 'DIBAYAR'
        | 'DALAM PROSES'
        | 'DIKIRIM'
        | 'SELESAI'
        | 'DIBATALKAN';

    payment_status:
        | 'BELUM DIBAYAR'
        | 'DIBAYAR'
        | 'GAGAL'
        | 'KADALUWARSA';

    address: string;
    notes?: string | null;

    shipping_cost: number;
    shipping_courier?: string | null;
    shipping_service?: string | null;

    paid_at?: string | null;
    tracking_number?: string | null;
    shipped_at?: string | null;
    completed_at?: string | null;
    created_at: string;
    updated_at: string;

    order_items?: OrderItem[];
    payment?: Payment;
    umkm?: Umkm;
}