import { Head, Link } from '@inertiajs/react';
import { ChevronLeft } from 'lucide-react';
import CtaCard from '@/components/khaslana/dashboard/cta-card';
import CreateIndex from '@/components/khaslana/product/create/create-index';
import { useAuth } from '@/hooks/use-auth';
import AppLayout from '@/layouts/app-layout';
import { product } from '@/routes';
import { create } from '@/routes/product';
import type { BreadcrumbItem } from '@/types';
import type { Product } from '@/types/product';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Product',
        href: product().url,
    },
    {
        title: 'Create',
        href: create().url,
    },
];

interface CreateProductProps {
    products: Product[];
    categories: {
        id: number;
        name: string;
    }[];
}

export default function CreateProduct({
    categories,
}: CreateProductProps) {
    const { user } = useAuth();

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title='Products' />
            {!user.is_umkm ? (
                <CtaCard />   
            ) : (
                <>
                    {/* header */}
                    <div className="flex flex-col align-items-center gap-3">
                        <Link
                            href={product()}
                            className='flex items-center gap-1 group w-fit'
                        >
                            <ChevronLeft className='h-5 w-5 text-[#99FF33] group-hover:text-white transition-colors duration-200' />
                            <span className='text-base text-[#99FF33] group-hover:text-white transition-colors duration-200'>Kembali</span>
                        </Link>
                        <h1 className="text-3xl font-bold">
                            Tambah Produk
                        </h1>
                    </div>
        
                    {/* content */}
                    <CreateIndex categories={categories} />
                </>
            )}
        </AppLayout>
    )
}