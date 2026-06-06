import { ShoppingBag, AlertTriangle, Loader2 } from 'lucide-react';
import React from 'react';
import type { CartItem as CartItemType } from '@/types/cart';

interface CartSummaryProps {
    selectedItems: CartItemType[];
    onCheckout: () => void;
    isLoading: boolean;
}

export const CartSummary: React.FC<CartSummaryProps> = ({
    selectedItems,
    onCheckout,
    isLoading,
}) => {
    // 1. Hitung total kuantitas barang yang dicentang
    const totalQuantity = selectedItems.reduce((acc, item) => acc + item.quantity, 0);

    // 2. Hitung total akumulasi harga dari seluruh produk yang dicentang
    const totalPrice = selectedItems.reduce((acc, item) => {
        const variantPrice = item.variant?.price;
        const basePrice = variantPrice ?? 0;
        return acc + (basePrice * item.quantity);
    }, 0);

    // 3. Validasi Aturan Bisnis: Kumpulkan ID UMKM yang unik dari item terpilih
    const uniqueUmkmIds = Array.from(
        new Set(selectedItems.map((item) => item.variant?.product?.umkm_id))
    ).filter(Boolean);

    // Evaluasi status validasi Single-UMKM
    const isMultipleMerchantSelected = uniqueUmkmIds.length > 1;
    const isNoItemSelected = selectedItems.length === 0;
    const isCheckoutDisabled = isNoItemSelected || isMultipleMerchantSelected || isLoading;

    // Helper formatter mata uang Rupiah (IDR)
    const formatCurrency = (value: number) => {
        return new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            maximumFractionDigits: 0,
        }).format(value);
    };

    return (
        <div className="fixed bottom-0 left-0 right-0 w-full bg-[#121214] border-t border-[#202024] z-50 shadow-[0_-8px_30px_rgb(0,0,0,0.5)]">
            
            {/* ⚠️ BANNER PERINGATAN: TEREDUKSI OLEH MULTI-UMKM VIOLATION */}
            {isMultipleMerchantSelected && (
                <div className="bg-[#2a1a1a] border-b border-[#4d1f1f] px-6 py-2.5 flex items-center gap-2.5 transition-all duration-300">
                    <AlertTriangle className="w-4 h-4 text-[#ff4444] flex-shrink-0" />
                    <p className="text-xs font-medium text-[#ff8888] tracking-wide">
                        Batas Aturan Transaksi: Selesaikan pembayaran dari satu UMKM terlebih dahulu. Lepaskan centang dari UMKM lain untuk melanjutkan checkout.
                    </p>
                </div>
            )}

            {/* 💰 KONTEN UTAMA BANNER RINGKASAN */}
            <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between gap-4">
                
                {/* SISI KIRI: Ringkasan Jumlah Item dan Total Kalkulasi Harga */}
                <div className="flex items-center gap-6">
                    {/* Badge kuantitas total (Sembunyi jika kosong) */}
                    {!isNoItemSelected && (
                        <div className="hidden sm:flex items-center gap-2 bg-[#1a1a1e] border border-[#2a2a30] px-3 py-1.5 rounded-lg">
                            <ShoppingBag className="w-4 h-4 text-[#7c7c8a]" />
                            <span className="text-xs font-bold text-[#f2f2f3]">
                                {totalQuantity} Pilihan
                            </span>
                        </div>
                    )}
                    
                    {/* Visualisasi Harga Sesuai Mockup Figma */}
                    <div className="flex items-baseline gap-3">
                        <span className="text-sm font-medium text-[#7c7c8a] uppercase tracking-wider">
                            Total
                        </span>
                        <span className="text-2xl font-black text-[#99ff33] tracking-tight tabular-nums">
                            {formatCurrency(totalPrice)}
                        </span>
                    </div>
                </div>

                {/* SISI KANAN: Tombol Aksi Utama (Pill Button Hijau Neon) */}
                <button
                    type="button"
                    onClick={onCheckout}
                    disabled={isCheckoutDisabled}
                    className={`relative flex items-center justify-center font-bold text-sm tracking-wide rounded-full px-8 py-3.5 transition-all duration-300 active:scale-98 ${
                        isCheckoutDisabled
                            ? 'bg-[#1a1a1e] text-[#4e4e54] border border-[#2a2a30] cursor-not-allowed shadow-none'
                            : 'bg-[#99ff33] text-black hover:bg-[#88e62d] shadow-[0_4px_20px_rgba(153,255,51,0.25)] hover:shadow-[0_4px_25px_rgba(153,255,51,0.4)]'
                    }`}
                >
                    {isLoading ? (
                        <div className="flex items-center gap-2">
                            <Loader2 className="w-4 h-4 animate-spin text-black" />
                            <span>Memproses...</span>
                        </div>
                    ) : (
                        <span>Checkout</span>
                    )}
                </button>

            </div>
        </div>
    );
};