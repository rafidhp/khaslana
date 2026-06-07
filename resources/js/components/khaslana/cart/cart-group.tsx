import { Store, SquarePen, Check } from 'lucide-react';
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
    onToggleEdit: () => void;
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
    onToggleEdit,
}) => {
    const itemIds = items.map((item) => item.id);
    const isAllGroupItemsSelected = items.every((item) => selectedItemsMap[item.id]);
    const handleMasterCheckboxChange = () => {
        onGroupSelectToggle(itemIds, !isAllGroupItemsSelected);
    };

    return (
        <div className="bg-[#161619] border border-[#202024] rounded-2xl overflow-hidden p-4 space-y-4">
            
            {/* MERCHANT HEADER GROUP */}
            <div className="flex items-center justify-between pb-3 border-b border-[#202024] pr-2">
            {/* KIRI */}
            <div className="flex items-center gap-3 min-w-0">
            <div
                onClick={handleMasterCheckboxChange}
                className={`
                    w-5 h-5 rounded flex items-center justify-center
                    border cursor-pointer transition
                    ${isAllGroupItemsSelected
                        ? 'bg-[#99ff33] border-[#99ff33]'
                        : 'bg-[#1a1a1e] border-[#2a2a30]'
                    }
                `}
            >
                {isAllGroupItemsSelected && (
                    <Check className="w-4 h-4 text-[#161619] stroke-[3]"/>
                )}
            </div>

                <label 
                    htmlFor={`master-checkbox-umkm-${umkmId}`}
                    className="flex items-center gap-2 cursor-pointer group min-w-0"
                >
                    <Store className="w-4 h-4 text-[#99ff33] shrink-0" />
                    <span className="text-sm font-bold text-[#f2f2f3] truncate">
                        {merchantName}
                    </span>
                </label>
            </div>

            {/* KANAN */}
            <div className="flex items-center gap-2 shrink-0 pr-1">

            <button
                type="button"
                onClick={onToggleEdit}
                className={`
                    flex items-center gap-1.5 text-xs font-semibold
                    px-3 py-1.5 rounded-md border transition
                    ${isEditMode
                        ? 'bg-[#261919] text-[#ff4444] border-[#4d1f1f]'
                        : 'text-[#7c7c8a] hover:text-white border-transparent'
                    }
                `}
            >
                {isEditMode ? (
                    <>
                        <Check className="w-3.5 h-3.5" />
                        <span>Selesai</span>
                    </>
                ) : (
                    <>
                        <SquarePen className="w-3.5 h-3.5" />
                        <span>Ubah</span>
                    </>
                )}
            </button>

            </div>
        </div>

            {/* DAFTAR BARIS PRODUK */}
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