import { Link } from '@inertiajs/react';
import axios from 'axios';
import {
    Truck
} from "lucide-react";
import { useState } from "react";

import Success from "@/assets/icons/success.png";
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { useAuth } from '@/hooks/use-auth';
import { useMidtrans } from '@/hooks/use-midtrans';
import { showErrorToast } from '@/lib/toast';
import { profile } from '@/routes';
import { generatePayment } from "@/routes/order";
import { checkout } from '@/routes/order';
import { show } from '@/routes/order';
import type { Order } from "@/types/order";

interface OrderPageProps {
    order: Order;
}

export default function OrderIndex({
    order,
}: OrderPageProps) {
    useMidtrans();
    const { user } = useAuth();
    // const item = order.order_items?.[0];
    // const product = item?.product;
    // const variant = item?.variant;
    // const quantity = item?.quantity ?? 1;
    const items = order.order_items ?? [];
    const address = user.location?.address ?? "";
    const [notes, setNotes] = useState(order.notes ?? '');
    const [openingPayment, setOpeningPayment] = useState(false);
    const [successOrder, setSuccessOrder] = useState(false);
    const [orderType, setOrderType] = useState<'DIAMBIL' | 'DIANTAR'>(order.type);
    const settlement = order.payment?.transaction_status === 'settlement';

    const service_fee = 2000;
    const subtotal = items.reduce(
        (acc, item) => acc + Number(item.subtotal ?? 0),
        0
    );
    const shippingCost = orderType === 'DIANTAR'
        ? Number(order.shipping_cost ?? 0)
        : 0;
    const total_price = subtotal + service_fee + shippingCost;
    const isShippingFeature = order.umkm?.is_shipping_feature == 1;
    const isOrderFeature = order.umkm?.is_order_feature == 1;

    const formatRupiah = (value: number) =>
        new Intl.NumberFormat("id-ID", {
            style: "currency",
            currency: "IDR",
            maximumFractionDigits: 0,
        }
    ).format(value);

    if (
        order.type === 'DIANTAR' &&
        !user.location?.address
    ) {
        showErrorToast('Silakan lengkapi alamat terlebih dahulu');
        return;
    }

    // ! JANGAN PERNAH DIUBAH😒
    const handlePay = async () => {
        setOpeningPayment(true);
        if (!window.snap) {
            console.error(
                'Midtrans script belum selesai dimuat'
            );
            return;
        }
        try {
            await axios.patch(checkout(order.id).url, {
                type: orderType,
                notes,
                address,
            });
            const response = await axios.post(generatePayment(order.id).url);
            const snapToken = response.data.snap_token;

            window.snap.pay(snapToken, {
                onSuccess() {
                    setOpeningPayment(false);
                    setSuccessOrder(true);
                },
                onPending() {
                    setOpeningPayment(false);
                },
                onError() {
                    setOpeningPayment(false);
                },
                onClose() {
                    setOpeningPayment(false);
                },
            });

            const iframe =
                document.getElementById(
                    'snap-midtrans'
                );

            console.log(
                iframe?.parentElement
            );

            const interval = setInterval(() => {
                const iframe =
                    document.getElementById(
                        'snap-midtrans'
                    ) as HTMLIFrameElement;

                if (!iframe) {
                    clearInterval(interval);
                    return;
                }
                iframe.style.width = '500px';
                iframe.style.height = '700px';
                iframe.style.top = '50%';
                iframe.style.left = '50%';
                iframe.style.transform = 'translate(-50%, -50%)';
                iframe.style.backgroundColor = 'transparent';
            }, 100);
            console.log('test', 
                document.getElementById(
                    'snap-midtrans'
                )?.parentElement
            );
        } catch (error) {
            console.error(error);
        }
    };
    
    return (
        <div className='mb-12'>
            <div className="flex flex-col gap-2 mb-8">
                <h3 className="font-bold text-5xl max-md:text-3xl">Beli Produk</h3>
                <p className="text-[#adaaaa] max-lg:text-sm">Selesaikan pesanan Anda untuk mendukung pertumbuhan ekonomi lokal.</p>
            </div>
            <div className="flex max-lg:flex-col gap-4">
                <div className="flex flex-col gap-5 flex-3">
                    {items.map((item) => {
                        const product = item.product;
                        const variant = item.variant;
                        const quantity = item.quantity;

                        return (
                            <div key={item.id} className="flex gap-6 bg-[#131313] p-8 rounded-3xl justify-between">
                                
                                <div className="flex gap-5">
                                    <img
                                        src={
                                            product?.product_images?.[0]?.image
                                                ? `/storage/${product.product_images[0].image}`
                                                : '/images/placeholder.png'
                                        }
                                        className="h-30 w-30 object-cover bg-white rounded-xl"
                                    />

                                    <div className="flex flex-col justify-between">
                                        <div>
                                            <h5 className="font-semibold text-2xl">
                                                {product?.name}
                                            </h5>

                                            <span className="text-[#adaaaa]">
                                                {item.variant_detail}
                                            </span>
                                        </div>

                                        <span>Kuantitas: {quantity} unit</span>
                                    </div>
                                </div>

                                <div className="flex flex-col items-end">
                                    <span className="text-sm text-[#adaaaa]">
                                        {formatRupiah(variant?.price ?? 0)} / unit
                                    </span>

                                    <span className="text-[#99ff33] font-bold text-2xl">
                                        {formatRupiah(item.subtotal)}
                                    </span>
                                </div>

                            </div>
                        );
                    })}

                    <div className='flex flex-col bg-[#131313] rounded-2xl p-8 gap-8'>
                        <span className="flex text-base gap-3 items-center font-semibold tracking-wide text-[#adaaaa]">
                            <Truck className="text-[#99ff33]"/> DETAIL PENGIRIMAN
                        </span>
                        <div className='flex flex-col gap-4'>
                            <div className="flex flex-col gap-1">
                                <span className="text-[#adaaaa] tracking-wide font-semibold uppercase text-sm">
                                    NOMOR INVOICE
                                </span>
                                <span className="font-mono text-sm break-all">
                                    {order.invoice_number}
                                </span>
                            </div>
                            <div className="h-0.5 w-full bg-white/5"></div>
                            <div className='flex flex-col gap-1'>
                                <Label htmlFor='name' className='text-[#adaaaa] tracking-wide font-semibold uppercase text-sm'>Nama Penerima</Label>
                                <Input
                                    placeholder="Contoh: Fajri Bagas"
                                    value={user.name}
                                    className="mt-2 border-gray-500/30 focus-visible:border-[#99FF33] bg-[#181818] focus-visible:ring-0 transition-all duration-200"
                                    required
                                />
                            </div>
                            <div className='flex flex-col gap-1'>
                                <Label className='text-[#adaaaa] tracking-wide font-semibold uppercase text-sm'>
                                    Tipe Pembelian
                                </Label>
                                <Select
                                    value={orderType}
                                    onValueChange={(value) =>
                                        setOrderType(
                                            value as
                                                | 'DIAMBIL'
                                                | 'DIANTAR'
                                        )
                                    }
                                >
                                    <SelectTrigger
                                        className="
                                            mt-2
                                            border-gray-500/30
                                            transition-all duration-200
                                            bg-[#181818]
                                            focus:ring-0
                                            focus:border-[#99FF33]
                                            data-[state=open]:border-[#99FF33]
                                            hover:border-[#99FF33]
                                        "
                                    >
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {isOrderFeature && (
                                            <SelectItem value="DIAMBIL">
                                                Ambil Sendiri
                                            </SelectItem>
                                        )}
                                        {isShippingFeature && (
                                            <SelectItem value="DIANTAR">
                                                Diantar
                                            </SelectItem>
                                        )}
                                    </SelectContent>

                                     {!isShippingFeature && (
                                        <span className="text-xs text-[#adaaaa]">
                                            UMKM ini tidak menyediakan layanan pengantaran.
                                        </span>
                                    )}
                                     {!isOrderFeature && (
                                        <span className="text-xs text-[#adaaaa]">
                                            UMKM ini tidak menyediakan layanan ambil sendiri.
                                        </span>
                                    )}
                                </Select>
                            </div>
                            {orderType === 'DIANTAR' && (
                                <div className='flex flex-col gap-1'>
                                    <Label htmlFor='address' className='text-[#adaaaa] tracking-wide font-semibold uppercase text-sm'>Alamat Penerima</Label>
                                    {address ? (
                                        <Textarea
                                            value={address}
                                            className="
                                                mt-2
                                                border-gray-500/30
                                                bg-[#181818]
                                                focus-visible:border-[#99FF33]
                                                focus-visible:ring-0
                                            "
                                            readOnly
                                        />
                                    ) : (
                                        <Link
                                            href={profile().url}
                                            className="
                                                mt-2
                                                flex items-center justify-center
                                                h-28
                                                rounded-xl
                                                border border-dashed border-[#99ff33]
                                                bg-[#181818]
                                                text-[#99ff33]
                                                font-medium
                                                hover:bg-[#99ff33]/10
                                                transition-all
                                            "
                                        >
                                            Lengkapi alamat terlebih dahulu
                                        </Link>
                                    )}
                                </div>
                            )}
                            <div className='flex flex-col gap-1'>
                                <Label htmlFor='notes' className='text-[#adaaaa] tracking-wide font-semibold uppercase text-sm'>Catatan (Opsional)</Label>
                                <Textarea
                                    value={notes}
                                    onChange={(e) => setNotes(e.target.value)}
                                    className="
                                        mt-2
                                        border-gray-500/30
                                        bg-[#181818]
                                        focus-visible:border-[#99FF33]
                                        focus-visible:ring-0
                                    "
                                />
                            </div>
                        </div>
                    </div>

                    {/* <div className="flex flex-col bg-[#131313] rounded-2xl p-8 gap-8">
                        <span className="flex text-base gap-3 items-center font-semibold tracking-wide text-[#adaaaa]">
                            <Wallet className="text-[#99ff33]"/> METODE PEMBAYARAN
                        </span>
                        <div className="flex w-full justify-between gap-4 max-md:flex-col">
                            {paymentOptions.map((payment) => (
                                <div
                                    key={payment.label}
                                    className="flex flex-col justify-center w-full items-center bg-[#262626] rounded-xl py-6 gap-3"
                                >
                                    {payment.icon}
                                    <span className="font-semibold text-lg">
                                        {payment.label}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </div> */}
                </div>

                <div className="flex flex-col gap-5 flex-2 bg-[#222] rounded-2xl p-8 h-fit max-lg:mb-10">
                    <span className="text-2xl font-bold">Ringkasan Pesanan</span>
                    <span className="flex justify-between w-full text-[#adaaaa]">
                        <span>Subtotal</span>
                        {formatRupiah(total_price)}
                    </span>
                    <span className="flex justify-between w-full text-[#adaaaa]">
                        <span>Biaya Layanan</span>
                        {formatRupiah(service_fee)}
                    </span>
                    {orderType === 'DIANTAR' && (
                        <span className="flex justify-between w-full text-[#adaaaa]">
                            <span>Biaya Pengantaran</span>
                            <span>
                                {formatRupiah(shippingCost)}
                            </span>
                        </span>
                    )}
                    <div className="h-0.5 w-full bg-white/5"></div>
                    <span className="flex justify-between w-full items-center">
                        <span className="font-semibold text-xl">Total Pembayaran</span>
                        <span className="font-semibold text-3xl text-[#99ff33]">{formatRupiah(total_price)}</span>
                    </span>
                    <button
                        disabled={openingPayment}
                        onClick={handlePay}
                        className="w-full flex py-4 bg-[#99ff33] rounded-full border border-[#99ff33] items-center justify-center font-medium text-[#222] transition-all duration-200 cursor-pointer hover:bg-transparent hover:text-[#99ff33]"
                    >
                        Bayar Sekarang
                    </button>
                </div>
            </div>
            {openingPayment && (
                <div
                    className="
                        fixed inset-0
                        bg-black/80
                        backdrop-blur-sm
                        z-40
                        flex items-center justify-center
                    "
                >
                    <div
                        className="
                            flex flex-col items-center gap-6
                            bg-[#131313]
                            border border-[#99ff33]/20
                            rounded-3xl
                            px-10 py-8
                            shadow-[0_0_40px_rgba(153,255,51,0.15)]
                        "
                    >
                        <div className="flex gap-2 h-5">
                            <span
                                className="
                                    w-3 h-3
                                    rounded-full
                                    bg-[#99ff33]
                                    animate-bounce
                                "
                            />
                            <span
                                className="
                                    w-3 h-3
                                    rounded-full
                                    bg-[#99ff33]
                                    animate-bounce
                                    [animation-delay:150ms]
                                "
                            />
                            <span
                                className="
                                    w-3 h-3
                                    rounded-full
                                    bg-[#99ff33]
                                    animate-bounce
                                    [animation-delay:300ms]
                                "
                            />
                        </div>

                        <div className="flex flex-col items-center gap-2">
                            <h4 className="font-semibold text-white text-xl">
                                Membuka Pembayaran
                            </h4>

                            <p className="text-[#a1a1a1] text-sm text-center">
                                Mohon tunggu sebentar,
                                menghubungkan ke Midtrans...
                            </p>
                        </div>
                    </div>
                </div>
            )}
            {successOrder || settlement && (
                <div
                    className="
                        fixed inset-0
                        bg-black/80
                        backdrop-blur-sm
                        z-40
                        flex items-center justify-center
                    "
                >
                    <div
                        className="
                            flex flex-col items-center gap-6
                            bg-[#131313]
                            border border-[#99ff33]/20
                            rounded-3xl
                            px-24 py-16
                            shadow-[0_0_40px_rgba(153,255,51,0.15)]
                        "
                    >
                        <div className='flex'>
                            <img src={Success} alt="success order" className='h-full w-24' />
                        </div>

                        <div className="flex flex-col items-center gap-2">
                            <h4 className="font-semibold text-white text-xl">
                                Pembayaran Berhasil
                            </h4>

                            <Link href={show(order.id)} className='btn-primary-khaslana py-2 mt-2'>Yeay</Link>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}