import { Head } from "@inertiajs/react";
import { CartIndex } from "@/components/khaslana/cart/cart-index";
import UnusedNavLayout from "@/layouts/unused-nav-layout";
import { catalog } from "@/routes";
import type { Cart } from "@/types/cart";

interface CartProps {
    cart: Cart | null;
}

export default function CartPage({
    cart,
}: CartProps) {
    // Menentukan rute kembali (Back Button) diarahkan langsung ke halaman utama Katalog
    const backUrl = catalog().url;

    return (
        <UnusedNavLayout backHref={backUrl}>
            <Head title="Keranjang Belanja">
                <link rel="preconnect" href="https://fonts.bunny.net" />
                <link
                    href="https://fonts.bunny.net/css?family=instrument-sans:400,500,600"
                    rel="stylesheet"
                />
            </Head>
            <CartIndex cart={cart} />
        </UnusedNavLayout>
    );
}