import { usePage } from "@inertiajs/react";
import { Wallet, QrCode, Landmark, WalletMinimal, Minus, Plus, Trash } from "lucide-react";
import { useState } from "react";
import type { ProductVariant } from "@/types/attribute";
import type { Product } from "@/types/product";

interface CheckoutData {
    product: Product;
    variant: ProductVariant;
    quantity: number;
    total_price: number;
    attributes: Record<string, string>;
}

interface OrderPageProps {
    checkoutData: CheckoutData;
}

export default function OrderIndex() {
    const { checkoutData } = usePage().props as unknown as OrderPageProps;
    const { product, variant, quantity, attributes } = checkoutData;
    const [muchQuantity, setQuantity] = useState(quantity);

    const stock = variant?.stock ?? 0
    const total_price = (variant?.price ?? 0) * muchQuantity
    const service_fee = 2000

    const paymentOptions = [
        {label: 'QRIS', icon: <QrCode />},
        {label: 'Transfer Bank', icon: <Landmark />},
        {label: 'E-Wallet', icon: <WalletMinimal />},
    ]
    
    return (
        <div>
            <div className="flex flex-col gap-2 mb-8">
                <h3 className="font-bold text-5xl max-md:text-3xl">Beli Produk</h3>
                <p className="text-[#adaaaa] max-lg:text-sm">Selesaikan pesanan Anda untuk mendukung pertumbuhan ekonomi lokal.</p>
            </div>

            <div className="flex max-lg:flex-col gap-4">
                <div className="flex flex-col gap-5 flex-3">
                    <div className="flex gap-6 bg-[#131313] p-8 rounded-3xl justify-between">

                    <div className="flex gap-5">
                        <div className="flex">
                            <img src={`/storage/${product.product_images?.[0]?.image}`} alt={product.name} className="h-30 w-30 object-cover bg-white rounded-xl"/>
                        </div>
                        <div className="flex flex-col gap-2 justify-between">
                            <div className="flex flex-col">
                                <h5 className="font-semibold text-2xl">{product.name}</h5>
                                <span className="flex gap-3 text-[#adaaaa]">
                                    {attributes && Object.entries(attributes).map(([key, value]) => (
                                        <span key={key}>
                                            {key} : {value}
                                        </span>
                                    ))}
                                </span>
                            </div>

                            <div className="mt-8 flex items-center justify-between gap-5">
                                <div
                                    className="
                                        flex items-center
                                        border border-[#3A3547]
                                        rounded-2xl
                                        overflow-hidden
                                    "
                                >
                                    <button
                                        onClick={() =>
                                            setQuantity((prev) => Math.max(1, prev - 1))
                                        }
                                        disabled={stock <= 1}
                                        className={`
                                            w-12 h-12
                                            flex items-center justify-center
                                            text-white
                                            cursor-pointer
                                            disabled:cursor-not-allowed
                                            disabled:text-white/50
                                            ${muchQuantity <= 1 && 'text-white/50 hover:cursor-not-allowed'}
                                        `}
                                    >
                                        <Minus size={18} />
                                    </button>
                                    <span className="w-14 text-center text-white font-semibold">
                                        {muchQuantity}
                                    </span>
                                    <button
                                        onClick={() =>
                                            setQuantity((prev) => Math.min(stock, prev + 1))
                                        }
                                        disabled={stock <= 0 || muchQuantity >= stock}
                                        className="
                                            w-12 h-12
                                            flex items-center justify-center
                                            text-white
                                            cursor-pointer
                                            disabled:cursor-not-allowed
                                            disabled:text-white/50
                                        "
                                    >
                                        <Plus size={18} />
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                    
                    <div className="flex flex-col justify-between items-end">
                        <div className="">
                            <Trash className="w-5"/>
                        </div>

                        <div className="flex flex-col items-end">
                            <span className="text-[#adaaaa] font-medium text-sm">Rp {variant.price} / unit</span>
                            <span className="text-[#99ff33] font-bold text-3xl">Rp {total_price}</span>
                        </div>
                    </div>
                </div>

                    <div className="flex flex-col bg-[#131313] rounded-2xl p-8 gap-8">
                        <span className="flex text-sm gap-3 items-center font-semibold tracking-wide text-[#adaaaa]">
                            <Wallet className="text-[#99ff33]"/> METODE PEMBAYARAN
                        </span>
                        <div className="flex w-full justify-between gap-4 max-md:flex-col">
                            {paymentOptions.map((payment) => (
                                <div className="flex flex-col justify-center w-full items-center bg-[#262626] rounded-xl py-6 gap-3">
                                    {payment.icon}
                                    <span className="font-semibold text-lg">{payment.label}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                <div className="flex flex-col gap-5 flex-2 bg-[#222] rounded-2xl p-8 h-fit max-lg:mb-10">
                    <span className="text-2xl font-bold">Ringkasan Pesanan</span>
                    <span className="flex justify-between w-full text-[#adaaaa]">
                        <span>Subtotal</span>
                        Rp {total_price}
                    </span>
                    <span className="flex justify-between w-full text-[#adaaaa]">
                        <span>Biaya Layanan</span>
                        Rp {service_fee}
                    </span>
                    <div className="h-0.5 w-full bg-white/5"></div>
                    <span className="flex justify-between w-full items-center">
                        <span className="font-semibold text-xl">Total Pembayaran</span>
                        <span className="font-semibold text-3xl text-[#99ff33]">Rp {total_price + service_fee}</span>
                    </span>
                    <button className="w-full flex py-4 bg-[#99ff33] rounded-[999px] border border-[#99ff33] items-center justify-center font-medium text-[#222] transition-all duration-200 cursor-pointer hover:bg-transparent hover:text-[#99ff33]">Bayar Sekarang</button>
                </div>
            </div>
        </div>
        
    )
}