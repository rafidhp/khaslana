import { Link } from '@inertiajs/react';
import locationIcon from "@/assets/images/katalog/location.svg";
import addToCartIcon from "@/assets/images/katalog/addtocart.svg";
import starIcon from "@/assets/images/katalog/star.svg";

interface ProductCardProps {
    name: string;
    price: string;
    image: string;
    location?: string;
    rating?: string;
    sold?: string;
    discount?: string;
    slug?: string;
}

export function ProductCard({ 
    name, 
    price, 
    image, 
    location = "Kab. Bandung", 
    rating = "4.5", 
    sold = "0",
    discount,
    slug = '#' 
}: ProductCardProps) {
    const productUrl = slug !== '#' ? `/product/${slug}` : '#';

    return (
        <div className="flex flex-col bg-[#252231] rounded-[14px] border border-white/5 overflow-hidden h-[360px]">
            {/* Bagian Gambar & Overlay Cart */}
            <div className="relative w-full min-h-[220px] flex-grow overflow-hidden">
                <Link href={productUrl} className="block w-full h-full">
                    <img 
                        src={image} 
                        alt={name} 
                        className="w-full h-full object-cover block"
                    />
                </Link>
                
                {/* Button Cart Melayang di atas gambar */}
                <button className="absolute top-3 right-3 bg-[#1E1B26]/70 border border-white/15 backdrop-blur-md rounded-[10px] w-[42px] h-[42px] flex items-center justify-center cursor-pointer z-[2] transition-all hover:bg-[#1E1B26]/90">
                    <img src={addToCartIcon} alt="add to cart" className="w-5 h-5 object-contain" />
                </button>
            </div>

            {/* Bagian Informasi Produk */}
            <div className="p-3.5 pb-3.5 flex flex-col gap-1.5">
                
                {/* Baris 1: Nama & Diskon Badge */}
                <div className="flex items-center justify-between gap-2">
                    <h4 className="text-white text-sm font-semibold truncate">
                        {name}
                    </h4>
                    {discount && (
                        <span className="bg-[#99FF33]/20 text-[#99FF33] text-[10px] font-bold px-2 py-0.5 rounded-full whitespace-nowrap shrink-0">
                            {discount}
                        </span>
                    )}
                </div>

                {/* Baris 2: Harga & Rating */}
                <div className="flex items-center justify-between">
                    <span className="text-[#99FF33] text-[13px] font-semibold">
                        {price}
                    </span>
                    <div className="flex items-center gap-1 text-white text-xs font-medium">
                        <img src={starIcon} alt="star" className="w-3 h-3 object-contain" />
                        {rating}
                    </div>
                </div>

                {/* Baris 3: Lokasi & Terjual */}
                <div className="flex items-center justify-between mt-0.5">
                    <span className="flex items-center gap-1 text-[#6a6a7e] text-[11px]">
                        <img src={locationIcon} alt="location" className="w-3 h-3 opacity-60 object-contain" />
                        {location}
                    </span>
                    <span className="text-[#6a6a7e] text-[11px]">
                        {sold} Terjual
                    </span>
                </div>
            </div>
        </div>
    );
}