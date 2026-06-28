import { router } from '@inertiajs/react';
import { PackageOpen } from 'lucide-react';
import { useState } from 'react';
import { useAuth } from '@/hooks/use-auth';

import addToCartIcon from "@/assets/images/catalog/addtocart.svg";
import locationIcon from "@/assets/images/catalog/location.svg";
import starIcon from "@/assets/images/catalog/star.svg";

import VariantDialog from '@/components/khaslana/catalog/detail/variant-dialog';
import LoginRequiredDialog from '@/components/khaslana/login-required-dialog';
import { show } from '@/routes/catalog';
import type { Product } from '@/types/product';


interface ProductCardProps {
    products: Product[];
}

export function ProductCard({
    products
}: ProductCardProps) {
    const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [showLoginDialog, setShowLoginDialog] = useState(false);
    const { user } = useAuth();

    const handleCardClicked = (id: number) => {
        router.visit(show(id).url);
    };

    const handleAddToCart = (e: React.MouseEvent<HTMLButtonElement>, product: Product) => {
        e.stopPropagation();

        if (!user) {
            setShowLoginDialog(true);
            return;
        } else {
            setSelectedProduct(product);
            setIsDialogOpen(true);
        }
    };

    if (products.length === 0) {
        return (
            <section className="flex w-full pt-5">
                <div className="flex flex-col items-center justify-center w-full py-12">
                    <PackageOpen className='h-32 w-32 text-[#99FF33] mb-4' />
                    <p className="text-white/80 text-sm md:text-base">
                        Belum ada produk yang tersedia.
                    </p>
                </div>
            </section>
        );
    }

    return (
        <>
            <section className="flex flex-col gap-6 pt-5 pb-16">
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 lg:gap-6 mt-4">

                    {products.map((product) => {
                        // promo count logic
                        const originalPrice = Number(product.product_variants?.[0]?.price ?? 0);
                        let finalPrice = originalPrice;

                        // cek status promo
                        const isPromoActive = product.promo && product.promo.status === 'BERLANGSUNG';

                        if (isPromoActive && product.promo?.type === 'DISKON' && product.promo?.discount_percent) {
                            // potng harga berdasarkan persen
                            finalPrice = originalPrice - (originalPrice * (Number(product.promo.discount_percent) / 100));
                        }

                        return (
                            <div
                                key={product.id}
                                onClick={() => handleCardClicked(product.id)}
                                className="
                                    group
                                    flex flex-col
                                    overflow-hidden
                                    rounded-3xl
                                    bg-[#242424]
                                    border-2 border-[#99FF33]/10
                                    transition-all duration-300
                                    hover:-translate-y-1
                                    hover:shadow-[0_10px_40px_rgba(153,255,51,0.08)]
                                    cursor-pointer
                                "
                            >
                                <div className="relative h-64 overflow-hidden">
                                    <img
                                        src={`/storage/${product.product_images?.[0]?.image}`}
                                        alt={product.name}
                                        className="
                                            w-full h-full object-cover bg-white
                                            transition-transform duration-500
                                            group-hover:scale-105
                                        "
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />

                                    {/* BADGE PROMO */}
                                    {isPromoActive && product.promo?.discount_percent && (
                                        <div className="absolute top-4 left-4">
                                            <span className="
                                                rounded-full
                                                bg-black/70
                                                px-4 py-1.5
                                                text-[11px]
                                                font-bold
                                                text-[#99FF33]
                                                backdrop-blur-md
                                            ">
                                                {product.promo.discount_percent}% OFF
                                            </span>
                                        </div>
                                    )}

                                    <button
                                        onClick={(e) => handleAddToCart(e, product)}
                                        className="
                                            absolute top-4 right-4 z-10
                                            flex items-center justify-center
                                            w-9 h-9
                                            rounded-lg
                                            bg-gray-800/40
                                            backdrop-blur-xl
                                            hover:bg-gray-800/60
                                            transition
                                        "
                                    >
                                        <img
                                            src={addToCartIcon}
                                            alt="add to cart"
                                            className="w-4 h-4"
                                        />
                                    </button>
                                </div>

                                <div className="flex flex-col flex-1 p-5">
                                    <h4 className="text-white text-lg font-bold line-clamp-1 mb-2">
                                        {product.name}
                                    </h4>

                                    {/* harga n rating */}
                                    <div className="flex items-center justify-between mt-1">
                                        <div className="flex flex-col">
                                            {/* menampilkan harga asli dicoret jika ada promo */}
                                            {isPromoActive && originalPrice > finalPrice && (
                                                <span className="text-xs text-red-400 line-through decoration-red-400 font-medium">
                                                    Rp {originalPrice.toLocaleString('id-ID')}
                                                </span>
                                            )}
                                            {/* menampilkan harga final */}
                                            <span className="text-[#99FF33] font-bold">
                                                Rp {finalPrice.toLocaleString('id-ID')}
                                            </span>
                                        </div>

                                        <div className="flex items-center gap-1 text-white text-sm">
                                            <img src={starIcon} className="w-3.5 h-3.5" />
                                            {product.umkm?.average_rating ?? 0}
                                        </div>
                                    </div>

                                    <div className="flex items-center justify-between mt-5 text-xs text-[#B7B7B7]">
                                        <span className="flex items-center gap-1">
                                            <img src={locationIcon} className="w-3.5 h-3.5 opacity-60" />
                                            {product.umkm?.city?.name}
                                        </span>

                                        <span>
                                            {product.category?.name}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        );
                    })}

                </div>
            </section>

            {selectedProduct && (
                <VariantDialog
                    product={selectedProduct}
                    open={isDialogOpen}
                    onClose={() => setIsDialogOpen(false)}
                    actionType="add-cart"
                />
            )}

            <LoginRequiredDialog
                open={showLoginDialog}
                onClose={() => setShowLoginDialog(false)}
            />
        </>
    );
}