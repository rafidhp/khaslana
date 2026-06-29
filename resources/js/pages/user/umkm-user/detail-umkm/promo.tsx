import { Head, Link } from '@inertiajs/react';
import { Calendar, Ticket, Info, Tag } from 'lucide-react';
import UnusedNavLayout from "@/layouts/unused-nav-layout";
import { catalog, home } from "@/routes";

interface PromoData {
    id: number;
    name: string;
    type: 'DISKON' | 'PROMO';
    description: string;
    image: string | null;
    start_date: string;
    end_date: string;
    status: 'SEGERA HADIR' | 'BERLANGSUNG' | 'BERAKHIR';
    discount_percent: number | null;
}

interface UmkmData {
    id: number;
    name: string;
    promos?: PromoData[];
}

interface PageProps {
    umkmData: UmkmData;
}

export default function PromoPage({ umkmData }: PageProps) {
    const promos = umkmData?.promos || [];

    // Tampilan jika UMKM belum membuat promo sama sekali
    if (promos.length === 0) {
        return (
            <UnusedNavLayout backHref={home().url}>
                <div className="flex flex-col items-center justify-center min-h-[80vh] text-white text-center px-4">
                    <div className="bg-[#191720] border border-zinc-800 p-10 rounded-3xl flex flex-col items-center max-w-md w-full shadow-2xl">
                        <Ticket className="size-20 text-zinc-700 mb-6" />
                        <h1 className="text-3xl font-bold mb-3">Belum Ada Promo</h1>
                        <p className="text-[#adaaaa] mb-8">Toko <span className="font-semibold text-white">{umkmData.name}</span> sedang tidak memiliki promo atau diskon aktif saat ini.</p>
                    </div>
                </div>
            </UnusedNavLayout>
        );
    }

    return (
        <UnusedNavLayout backHref={home().url}>
            <Head title={`Promo - ${umkmData.name}`} />

            <div className="">
                
                {/* Header Section */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-10 gap-6">
                    <div>
                        <h1 className="text-4xl font-extrabold tracking-tight">
                            Promo Spesial
                        </h1>
                        <p className="text-[#adaaaa] mt-2 text-lg">
                            Nikmati berbagai penawaran menarik dari <span className="text-white font-semibold">{umkmData.name}</span>
                        </p>
                    </div>

                    {/* <div className="bg-[#191720] border border-zinc-800 px-5 py-3 rounded-2xl flex items-center gap-3">
                        <Info className="text-[#99ff33] size-5" />
                        <span className="text-sm text-zinc-300">Promo diterapkan otomatis saat Checkout.</span>
                    </div> */}
                </div>

                {/* Grid Daftar Voucher Promo */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {promos.map((promo) => (
                        <div 
                            key={promo.id} 
                            className="bg-[#191720] border border-zinc-800 rounded-3xl overflow-hidden shadow-xl hover:border-[#99ff33]/40 transition-all duration-300 group flex flex-col"
                        >
                            {/* Bagian Atas / Header Voucher */}
                            <div className="bg-gradient-to-r from-[#222] to-zinc-900 p-6 border-b border-zinc-800 relative overflow-hidden">
                                {/* Hiasan Bulat (Efek sobekan voucher) */}
                                <div className="absolute -left-3 top-1/2 -translate-y-1/2 w-6 h-6 bg-[#0a0a0a] rounded-full border-r border-zinc-800"></div>
                                <div className="absolute -right-3 top-1/2 -translate-y-1/2 w-6 h-6 bg-[#0a0a0a] rounded-full border-l border-zinc-800"></div>

                                <div className="flex justify-between items-start">
                                    <div className="flex items-center gap-4">
                                        <div className="p-3 bg-[#99ff33]/10 text-[#99ff33] rounded-2xl border border-[#99ff33]/20">
                                            {promo.type === 'DISKON' ? <Tag className="size-8" /> : <Ticket className="size-8" />}
                                        </div>
                                        <div>
                                            <span className={`text-[10px] font-extrabold uppercase tracking-widest px-2 py-1 rounded ${
                                                promo.status === 'BERLANGSUNG' ? 'bg-[#99ff33]/20 text-[#99ff33]' :
                                                promo.status === 'SEGERA HADIR' ? 'bg-blue-500/20 text-blue-400' :
                                                'bg-red-500/20 text-red-400'
                                            }`}>
                                                {promo.status}
                                            </span>
                                            <h2 className="text-2xl font-bold mt-2 tracking-tight group-hover:text-[#99ff33] transition-colors line-clamp-1">
                                                {promo.name}
                                            </h2>
                                        </div>
                                    </div>
                                    
                                    {/* Nilai Diskon */}
                                    {promo.type === 'DISKON' && promo.discount_percent && (
                                        <div className="text-right">
                                            <p className="text-xs text-zinc-400 font-medium uppercase tracking-wider mb-1">Diskon</p>
                                            <p className="text-3xl font-black text-[#99ff33]">-{promo.discount_percent}%</p>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Bagian Bawah / Detail Voucher */}
                            <div className="p-6 flex-1 flex flex-col justify-between">
                                <p className="text-[#adaaaa] leading-relaxed text-sm whitespace-pre-line line-clamp-3 mb-6">
                                    {promo.description}
                                </p>

                                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pt-4 border-t border-zinc-800/50">
                                    <div className="flex items-center gap-2 bg-zinc-900/50 px-3 py-2 rounded-lg border border-zinc-800">
                                        <Calendar className="text-zinc-400 size-4" />
                                        <span className="text-xs text-zinc-300 font-medium">
                                            Berlaku: {new Date(promo.start_date).toLocaleDateString('id-ID', { day: 'numeric', month: 'short' })} - {new Date(promo.end_date).toLocaleDateString('id-ID', { day: 'numeric', month: 'short' })}
                                        </span>
                                    </div>

                                    {/* <Link 
                                        href={`/catalog`}
                                        className="flex items-center justify-center gap-2 text-sm font-bold text-[#99ff33] bg-[#99ff33]/10 hover:bg-[#99ff33]/20 px-5 py-2.5 rounded-xl transition-all"
                                    >
                                        Gunakan
                                    </Link> */}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </UnusedNavLayout>
    );
}