export interface Payment {
    id: number;
    order_id: number;
    midtrans_order_id: string;
    payment_type: string;
    transaction_status: string;
    fraud_status?: string | null;
    gross_amount: number;
    snap_token?: string | null;
    raw_response?: Record<string, unknown>;
    paid_at?: string | null;
    created_at: string;
    updated_at: string;
}