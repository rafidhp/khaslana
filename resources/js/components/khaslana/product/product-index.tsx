import { Link, router } from '@inertiajs/react';
import { Eye, Pencil, Trash2, PackageOpen, ChevronLeft, ChevronRight } from 'lucide-react';

import DeleteDialog from '@/components/khaslana/product/delete-dialog';
import { create, destroy, edit, show } from '@/routes/product';
import type { PaginatedProducts } from "@/types/paginated-product";

interface ProductIndexProps {
    products: PaginatedProducts;
}

export default function ProductIndex({
    products,
}: ProductIndexProps) {
    const truncateText = (text: string, limit: number = 80) => {
        if (text.length <= limit) {
            return text;
        }
        return text.substring(0, limit) + '...';
    };

    const handleDelete = (productId: number) => {
        router.delete(
            destroy(productId).url,
            {preserveScroll: true}
        );
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
                                Gambar
                            </th>
                            <th className="p-4 text-left">
                                Nama Produk
                            </th>
                            <th className="p-4 text-left">
                                Deskripsi
                            </th>
                            <th className="p-4 text-left">
                                Kategori
                            </th>
                            <th className="p-4 text-lef">
                                Stok
                            </th>
                            <th className="p-4 text-center">
                                Aksi
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        {products.data.length === 0 ? (
                            <tr>
                                <td
                                    colSpan={7}
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
                            products.data.map((product, index) => (
                                <tr
                                    key={product.id}
                                    className="border-b border-white/5 hover:bg-white/5 transition"
                                >
                                    <td className="p-4 text-sm md:text-base">
                                        {(products.from ?? 1) + index}
                                    </td>
                                    <td className="p-4">
                                        <img
                                            src={
                                                product.product_images?.[0]?.image
                                                    ? `/storage/${product.product_images[0].image}`
                                                    : '/images/placeholder.png'
                                            }
                                            alt={product.name}
                                            className="
                                                w-16 h-16
                                                rounded-lg object-cover
                                                border border-[#99FF33]/30
                                            "
                                        />
                                    </td>
                                    <td className="p-4 font-medium text-sm md:text-base">
                                        {product.name}
                                    </td>
                                    <td className="p-4 text-xs md:text-sm text-muted-foreground max-w-xs">
                                        {truncateText(product.description)}
                                    </td>
                                    <td className="p-4 text-sm md:text-base">
                                        {product.category?.name}
                                    </td>
                                    <td className="p-4 text-sm md:text-base item-center justify-center flex translate-y-5">
                                        {product.product_variants?.[0].stock}
                                    </td>
                                    <td className="p-4">
                                        <div className="flex justify-center gap-2">
                                            <Link
                                                href={show(product.id).url}
                                                className="p-2 rounded-md group hover:bg-[#99FF33]/20 transition-colors duration-200"
                                            >
                                                <Eye size={16} className='group-hover:text-[#99FF33]' />
                                            </Link>
                                            <Link
                                                href={edit(product.id).url}
                                                className="p-2 rounded-md group hover:bg-[#99FF33]/20 transition-colors duration-200"
                                            >
                                                <Pencil size={16} className='group-hover:text-[#99FF33]' />
                                            </Link>
                                            <DeleteDialog
                                                productName={product.name}
                                                onDelete={() => handleDelete(product.id)}
                                            >
                                                <button
                                                    disabled={product.sold_count != null}
                                                    type="button"
                                                    className="p-2 rounded-md hover:bg-red-500/20 disabled:hover:bg-transparent cursor-pointer disabled:cursor-not-allowed transition-colors duration-200"
                                                >
                                                    {product.sold_count != null ? (
                                                        <Trash2 size={16} className="text-red-500/20" />
                                                    ) : (
                                                        <Trash2 size={16} className="text-red-500" />
                                                    )}
                                                </button>
                                            </DeleteDialog>
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
                {products.links
                    .filter((link) => {
                        if (products.last_page === 1) {
                            return !link.label.includes("Previous") && !link.label.includes("Next");
                        }

                        if (
                            products.current_page === 1 &&
                            link.label.includes("Previous")
                        ) {
                            return false;
                        }

                        if (
                            products.current_page === products.last_page &&
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
                                    flex justify-center items-center gap-1
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