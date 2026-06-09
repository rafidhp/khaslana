import { router } from '@inertiajs/react';
import { ShoppingCart } from 'lucide-react';
import { useMemo, useState, useRef, useEffect } from 'react';
import { CartGroup } from '@/components/khaslana/cart/cart-group';
import { CartSummary } from '@/components/khaslana/cart/cart-summary';
import type { Cart, CartItem, SelectedCartItemsMap } from '@/types/cart';


interface CartIndexProps {
    cart: Cart | null;
}

export const CartIndex: React.FC<CartIndexProps> = ({ cart }) => {

    const [selectedItemsMap, setSelectedItemsMap] = useState<SelectedCartItemsMap>({});
    const [editModeMap, setEditModeMap] = useState<Record<number, boolean>>({});
    const [isCheckoutLoading, setIsCheckoutLoading] = useState<boolean>(false);
    const containerRef = useRef<HTMLDivElement>(null);
    const [isAtBottom, setIsAtBottom] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            if (!containerRef.current) return;
            const rect = containerRef.current.getBoundingClientRect();
            if (rect.bottom <= window.innerHeight) {
                setIsAtBottom(true);
            } else {
                setIsAtBottom(false);
            }
        };

        window.addEventListener('scroll', handleScroll, { passive: true });
        handleScroll();
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    
    // Grouping Cart-Item
    const groupedMerchantItems = useMemo(() => {
        if (!cart || !cart.cart_items) return [];
    
        const groups: Record<number, {
            umkmId: number;
            merchantName: string;
            items: CartItem[];
        }> = {};
    
        cart.cart_items.forEach((item) => {
            const umkm = item.variant?.product?.umkm;

            const umkmId = umkm?.id ?? 0;
            const merchantName = umkm?.store_name ?? 'UMKM Tidak Diketahui';

            if (!groups[umkmId]) {
                groups[umkmId] = {
                    umkmId,
                    merchantName,
                    items: []
                };
            }

            groups[umkmId].items.push(item);
        });
    
        return Object.values(groups);
    }, [cart]);

    // Array Filter Selected Item
    const selectedItemsArray = useMemo(() => {
        if (!cart || !cart.cart_items) return [];
        return cart.cart_items.filter((item) => !!selectedItemsMap[item.id]);
    }, [cart, selectedItemsMap]);


    // Action Single Selection
    const handleSelectToggle = (id: number) => {
        setSelectedItemsMap((prev) => ({
            ...prev,
            [id]: !prev[id],
        }));
    };

    // Action Multi Selection
    const handleGroupSelectToggle = (itemIds: number[], shouldSelectAll: boolean) => {
        setSelectedItemsMap((prev) => {
            const updatedMap = { ...prev };
            itemIds.forEach((id) => {
                updatedMap[id] = shouldSelectAll;
            });
            return updatedMap;
        });
    };

    // Sinkronisasi Kuantitas
    const handleQuantityChange = (id: number, newQuantity: number) => {
        router.patch(
            `/cart/update/${id}`,
            { quantity: newQuantity },
            {
                preserveScroll: true,
                preserveState: true,
            }
        );
    };

    // Eksekusi Penghapusan Item
    const handleRemoveItem = (id: number) => {
        router.delete(`/cart/remove/${id}`, {
            preserveScroll: true,
            onSuccess: () => {
                setSelectedItemsMap((prev) => {
                    const updated = { ...prev };
                    delete updated[id];
                    return updated;
                });
            },
        });
    };

    // Send Data To Order
    const handleCheckoutExecute = () => {
        const cartItemIds = selectedItemsArray.map((item) => item.id);
    
        if (cartItemIds.length === 0) return;
    
        router.post(
            `/cart/checkout-order`,
            { cart_item_ids: cartItemIds },
            {
                onStart: () => setIsCheckoutLoading(true),
                onFinish: () => setIsCheckoutLoading(false),
                onError: (errors) => {
                    alert(errors.message || 'Gagal memproses checkout.');
                },
            }
        );
    };

    
    // Empty State Layout
    if (groupedMerchantItems.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center px-4 text-center">
                <div className="w-16 h-16 bg-[#1a1a1e] border border-[#202024] rounded-2xl flex items-center justify-center mb-4 text-[#7c7c8a]">
                    <ShoppingCart className="w-8 h-8" />
                </div>
                <h3 className="text-lg font-bold text-[#f2f2f3] tracking-wide">
                    Keranjang Belanja Kosong
                </h3>
                <p className="text-sm text-[#7c7c8a] max-w-sm mt-1">
                    Kamu belum memasukkan produk apa pun. Yuk, jelajahi UMKM terdekat dan temukan jajanan favoritmu!
                </p>
                <button
                    type="button"
                    onClick={() => router.get('/catalog')}
                    className="mt-6 bg-[#1a1a1e] hover:bg-[#29292e] text-[#99ff33] border border-[#2a2a30] px-6 py-2.5 rounded-full text-sm font-bold tracking-wide transition-all duration-200 active:scale-95 shadow-md"
                >
                    Mulai Belanja
                </button>
            </div>
        );
    }

    // Active State Layout
    return (
        <div ref={containerRef} className="min-h-screen relative pb-32 flex flex-col">
            
            {/* Header */}
            <div className="mb-8 flex items-center justify-between">
                <div className="space-y-1">
                    <h1 className="text-2xl font-bold text-white">
                        Keranjang Belanja
                    </h1>
                    <p className="text-sm text-[#7c7c8a]">
                        Selesaikan pesanan Anda untuk mendukung pertumbuhan ekonomi lokal.
                    </p>
                </div>
                
            </div>

            {/* LOOPING Group UMKM */}
            <div className="space-y-5 px-6 flex-1">
            {groupedMerchantItems.map((group) => (
                <CartGroup
                    key={group.umkmId}
                    umkmId={group.umkmId}
                    merchantName={group.merchantName}
                    items={group.items}
                    selectedItemsMap={selectedItemsMap}
                    isEditMode={editModeMap[group.umkmId] ?? false}
                    onToggleEdit={() => {
                        setEditModeMap(prev => ({
                            ...prev,
                            [group.umkmId]: !prev[group.umkmId],
                        }));
                    }}
                    onSelectToggle={handleSelectToggle}
                    onGroupSelectToggle={handleGroupSelectToggle}
                    onQuantityChange={handleQuantityChange}
                    onRemove={handleRemoveItem}
                />
            ))}
        </div>

            {/* Sticky Button Banner*/}
            <CartSummary
                selectedItems={selectedItemsArray}
                onCheckout={handleCheckoutExecute}
                isLoading={isCheckoutLoading}
                isAbsolute={isAtBottom}
            />

        </div>
    );
};