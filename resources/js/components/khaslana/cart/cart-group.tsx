import { Store } from 'lucide-react';
import React from 'react';
import { CartItem } from '@/components/khaslana/cart/cart-item';
import type { CartItem as CartItemType } from '@/types/cart';

interface CartGroupProps {
    umkmId: number;
    merchantName: string;
    items: CartItemType[];
    selectedItemsMap: Record<number, boolean>;
    isEditMode: boolean;
    onSelectToggle: (id: number) => void;
    onGroupSelectToggle: (itemIds: number[], shouldSelectAll: boolean) => void;
    onQuantityChange: (id: number, newQuantity: number) => void;
    onRemove: (id: number) => void;
}

export const CartGroup: React.FC<CartGroupProps> = ({
    umkmId,
    merchantName,
    items,
    selectedItemsMap,
    isEditMode,
    onSelectToggle,
    onQuantityChange,
    onRemove,
    onGroupSelectToggle,
}) => {
    // Ekstraksi seluruh ID item yang berada di kelompok UMKM ini
    const itemIds = items.map((item) => item.id);

    // Evaluasi apakah seluruh item di dalam toko ini sedang tercentang
    const isAllGroupItemsSelected = items.every((item) => selectedItemsMap[item.id]);

    // Handler ketika master checkbox toko di-klik
    const handleMasterCheckboxChange = () => {
        onGroupSelectToggle(itemIds, !isAllGroupItemsSelected);
    };

    return (
        <div className="bg-[#161619] border border-[#202024] rounded-2xl overflow-hidden p-4 space-y-4">
            
            {/* 🏪 KEPALA TOKO (MERCHANT HEADER GROUP) */}
            <div className="flex items-center justify-between pb-3 border-b border-[#202024]">
                <div className="flex items-center gap-3">
                    {/* Master Checkbox Kelompok Toko */}
                    <input
                        type="checkbox"
                        id={`master-checkbox-umkm-${umkmId}`}
                        checked={isAllGroupItemsSelected}
                        onChange={handleMasterCheckboxChange}
                        className="w-5 h-5 rounded border-[#2a2a30] bg-[#1a1a1e] text-[#99ff33] focus:ring-[#99ff33] focus:ring-offset-0 focus:ring-1 cursor-pointer transition-colors"
                    />
                    
                    {/* Label Informasi Toko */}
                    <label 
                        htmlFor={`master-checkbox-umkm-${umkmId}`}
                        className="flex items-center gap-2 cursor-pointer group"
                    >
                        <Store className="w-4 h-4 text-[#7c7c8a] group-hover:text-[#99ff33] transition-colors" />
                        <span className="text-sm font-bold text-[#f2f2f3] group-hover:text-white transition-colors tracking-wide">
                            {merchantName}
                        </span>
                    </label>
                </div>

                {/* Badge Jumlah Item Toko */}
                <div className="bg-[#1a1a1e] px-2.5 py-1 rounded-full border border-[#2a2a30]">
                    <span className="text-[10px] font-bold text-[#7c7c8a] tracking-wider uppercase">
                        {items.length} Produk
                    </span>
                </div>
            </div>

            {/* 📦 DAFTAR BARIS PRODUK INTERNAL TOKO */}
            <div className="space-y-3">
                {items.map((item) => (
                    <CartItem
                        key={item.id}
                        item={item}
                        isSelected={!!selectedItemsMap[item.id]}
                        isEditMode={isEditMode}
                        onSelectToggle={onSelectToggle}
                        onQuantityChange={onQuantityChange}
                        onRemove={onRemove}
                    />
                ))}
            </div>

        </div>
    );
};