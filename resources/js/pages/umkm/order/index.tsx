import { Head } from '@inertiajs/react';

import CtaCard from '@/components/khaslana/dashboard/cta-card';
import OrderIndex from '@/components/khaslana/dashboard/order/order-index';
import { useAuth } from '@/hooks/use-auth';
import AppLayout from '@/layouts/app-layout';
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

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title='Orders' />
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