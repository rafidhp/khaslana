import { router } from '@inertiajs/react';
import { PackageOpen } from 'lucide-react';
import addToCartIcon from "@/assets/images/catalog/addtocart.svg";
import locationIcon from "@/assets/images/catalog/location.svg";
import starIcon from "@/assets/images/catalog/star.svg";
import { show } from '@/routes/catalog';
import type { Product } from '@/types/product';

interface ProductCardProps {
    products: Product[];
}

export function ProductCard({ 
    products,
}: ProductCardProps) {
    const handleCardClicked = (id: number) => {
        router.visit(show(id).url);
    }

    const handleAddToCart = (e: React.MouseEvent<HTMLButtonElement>, id: number) => {
        e.stopPropagation();
        console.log('Tambah ke keranjang ID:', id);
    }

    if (products.length === 0) {
        return (
            <section className="flex w-full pt-5">
                <div className="flex flex-col items-center justify-center w-full py-12">
                    <PackageOpen className='h-32 w-32 text-center text-[#99FF33] mb-4' />
                    <p className="text-center text-white/80 text-sm md:text-base">
                        Belum ada produk yang tersedia.
                    </p>
                </div>
            </section>
        );
    }

    return (
        <section className="flex flex-col gap-6 pt-5 pb-16">
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 lg:gap-6 mt-4">
                {products.map((product) => (
                    <div
                        key={product.id}
                        onClick={() => handleCardClicked(product.id)}
                        className="
                            group z-0
                            flex flex-col
                            overflow-hidden
                            rounded-3xl
                            bg-[#242424]
                            transition-all duration-300
                            border-2 border-[#99FF33]/10
                            hover:-translate-y-1
                            hover:shadow-[0_10px_40px_rgba(153,255,51,0.08)]
                            hover:cursor-pointer
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

                            <div className="absolute inset-0 bg-linear-to-t from-black/50 to-transparent pointer-events-none" />

                            {product.promo?.discount_percent && (
                                <div className="absolute top-4 left-4">
                                    <span
                                        className="
                                            rounded-full
                                            bg-black/70
                                            px-4 py-1.5
                                            text-[10px] lg:text-[11px]
                                            font-bold
                                            uppercase
                                            tracking-wider
                                            text-[#99FF33]
                                            backdrop-blur-md
                                        "
                                    >
                                        {product.promo.discount_percent}% OFF
                                    </span>
                                </div>
                            )}

                            <button
                                onClick={(e) =>
                                    handleAddToCart(e, product.id)
                                }
                                className="
                                    absolute top-4 right-4 z-10
                                    flex items-center justify-center
                                    w-8 h-8 lg:w-10 lg:h-10
                                    rounded-[8px]
                                    bg-gray-800/40
                                    backdrop-blur-xl
                                    transition
                                    hover:bg-gray-800/50
                                    hover:cursor-pointer
                                "
                            >
                                <img
                                    src={addToCartIcon}
                                    alt="add to cart"
                                    className="w-4 h-4 lg:w-5 lg:h-5 object-contain"
                                />
                            </button>
                        </div>

                        <div className="flex flex-col flex-1 p-5">
                            <h4 className="text-white text-[16px] lg:text-[18px] font-bold leading-tight line-clamp-1 mb-2">
                                {product.name}
                            </h4>

                            <div className="flex items-center justify-between mt-1">
                                <span className="text-[#99FF33] text-[15px] lg:text-[18px] font-bold">
                                    Rp {Number(product.product_variants?.[0]?.price ?? 0).toLocaleString('id-ID')}
                                </span>

                                <div className="flex items-center gap-1.5 text-white text-[13px] font-medium">
                                    <img
                                        src={starIcon}
                                        alt="star"
                                        className="w-3.5 h-3.5 object-contain"
                                    />
                                    {product.umkm?.average_rating ?? 0}
                                </div>
                            </div>

                            <div className="flex items-center justify-between mt-5">
                                <span className="flex items-center gap-1.5 text-[#B7B7B7] text-[12px]">
                                    <img
                                        src={locationIcon}
                                        alt="location"
                                        className="w-3.5 h-3.5 opacity-60 object-contain pb-0.5"
                                    />
                                    {product.umkm?.city?.name}
                                </span>

                                <span className="text-[#B7B7B7] text-[12px] font-medium">
                                    {product.category?.name}
                                </span>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </section>
    );
}