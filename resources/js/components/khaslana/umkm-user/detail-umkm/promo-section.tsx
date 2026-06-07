import DefaultLogo from '@/assets/icons/default-store-logo.png';
import type { Umkm } from "@/types/umkm";
import { Link } from '@inertiajs/react';
import { Ticket } from 'lucide-react'; // Import ikon Ticket

interface PromoSectionProps {
    umkmData: Umkm;
}

export default function PromoSection({ umkmData }: PromoSectionProps) {
    const logo = umkmData.user?.profile?.logo ?? null;
    const promo = umkmData.promos && umkmData.promos.length > 0 ? umkmData.promos[0] : null;

    // Jika tidak ada promo, kita kembalikan null agar section tidak muncul
    // Atau jika ingin tetap tampil namun dengan pesan, hapus comment return null di bawah:
    if (!promo) {
        return (
            <div className="flex w-full mt-12 px-8 py-5 bg-zinc-800/50 border border-zinc-700 rounded-3xl items-center gap-4">
                <div className="bg-zinc-700 p-3 rounded-full">
                    <Ticket className="size-6 text-zinc-400" />
                </div>
                <div className="flex flex-col">
                    <h3 className="font-bold text-white text-lg">Belum Ada Promo</h3>
                    <p className="text-zinc-400 text-sm">
                        Toko ini sedang tidak memiliki penawaran spesial untuk saat ini.
                    </p>
                </div>
            </div>
        ); 
    }

    return (
        <div className="flex w-full mt-12 px-8 py-5 bg-[#99FF33]/90 rounded-3xl">
            <div className='flex justify-between w-full items-center'>
                <div className='flex items-center gap-4'>
                    <img
                        src={logo ? `/storage/${logo}` : DefaultLogo}
                        alt="Store Logo"
                        className="w-18 h-18 rounded-full object-cover border-2 border-[#1E1B26] bg-[#1E1B26]"
                    />
                    <div className='flex flex-col gap-1 text-[#1E1B26] me-4'>
                        <h1 className='text-xl md:text-2xl font-bold line-clamp-1'>
                            {promo.name}
                        </h1>
                        <span className='text-sm md:text-base font-normal line-clamp-1'>
                            {promo.description}
                        </span>
                    </div>
                </div>
                
                <div>
                    <Link href={`/umkm/${umkmData.id}/promo`} className="group relative inline-flex h-12 items-center justify-center overflow-hidden rounded-full bg-[#1E1B26] font-medium hover:cursor-pointer">
                        <div className="inline-flex h-12 translate-y-0 items-center justify-center px-6 text-white transition duration-500 group-hover:-translate-y-[150%]">
                            Cek Promo
                        </div>
                        <div className="absolute inline-flex h-12 w-full translate-y-[100%] items-center justify-center text-[#1E1B26] transition duration-500 group-hover:translate-y-0">
                            <span className="absolute h-full w-full translate-y-full skew-y-12 scale-y-0 bg-white transition duration-500 group-hover:translate-y-0 group-hover:scale-150"></span>
                            <span className="z-10">Cek Promo</span>
                        </div>
                    </Link>
                </div>
            </div>
        </div>
    )
}