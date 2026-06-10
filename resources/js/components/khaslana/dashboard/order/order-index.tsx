import { Link, router, usePage } from '@inertiajs/react';
import { useEffect, useRef } from 'react';
import { Eye, PackageOpen } from 'lucide-react';
import { showSuccessToast, showErrorToast } from '@/lib/toast';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { create } from '@/routes/product';
import type { PaginatedOrders } from "@/types/paginated-order";
import type { Order } from '@/types/order';

interface OrderIndexProps {
    orders: PaginatedOrders;
}

export default function OrderIndex({
    orders,
}: OrderIndexProps) {
    const { props } = usePage<{
        flash: {
            success?: string;
            error?: string;
        };
    }>();
    const hasShownToast = useRef(false);

    const formatRupiah = (value: number) =>
        new Intl.NumberFormat("id-ID", {
            style: "currency",
            currency: "IDR",
            maximumFractionDigits: 0,
        }).format(value);

    const getNextStatus = (order: Order) => {
        switch (order.status) {
            case 'DIBAYAR': return 'DALAM PROSES';
            case 'DALAM PROSES': return order.type === 'DIANTAR' ? 'DIKIRIM' : 'SIAP DIAMBIL';
            case 'DIKIRIM': return 'SELESAI';
            case 'SIAP DIAMBIL': return 'SELESAI';

            default: return null;
        }
    };

    const handleStatusChange = (orderId: number, newStatus: string) => {
        router.patch(`/dashboard/order/change-status/${orderId}`, {
            status: newStatus
        }, {
            preserveScroll: true,
        });
    };

    useEffect(() => {
        if (hasShownToast.current) return;

        if (props.flash?.success) {
            hasShownToast.current = true;

            showSuccessToast(
                'Berhasil',
                props.flash.success,
            );
        }
        if (props.flash?.error) {
            hasShownToast.current = true;

            showErrorToast(
                'Gagal',
                props.flash.error,
            );
        }
    }, [props.flash]);

    return (
        <div className="rounded-xl border border-[#99FF33]/50 bg-[#1E1B26] overflow-hidden mt-4">
            <div className="overflow-x-auto">
                <table className="w-full">
                    <thead>
                        <tr className="border-b border-[#99FF33]/50 bg-[#99FF33]/90 text-[#1B1E26] text-sm md:text-base">
                            <th className="p-4 text-left">
                                No
                            </th>
                            <th className="p-4 text-left">
                                Produk
                            </th>
                            <th className="p-4 text-left">
                                Nama Pembeli
                            </th>
                            <th className="p-4 text-left">
                                Tipe Order
                            </th>
                            <th className="p-4 text-left">
                                Total Harga
                            </th>
                            <th className="p-4 text-lef">
                                Status saat ini
                            </th>
                            <th className="p-4 text-lef">
                                Ubah status menjadi
                            </th>
                            <th className="p-4 text-center">
                                Aksi
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        {orders.data.length === 0 ? (
                            <tr>
                                <td
                                    colSpan={6}
                                    className="py-10 text-center text-muted-foreground"
                                >
                                    <div className='flex flex-col items-center'>
                                        <PackageOpen className='h-32 w-32 text-center text-[#99FF33] mb-4' />
                                        <span className='flex gap-1'>
                                            Belum data ada produk. Ayo tambahkan produk Anda
                                            <a href={create().url} className='text-[#99FF33] underline'>disini</a>.
                                        </span>
                                    </div>
                                </td>
                            </tr>
                        ) : (
                            orders.data.map((order, index) => (
                                <tr
                                    key={order.id}
                                    className="border-b border-white/5 hover:bg-white/5 transition"
                                >
                                    <td className="p-4 text-sm md:text-base">
                                        {(orders.from ?? 1) + index}
                                    </td>
                                    <td className="p-4">
                                        {order.order_items?.[0].product_name}
                                    </td>
                                    <td className="p-4 font-medium text-sm md:text-base">
                                        {order.user?.name}
                                    </td>
                                    <td className="p-4 font-medium text-sm md:text-base">
                                        {order.type}
                                    </td>
                                    <td className="p-4 text-xs md:text-sm text-muted-foreground max-w-xs">
                                        {formatRupiah(order.total_price)}
                                    </td>
                                    <td className="py-4 text-sm md:text-base">
                                        <div className="flex justify-center">
                                            <Badge
                                                className={`uppercase ${
                                                    order.status === 'SELESAI'
                                                        ? 'bg-[#99FF33] text-black'
                                                        : order.status === 'DIBATALKAN'
                                                        ? 'bg-red-500 text-white'
                                                        : 'bg-yellow-500 text-black'
                                                }`}
                                            >
                                                {order.status}
                                            </Badge>
                                        </div>
                                    </td>
                                    <td className="p-4 text-sm md:text-base">
                                        <div className='flex justify-center' onClick={(e) => e.stopPropagation()}> 
                                            {(() => {
                                                const nextStatus = getNextStatus(order);

                                                if (!nextStatus) {
                                                    return (
                                                        <span className="text-xs text-muted-foreground">
                                                            -
                                                        </span>
                                                    );
                                                }

                                                return (
                                                    <Button
                                                        size="sm"
                                                        className="
                                                            bg-[#99FF33]
                                                            border border-[#99FF33]
                                                            hover:bg-[#1E1B26]
                                                            hover:text-[#99FF33]
                                                            transition-colors duration-200
                                                            hover:cursor-pointer
                                                        "
                                                        onClick={() =>
                                                            handleStatusChange(order.id, nextStatus)
                                                        }
                                                    >
                                                        {nextStatus}
                                                    </Button>
                                                );
                                            })()}
                                        </div>
                                    </td>

                                    <td className="p-4">
                                        <div className="flex justify-center gap-2">
                                            <Link
                                                href={`/dashboard/order/${order.id}`}
                                                className="p-2 rounded-md group hover:bg-[#99FF33]/20 transition-colors duration-200"
                                            >
                                                <Eye size={16} className='group-hover:text-[#99FF33]' />
                                            </Link>
                                        </div>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>

            {/* paginatoin */}
            <div className="flex justify-center gap-2 p-4 border-t border-[#99FF33]/50">
                {orders.links.map(
                    (link, index) => (
                        <Link
                            key={index}
                            href={link.url || '#'}
                            preserveScroll
                            className={`
                                px-3 py-2 rounded-md text-sm border
                                ${
                                    link.active
                                        ? `
                                            bg-[#99FF33]
                                            text-[#1E1B26]
                                            border-[#99FF33]
                                        `
                                        : `
                                            border-white/10
                                            hover:border-[#99FF33]
                                        `
                                }
                            `}
                            dangerouslySetInnerHTML={{
                                __html:
                                    link.label,
                            }}
                        />
                    )
                )}
            </div>
        </div>
    )
}