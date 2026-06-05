import { Link } from '@inertiajs/react';
import type { PaginatedProducts } from '@/types/paginated-product';

interface PaginationSectionProps {
    products: PaginatedProducts;
}

export function PaginationSection({
    products,
}: PaginationSectionProps) {
    if (products.data.length === 0) {
        return null;
    }

    if (products.last_page <= 1) {
        return null;
    }

     return (
        <div className="flex justify-center items-center gap-2 pt-2.5 mb-12 flex-wrap">
            {products.prev_page_url && (
                <Link
                    href={products.prev_page_url}
                    preserveScroll
                    className="
                        flex items-center justify-center
                        w-9.5 h-9.5
                        rounded-full
                        bg-transparent
                        border border-white/5
                        text-[#989898]
                        text-xs
                        font-medium
                        hover:bg-white/10
                        transition-colors
                    "
                >
                    &lt;
                </Link>
            )}

            {products.links
                .filter(
                    (link) =>
                        link.label !== '&laquo; Previous' &&
                        link.label !== 'Next &raquo;'
                )
                .map((link, index) => (
                    <Link
                        key={index}
                        href={link.url ?? '#'}
                        preserveScroll
                        className={`
                            flex items-center justify-center
                            w-9.5 h-9.5
                            rounded-full
                            text-sm
                            font-medium
                            transition-colors
                            ${
                                link.active
                                    ? `
                                        bg-[#99FF33]
                                        border border-[#99FF33]
                                        text-[#1E1B26]
                                        font-bold
                                    `
                                    : `
                                        bg-transparent
                                        border border-white/5
                                        text-[#989898]
                                        hover:bg-white/10
                                    `
                            }
                        `}
                    >
                        {link.label}
                    </Link>
                )
            )}

            {products.next_page_url && (
                <Link
                    href={products.next_page_url}
                    preserveScroll
                    className="
                        flex items-center justify-center
                        w-9.5 h-9.5
                        rounded-full
                        bg-transparent
                        border border-white/5
                        text-[#989898]
                        text-xs
                        font-medium
                        hover:bg-white/10
                        transition-colors
                    "
                >
                    &gt;
                </Link>
            )}
        </div>
    );
}