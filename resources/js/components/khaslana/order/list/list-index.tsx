import { router } from "@inertiajs/react";
import { useState } from "react";
import { showSuccessToast, showErrorToast } from "@/lib/toast";
import type { Order } from "@/types/order"
import ConfirmationDialog from "../../confirmation-dialog";

interface ListIndexProps {
    orders: Order[];
}

export default function ListIndex({
    orders,
}: ListIndexProps) {
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [selectedOrderId, setSelectedOrderId] = useState<number | null>(null);

    const formatRupiah = (value: number | undefined) =>
        new Intl.NumberFormat("id-ID", {
            style: "currency",
            currency: "IDR",
            maximumFractionDigits: 0,
        }
    ).format(value ?? 0);

    console.log(orders);

    const renderStatusBubble = (status: string) => {
        switch (status) {
            case 'TERTUNDA':
                return (
                    <div className="px-4 py-1.5 border border-orange-500 text-orange-400 bg-orange-500/10 rounded-full font-bold text-xs">TERTUNDA</div>
                )
            case 'MENUNGGU PEMBAYARAN':
                return (
                    <div className="px-4 py-1.5 border border-yellow-500 text-yellow-400 bg-orange-500/10 rounded-full font-bold text-xs">MENUNGGU PEMBAYARAN</div>
                )
            case 'DIBAYAR':
                return (
                    <div className="px-4 py-1.5 border border-yellow-500 text-yellow-400 bg-orange-500/10 rounded-full font-bold text-xs">DIBAYAR</div>
                )
            case 'DALAM PROSES':
                return (
                    <div className="px-4 py-1.5 border border-yellow-500 text-yellow-400 bg-orange-500/10 rounded-full font-bold text-xs">DALAM PROSES</div>
                )
            case 'DIKIRIM':
                return (
                    <div className="px-4 py-1.5 border border-yellow-500 text-yellow-400 bg-orange-500/10 rounded-full font-bold text-xs">DIKIRIM</div>
                )
            case 'SELESAI':
                return (
                    <div className="px-4 py-1.5 border border-yellow-500 text-yellow-400 bg-orange-500/10 rounded-full font-bold text-xs">SELESAI</div>
                )
            default:
                return (
                    <div className="px-4 py-1.5 border border-red-500 text-red-400 bg-orange-500/10 rounded-full font-bold text-xs">DIBATALKAN</div>
                )
        }
    }

    const handleCompleteOrder = (e: React.MouseEvent, orderId: number) => {
        e.stopPropagation();
        e.preventDefault();
        setSelectedOrderId(orderId);
        setIsDialogOpen(true);
    }
    
    const confirmCompleteOrder = () => {
        if (!selectedOrderId) return;

        router.patch(`/order/complete/${selectedOrderId}`, {}, {
            onSuccess: () => {
                setIsDialogOpen(false);
                setSelectedOrderId(null);
                showSuccessToast("Pesanan berhasil diselesaikan");
            },
            onError: () => {
                setIsDialogOpen(false);
                setSelectedOrderId(null);
                showErrorToast("Terjadi error, silahkan coba lagi.")
            }
        })
    }

    return (
        <>
            <div className="mb-8">
                <span className="font-semibold text-4xl">
                    Riwayat <span className="text-[#99ff33]">Pesanan</span>
                </span>
            </div>

            <div className="flex flex-col gap-4 mb-20">
                {orders.map((order) => (
                    <a href={`/order/show/${order.id}`}
                        className="flex max-md:flex-col gap-6 bg-[#131313] p-8 rounded-3xl justify-between duration-200 transition-all hover:bg-[#222] hover:-translate-y-1">
                        <div className="flex gap-5">
                            <div className="flex">
                                <img
                                    src={
                                        order.order_items?.[0].product?.product_images?.[0]?.image
                                            ? `/storage/${order.order_items?.[0].product?.product_images?.[0]?.image}`
                                            : '/images/placeholder.png'
                                    }
                                    alt={order.order_items?.[0].product_name}
                                    className="h-30 w-30 max-md:h-15 max-md:w-15 object-cover bg-white rounded-xl"
                                />
                            </div>
                            <div className="flex flex-col gap-2 justify-between">
                                <div className="flex flex-col">
                                    <h5 className="font-semibold text-2xl max-md:text-lg">{order.order_items?.[0].product_name}</h5>
                                    <span className="flex flex-col max-md:text-sm text-[#adaaaa]">
                                        {order.order_items?.[0].variant_detail}
                                        <span className="text-white">Kuantitas: {order.order_items?.[0].quantity} unit</span>
                                    </span>
                                </div>
                                <div className="w-fit">
                                    {renderStatusBubble(order.status)}
                                </div>
                            </div>
                        </div>
                        <div className="flex flex-col w-full items-end max-md:gap-3 justify-between">
                            <div className="flex flex-col items-end">
                                <span className="text-[#adaaaa] font-medium text-sm">
                                    Total Belanja
                                </span>
                                <span className="text-[#99ff33] font-bold text-3xl max-md:text-2xl">
                                    {formatRupiah(order.total_price)}
                                </span>
                            </div>
                            <div className="flex gap-2">
                                <a href={`/order/show/${order.id}`}
                                    className="flex border border-[#99ff33] justify-center text-[#99ff33] px-4.5 font-semibold py-2 rounded-[999px] text-sm hover:text-black hover:bg-[#99ff33] duration-200 transition-all">
                                    Lihat Detail
                                </a>
                                {order.type == 'DIANTAR' && order.status == 'DIKIRIM' && (
                                    <button onClick={(e) => handleCompleteOrder(e, order.id)}
                                        className="flex border border-[#99ff33] justify-center hover:text-[#99ff33] px-4.5 font-semibold py-2 rounded-[999px] text-sm text-black bg-[#99ff33] hover:bg-transparent duration-200 transition-all cursor-pointer">
                                        Selesai
                                    </button>
                                )}
                            </div>
                        </div>
                    </a>
                ))}
            </div>

            <ConfirmationDialog 
                open={isDialogOpen}
                title="Selesaikan Pesanan Ini?"
                description="Pastikan Anda sudah menerima produk. Aksi ini tidak dapat dibatalkan"
                confirmText="Ya, Selesai"
                onConfirm={confirmCompleteOrder}
                onCancel={() => {
                    setIsDialogOpen(false);
                    setSelectedOrderId(null);
                }}
            />
        </>
    )
}