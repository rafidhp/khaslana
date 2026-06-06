import { Head } from '@inertiajs/react';
import ShowIndex from '@/components/khaslana/order/show/show-index';
import UnusedNavLayout from '@/layouts/unused-nav-layout';
import type { Order } from '@/types/order';

interface ShowProps {
    order: Order;
}

export default function About({
    order,
}: ShowProps) {
    return (
        <UnusedNavLayout backHref='/order/list'>
            <Head title='Show Order'>
                <link rel="preconnect" href="https://fonts.bunny.net" />
                <link
                    href="https://fonts.bunny.net/css?family=instrument-sans:400,500,600"
                    rel="stylesheet"
                />
            </Head>
            <ShowIndex order={order} />
        </UnusedNavLayout>
    );
}
