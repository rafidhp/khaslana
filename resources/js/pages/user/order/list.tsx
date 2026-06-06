import { Head } from '@inertiajs/react';
import ListIndex from '@/components/khaslana/order/list/list-index';
import UnusedNavLayout from '@/layouts/unused-nav-layout';
import type { Order } from '@/types/order';

interface ShowProps {
    orders: Order[];
}

export default function About({
    orders,
}: ShowProps) {
    return (
        <UnusedNavLayout backHref='/'>
            <Head title='History Order'>
                <link rel="preconnect" href="https://fonts.bunny.net" />
                <link
                    href="https://fonts.bunny.net/css?family=instrument-sans:400,500,600"
                    rel="stylesheet"
                />
            </Head>
            <ListIndex orders={orders} />
        </UnusedNavLayout>
    );
}
