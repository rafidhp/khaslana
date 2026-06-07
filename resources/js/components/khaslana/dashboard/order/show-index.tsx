import { router } from "@inertiajs/react";
import { showSuccessToast, showErrorToast } from "@/lib/toast";
import type { Order } from "@/types/order";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface ShowIndexProps {
    order: Order;
}

export default function ShowDashoardOrder({
    order,
}: ShowIndexProps) {
    const formatRupiah = (value: number | undefined) =>
        new Intl.NumberFormat("id-ID", {
            style: "currency",
            currency: "IDR",
            maximumFractionDigits: 0,
        }
    ).format(value ?? 0);

    const renderPaymentBubble = (status: string) => {
        switch (status) {
            case 'BELUM DIBAYAR':
                return (
                    <div className="px-4 py-1.5 border border-yellow-500 text-yellow-400 bg-orange-500/10 rounded-full font-bold text-sm max-md:text-xs max-md:mt-2">BELUM DIBAYAR</div>
                )
            case 'DIBAYAR':
                return (
                    <div className="px-4 py-1.5 border border-green-500 text-green-400 bg-orange-500/10 rounded-full font-bold text-sm max-md:text-xs max-md:mt-2">DIBAYAR</div>
                )
            case 'GAGAL':
                return (
                    <div className="px-4 py-1.5 border border-red-500 text-red-400 bg-orange-500/10 rounded-full font-bold text-sm max-md:text-xs max-md:mt-2">GAGAL</div>
                )
            case 'KADALUWARSA':
                return (
                    <div className="px-4 py-1.5 border border-red-500 text-red-400 bg-orange-500/10 rounded-full font-bold text-sm max-md:text-xs max-md:mt-2">KADALUWARSA</div>
                )
            default:
                return (
                    <div className="px-4 py-1.5 border border-gray-500 text-gray-400 bg-orange-500/10 rounded-full font-bold text-sm max-md:text-xs max-md:mt-2">N/A</div>
                )
        }
    }

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

    return (
        <div className="flex flex-col gap-6 mb-8">
            <div className="flex max-md:flex-col justify-between max-md:items-start items-end mb-8 max-md:mb-3">
                <div className="flex max-md:flex-col max-md:items-start items-end gap-2 max-md:mb-3">
                    <span className="text-4xl font-semibold flex gap-2">Detail 
                    <span className="text-[#99ff33]">Pesanan</span>
                    </span>
                    <span className="mb-1 font-semibold text-sm text-[#adaaaa]">{order.invoice_number}</span>
                </div>

                <div>
                    <Select
                        value={order.status}
                        onValueChange={(value) => handleStatusChange(order.id, value)}
                        disabled={['SELESAI', 'DIBATALKAN'].includes(order.status)}
                    >
                        <SelectTrigger 
                            className={`w-45 bg-[#131313] rounded-[999px] text-sm cursor-pointer font-semibold uppercase tracking-wide transition-all flex justify-betweem text-start px-4 py-5 duration-200 focus:ring-0 focus:ring-offset-0 ${
                                order.status === 'TERTUNDA' || order.status === 'MENUNGGU PEMBAYARAN' ? 'border-yellow-500/50 text-yellow-400 focus:border-yellow-500' :
                                order.status === 'DIBAYAR' ? 'border-yellow-500/50 text-yellow-400 focus:border-yellow-500' :
                                order.status === 'DIKIRIM' ? 'border-yellow-500/50 text-yellow-400 focus:border-yellow-500' :
                                order.status === 'SIAP DIAMBIL' ? 'border-yellow-500/50 text-yellow-400 focus:border-yellow-500' : // <-- Selipkan di sini
                                order.status === 'SELESAI' ? 'border-[#99FF33]/80 text-[#99FF33] focus:border-[#99FF33]' :
                                'border-red-500/50 text-red-400 focus:border-red-500'
                            }`}
                        >
                            <SelectValue placeholder="Pilih Status" />
                        </SelectTrigger>
                        
                        <SelectContent className="bg-[#1E1B26] border-white/10 text-sm cursor-pointer font-bold uppercase">
                            <SelectItem value="TERTUNDA" className="text-yellow-400 focus:bg-white/5 focus:text-yellow-400 cursor-pointer">TERTUNDA</SelectItem>
                            <SelectItem value="MENUNGGU PEMBAYARAN" className="text-yellow-400 focus:bg-white/5 focus:text-yellow-400 cursor-pointer hidden">MENUNGGU PEMBAYARAN</SelectItem>
                            <SelectItem value="DIBAYAR" className="text-yellow-400 focus:bg-white/5 focus:text-yellow-400 cursor-pointer hidden">DIBAYAR</SelectItem>
                            <SelectItem value="DALAM PROSES" className="text-yellow-400 focus:bg-white/5 focus:text-yellow-400 cursor-pointer">DALAM PROSES</SelectItem>
                            {order.type == 'DIANTAR' && (
                                <SelectItem value="DIKIRIM" className="text-yellow-400 focus:bg-white/5 focus:text-yellow-400 cursor-pointer">DIKIRIM</SelectItem>
                            )}
                            {order.type == 'DIAMBIL' && (
                                <SelectItem value="SIAP DIAMBIL" className="text-yellow-400 focus:bg-white/5 focus:text-yellow-400 cursor-pointer">SIAP DIAMBIL</SelectItem>
                            )}
                            <SelectItem value="SELESAI" className="text-[#99FF33] focus:bg-white/5 focus:text-[#99FF33] cursor-pointer hidden">SELESAI</SelectItem>
                        </SelectContent>
                    </Select>
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
                        <a href={`/catalog/${order.order_items?.[0].product_id}`}
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
                        <span className="max-md:w-fit">{renderPaymentBubble(order.payment_status)}</span>
                    </span>
                    <div className="flex flex-col gap-1">
                        <div className="flex justify-between w-full text-lg">
                            <span>Metode Pembayaran</span>
                            {order.payment?.payment_type}
                        </div>
                        <div className="h-0.5 w-full bg-white/20 my-2"></div>
                        <div className="flex justify-between w-full text-lg">
                            <span>Subtotal</span>
                            {formatRupiah(order.order_items?.[0].price)}
                        </div>
                        <div className="flex justify-between w-full text-lg">
                            <span>Biaya Jasa Aplikasi</span>
                            {formatRupiah(2000)}
                        </div>
                        {order.shipping_cost > 0 ? (
                            <div className="flex justify-between w-full text-lg">
                                <span>Biaya Pengiriman</span>
                                {formatRupiah(order.shipping_cost)}
                            </div>
                        ) : (
                            <div className="hidden"></div>
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