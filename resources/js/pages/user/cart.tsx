import { Head } from "@inertiajs/react";
import CartIndex from "@/components/khaslana/cart/cart-index";
import UserLayout from "@/layouts/user-layout";

export default function Cart() {
    return (
        <UserLayout>
            <Head title="Cart">
                <link rel="preconnect" href="https://fonts.bunny.net" />
                <link
                    href="https://fonts.bunny.net/css?family=instrument-sans:400,500,600"
                    rel="stylesheet"
                />
            </Head>
            <CartIndex />
        </UserLayout>
    )
}