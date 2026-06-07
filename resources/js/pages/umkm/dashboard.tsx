import { Head, router } from '@inertiajs/react';
import { ShoppingBag, DollarSign, Package, Star } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import SwitchOff from '@/assets/images/dashboard/switch-off.svg';
import SwitchOn from '@/assets/images/dashboard/switch-on.svg';

import CtaCard from '@/components/khaslana/dashboard/cta-card';
// import StatisticCard from '@/components/khaslana/dashboard/statistic-card';
import { useAuth } from '@/hooks/use-auth';
import AppLayout from '@/layouts/app-layout';
import { showSuccessToast } from '@/lib/toast';
import { dashboard } from '@/routes';
import { storeStatusRoute } from '@/routes/dashboard';
import type { BreadcrumbItem } from '@/types';
import type { Order } from '@/types/order';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
        href: dashboard().url,
    },
];

interface UmkmStat {
    umkm_id: number;
    total_pendapatan: string | number;
    total_pembeli: number;
}

interface ActiveProduct {
    umkm_id: number;
    total_produk: number;
}

interface ProductWithRating {
    id: number;
    name: string;
    reviews_avg_rating: string;
}

interface StoreRating {
    id: number;
    name: string;
    products: ProductWithRating[];
}

interface CategoryData {
    id: number;
    name: string;
}

interface ProductImage {
    id: number;
    product_id: number;
    image_path: string;
}

interface TopProducts {
    id: number;
    name: string;
    category: CategoryData;
    total_terjual: string | number;
    product_images: ProductImage[];
}

interface DashboardProps {
    status: 'BUKA' | 'TUTUP';
    umkm_stat: UmkmStat[];
    active_product: ActiveProduct[];
    store_rating: StoreRating[];
    top_products: TopProducts[];
    sales_chart: ChartItem[];
    latest_orders: Order[];
}

interface ChartItem {
    label: string;
    penjualan: number;
}

