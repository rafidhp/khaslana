import { router } from '@inertiajs/react';
import addToCartIcon from "@/assets/images/catalog/addtocart.svg";
import locationIcon from "@/assets/images/catalog/location.svg";
import starIcon from "@/assets/images/catalog/star.svg";

interface ProductCardProps {
    id: number;
    name: string;
    price: string;
    image: string;
    location?: string;
    rating?: string;
    sold?: string;
    discount?: string;
}

export function ProductCard({ 
    id,
    name, 
    price, 
    image, 
    location = "Kab. Bandung", 
    rating = "4.5", 
    sold = "0",
    discount,
}: ProductCardProps) {
    
    // 1. Fungsi klik untuk pindah ke detail katalog (seluruh card)
    const handleCardClicked = () => {
        router.visit(`/catalog/${id}`);
    }

    // 2. Fungsi klik pada bagian keranjang pada card
    const handleAddToCart = (e: React.MouseEvent<HTMLButtonElement>) => {
        e.stopPropagation(); // Jurus rahasia biar event kliknya gak bocor ke Card
        console.log('Tambah ke keranjang ID:', id);
    }

    return (
        <div 
            onClick={handleCardClicked}
            className="
                group z-0
                flex flex-col
                overflow-hidden
                rounded-[32px]
                bg-[#242424]
                transition-all duration-300
                border-2 border-[#99FF33]/10
                hover:-translate-y-1
                hover:shadow-[0_10px_40px_rgba(153,255,51,0.08)]
                hover:cursor-pointer
            "
        >
            {/* Bagian Gambar */}
            <div className="relative h-[220px] overflow-hidden">
                <img 
                    src={image} 
                    alt={name} 
                    className="
                        w-full h-full object-cover
                        transition-transform duration-500
                        group-hover:scale-105
                    "
                />
                
                {/* Overlay Hitam Transparan */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent pointer-events-none" />

                {/* Diskon Badge */}
                {discount && (
                    <div className="absolute top-4 left-4">
                        <span className="
                            rounded-full
                            bg-black/70
                            px-4 py-1.5
                            text-[10px] lg:text-[11px]
                            font-bold
                            uppercase
                            tracking-wider
                            text-[#99FF33]
                            backdrop-blur-md
                        ">
                            {discount}
                        </span>
                    </div>
                )}

                {/* Button Cart */}
                <button 
                    onClick={handleAddToCart}
                    className="
                        absolute top-4 right-4 z-10
                        flex items-center justify-center
                        w-8 h-8 lg:w-10 lg:h-10
                        rounded-[8px]
                        bg-white/20
                        backdrop-blur-md
                        transition
                        hover:bg-white/30
                        hover:cursor-pointer
                    "
                >
                    <img src={addToCartIcon} alt="add to cart" className="w-4 h-4 lg:w-5 lg:h-5 object-contain" />
                </button>
            </div>

            {/* Bagian Informasi Produk */}
            <div className="flex flex-col flex-1 p-5">
                
                
                <h4 className="text-white text-[16px] lg:text-[18px] font-bold leading-tight line-clamp-1 mb-2">
                    {name}
                </h4>

               
                <div className="flex items-center justify-between mt-1">
                    <span className="text-[#99FF33] text-[15px] lg:text-[18px] font-bold">
                        {price}
                    </span>
                    <div className="flex items-center gap-1.5 text-white text-[13px] font-medium">
                        <img src={starIcon} alt="star" className="w-3.5 h-3.5 object-contain" />
                        {rating}
                    </div>
                </div>

                <div className="flex items-center justify-between mt-5">
                    <span className="flex items-center gap-1.5 text-[#B7B7B7] text-[12px]">
                        <img src={locationIcon} alt="location" className="w-3.5 h-3.5 opacity-60 object-contain pb-0.5" />
                        {location}
                    </span>
                    <span className="text-[#B7B7B7] text-[12px] font-medium">
                        {sold} Terjual
                    </span>
                </div>
            </div>
        </div>
    );
}