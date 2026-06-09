import { AlertTriangle, Loader2 } from 'lucide-react';
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
    // Total item terpilih
    const selectedCount = selectedItems.length;

    // Total harga
    const totalPrice = selectedItems.reduce((acc, item) => {
        const price = item.variant?.price ?? 0;
        return acc + price * item.quantity;
    }, 0);

    // Validasi UMKM
    const uniqueUmkmIds = Array.from(
        new Set(selectedItems.map((item) => item.variant?.product?.umkm_id))
    ).filter(Boolean);

    const isMultipleMerchantSelected = uniqueUmkmIds.length > 1;
    const isNoItemSelected = selectedCount === 0;
    const isMultipleItemSelected = selectedCount > 1;
    const isCheckoutDisabled = isNoItemSelected || isMultipleMerchantSelected || isMultipleItemSelected || isLoading;

    const formatCurrency = (value: number) => {
        return new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            maximumFractionDigits: 0,
        }).format(value);
    };

    return (
        <div className="fixed bottom-0 left-0 right-0 z-50 bg-[#1E1B26] border-t border-[#2E2A39]">

            {/* Disable */}
            {isMultipleMerchantSelected && (
                <div className="bg-[#2a1a1a] border-b border-[#4d1f1f] px-6 py-2.5 flex items-center gap-2.5">
                    <AlertTriangle className="w-4 h-4 text-[#ff4444]" />
                    <p className="text-xs text-[#ff8888]">
                        Checkout hanya bisa dari satu UMKM. Lepaskan item lain untuk lanjut.
                    </p>
                </div>
            )}

            {isMultipleItemSelected && !isMultipleMerchantSelected && (
                <div className="bg-[#2a1a1a] border-b border-[#4d1f1f] px-6 py-2.5 flex items-center gap-2.5">
                    <AlertTriangle className="w-4 h-4 text-[#ff4444]" />
                    <p className="text-xs text-[#ff8888]">
                        Hanya bisa checkout satu item
                    </p>
                </div>
            )}

            {/* MAIN */}
            <div className="max-w-8xl mx-auto px-6 py-4 flex items-center justify-end gap-6">

                {/* LEFT - TOTAL */}
                <div className="flex items-center gap-3">
                    <span className="text-sm text-[#7c7c8a]">
                        Total
                    </span>
                    <span className="text-xl font-bold text-[#99FF33]">
                        {formatCurrency(totalPrice)}
                    </span>
                </div>

                {/* RIGHT - BUTTON */}
                <button
                    onClick={onCheckout}
                    disabled={isCheckoutDisabled}
                    className={`
                        px-6 py-3 rounded-full font-semibold text-sm
                        transition-all duration-200 active:scale-95
                        ${isCheckoutDisabled
                            ? 'bg-[#2a2a30] text-[#7c7c8a] cursor-not-allowed'
                            : 'bg-[#99FF33] text-black hover:brightness-110'
                        }
                    `}
                >
                    {isLoading ? (
                        <div className="flex items-center gap-2">
                            <Loader2 className="w-4 h-4 animate-spin" />
                            <span>Memproses...</span>
                        </div>
                    ) : (
                        selectedCount > 0 ? `Checkout (${selectedCount})` : 'Checkout'
                    )}
                </button>

            </div>
        </div>
    );
};