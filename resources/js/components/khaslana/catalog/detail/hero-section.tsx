import { ShieldCheck, Truck } from "lucide-react";
import { useState } from "react";
import { useAuth } from "@/hooks/use-auth";

import AddToCartIcon from "@/assets/images/catalog/addtocart.svg";
import DefaultProduct from "@/assets/images/product/default-product.png";
import VariantDialog from "@/components/khaslana/catalog/detail/variant-dialog";
import LoginRequiredDialog from '@/components/khaslana/login-required-dialog';
import type { Product } from "@/types/product";

interface HeroSectionProps {
    product: Product;
}

export default function HeroSection({
    product,
}: HeroSectionProps) {
    const variant = product.product_variants?.[0];
    const price = variant?.price ?? 0;
    const stock = variant?.stock ?? 0;
    const image = product.product_images?.[0]?.image;
    const rating = product.umkm?.average_rating ?? 0;
    const formatPrice = (value: number) => new Intl.NumberFormat("id-ID").format(value);
    const [openVariant, setOpenVariant] = useState(false);
    const [actionType, setActionType] = useState<
        "buy-now" | "add-cart"
    >("buy-now");
    const isShippingFeature = product.umkm?.is_shipping_feature === true;
    const isOrderFeature = product.umkm?.is_order_feature === true;
    const canOrder = isOrderFeature || isShippingFeature;
    const [showLoginDialog, setShowLoginDialog] = useState(false);
    const { user } = useAuth();

    const handleBuyNowClicked = () => {
        if (!user) {
            setShowLoginDialog(true);
            return;
        } else {
            setActionType("buy-now");
            setOpenVariant(true);
        }
    };

    const handleAddCartClicked = () => {
        if (!user) {
            setShowLoginDialog(true);
            return;
        } else {
            setActionType("add-cart");
            setOpenVariant(true);
        }
    };

    return (
        <section className="w-full">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                {/* left section */}
                <div className="relative">
                    {product.promo && (
                        <div
                            className="
                                absolute z-10
                                top-4 left-4
                                bg-[#99FF33]
                                text-black text-xs font-semibold
                                px-3 py-1
                                rounded-full
                            "
                        >
                            {product.promo.type}
                        </div>
                    )}
                    <div
                        className="
                            aspect-square
                            overflow-hidden
                            rounded-3xl
                            bg-white
                        "
                    >
                        <img
                            src={
                                image ? `/storage/${image}` : DefaultProduct
                            }
                            alt={product.name}
                            className="w-full h-full object-contain"
                        />
                    </div>
                </div>

                {/* right section */}
                <div className="flex flex-col justify-between">
                    <div className="mt-4">
                        <p
                            className="
                                text-[#99FF33]
                                uppercase
                                tracking-wider
                                text-xs font-normal
                                mb-0 md:mb-3
                            "
                        >
                            {product.category?.name}
                        </p>
                        <h1 className="text-white text-5xl md:text-6xl font-bold leading-tight">
                            {product.name}
                        </h1>
                        <div className="flex items-center gap-3 mt-1 md:mt-3">
                            <div className="flex text-[#99FF33]">
                                {"★★★★★"}
                            </div>
                            <span className="text-gray-300 text-sm">
                                {rating.toFixed(1)} Rating
                            </span>
                            <span className="text-gray-600">|</span>
                            <span className="text-gray-300 text-sm">
                                {product.umkm?.store_name}
                            </span>
                        </div>
                        <div className="flex items-center gap-4 mt-6">
                            <h2 className="text-[#99FF33] text-4xl md:text-5x font-bold">
                                Rp {formatPrice(price)}
                            </h2>
                            {product.promo?.discount_percent && (
                                <span className="text-gray-500 line-through text-lg">
                                    Rp{" "}
                                    {formatPrice(
                                        Math.round(price / (1 - product.promo.discount_percent / 100))
                                    )}
                                </span>
                            )}
                        </div>
                        <div className="grid grid-cols-2 gap-4 mt-8">
                            <div className="bg-[#22202C] rounded-2xl p-4 flex items-center gap-3">
                                <div
                                    className="
                                        h-10 w-10
                                        rounded-xl
                                        bg-[#99FF33]/10
                                        flex
                                        items-center
                                        justify-center
                                    "
                                >
                                    <ShieldCheck
                                        className="text-[#99FF33]"
                                        size={20}
                                    />
                                </div>
                                <div className="flex flex-col items-starts gap-0.5">
                                    <p className="text-white text-sm md:text-base font-medium">
                                        Produk UMKM
                                    </p>
                                    <p className="text-gray-400 text-xs">
                                        Kualitas Terjamin
                                    </p>
                                </div>
                            </div>
                            {isShippingFeature && (
                                <div className="bg-[#22202C] rounded-2xl p-4 flex items-center gap-3">
                                    <div
                                        className="
                                            h-10 w-10
                                            rounded-xl
                                            bg-[#99FF33]/10
                                            flex items-center justify-center
                                        "
                                    >
                                        <Truck
                                            className="text-[#99FF33]"
                                            size={20}
                                        />
                                    </div>
                                    <div className="flex flex-col items-start gap-0.5">
                                        <p className="text-white text-sm md:text-base font-medium">
                                            Pengiriman Cepat
                                        </p>
                                        <p className="text-gray-400 text-xs">
                                            Siap Diproses
                                        </p>
                                    </div>
                                </div>
                            )}
                        </div>
                        <p className="mt-4 text-gray-400 text-base leading-8 line-clamp-6">
                            {product.description}
                        </p>
                    </div>
                    <div>
                        <div className="flex items-center gap-5 mt-10">
                            <span className="text-gray-400">
                                Stok Tersedia:
                                <span className="text-white font-semibold ml-1">
                                    {stock} pcs
                                </span>
                            </span>
                        </div>
                        {canOrder && (
                            <div className="flex gap-4 mt-8">
                                <button
                                    onClick={handleBuyNowClicked}
                                    className="btn-primary-khaslana w-full cursor-pointer"
                                >
                                    Beli Sekarang
                                </button>
                                <button
                                    onClick={handleAddCartClicked}
                                    className="
                                        h-14 w-14 aspect-square
                                        rounded-full
                                        border
                                        border-gray-700
                                        flex
                                        items-center
                                        justify-center
                                        text-white
                                        hover:cursor-pointer hover:bg-white/10
                                    "
                                >
                                    <img
                                        src={AddToCartIcon}
                                        alt="add to cart"
                                        className="pb-1 h-6 w-6"
                                    />
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* dialogs */}
            {openVariant && (
                <VariantDialog
                    key={`${product.id}-${actionType}`}
                    product={product}
                    open={openVariant}
                    onClose={() => setOpenVariant(false)}
                    actionType={actionType}
                />
            )}
            
            <LoginRequiredDialog
                open={showLoginDialog}
                onClose={() => setShowLoginDialog(false)}
            />
        </section>
    )
}