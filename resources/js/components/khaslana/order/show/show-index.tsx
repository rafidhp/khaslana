import type { Order } from "@/types/order"

interface ShowIndexProps {
    order: Order;
}

export default function ShowIndex({
    order,
}: ShowIndexProps) {
    const formatRupiah = (value: number | undefined) =>
        new Intl.NumberFormat("id-ID", {
            style: "currency",
            currency: "IDR",
            maximumFractionDigits: 0,
        }
    ).format(value ?? 0);

    const renderStatusBubble = (status: string) => {
        switch (status) {
            case 'TERTUNDA':
                return (
                    <div className="px-4 py-1.5 border border-orange-500 text-orange-400 bg-orange-500/10 rounded-full font-bold text-md max-md:text-xs max-md:mt-2">TERTUNDA</div>
                )
            case 'MENUNGGU PEMBAYARAN':
                return (
                    <div className="px-4 py-1.5 border border-yellow-500 text-yellow-400 bg-orange-500/10 rounded-full font-bold text-md max-md:text-xs max-md:mt-2">MENUNGGU PEMBAYARAN</div>
                )
            case 'DIBAYAR':
                return (
                    <div className="px-4 py-1.5 border border-yellow-500 text-yellow-400 bg-orange-500/10 rounded-full font-bold text-md max-md:text-xs max-md:mt-2">DIBAYAR</div>
                )
            case 'DALAM PROSES':
                return (
                    <div className="px-4 py-1.5 border border-yellow-500 text-yellow-400 bg-orange-500/10 rounded-full font-bold text-md max-md:text-xs max-md:mt-2">DALAM PROSES</div>
                )
            case 'SIAP DIAMBIL':
                return (
                    <div className="px-4 py-1.5 border border-yellow-500 text-yellow-400 bg-orange-500/10 rounded-full font-bold text-md max-md:text-xs max-md:mt-2">SIAP DIAMBIL</div>
                )
            case 'DIKIRIM':
                return (
                    <div className="px-4 py-1.5 border border-yellow-500 text-yellow-400 bg-orange-500/10 rounded-full font-bold text-md max-md:text-xs max-md:mt-2">DIKIRIM</div>
                )
            case 'SELESAI':
                return (
                    <div className="px-4 py-1.5 border border-yellow-500 text-yellow-400 bg-orange-500/10 rounded-full font-bold text-md max-md:text-xs max-md:mt-2">SELESAI</div>
                )
            default:
                return (
                    <div className="px-4 py-1.5 border border-red-500 text-red-400 bg-orange-500/10 rounded-full font-bold text-md max-md:text-xs max-md:mt-2">DIBATALKAN</div>
                )
        }
    }

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
    
    return (
        <div className="flex flex-col gap-6 mb-8">
            <div className="flex max-md:flex-col justify-between max-md:items-start items-end mb-8">
                <div className="flex max-md:flex-col max-md:items-start items-end gap-2">
                    <span className="text-4xl font-semibold flex gap-2">Detail 
                    <span className="text-[#99ff33]">Pesanan</span>
                    </span>
                    <span className="mb-1 font-semibold text-sm text-[#adaaaa]">{order.invoice_number}</span>
                </div>

                <div>
                    {renderStatusBubble(order.status)}
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
                        {order.notes && (
                            <div className="flex justify-between w-full text-lg">
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