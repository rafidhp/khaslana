import { Head, usePage } from "@inertiajs/react";
import OrderIndex from "@/components/khaslana/order/order-index";
import UnusedNavLayout from "@/layouts/unused-nav-layout";
import { catalog } from "@/routes";
import { show } from "@/routes/catalog";
import type { Order } from "@/types/order";

interface IndexProps {
    order: Order;
}

export default function Order({
    order,
}: IndexProps) {
    const { url } = usePage();
    const searchParams = new URLSearchParams(url.split('?')[1]);
    const productId = searchParams.get('product_id');
    const backUrl = productId ? show(productId).url : catalog().url;

    return (
        <UnusedNavLayout backHref={backUrl}>
            <Head title='Order Produk'>
                <link rel="preconnect" href="https://fonts.bunny.net" />
                <link
                    href="https://fonts.bunny.net/css?family=instrument-sans:400,500,600"
                    rel="stylesheet"
                />
            </Head>
            <OrderIndex order={order} />
        </UnusedNavLayout>
    )
}