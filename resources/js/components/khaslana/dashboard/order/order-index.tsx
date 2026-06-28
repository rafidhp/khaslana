import { Link, router, usePage } from '@inertiajs/react';
import { useEffect, useRef } from 'react';
import { Eye, ClipboardList, ChevronLeft, ChevronRight } from 'lucide-react';
import { showSuccessToast, showErrorToast } from '@/lib/toast';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import NotesDialog from '@/components/khaslana/dashboard/order/notes-dialog';
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
                            <th className="p-4 text-center">
                                No
                            </th>
                            <th className="p-4 text-center">
                                Produk
                            </th>
                            <th className="p-4 text-center">
                                Nama Pembeli
                            </th>
                            <th className="p-4 text-center">
                                Tipe Order
                            </th>
                            <th className="p-4 text-center">
                                Total Harga
                            </th>
                            <th className="p-4 text-center">
                                Status saat ini
                            </th>
                            <th className="p-4 text-center">
                                Ubah status menjadi
                            </th>
                            <th className="p-4 text-center">
                                Catatan
                            </th>
                            <th className="p-4 text-center">
                                Detail
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        {orders.data.length === 0 ? (
                            <tr>
                                <td
                                    colSpan={9}
                                    className="py-10 text-center text-muted-foreground"
                                >
                                    <div className='flex flex-col items-center'>
                                        <ClipboardList className='h-32 w-32 text-center text-[#99FF33] mb-4' />
                                        <span className='flex gap-1'>
                                            Belum data order yang masuk ke toko Anda.
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
                                    <td className="p-4 text-sm md:text-base text-center">
                                        {(orders.from ?? 1) + index}
                                    </td>
                                    <td className="p-4 font-medium text-sm md:text-base text-center">
                                        {order.order_items?.[0].product_name}
                                    </td>
                                    <td className="p-4 font-medium text-sm md:text-base text-center">
                                        {order.user?.name}
                                    </td>
                                    <td className="p-4 font-medium text-sm md:text-base text-center">
                                        {order.type}
                                    </td>
                                    <td className="p-4 text-sm md:text-base text-center">
                                        {formatRupiah(order.total_price)}
                                    </td>
                                    <td className="py-4 text-sm md:text-base text-center">
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
                                    <td className="p-4 text-sm md:text-base text-center">
                                        <div className='flex justify-center items-center' onClick={(e) => e.stopPropagation()}> 
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
                                    <td className="p-4 text-sm md:text-base text-center">
                                        <div className='flex justify-center items-center'>
                                            {order.notes ? (
                                                <NotesDialog notes={order.notes} />
                                            ) : (
                                                <span>Tidak ada</span>
                                            )}
                                        </div>
                                    </td>
                                    <td className='p-4 text-sm md:text-base text-center'>
                                        <div className='flex justify-center items-center'>
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
                {orders.links
                    .filter((link) => {
                        if (orders.last_page === 1) {
                            return !link.label.includes("Previous") && !link.label.includes("Next");
                        }

                        if (
                            orders.current_page === 1 &&
                            link.label.includes("Previous")
                        ) {
                            return false;
                        }

                        if (
                            orders.current_page === orders.last_page &&
                            link.label.includes("Next")
                        ) {
                            return false;
                        }

                        return true;
                    })
                    .map((link, index) => {
                        let label = link.label;

                        if (label.includes("Previous")) {
                            label = "Sebelumnya";
                        }

                        if (label.includes("Next")) {
                            label = "Setelahnya";
                        }

                        return (
                            <Link
                                key={index}
                                href={link.url || "#"}
                                preserveScroll
                                className={`
                                    px-3 py-2 rounded-md text-sm border transition-colors
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
                                    ${!link.url && "pointer-events-none opacity-50"}
                                `}
                            >
                                {label === 'Sebelumnya' && (
                                    <ChevronLeft className='h-4 w-4' />
                                )}
                                {label}
                                {label === 'Setelahnya' && (
                                    <ChevronRight className='h-4 w-4' />
                                )}
                            </Link>
                        );
                    })
                }
            </div>
        </div>
    )
}