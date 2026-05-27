import { Head } from '@inertiajs/react';
import { CreatePost } from '@/components/khaslana/community/create-post';
import UserLayout from '@/layouts/user-layout';

export default function Community() {
    return (
        <UserLayout>
            <Head title='Buat Postingan'>
                <link rel="preconnect" href="https://fonts.bunny.net" />
                <link
                    href="https://fonts.bunny.net/css?family=instrument-sans:400,500,600"
                    rel="stylesheet"
                />
            </Head>
            <CreatePost />
        </UserLayout>
    );
}
