import { Transition } from '@headlessui/react';
import { Form, Head, Link } from '@inertiajs/react';
import React from 'react';

import ProfileController from '@/actions/App/Http/Controllers/Settings/ProfileController';
import DefaultProfile from '@/assets/icons/default-profile.png';
// import DeleteUser from '@/components/delete-user';
import Heading from '@/components/heading';
import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAuth } from '@/hooks/use-auth';
import AppLayout from '@/layouts/app-layout';
import SettingsLayout from '@/layouts/settings/layout';
import { edit } from '@/routes/profile';
import { send } from '@/routes/verification';
import type { BreadcrumbItem } from '@/types';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Pengaturan profil',
        href: edit().url,
    },
];

export default function Profile({
    mustVerifyEmail,
    status,
}: {
    mustVerifyEmail: boolean;
    status?: string;
}) {
    const { user } = useAuth();
    const [preview, setPreview] = React.useState<string | null>(
        user.profile_photo ?? null
    );

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Profile settings" />

            <h1 className="sr-only">Profile Settings</h1>

            <SettingsLayout>
                <div className="space-y-6">
                    <Heading
                        variant="default"
                        title="Informasi Profil"
                        description="Perbarui data diri Anda"
                    />

                    <Form
                        {...ProfileController.update.form()}
                        options={{
                            preserveScroll: true,
                        }}
                        className="space-y-6"
                    >
                        {({ processing, recentlySuccessful, errors }) => (
                            <>
                                <div className="grid gap-4">
                                    <Label htmlFor="profile_photo">
                                        Foto Profil
                                    </Label>

                                    <div className="flex items-center gap-5">
                                        <img
                                            src={preview ?? DefaultProfile}
                                            alt={user.name}
                                            className="
                                                w-24 h-24
                                                rounded-full
                                                object-cover
                                                border-2 border-[#99FF33]/80
                                                shadow-sm
                                            "
                                        />

                                        <div className="flex flex-col gap-2">
                                            <Input
                                                id="profile_photo"
                                                type="file"
                                                name="profile_photo"
                                                accept="image/*"
                                                onChange={(e) => {
                                                    const file = e.target.files?.[0];
                                                    if (file) {
                                                        setPreview(URL.createObjectURL(file));
                                                    }
                                                }}
                                                className="cursor-pointer"
                                            />

                                            <p className="text-sm text-muted-foreground">
                                                JPG, PNG sampai dengan 2MB
                                            </p>
                                        </div>
                                    </div>

                                    <InputError
                                        className="mt-2"
                                        message={errors.profile_photo}
                                    />
                                </div>
                                <div className="grid gap-2">
                                    <Label htmlFor="name">Nama</Label>

                                    <Input
                                        id="name"
                                        className="mt-1 border-gray-500/30 focus-visible:border-[#99FF33] focus-visible:ring-0 transition-all duration-200"
                                        defaultValue={user.name}
                                        name="name"
                                        required
                                        autoComplete="name"
                                        placeholder="Full name"
                                    />

                                    <InputError
                                        className="mt-2"
                                        message={errors.name}
                                    />
                                </div>

                                <div className="grid gap-2">
                                    <Label htmlFor="username">Username</Label>

                                    <Input
                                        id="username"
                                        className="mt-1 border-gray-500/30 focus-visible:border-[#99FF33] focus-visible:ring-0 transition-all duration-200"
                                        defaultValue={user.username}
                                        name="username"
                                        required
                                        autoComplete="username"
                                        placeholder="Your username"
                                    />

                                    <InputError
                                        className="mt-2"
                                        message={errors.username}
                                    />
                                </div>

                                <div className="grid gap-2">
                                    <Label htmlFor="email">Alamat Email</Label>

                                    <Input
                                        id="email"
                                        type="email"
                                        className="mt-1 border-gray-500/30 focus-visible:border-[#99FF33] focus-visible:ring-0 transition-all duration-200"
                                        defaultValue={user.email}
                                        name="email"
                                        required
                                        autoComplete="email"
                                        placeholder="Email address"
                                    />

                                    <InputError
                                        className="mt-2"
                                        message={errors.email}
                                    />
                                </div>

                                {mustVerifyEmail &&
                                    user.email_verified_at === null && (
                                        <div>
                                            <p className="-mt-4 text-sm text-muted-foreground">
                                                Your email address is
                                                unverified.{' '}
                                                <Link
                                                    href={send()}
                                                    as="button"
                                                    className="text-foreground underline decoration-neutral-300 underline-offset-4 transition-colors duration-300 ease-out hover:decoration-current! dark:decoration-neutral-500"
                                                >
                                                    Click here to resend the
                                                    verification email.
                                                </Link>
                                            </p>

                                            {status ===
                                                'verification-link-sent' && (
                                                <div className="mt-2 text-sm font-medium text-green-600">
                                                    A new verification link has
                                                    been sent to your email
                                                    address.
                                                </div>
                                            )}
                                        </div>
                                    )}

                                <div className="flex items-center gap-4">
                                    <Button
                                        disabled={processing}
                                        data-test="update-profile-button"
                                        className='bg-[#99FF33] border border-[#99FF33] hover:bg-[#1E1B26] hover:text-[#99FF33] transition-colors duration-200 hover:cursor-pointer'
                                    >
                                        Simpan
                                    </Button>

                                    <Transition
                                        show={recentlySuccessful}
                                        enter="transition ease-in-out"
                                        enterFrom="opacity-0"
                                        leave="transition ease-in-out"
                                        leaveTo="opacity-0"
                                    >
                                        <p className="text-sm text-[#99FF33]/60">
                                            Tersimpan
                                        </p>
                                    </Transition>
                                </div>
                            </>
                        )}
                    </Form>
                </div>

                {/* <DeleteUser /> */}
            </SettingsLayout>
        </AppLayout>
    );
}
