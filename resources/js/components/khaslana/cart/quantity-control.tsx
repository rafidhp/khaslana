import { Minus, Plus } from 'lucide-react';
import React from 'react';

interface QuantityControlProps {
    quantity: number;
    stock: number;
    onChange: (newQuantity: number) => void;
}

export const QuantityControl: React.FC<QuantityControlProps> = ({
    quantity,
    stock,
    onChange,
}) => {
    // Fungsi penanganan tombol minus
    const handleDecrement = () => {
        if (quantity > 1) {
            onChange(quantity - 1);
        }
    };

    // Fungsi penanganan tombol plus
    const handleIncrement = () => {
        if (quantity < stock) {
            onChange(quantity + 1);
        }
    };

    // Evaluasi status tombol disabled
    const isMinusDisabled = quantity <= 1;
    const isPlusDisabled = quantity >= stock;

    return (
        <div className="flex items-center bg-[#1a1a1e] border border-[#2a2a30] rounded-lg p-1 h-9 overflow-hidden shadow-inner select-none">
            {/* Tombol Kurang (Minus) */}
            <button
                type="button"
                onClick={handleDecrement}
                disabled={isMinusDisabled}
                className={`flex items-center justify-center w-7 h-full rounded-md transition-all duration-200 ${
                    isMinusDisabled
                        ? 'text-[#4e4e54] cursor-not-allowed opacity-40'
                        : 'text-[#f2f2f3] hover:bg-[#29292e] hover:text-[#99ff33] active:scale-95'
                }`}
                title="Kurangi jumlah"
            >
                <Minus className="w-3.5 h-3.5" />
            </button>

            {/* Indikator Angka Kuantitas */}
            <div className="w-8 flex items-center justify-center text-center">
                <span className="text-xs font-bold text-[#f2f2f3] tabular-nums">
                    {quantity}
                </span>
            </div>

            {/* Tombol Tambah (Plus) */}
            <button
                type="button"
                onClick={handleIncrement}
                disabled={isPlusDisabled}
                className={`flex items-center justify-center w-7 h-full rounded-md transition-all duration-200 ${
                    isPlusDisabled
                        ? 'text-[#4e4e54] cursor-not-allowed opacity-40'
                        : 'text-[#f2f2f3] hover:bg-[#29292e] hover:text-[#99ff33] active:scale-95'
                }`}
                title="Tambah jumlah"
            >
                <Plus className="w-3.5 h-3.5" />
            </button>
        </div>
    );
};