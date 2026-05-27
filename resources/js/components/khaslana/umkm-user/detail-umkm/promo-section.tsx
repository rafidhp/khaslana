import DefaultLogo from '@/assets/icons/default-store-logo.png';
import type { Umkm } from "@/pages/user/umkm";

interface PromoSectionProps {
    umkmData: Umkm[];
}

export default function PromoSection({
    umkmData,
}: PromoSectionProps) {
    const logo = umkmData.user?.profile?.logo ?? null;

    return (
        <div className="flex w-full mt-12 px-8 py-5 bg-[#99FF33]/90 p-4 rounded-3xl">
            <div className='flex justify-between w-full items-center'>
                <div className='flex items-center gap-4'>
                    <img
                        src={logo ? `/storage/${logo}` : DefaultLogo}
                        alt="Store Logo"
                        className="
                            w-18 h-18
                            rounded-full
                            object-cover
                            border-2 border-[#99FF33]
                            bg-[#1E1B26]
                        "
                    />
                    <div className='flex flex-col gap-1 text-[#1E1B26]'>
                        <h1 className='text-2xl font-bold'>Mitra Lokal: Roti Bangkir Bakery</h1>
                        <span className='text-sm md:text-base font-normal'>Nikmati bundling spesial Kopi + Roti mulai dari Rp 45.000</span>
                    </div>
                </div>
                <div>
                    <button className='btn-primary-khaslana bg-[#1E1B26] border-2 border-[#272431] text-[#99FF33] hover:cursor-pointer hover:tracking-wider'>
                        Cek Promo
                    </button>
                </div>
            </div>
        </div>
    )
}