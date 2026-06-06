import { Link, router } from '@inertiajs/react';
import { Eye, PackageOpen } from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { create } from '@/routes/product';
import type { PaginatedOrders } from "@/types/paginated-order";

interface OrderIndexProps {
    orders: PaginatedOrders;
}

export default function OrderIndex({
    orders,
}: OrderIndexProps) {
    const formatRupiah = (value: number) =>
        new Intl.NumberFormat("id-ID", {
            style: "currency",
            currency: "IDR",
            maximumFractionDigits: 0,
        }).format(value);

    const handleStatusChange = (orderId: number, newStatus: string) => {
        router.patch(`/order/${orderId}/update-status`, {
            status: newStatus
        }, {
            preserveScroll: true
        });
    };

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
                                Invoice
                            </th>
                            <th className="p-4 text-left">
                                Nama Pembeli
                            </th>
                            <th className="p-4 text-left">
                                Total Harga
                            </th>
                            <th className="p-4 text-left">
                                Status
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
                                        {order.invoice_number}
                                    </td>
                                    <td className="p-4 font-medium text-sm md:text-base">
                                        {order.user?.name}
                                    </td>
                                    <td className="p-4 text-xs md:text-sm text-muted-foreground max-w-xs">
                                        {formatRupiah(order.total_price)}
                                    </td>
                                    <td className="p-4 text-sm md:text-base">
                                        <div onClick={(e) => e.stopPropagation()}> 
                                            <Select
                                                value={order.status}
                                                onValueChange={(value) => handleStatusChange(order.id, value)}
                                                disabled={['SELESAI', 'DIBATALKAN'].includes(order.status)}
                                            >
                                                <SelectTrigger 
                                                    className={`w-[180px] bg-[#131313] rounded-xl text-xs font-bold uppercase tracking-wider transition-all duration-200 focus:ring-0 focus:ring-offset-0 ${
                                                        order.status === 'TERTUNDA' || order.status === 'MENUNGGU PEMBAYARAN' ? 'border-yellow-500/50 text-yellow-400 focus:border-yellow-500' :
                                                        order.status === 'DIBAYAR' ? 'border-blue-500/50 text-blue-400 focus:border-blue-500' :
                                                        order.status === 'DALAM PROSES' ? 'border-purple-500/50 text-purple-400 focus:border-purple-500' :
                                                        order.status === 'DIKIRIM' ? 'border-indigo-500/50 text-indigo-400 focus:border-indigo-500' :
                                                        order.status === 'SELESAI' ? 'border-[#99FF33]/50 text-[#99FF33] focus:border-[#99FF33]' :
                                                        'border-red-500/50 text-red-400 focus:border-red-500'
                                                    }`}
                                                >
                                                    <SelectValue placeholder="Pilih Status" />
                                                </SelectTrigger>
                                                
                                                <SelectContent className="bg-[#1E1B26] border-white/10 text-xs font-bold uppercase">
                                                    <SelectItem value="TERTUNDA" className="text-yellow-400 focus:bg-white/5 focus:text-yellow-400 cursor-pointer">TERTUNDA</SelectItem>
                                                    <SelectItem value="MENUNGGU PEMBAYARAN" className="text-yellow-400 focus:bg-white/5 focus:text-yellow-400 cursor-pointer">MENUNGGU PEMBAYARAN</SelectItem>
                                                    <SelectItem value="DIBAYAR" className="text-blue-400 focus:bg-white/5 focus:text-blue-400 cursor-pointer">DIBAYAR</SelectItem>
                                                    <SelectItem value="DALAM PROSES" className="text-purple-400 focus:bg-white/5 focus:text-purple-400 cursor-pointer">DALAM PROSES</SelectItem>
                                                    <SelectItem value="DIKIRIM" className="text-indigo-400 focus:bg-white/5 focus:text-indigo-400 cursor-pointer">DIKIRIM</SelectItem>
                                                    <SelectItem value="SELESAI" className="text-[#99FF33] focus:bg-white/5 focus:text-[#99FF33] cursor-pointer">SELESAI</SelectItem>
                                                    <SelectItem value="DIBATALKAN" className="text-red-400 focus:bg-white/5 focus:text-red-400 cursor-pointer">DIBATALKAN</SelectItem>
                                                </SelectContent>
                                            </Select>
                                        </div>
                                    </td>

                                    <td className="p-4">
                                        <div className="flex justify-center gap-2">
                                            <Link
                                                href={`#`}
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