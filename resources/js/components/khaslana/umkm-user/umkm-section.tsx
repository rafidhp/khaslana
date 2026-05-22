import { router } from '@inertiajs/react';
import {
    ArrowRight,
    Heart,
    MapPin,
    Star,
} from 'lucide-react';
import DefaultStore from '@/assets/images/umkm-user/default-store.png';
import { detail } from '@/routes/umkm';

type Umkm = {
    id: number;
    name: string;
    category: string;
    location: string;
    distance: string;
    rating: number;
    description: string;
    image: string;
    slug?: string;
    isFavorite?: boolean;
};

export default function UmkmSection() {
    const umkms: Umkm[] = [
        {
            id: 1,
            name: 'Batik Harmoni',
            category: 'Fashion',
            location: 'Yogyakarta',
            distance: '1.2km',
            rating: 4.9,
            description:
                'Koleksi batik tulis eksklusif dengan pewarna alami, menjaga tradisi budaya Indonesia. lorem ipsum dolor sit amet lorem ipsum dolor sit amet lorem ipsum dolor sit amet',
            image: DefaultStore,
        },
        {
            id: 2,
            name: 'Warung Ibu Sri',
            category: 'Kuliner',
            location: 'Solo',
            distance: '0.8km',
            rating: 4.8,
            description:
                'Cita rasa masakan Jawa autentik dengan resep turun temurun sejak puluhan tahun.',
            image: DefaultStore,
        },
        {
            id: 3,
            name: 'Kopi Nusantara',
            category: 'Kuliner',
            location: 'Bandung',
            distance: '2.5km',
            rating: 4.7,
            description:
                'Menyajikan biji kopi pilihan dari petani lokal seluruh Indonesia.',
            image: DefaultStore,
        },
        {
            id: 4,
            name: 'Tanah Liat Studio',
            category: 'Kerajinan',
            location: 'Ubud',
            distance: '4.1km',
            rating: 4.9,
            description:
                'Kerajinan tangan keramik kontemporer yang menggabungkan estetika modern.',
            image: DefaultStore,
        },
        {
            id: 5,
            name: 'Tembok Ratapan Solo',
            category: 'Artefak',
            location: 'Solo',
            distance: '4.1km',
            rating: 4.9,
            description:
                'Kerajinan tangan keramik kontemporer yang menggabungkan estetika modern.',
            image: DefaultStore,
        },
    ];

    const handleCardClicked = (umkm: Umkm) => {
        router.visit(detail(umkm.id));
    }

    const handleFavorite = (e: React.MouseEvent<HTMLButtonElement>, umkm: Umkm) => {
        e.stopPropagation();
        console.log('Favorite', umkm.id);
    }

    return (
        <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 lg:gap:8 mb-12 w-full">
            {umkms.map((umkm) => (
                <div
                    key={umkm.id}
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
                    "
                    onClick={() => handleCardClicked(umkm)}
                >
                    {/* image */}
                    <div className="relative h-[220px] overflow-hidden">
                        <img
                            src={umkm.image}
                            alt={umkm.name}
                            className="
                                w-full h-full object-contain
                                transition-transform duration-500
                                group-hover:scale-108
                            "
                        />
                        
                        {/* overlay */}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />

                        {/* category */}
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
                                {umkm.category}
                            </span>
                        </div>

                        {/* favorite */}
                        <button
                            className="
                                absolute top-4 right-4 z-10
                                flex items-center justify-center
                                w-8 h-8 lg:w-10 lg:h-10
                                rounded-full
                                bg-black/50
                                backdrop-blur-md
                                text-white
                                transition
                                hover:bg-white/20
                                hover:cursor-pointer
                            "
                            onClick={(e) => handleFavorite(e, umkm)}
                        >
                            <Heart className="w-4 h-4 lg:w-5 lg:h-5" />
                        </button>
                    </div>

                    {/* content */}
                    <div className="flex flex-col flex-1 p-5">
                        <div className="flex items-center justify-between gap-3">
                            <h3 className="text-white text-[18px] lg:text-[28px] font-bold leading-tight line-clamp-1">
                                {umkm.name}
                            </h3>

                            <div
                                className="
                                    flex items-center gap-1
                                    rounded-full
                                    bg-[#2F3E1F]
                                    px-3 py-1
                                    text-[#99FF33]
                                    text-xs lg:text-sm
                                    font-semibold
                                "
                            >
                                <Star className="w-3 h-3 lg:w-4 lg:w-4 fill-[#99FF33]" />
                                {umkm.rating}
                            </div>
                        </div>
                        <div className="flex items-center gap-1 mt-2 text-[#B7B7B7] text-xs md:text-sm">
                            <MapPin className="w-5 h-5 pb-1" />
                            <span>
                                {umkm.location} • {umkm.distance}
                            </span>
                        </div>
                        <p
                            className="
                                mt-4
                                mb-auto
                                text-[#B7B7B7]
                                text-xs lg:text-sm
                                leading-relaxed
                                line-clamp-3
                            "
                        >
                            {umkm.description}
                        </p>
                        <button
                            className="
                                group/button
                                mt-6
                                w-full
                                rounded-full
                                bg-[#99FF33]
                                py-3
                                font-bold
                                text-black
                                transition-all duration-300
                                hover:opacity-90
                                hover:cursor-pointer
                            "
                        >
                            <span className="flex items-center justify-center gap-2 text-sm lg:text-base">
                                Kunjungi Toko
                                <ArrowRight
                                    className="
                                        w-5 h-5
                                        transition-transform duration-300
                                        group-hover/button:translate-x-1
                                    "
                                />
                            </span>
                        </button>
                    </div>
                </div>
            ))}
        </div>
    );
}