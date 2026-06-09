import { Head } from '@inertiajs/react';

import WelcomeIndex from '@/components/khaslana/welcome/welcome-index';
import UserLayout from '@/layouts/user-layout';
import type { Product } from '@/types/product';

interface WelcomeProps {
    products: Product[];
}

export default function Welcome({
    products,
}: WelcomeProps) {
    return (
        <UserLayout>
            <Head>
                <link rel="preconnect" href="https://fonts.bunny.net" />
                <link
                    href="https://fonts.bunny.net/css?family=instrument-sans:400,500,600"
                    rel="stylesheet"
                />
            </Head>
            <WelcomeIndex products={products} />
        </UserLayout>
    );
}
