import { Head } from '@inertiajs/react';
import CommunityIndex from '@/components/khaslana/community/community-index';
import UserLayout from '@/layouts/user-layout';

export default function Community() {
    return (
        <UserLayout>
            <Head>
                <link rel="preconnect" href="https://fonts.bunny.net" />
                <link
                    href="https://fonts.bunny.net/css?family=instrument-sans:400,500,600"
                    rel="stylesheet"
                />
            </Head>
            <CommunityIndex />
        </UserLayout>
    );
}
