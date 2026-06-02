import { Head, usePage } from "@inertiajs/react";
import OrderIndex from "@/components/khaslana/order/order-index";
import UnusedNavLayout from "@/layouts/unused-nav-layout";

export default function Order() {
    const { url } = usePage();
    const searchParams = new URLSearchParams(url.split('?')[1]);
    const productId = searchParams.get('product_id');

    const backUrl = productId ? `/catalog/${productId}` : "catalog";

    console.log(backUrl)

    return (
        <UnusedNavLayout backHref={backUrl}>
            <Head title='Order Produk'>
                <link rel="preconnect" href="https://fonts.bunny.net" />
                <link
                    href="https://fonts.bunny.net/css?family=instrument-sans:400,500,600"
                    rel="stylesheet"
                />
            </Head>
            <OrderIndex />
        </UnusedNavLayout>
    )
}