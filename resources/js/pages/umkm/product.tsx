import { Head, Link, usePage } from '@inertiajs/react';
import { useEffect, useRef } from 'react';
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

interface ProductProps {
    products: PaginatedProducts;
}

export default function Product({
    products,
}: ProductProps) {
    const { user } = useAuth();
    const { props } = usePage<{
        flash: {
            success?: string;
            error?: string;
        };
    }>();
    const hasShownToast = useRef(false);

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

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title='Products' />
            {!user.is_umkm ? (
                <CtaCard />   
            ) : (
                <>
                    {/* header */}
                    <div className="flex flex-col align-items-center gap-2">
                        <h1 className="text-3xl font-bold">
                            Produk
                        </h1>
                        <div className='flex justify-between items-start'>
                            <p className="text-muted-foreground">
                                Kelola produk produk Anda
                            </p>
                            <Link
                                href={create()}
                                className="
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
                    </div>
        
                    {/* content */}
                    <ProductIndex products={products} />
                </>
            )}
        </AppLayout>
    )
}