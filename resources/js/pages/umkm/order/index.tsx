import { Head } from '@inertiajs/react';

import CtaCard from '@/components/khaslana/dashboard/cta-card';
import OrderIndex from '@/components/khaslana/dashboard/order/order-index';
import { useAuth } from '@/hooks/use-auth';
import AppLayout from '@/layouts/app-layout';
import type { Order } from '@/types/order';
import { order } from '@/routes/dashboard';
import type { BreadcrumbItem } from '@/types';
import type { PaginatedOrders } from '@/types/paginated-order';
import { useMemo, useState } from 'react';
import { Input } from '@/components/ui/input';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Order',
        href: order().url,
    },
];

interface OrderProps {
    orders: PaginatedOrders;
}

const OrderStatusOptions = [
    { id: 'TERTUNDA', name: 'Tertunda' },
    { id: 'MENUNGGU PEMBAYARAN', name: 'Menunggu Pembayaran' },
    { id: 'DIBAYAR', name: 'Dibayar' },
    { id: 'DALAM PROSES', name: 'Dalam Proses' },
    { id: 'DIKIRIM', name: 'Dikirim' },
    { id: 'SIAP DIAMBIL', name: 'Siap Diambil' },
    { id: 'SELESAI', name: 'Selesai' },
    { id: 'DIBATALKAN', name: 'Dibatalkan' },
]

export default function Order({
    orders,
}: OrderProps) {
    const { user } = useAuth();
    const [search, setSearch] = useState('');
    const [selectedStatus, setSelectedStatus] = useState<string>('all');

    const filteredOrders = useMemo(() => {
        return {
            ...orders,
            data: orders.data.filter((order) => {
                const productName = order.order_items?.[0]?.product_name || '';
                const matchSearch =
                    productName.toLowerCase()
                        .includes(search.toLowerCase())

                const matchStatus =
                    selectedStatus === 'all' ||
                    order.status === selectedStatus;

                return matchSearch && matchStatus;
            }),
        };
    }, [orders, search, selectedStatus]);

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title='Orders' />
            {!user.is_umkm ? (
                <CtaCard />   
            ) : (
                <>
                    {/* header */}
                    <div className="flex flex-col align-items-center gap-2">
                        <h1 className="text-3xl font-bold">
                            Order
                        </h1>
                        <div className='flex justify-between items-start'>
                            <p className="text-muted-foreground">
                                Kelola pesanan pelanggan Anda
                            </p>
                        </div>
                    </div>

                    {/* search */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mt-6">
                        <div className='md:col-span-2'>
                            <Input
                                type="text"
                                placeholder="Cari pesanan berdasarkan nama barang..."
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                className="
                                    w-full
                                    border-gray-500/30
                                    focus-visible:border-[#99FF33] focus-visible:ring-0
                                    transition-all duration-200
                                    dark:bg-transparent
                                "
                            />
                        </div>
                        <div className='md:col-span-1'>
                            <Select
                                value={selectedStatus}
                                onValueChange={setSelectedStatus}
                            >
                                <SelectTrigger
                                    className="
                                        border-gray-500/30
                                        bg-transparent
                                        transition-all duration-200
                                        focus:ring-0
                                        focus:border-[#99FF33]
                                        data-[state=open]:border-[#99FF33]
                                        hover:border-[#99FF33]
                                        cursor-pointer
                                    "
                                >
                                    <SelectValue placeholder="Semua Status" />
                                </SelectTrigger>

                                <SelectContent
                                    className="
                                        bg-[#1E1B26]
                                        border-white/10
                                        cursor-pointer
                                    "
                                >
                                    <SelectItem value="all">
                                        Semua Status
                                    </SelectItem>

                                    {OrderStatusOptions.map((item) => (
                                        <SelectItem
                                            key={item.id}
                                            value={item.id.toString()}
                                            className='cursor-pointer'
                                        >
                                            {item.name}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
        
                    {/* content */}
                    <OrderIndex orders={filteredOrders} />
                </>
            )}
        </AppLayout>
    )
}