import { Trash2, Check } from 'lucide-react';
import { useState } from 'react';
import DefaultProduct from "@/assets/images/product/default-product.png";
import { QuantityControl } from '@/components/khaslana/cart/quantity-control';
import DeleteConfirmationDialog from '@/components/khaslana/delete-confirmation-dialog';
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
    const variant = item.variant;
    const product = variant?.product;
    const [isDeleteOpen, setIsDeleteOpen] = useState(false);

    const basePrice = variant?.price ?? 0;
    const totalPrice = basePrice * item.quantity;

    const formatCurrency = (value: number) => {
        return new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            maximumFractionDigits: 0,
        }).format(value);
    };

    const variantAttributesText = variant?.attribute_values
        ?.map((attrValue) => {
            if (!attrValue.attribute?.name) return attrValue.value;
            return `${attrValue.attribute.name}: ${attrValue.value}`;
        })
        .join(', ');

    const imageUrl =
        product?.product_images?.[0]?.image
            ? `/storage/${product.product_images[0].image}`
            : DefaultProduct;

    return (
        <>
            <div className="flex justify-between gap-4 p-4 bg-[#121214] border border-[#202024] rounded-xl transition-all duration-200 hover:border-[#29292e]">

                {/* LEFT */}
                <div className="flex items-start flex-1 gap-4 min-w-0">
                    
                    {/* CHECKBOX */}
                    <div
                        onClick={() => onSelectToggle(item.id)}
                        className={`
                            w-5 h-5 rounded flex items-center justify-center
                            border cursor-pointer transition
                            ${isSelected
                                ? 'bg-[#99ff33] border-[#99ff33]'
                                : 'bg-[#1a1a1e] border-[#2a2a30]'
                            }
                        `}
                    >
                        {isSelected && (
                            <Check className="w-4 h-4 text-[#161619] stroke-[3]" />
                        )}
                    </div>

                    {/* IMAGE */}
                    <div className="relative w-20 h-20 rounded-lg overflow-hidden bg-[#1c1c21] flex-shrink-0 border border-[#202024]">
                        <img
                            src={imageUrl}
                            alt={product?.name ?? "Produk"}
                            className="w-full h-full object-cover"
                        />
                    </div>

                    {/* INFO */}
                    <div className="flex flex-col flex-1 min-w-0 pr-2">
                        <h4 className="text-sm font-semibold text-[#f2f2f3] truncate tracking-wide">
                            {product?.name ?? 'Produk Tidak Diketahui'}
                        </h4>

                        <p className="text-[12px] text-[#7c7c8a] mt-1 leading-tight">
                            {variantAttributesText}
                        </p>

                        <div className="mt-3 w-fit max-w-[120px]">
                            <QuantityControl
                                quantity={item.quantity}
                                stock={variant?.stock ?? 0}
                                onChange={(newQuantity) => onQuantityChange(item.id, newQuantity)}
                            />
                        </div>
                    </div>
                </div>

                {/* RIGHT */}
                <div className="flex flex-col items-end flex-shrink-0 pl-2 min-w-[130px] gap-2">

                    {/* DELETE */}
                    <button
                        type="button"
                        onClick={() => setIsDeleteOpen(true)}
                        className={`
                            p-1.5 rounded-md transition-all duration-200
                            bg-[#1a1a1e]
                            ${isEditMode
                                ? 'opacity-100 text-[#7c7c8a] hover:text-[#ff4444] hover:bg-[#261919]'
                                : 'opacity-0 pointer-events-none'
                            }
                        `}
                    >
                        <Trash2 className="w-3.5 h-3.5" />
                    </button>

                    {/* PRICE */}
                    <div className="text-right mt-auto">
                        <div className="text-[11px] text-[#7c7c8a] mb-1">
                            {formatCurrency(basePrice)} / unit
                        </div>
                        <div className="text-lg font-bold text-[#99ff33]">
                            {formatCurrency(totalPrice)}
                        </div>
                    </div>
                </div>
            </div>

            {/* DIALOG */}
            <DeleteConfirmationDialog
                open={isDeleteOpen}
                title="Hapus Produk?"
                description="Produk ini akan dihapus dari keranjang Anda."
                onCancel={() => setIsDeleteOpen(false)}
                onConfirm={() => {
                    onRemove(item.id);
                    setIsDeleteOpen(false);
                }}
            />
        </>
    );
};