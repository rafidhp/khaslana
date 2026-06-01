import { Head } from '@inertiajs/react';
import UmkmIndex from '@/components/khaslana/umkm-user/umkm-index';
import UserLayout from '@/layouts/user-layout';
import type { Umkm } from '@/types/umkm';

interface UmkmPageProps {
    umkms: Umkm[];
}

export default function Umkm({
    umkms,
}: UmkmPageProps) {
    return (
        <UserLayout>
            <Head title='Umkm'>
                <link rel="preconnect" href="https://fonts.bunny.net" />
                <link
                    href="https://fonts.bunny.net/css?family=instrument-sans:400,500,600"
                    rel="stylesheet"
                />
            </Head>
            <UmkmIndex umkms={umkms} />
        </UserLayout>
    );
}
