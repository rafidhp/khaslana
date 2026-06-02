import { Head, Link } from '@inertiajs/react';
import CtaCard from '@/components/khaslana/dashboard/cta-card';
import ProductIndex from '@/components/khaslana/product/product-index';
import { useAuth } from '@/hooks/use-auth';
import AppLayout from '@/layouts/app-layout';
import { product } from '@/routes';
import { create } from '@/routes/product';
import type { BreadcrumbItem } from '@/types';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Product',
        href: product().url,
    },
];

export default function Product() {
    const { user } = useAuth();

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
                    <ProductIndex />
                </>
            )}
        </AppLayout>
    )
}