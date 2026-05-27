import { usePage } from '@inertiajs/react';

import {
    MessageCircle,
    MapPin,
    Star,
} from "lucide-react";
import DefaultStore from "@/assets/images/umkm-user/default-store.png";
import type { Umkm } from "@/types/umkm";

interface HeroSectionProps {
    umkmData: Umkm[];
}

export default function HeroSection({
    umkmData,
}: HeroSectionProps) {
    let status = umkmData.status === 'BUKA';

    return (
        <section className="flex flex-col lg:flex-row items-center lg:items-end justify-center lg:justify-between gap-10 lg:gap-16 w-full">
            <div className="flex flex-col flex-1 w-full">
                <div className="flex items-center gap-3">
                    <span className="rounded-full bg-[#2F3E1F] px-4 py-1.5 text-[10px] md:text-[11px] font-medium uppercase tracking-wider text-[#99FF33]">
                        {umkmData.type}
                    </span>
                </div>
                <h1 className="mt-6 text-white text-5xl md:text-7xl tracking-wider font-bold leading-[1.05]">
                    {umkmData.store_name}
                </h1>
                <div className="flex flex-wrap items-center gap-x-5 gap-y-3 mt-4 text-[#D1D1D1]">
                    <div className="flex items-center gap-1">
                        <Star className="pb-1 w-6 md:w-7 h-6 md:h-7 fill-[#99FF33] text-[#99FF33]" />
                        <span className="text-xl md:text-2xl font-semibold text-white me-1">
                            {umkmData.average_rating}
                        </span>
                        <span className="text-sm md:text-base text-[#989898]">
                            (240+ Ulasan)
                        </span>
                    </div>
                    <div className="w-px h-6 md:h-7 bg-white/20" />
                    <div className="flex items-center gap-2">
                        <MapPin className="pb-1 w-5 md:w-6 h-5 md:h-6" />
                        <span className="text-sm md:text-base text-[#B7B7B7]">
                            {umkmData.address}
                        </span>
                    </div>
                </div>
                <div className="mt-3">
                    <span className="text-sm md:text-base text-[#cdcccc]">
                        {umkmData.open_days === 'Setiap Hari'
                            ? `Buka ${umkmData.open_days}`
                            : `Buka Hari ${umkmData.open_days}`
                        }
                    </span>
                </div>
                <div className="mt-8">
                    <button className="btn-primary-khaslana text-sm md:text-base hover:cursor-pointer gap-2">
                        <MessageCircle className="pb-0.5 w-5 md:w-6 h-5 md:h-6" />
                        Hubungi Sekarang
                    </button>
                </div>
            </div>

            <div className="relative w-full max-w-[500px]">
                <div className="overflow-hidden rounded-[32px] border border-white/10">
                    <img
                        src={
                            umkmData.umkm_images?.[0]?.image
                                ? `/storage/${umkmData.umkm_images?.[0]?.image}`
                                : DefaultStore
                        }
                        alt="Cafe"
                        className="max-h-[400px] w-full object-cover"
                    />
                    <div
                        className="
                            absolute inset-0
                            bg-gradient-to-t
                            from-black/80
                            via-black/20
                            to-transparent
                            rounded-[32px]
                        "
                    />
                </div>
                <div className="absolute bottom-5 left-5 flex flex-col gap-2">
                    <div
                        className="
                            flex items-center gap-2
                            w-fit items-center
                            rounded-full
                            bg-[#2F3E1F]/90
                            px-3 py-1.5
                            backdrop-blur-md
                        "
                    >
                        <span
                            className={`text-[10px] lg:text-[10.5px] font-bold uppercase tracking-wider ${status
                                    ? 'text-[#99FF33]'
                                    : 'text-gray-400'
                                }`}
                        >
                            {status
                                ? 'Sedang Buka'
                                : 'Sedang Tutup'}
                        </span>
                        <span className="relative flex mb-0.5 h-2.5 w-2.5">
                            <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${
                                status ? 'bg-green-400' : ''
                            }`}></span>
                            <span className={`relative inline-flex rounded-full h-2.5 w-2.5 ${
                                status ? 'bg-green-500' : 'bg-gray-400'
                            }`}></span>
                        </span>
                    </div>
                    <span className="text-white text-2xl font-medium">
                        {umkmData.open_time === '24 Jam'
                            ? `Buka ${umkmData.open_time}`
                            : `${umkmData.open_time} — ${umkmData.close_time} WIB`
                        }
                    </span>
                </div>
            </div>
        </section>
    );
}