import { Trash2 } from 'lucide-react';
import React from 'react';
import { QuantityControl } from '@/components/khaslana/cart/quantity-control';
import type { CartItem as CartItemType } from '@/types/cart';

interface CartItemProps {
    item: CartItemType;
    isSelected: boolean;
    isEditMode: boolean;
    onSelectToggle: (id: number) => void;
    onQuantityChange: (id: number, newQuantity: number) => void;
    onRemove: (id: number) => void;
}

export const CartItem: React.FC<CartItemProps> = ({
    item,
    isSelected,
    isEditMode,
    onSelectToggle,
    onQuantityChange,
    onRemove,
}) => {
    // Ambil data dasar varian dan produk agar kode lebih bersih
    const variant = item.variant;
    const product = variant?.product;
    
    // Hitung harga final (prioritaskan harga varian, fallback ke harga produk utama)
    const basePrice = variant?.price ?? 0;
    const totalPrice = basePrice * item.quantity;

    // Helper formatter mata uang Rupiah (IDR)
    const formatCurrency = (value: number) => {
        return new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            maximumFractionDigits: 0,
        }).format(value);
    };

    // Ekstraksi teks string gabungan variasi pilihan atribut (misal: "Pedas Level 5, Jumbo")
    const variantAttributesText = variant?.attributeValues
        ?.map((attrValue) => attrValue.value)
        .join(', ');

    return (
        <div className="flex items-center justify-between p-4 bg-[#121214] border border-[#202024] rounded-xl transition-all duration-200 hover:border-[#29292e]">
            {/* SISI KIRI: Checkbox, Thumbnail Foto, dan Detail Informasi Produk */}
            <div className="flex items-center flex-1 gap-4 min-w-0">
                {/* Checkbox Pilihan Item */}
                <div className="flex items-center justify-center">
                    <input
                        type="checkbox"
                        id={`cart-item-checkbox-${item.id}`}
                        checked={isSelected}
                        onChange={() => onSelectToggle(item.id)}
                        className="w-5 h-5 rounded border-[#2a2a30] bg-[#1a1a1e] text-[#99ff33] focus:ring-[#99ff33] focus:ring-offset-0 focus:ring-1 cursor-pointer transition-colors"
                    />
                </div>

                {/* Thumbnail Gambar Produk */}
                <div className="relative w-20 h-20 rounded-lg overflow-hidden bg-[#1c1c21] flex-shrink-0 border border-[#202024]">
                    {product?.image ? (
                        <img
                            src={product.image}
                            alt={product.name}
                            className="w-full h-full object-cover"
                        />
                    ) : (
                        <div className="w-full h-full flex items-center justify-center bg-[#1a1a1e]">
                            <span className="text-[10px] text-[#7c7c8a] uppercase tracking-wider font-semibold">
                                No Img
                            </span>
                        </div>
                    )}
                </div>

                {/* Teks Deskripsi Informasi Produk */}
                <div className="flex flex-col flex-1 min-w-0 pr-2">
                    <h4 className="text-sm font-semibold text-[#f2f2f3] truncate tracking-wide">
                        {product?.name ?? 'Produk Tidak Diketahui'}
                    </h4>
                    
                    {/* Render opsi variasi produk jika ada */}
                    {variantAttributesText && (
                        <p className="text-xs text-[#7c7c8a] mt-0.5 truncate font-medium">
                            Varian: {variantAttributesText}
                        </p>
                    )}
                    
                    <div className="flex items-baseline gap-2 mt-2">
                        <span className="text-sm font-bold text-[#99ff33]">
                            {formatCurrency(basePrice)}
                        </span>
                        {item.quantity > 1 && (
                            <span className="text-[11px] text-[#7c7c8a] font-medium">
                                (Total: {formatCurrency(totalPrice)})
                            </span>
                        )}
                    </div>
                </div>
            </div>

            {/* SISI KANAN: Kontrol Jumlah Kuantitas dan Tombol Aksi Hapus (Edit Mode) */}
            <div className="flex items-center gap-4 flex-shrink-0 pl-2">
                {/* Komponen Pengatur Tambah/Kurang Kuantitas */}
                <QuantityControl
                    quantity={item.quantity}
                    stock={variant?.stock ?? 0}
                    onChange={(newQuantity) => onQuantityChange(item.id, newQuantity)}
                />

                {/* Tombol Hapus Spesifik Row Item (Hanya muncul jika isEditMode bernilai TRUE) */}
                {isEditMode && (
                    <button
                        type="button"
                        onClick={() => onRemove(item.id)}
                        className="p-2 text-[#7c7c8a] hover:text-[#ff4444] bg-[#1a1a1e] hover:bg-[#261919] rounded-lg transition-all duration-200 group border border-transparent hover:border-[#4d1f1f]"
                        title="Hapus item dari keranjang"
                    >
                        <Trash2 className="w-4 h-4 transition-transform group-hover:scale-105" />
                    </button>
                )}
            </div>
        </div>
    );
};