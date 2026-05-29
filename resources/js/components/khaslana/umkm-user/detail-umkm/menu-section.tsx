import { Link } from "@inertiajs/react"
import { ChevronRight, Plus } from "lucide-react"
import type { Product } from "@/types/product";

interface MenuSectionProps {
    products: Product[];
}

export default function MenuSection({
    products,
}: MenuSectionProps) {
    return (
        <div className="flex flex-col items-center w-full mt-18">
            <div className="flex flex-col w-full gap-2">
                <h2 className="text-xl md:text-2xl font-bold">Menu Unggulan</h2>
                <div className="flex justify-between items-center w-full">
                    <h3 className="text-muted-foreground text-sm md:text-base">Koleksi produk produk unggulan dari toko kami.</h3>
                    <Link
                        href=""
                        className="flex gap-1 text-sm md:text-base text-[#99FF33] group transition-all duration-300"
                    >
                        Lihat semua menu
                        <ChevronRight className="w-5 h-5 transition-transform duration-300 group-hover:translate-x-2 font-semibold" />
                    </Link>
                </div>
            </div>
            {products.length === 0 ? (
                <div className="w-full mt-8 flex justify-center">
                    <p className="text-sm md:text-base text-white/80 text-center">
                        Toko ini belum memiliki produk.
                    </p>
                </div>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mt-8">
                    {products.map((product) => (
                        <div
                            key={product.id}
                            className="
                                bg-card
                                rounded-3xl
                                overflow-hidden
                                border
                                transition-all
                                hover:-translate-y-1
                            "
                        >
                            <div className="relative">
                                <img
                                    src={`/storage/${product.product_images?.[0]?.image}`}
                                    alt={product.name}
                                    className="
                                        w-full
                                        h-52
                                        object-cover
                                    "
                                />

                                {product.promo && (
                                    <span
                                        className="
                                            absolute
                                            top-3
                                            left-3
                                            text-xs
                                            px-2
                                            py-1
                                            rounded-full
                                            bg-red-100
                                            text-red-500
                                            font-medium
                                        "
                                    >
                                        {product.promo.discount_percent}% OFF
                                    </span>
                                )}
                            </div>

                            <div className="p-4 flex flex-col gap-2">
                                <h4 className="font-semibold">
                                    {product.name}
                                </h4>

                                <p
                                    className="
                                        text-sm
                                        text-muted-foreground
                                        line-clamp-2
                                    "
                                >
                                    {product.description}
                                </p>

                                <div className="flex justify-between items-center mt-2">
                                    <span
                                        className="
                                            text-[#99FF33]
                                            font-bold
                                        "
                                    >
                                        Rp{" "}
                                        {Number(
                                            product.product_variants?.[0]
                                                ?.price ?? 0
                                        ).toLocaleString("id-ID")}
                                    </span>

                                    <button
                                        className="
                                            w-10
                                            h-10
                                            rounded-full
                                            bg-[#99FF33]/20
                                            flex
                                            items-center
                                            justify-center
                                        "
                                    >
                                        <Plus size={18} />
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    )
}