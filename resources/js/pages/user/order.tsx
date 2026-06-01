import { Head } from "@inertiajs/react";
import OrderIndex from "@/components/khaslana/order/order-index";
import UserLayout from "@/layouts/user-layout";

export default function Order() {
    return (
        <UserLayout>
            <Head title="Order">
                <link rel="preconnect" href="https://fonts.bunny.net" />
                <link
                    href="https://fonts.bunny.net/css?family=instrument-sans:400,500,600"
                    rel="stylesheet"
                />
            </Head>
            <OrderIndex />
        </UserLayout>
    )
}