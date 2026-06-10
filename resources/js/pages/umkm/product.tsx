import { Head, Link, usePage } from '@inertiajs/react';
import { useEffect, useRef, useState, useMemo } from 'react';

import { Input } from '@/components/ui/input';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import CtaCard from '@/components/khaslana/dashboard/cta-card';
import ProductIndex from '@/components/khaslana/product/product-index';
import { useAuth } from '@/hooks/use-auth';
import AppLayout from '@/layouts/app-layout';
import { showSuccessToast, showErrorToast } from '@/lib/toast';
import { product } from '@/routes';
import { create } from '@/routes/product';
import type { BreadcrumbItem } from '@/types';
import type { PaginatedProducts } from '@/types/paginated-product';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Product',
        href: product().url,
    },
];

interface Category {
    id: number;
    name: string;
}

interface ProductProps {
    products: PaginatedProducts;
    categories: Category[];
}

export default function Product({
    products,
    categories,
}: ProductProps) {
    const { user } = useAuth();
    const { props } = usePage<{
        flash: {
            success?: string;
            error?: string;
        };
    }>();
    const hasShownToast = useRef(false);
    const [search, setSearch] = useState('');
    const [selectedCategory, setSelectedCategory] = useState<string>('all');

    useEffect(() => {
        if (hasShownToast.current) return;

        if (props.flash?.success) {
            hasShownToast.current = true;

            showSuccessToast(
                'Berhasil',
                props.flash.success,
            );
        }
        if (props.flash?.error) {
            hasShownToast.current = true;

            showErrorToast(
                'Gagal',
                props.flash.error,
            );
        }
    }, [props.flash]);

    const filteredProducts = useMemo(() => {
        return {
            ...products,
            data: products.data.filter((product) => {
                const matchSearch =
                    product.name
                        .toLowerCase()
                        .includes(search.toLowerCase()) ||
                    product.category?.name
                        ?.toLowerCase()
                        .includes(search.toLowerCase()) ||
                    product.description
                        ?.toLowerCase()
                        .includes(search.toLowerCase());

                const matchCategory =
                    selectedCategory === 'all' ||
                    product.category_id === Number(selectedCategory);

                return matchSearch && matchCategory;
            }),
        };
    }, [products, search, selectedCategory]);

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title='Products' />
            {!user.is_umkm ? (
                <CtaCard />   
            ) : (
                <>
                    {/* header */}
                    <div className="flex justify-between items-end gap-2">
                        <div className='flex flex-col items-start'>
                            <h1 className="text-3xl font-bold">
                                Produk
                            </h1>
                            <p className="text-muted-foreground">
                                Kelola produk produk Anda
                            </p>
                        </div>
                        <Link
                            href={create()}
                            className="
                                flex
                                bg-[#99FF33]
                                border border-[#99FF33]
                                py-2 px-4 rounded-md
                                text-[#1E1B26] text-sm font-medium
                                hover:bg-[#1E1B26]
                                hover:text-[#99FF33]
                                transition-colors duration-200
                                cursor-pointer
                            "
                        >
                            Tambah Produk
                        </Link>
                    </div>

                    {/* search */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mt-6">
                        <div className='md:col-span-2'>
                            <Input
                                type="text"
                                placeholder="Cari produk berdasarkan nama, deskripsi atau kategori..."
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                className="
                                    w-full
                                    border-gray-500/30
                                    focus-visible:border-[#99FF33] focus-visible:ring-0
                                    transition-all duration-200
                                    dark:bg-transparent
                                "
                            />
                        </div>
                        <div className='md:col-span-1'>
                            <Select
                                value={selectedCategory}
                                onValueChange={setSelectedCategory}
                            >
                                <SelectTrigger
                                    className="
                                        border-gray-500/30
                                        bg-transparent
                                        transition-all duration-200
                                        focus:ring-0
                                        focus:border-[#99FF33]
                                        data-[state=open]:border-[#99FF33]
                                        hover:border-[#99FF33]
                                    "
                                >
                                    <SelectValue placeholder="Semua Kategori" />
                                </SelectTrigger>

                                <SelectContent
                                    className="
                                        bg-[#1E1B26]
                                        border-white/10
                                    "
                                >
                                    <SelectItem value="all">
                                        Semua Kategori
                                    </SelectItem>

                                    {categories.map((category) => (
                                        <SelectItem
                                            key={category.id}
                                            value={category.id.toString()}
                                        >
                                            {category.name}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
        
                    {/* content */}
                    <ProductIndex products={filteredProducts} />
                </>
            )}
        </AppLayout>
    )
}