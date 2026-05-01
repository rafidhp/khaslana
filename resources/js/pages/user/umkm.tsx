import { Head } from '@inertiajs/react';
import UmkmIndex from '@/components/khaslana/umkm-user/umkm-index';
import UserLayout from '@/layouts/user-layout';

export default function Umkm() {
    return (
        <UserLayout>
            <Head>
                <link rel="preconnect" href="https://fonts.bunny.net" />
                <link
                    href="https://fonts.bunny.net/css?family=instrument-sans:400,500,600"
                    rel="stylesheet"
                />
            </Head>
            <UmkmIndex />
        </UserLayout>
    );
}
