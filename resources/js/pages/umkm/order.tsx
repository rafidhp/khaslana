import { Head, usePage } from '@inertiajs/react';
import { useEffect, useRef } from 'react';
import CtaCard from '@/components/khaslana/dashboard/cta-card';
import OrderIndex from '@/components/khaslana/dashboard/order/order-index';
import { useAuth } from '@/hooks/use-auth';
import AppLayout from '@/layouts/app-layout';
import { showSuccessToast, showErrorToast } from '@/lib/toast';
import { order } from '@/routes/dashboard';
import type { BreadcrumbItem } from '@/types';
import type { PaginatedOrders } from '@/types/paginated-order';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Order',
        href: order().url,
    },
];

interface OrderProps {
    orders: PaginatedOrders;
}

export default function Order({
    orders,
}: OrderProps) {
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
                            Order
                        </h1>
                        <div className='flex justify-between items-start'>
                            <p className="text-muted-foreground">
                                Kelola pesanan pelanggan Anda
                            </p>
                        </div>
                    </div>
        
                    {/* content */}
                    <OrderIndex orders={orders} />
                </>
            )}
        </AppLayout>
    )
}