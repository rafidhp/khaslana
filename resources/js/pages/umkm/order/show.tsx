import { Head } from '@inertiajs/react';

import AppLayout from '@/layouts/app-layout';
import type { Order } from '@/types/order';
import ShowDashoardOrder from '@/components/khaslana/dashboard/order/show-index';
import { BreadcrumbItem } from '@/types';
import { order } from '@/routes/dashboard';

interface ShowProps {
    order: Order;
}

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Detail Order',
        href: order().url,
    },
];

export default function ShowOrder({
    order,
}: ShowProps) {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title='Show Order'>
                <link rel="preconnect" href="https://fonts.bunny.net" />
                <link
                    href="https://fonts.bunny.net/css?family=instrument-sans:400,500,600"
                    rel="stylesheet"
                />
            </Head>
            <ShowDashoardOrder order={order} />
        </AppLayout>
    );
}
