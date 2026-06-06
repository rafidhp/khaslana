import { router } from '@inertiajs/react';
import { ShoppingCart, Edit3, Check, ShoppingBag } from 'lucide-react';
import React, { useMemo, useState } from 'react';
import { CartGroup } from '@/components/khaslana/cart/cart-group';
import { CartSummary } from '@/components/khaslana/cart/cart-summary';
import type { Cart, CartItem, SelectedCartItemsMap } from '@/types/cart';

interface CartIndexProps {
    cart: Cart | null;
}

export const CartIndex: React.FC<CartIndexProps> = ({ cart }) => {
    // ----------------------------------------------------
    // 🎛️ STATE MANAGEMENT
    // ----------------------------------------------------
    const [selectedItemsMap, setSelectedItemsMap] = useState<SelectedCartItemsMap>({});
    const [isEditMode, setIsEditMode] = useState<boolean>(false);
    const [isCheckoutLoading, setIsCheckoutLoading] = useState<boolean>(false);

    // ----------------------------------------------------
    // 📊 REACTIVE CALCULATION (COMPUTED VALUES)
    // ----------------------------------------------------
    
    // 1. Mengelompokkan item keranjang berdasarkan Toko/UMKM menggunakan useMemo (Bottom-Up Integration)
    const groupedMerchantItems = useMemo(() => {
        if (!cart || !cart.cart_items || cart.cart_items.length === 0) return [];

        const groups: Record<number, { umkmId: number; merchantName: string; items: CartItem[] }> = {};

        cart.cart_items.forEach((item) => {
            const umkm = item.variant?.product?.umkm;
            if (!umkm) return; // Skip jika data relasi tidak lengkap

            if (!groups[umkm.id]) {
                groups[umkm.id] = {
                    umkmId: umkm.id,
                    merchantName: umkm.name,
                    items: [],
                };
            }
            groups[umkm.id].items.push(item);
        });

        return Object.values(groups);
    }, [cart]);

    // 2. Memfilter array item apa saja yang saat ini sedang dicentang oleh user
    const selectedItemsArray = useMemo(() => {
        if (!cart || !cart.cart_items) return [];
        return cart.cart_items.filter((item) => !!selectedItemsMap[item.id]);
    }, [cart, selectedItemsMap]);

    // ----------------------------------------------------
    // 🛠️ INTERACTION HANDLERS (BACKEND BRIDGE)
    // ----------------------------------------------------

    // Aksi pencentangan baris item tunggal
    const handleSelectToggle = (id: number) => {
        setSelectedItemsMap((prev) => ({
            ...prev,
            [id]: !prev[id],
        }));
    };

    // Aksi pencentangan massal satu grup Toko/UMKM
    const handleGroupSelectToggle = (itemIds: number[], shouldSelectAll: boolean) => {
        setSelectedItemsMap((prev) => {
            const updatedMap = { ...prev };
            itemIds.forEach((id) => {
                updatedMap[id] = shouldSelectAll;
            });
            return updatedMap;
        });
    };

    // Sinkronisasi Kuantitas via HTTP PATCH (Inertia Visit)
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

    // Eksekusi Penghapusan Item via HTTP DELETE (Inertia Visit)
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

    // Gerbang Transisi Akhir: Penyerahan data item terpilih ke sistem Order Rafi
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

    // ----------------------------------------------------
    // 👁️ VISUAL RENDERING CONDITIONAL STATE
    // ----------------------------------------------------
    
    // State: Keranjang Kosong (Empty State Layout)
    if (groupedMerchantItems.length === 0) {
        return (
            <div className="min-h-[80vh] flex flex-col items-center justify-center px-4 text-center">
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

    // State: Keranjang Memiliki Item Terisi (Active State Layout)
    return (
        <div className="w-full max-w-3xl mx-auto px-4 pt-6 pb-32 space-y-6">
            
            {/* 📋 KEPALA HALAMAN CART (HEADER CONTROLLER) */}
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                    <ShoppingBag className="w-5 h-5 text-[#99ff33]" />
                    <h2 className="text-xl font-black text-white tracking-wide uppercase">
                        Keranjang Saya
                    </h2>
                </div>
                
                {/* Tombol Toggle Mode Edit Mode (Figma Reference Action) */}
                <button
                    type="button"
                    onClick={() => setIsEditMode(!isEditMode)}
                    className={`flex items-center gap-1.5 text-xs font-bold tracking-wide uppercase px-4 py-2 rounded-lg border transition-all duration-200 ${
                        isEditMode
                            ? 'bg-[#261919] text-[#ff4444] border-[#4d1f1f] hover:bg-[#361f1f]'
                            : 'bg-[#1a1a1e] text-[#7c7c8a] border-[#2a2a30] hover:text-white hover:border-[#40404a]'
                    }`}
                >
                    {isEditMode ? (
                        <>
                            <Check className="w-3.5 h-3.5" />
                            <span>Selesai</span>
                        </>
                    ) : (
                        <>
                            <Edit3 className="w-3.5 h-3.5" />
                            <span>Edit Mode</span>
                        </>
                    )}
                </button>
            </div>

            {/* 📦 LOOPING KELOMPOK TOKO UMKM */}
            <div className="space-y-5">
                {groupedMerchantItems.map((group) => (
                    <CartGroup
                        key={group.umkmId}
                        umkmId={group.umkmId}
                        merchantName={group.merchantName}
                        items={group.items}
                        selectedItemsMap={selectedItemsMap}
                        isEditMode={isEditMode}
                        onSelectToggle={handleSelectToggle}
                        onGroupSelectToggle={handleGroupSelectToggle}
                        onQuantityChange={handleQuantityChange}
                        onRemove={handleRemoveItem}
                    />
                ))}
            </div>

            {/* 💰 STICKY BOTTOM BANNER SUMMARY (Figma Full-Width Horizontal Style) */}
            <CartSummary
                selectedItems={selectedItemsArray}
                onCheckout={handleCheckoutExecute}
                isLoading={isCheckoutLoading}
            />

        </div>
    );
};