export default function Dashboard({
    status,
    umkm_stat,
    active_product,
    store_rating,
    top_products,
    sales_chart,
    latest_orders
}: DashboardProps) {
    const { user } = useAuth();
    const handleToggleStore = () => {
        router.post(storeStatusRoute(), {
            status: true,
        }, {
            preserveScroll: true,
            onSuccess: () => {
                showSuccessToast('Status toko berhasil diubah!');
            }
        });
    };

    const stat = umkm_stat?.[0] || { total_pembeli: 0, total_pendapatan: 0 };
    const product = active_product?.[0] || { total_produk: 0 };
    const storeProduct = store_rating?.[0]?.products?.[0];

    const storeStatistics = [
        { id: 1, title: 'Pesanan', 'value': stat.total_pembeli, 'icon': <ShoppingBag className='size-8' /> },
        { id: 2, title: 'Pendapatan', 'value': stat.total_pendapatan, 'icon': <DollarSign className='size-8' /> },
        { id: 3, title: 'Produk aktif', 'value': product.total_produk, 'icon': <Package className='size-8' /> },
        {
            id: 4, title: 'Rating toko', 'value': storeProduct?.reviews_avg_rating
                ? `${Number(storeProduct.reviews_avg_rating).toFixed(1)}/5.0`
                : '0.0/5.0', 'icon': <Star className='size-8' />
        },
    ]

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Dashboard" />
            {!user.is_umkm ? (
                <CtaCard />
            ) : (
                <>
                    <div className="flex justify-between items-center mb-8">
                        <div className="flex flex-col gap-2">
                            <h1 className="font-semibold text-4xl">Ringkasan Toko Anda.</h1>
                            <p className="text-[#adaaaa]">Pantau kinerja toko Anda secara real-time</p>
                        </div>
                        <div className="flex items-center gap-3 bg-[#191720] px-4 py-2 rounded-2xl">
                            <span className="text-xl font-medium text-white">
                                Status Toko :
                            </span>
                            <span
                                className={`
                                    text-xl font-bold
                                    ${status === 'BUKA'
                                        ? 'text-[#99FF33]'
                                        : 'text-red-500'
                                    }
                                `}
                            >
                                {status === 'BUKA' ? 'Buka' : 'Tutup'}
                            </span>
                            <button
                                type="button"
                                onClick={handleToggleStore}
                                className="focus:outline-none transition-transform active:scale-95 ml-2"
                            >
                                <img
                                    src={status === 'BUKA' ? SwitchOn : SwitchOff}
                                    alt={status === 'BUKA' ? "Switch is On" : "Switch is Off"}
                                    className="w-full h-full cursor-pointer"
                                />
                            </button>
                        </div>
                    </div>

                    <div className='grid grid-cols-4 max-lg:grid-cols-2 gap-4 justify-between w-full mb-4'>
                        {storeStatistics.map((item) => (
                            <div key={item.id}
                                className='flex flex-col gap-4 w-full rounded-4xl p-6 bg-[#222]'>
                                <div className='w-fit p-3 text-[#99ff33] rounded-[999px] bg-[#cacaca]/20'>
                                    {item.icon}
                                </div>
                                <div className='flex flex-col'>
                                    <span className='text-[#adaaaa]'>{item.title}</span>
                                    <span className='font-semibold text-3xl'>{item.value}</span>
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className='flex max-lg:flex-col mb-4 gap-5 justify-between w-full'>
                        <div className='flex flex-col bg-[#191720] w-full rounded-4xl p-6 py-6 max-lg:h-100 lg:flex-4'>
                            <span className='text-2xl font-semibold'>Grafik Penjualan</span>

                            <ResponsiveContainer width="100%" height="100%">
                                <AreaChart data={sales_chart} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                                    <defs>
                                        <linearGradient id="colorPenjualan" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="#7fff1a" stopOpacity={0.2} />
                                            <stop offset="95%" stopColor="#7fff1a" stopOpacity={0} />
                                        </linearGradient>
                                    </defs>
                                    <XAxis dataKey="label" stroke="#52525b" fontSize={12} tickLine={false} axisLine={false} />
                                    <YAxis hide />
                                    <Tooltip
                                        contentStyle={{ backgroundColor: '#18181c', borderColor: '#27272a', borderRadius: '12px' }}
                                        itemStyle={{ color: '#7fff1a' }}
                                        formatter={(value) => [`${value} Transaksi`, 'Total Penjualan']}
                                    />
                                    <Area type="monotone" dataKey="penjualan" stroke="#7fff1a" strokeWidth={3} fillOpacity={1} fill="url(#colorPenjualan)" />
                                </AreaChart>
                            </ResponsiveContainer>
                        </div>

                        <div className='flex flex-col gap-4 bg-[#191720] w-full rounded-4xl p-6 py-6 flex-2'>
                            <span className='text-2xl font-semibold pb-3'>Produk Terlaris</span>
                            {top_products.map((item) => (
                                <div className='flex justify-between gap-3' key={item.id}>
                                    <div className='flex gap-4'>
                                        <img src={`storage/${item.product_images}`} alt="tes" className='size-13 bg-white rounded-[999px]' />

                                        <div className='flex flex-col justify-center'>
                                            <span className='text-lg font-medium'>{item.name}</span>
                                            <span className='text-sm text-[#adaaaa] tracking-wider'>{item.category?.name}</span>
                                        </div>
                                    </div>

                                    <div className='flex flex-col justify-center items-end text-[#adaaaa]'>
                                        <span className='text-xl font-semibold text-[#99ff33]'>{item.total_terjual || 0}</span>
                                        <span className='text-sm'>TERJUAL</span>
                                    </div>
                                </div>
                            ))}
                            <a href="/product" className='flex text-[#99ff33] font-semibold w-full justify-center mt-6'>Lihat Semua Produk</a>
                        </div>
                    </div>

                    <div className='flex '>
                        <div className='flex flex-col bg-[#191720] w-full rounded-4xl p-6 lg:flex-4 gap-6'>
                            <span className='text-2xl font-semibold'>Pesanan Terbaru</span>
                            <div className='flex justify-between w-full md:px-10 '>
                                <div className='flex flex-col gap-3'>
                                    <span className='font-semibold text-sm tracking-[1px] text-[#BFCBAF] mb-4'>PELANGGAN</span>
                                    {latest_orders.map((item) => (
                                        <span key={item.id}
                                            className='font-semibold'>
                                            {item.user?.name}
                                        </span>
                                    ))}
                                </div>

                                <div className='flex flex-col gap-3'>
                                    <span className='font-semibold text-sm tracking-[1px] text-[#BFCBAF] mb-4'>PRODUK</span>
                                    {latest_orders.map((item) => (
                                        <span key={item.id}
                                            className='font-normal text-[#adaaaa]'>
                                            {item.order_items?.[0].product_name}
                                        </span>
                                    ))}
                                </div>

                                <div className='flex flex-col gap-3 max-md:hidden'>
                                    <span className='font-semibold text-sm tracking-[1px] text-[#BFCBAF] mb-4 '>STATUS</span>
                                    {latest_orders.map((item) => (
                                        <span key={item.id}
                                            className='font-medium text-yellow-200'>
                                            {item.status}
                                        </span>
                                    ))}
                                </div>

                                <div className='flex flex-col gap-3'>
                                    <span className='font-semibold text-sm tracking-[1px] text-[#BFCBAF] mb-4'>TOTAL</span>
                                    {latest_orders.map((item) => (
                                        <span key={item.id}
                                            className='font-semibold'>
                                            Rp {item.total_price}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </>
            )}
        </AppLayout>
    );
}
