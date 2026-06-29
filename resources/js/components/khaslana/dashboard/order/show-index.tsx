import { router, Link } from "@inertiajs/react";
import { ChevronLeft, Copy } from "lucide-react";
import { showSuccessToast, showErrorToast } from "@/lib/toast";
import type { Order } from "@/types/order";
import { Button } from "@/components/ui/button";
import { order as orderRoute } from '@/routes/dashboard';
import { show } from "@/routes/product";

interface ShowIndexProps {
    order: Order;
}

export default function ShowDashoardOrder({
    order,
}: ShowIndexProps) {
    const productId = order.order_items?.[0]?.product_id;
    const formatRupiah = (value: number | undefined) =>
        new Intl.NumberFormat("id-ID", {
            style: "currency",
            currency: "IDR",
            maximumFractionDigits: 0,
        }
    ).format(value ?? 0);

    const renderOrderStatus = (status: string) => {
        switch (status) {
            case 'TERTUNDA':
            case 'MENUNGGU PEMBAYARAN':
            case 'DIBAYAR':
            case 'DALAM PROSES':
            case 'DIKIRIM':
            case 'SIAP DIAMBIL':
                return (
                    <div className="px-4 py-1.5 border border-yellow-500 text-yellow-400 bg-yellow-500/10 rounded-full font-bold text-sm uppercase">
                        {status}
                    </div>
                );

            case 'SELESAI':
                return (
                    <div className="px-4 py-1.5 border border-[#99FF33] text-[#99FF33] bg-[#99FF33]/10 rounded-full font-bold text-sm uppercase">
                        {status}
                    </div>
                );

            case 'DIBATALKAN':
                return (
                    <div className="px-4 py-1.5 border border-red-500 text-red-400 bg-red-500/10 rounded-full font-bold text-sm uppercase">
                        {status}
                    </div>
                );

            default:
                return (
                    <div className="px-4 py-1.5 border border-gray-500 text-gray-400 bg-gray-500/10 rounded-full font-bold text-sm uppercase">
                        {status}
                    </div>
                );
        }
    };

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
            onSuccess: () => {
                showSuccessToast('Status order berhasil diubah!')
            },
            onError: () => {
                showErrorToast('Terjadi kesalahan, mohon coba lagi.')
            }
        });
    };

    const handleCopyInvoice = async (invoice: string) => {
        try {
            await navigator.clipboard.writeText(invoice);
            showSuccessToast("Nomor invoice berhasil disalin.");
        } catch {
            showErrorToast("Gagal menyalin nomor invoice.");
        }
    };

    return (
        <div className="flex flex-col gap-6 mb-8">
            <div className="flex justify-between max-md:items-center items-end max-md:mb-3">
                <div className="flex flex-col gap-4">
                    <Link
                        href={orderRoute()}
                        className='flex items-center gap-1 group w-fit'
                    >
                        <ChevronLeft className='h-5 w-5 text-[#99FF33] group-hover:text-white transition-colors duration-200' />
                        <span className='text-base text-[#99FF33] group-hover:text-white transition-colors duration-200'>Kembali</span>
                    </Link>
                    <div className="flex max-md:flex-col max-md:items-start items-end gap-2 max-md:mb-3">
                        <span className="text-4xl font-semibold flex gap-2">
                            Detail <span className="text-[#99ff33]">Pesanan</span>
                        </span>
                    </div>
                </div>

                <div className="flex flex-col gap-3 items-start">
                    {renderOrderStatus(order.status)}

                    {(() => {
                        const nextStatus = getNextStatus(order);

                        if (!nextStatus) {
                            return null;
                        }

                        return (
                            <Button
                                size="sm"
                                className="
                                    bg-[#99FF33] hover:bg-[#1E1B26]
                                    text-black hover:text-[#99FF33]
                                    border border-[#99FF33]
                                    transition-colors duration-200
                                "
                                onClick={() => handleStatusChange(order.id, nextStatus)}
                            >
                                {nextStatus}
                            </Button>
                        );
                    })()}
                </div>
            </div>

            <div>
                <div
                    className="flex gap-6 bg-[#131313] p-8 rounded-3xl justify-between">
                    <div className="flex gap-5">
                        <div className="flex">
                            <img
                                src={
                                    order.order_items?.[0].product?.product_images?.[0]?.image
                                        ? `/storage/${order.order_items?.[0].product?.product_images?.[0]?.image}`
                                        : '/images/placeholder.png'
                                }
                                alt={order.order_items?.[0].product_name}
                                className="h-30 w-30 object-cover bg-white rounded-xl"
                            />
                        </div>
                        <div className="flex flex-col gap-2 justify-between">
                            <div className="flex flex-col">
                                <h5 className="font-semibold text-2xl">{order.order_items?.[0].product_name}</h5>
                                <span className="flex gap-3 text-[#adaaaa]">
                                    {order.order_items?.[0].variant_detail}
                                </span>
                                <span>
                                    {order.order_items?.[0].quantity} x {formatRupiah(order.order_items?.[0].price)}
                                </span>
                            </div>
                        </div>
                    </div>
                    <div className="flex max-md:hidden flex-col justify-end">
                        <a href={
                            productId ? show(productId).url : ''
                        }
                            className="flex border border-[#99ff33] justify-center text-[#99ff33] font-semibold py-2 px-6 rounded-[999px] text-sm hover:text-black hover:bg-[#99ff33] duration-200 transition-all">
                            Lihat Produk
                        </a>
                    </div>
                </div>
            </div>
            
            <div className="flex max-md:flex-col justify-between w-full gap-6">
                {order.type == 'DIANTAR' && (
                    <div className="flex flex-col gap-6 bg-[#131313] p-8 rounded-3xl w-full">
                        <span className="font-semibold text-2xl">Info Pengiriman</span>
                        <div className="flex flex-col gap-2">
                            <div className="flex justify-between w-full text-lg">
                                <span>Tanggal Pengiriman</span>
                                {order.shipped_at || 'Belum Dikirim'}
                            </div>
                            <div className="flex justify-between w-full text-lg">
                                <span>Alamat</span>
                                {order.address}
                            </div>
                        </div>
                    </div>
                )}

                <div className="flex flex-col gap-6 bg-[#131313] p-8 rounded-3xl w-full">
                    <span className="font-semibold flex max-md:flex-col max-md:w-fit justify-between text-2xl">
                        Rincian Pembayaran
                    </span>
                    <div className="flex flex-col gap-1">
                        <div className="flex justify-between w-full text-base md:text-lg">
                            <span>Nomor Invoice</span>
                            <div className="flex items-center gap-2">
                                <span>{order.invoice_number}</span>
                                <button
                                    type="button"
                                    onClick={() => handleCopyInvoice(order.invoice_number)}
                                    className="
                                        p-1.5
                                        rounded-md
                                        hover:bg-white/10
                                        transition-colors
                                        cursor-pointer
                                    "
                                    title="Salin nomor invoice"
                                >
                                    <Copy className="size-4" />
                                </button>
                            </div>
                        </div>
                        <div className="h-0.5 w-full bg-white/20 my-2"></div>
                        <div className="flex justify-between w-full text-base md:text-lg">
                            <span>Status Pesanan</span>
                            {order.status}
                        </div>
                        <div className="flex justify-between w-full text-base md:text-lg">
                            <span>Metode Pembayaran</span>
                            {order.payment?.payment_type}
                        </div>
                        <div className="flex justify-between w-full text-base md:text-lg">
                            <span>Status Pembayaran</span>
                            {order.payment_status}
                        </div>
                        <div className="h-0.5 w-full bg-white/20 my-2"></div>
                        <div className="flex justify-between w-full text-base md:text-lg">
                            <span>Subtotal</span>
                            {formatRupiah(order.order_items?.[0].price)}
                        </div>
                        <div className="flex justify-between w-full text-base md:text-lg">
                            <span>Biaya Jasa Aplikasi</span>
                            {formatRupiah(2000)}
                        </div>
                        {order.shipping_cost > 0 ? (
                            <div className="flex justify-between w-full text-base md:text-lg">
                                <span>Biaya Pengiriman</span>
                                {formatRupiah(order.shipping_cost)}
                            </div>
                        ) : (
                            <div className="hidden"></div>
                        )}
                        {order.notes && (
                            <div className="flex justify-between w-full text-base md:text-lg">
                                <span>Catatan</span>
                                {order.notes}
                            </div>
                        )}
                        <div className="h-0.5 w-full bg-white/20 my-2"></div>
                        <div className="flex text-[#99ff33] font-medium justify-between w-full text-xl">
                            <span className="">Total Belanja</span>
                            {formatRupiah(order.total_price)}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}