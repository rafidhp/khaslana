import { Transition } from "@headlessui/react";
import { Head, Link, usePage, useForm } from "@inertiajs/react";
import React, { useEffect } from "react";
import ProfileController from "@/actions/App/Http/Controllers/Settings/ProfileController";
import DefaultProfile from "@/assets/icons/default-profile.png";
import InputError from "@/components/input-error";
import UserLocation from "@/components/khaslana/profile/user-location";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/hooks/use-auth";
import UnusedNavLayout from "@/layouts/unused-nav-layout";
import { showSuccessToast } from "@/lib/toast";
import { home } from "@/routes";
import { send } from "@/routes/verification";

interface ProfileFormData {
    name: string;
    username: string;
    email: string;
    latitude: number | null;
    longitude: number | null;
    province_id: string;
    city_id: string;
    district_id: string;
    village_id: string;
    address: string;
    profile_photo: File | null;
}

interface ProfileProps {
    mustVerifyEmail: boolean;
    status?: string;
    location: {
        latitude: number | null;
        longitude: number | null;
        province_id: string;
        city_id: string;
        district_id: string;
        village_id: string;
        address: string;
    };
    provinces: {
        code: string;
        name: string;
    }[];
}

export default function Profile({
    mustVerifyEmail,
    status,
    location,
    provinces,
}: ProfileProps) {
    const { user } = useAuth();
    const [preview, setPreview] = React.useState<string | null>(
        user.profile_photo ?? null
    );
    const { props } = usePage<{
        flash: {
            success?: string;
            error?: string;
        };
    }>();
    const form = useForm<ProfileFormData>({
        name: user.name,
        username: user.username,
        email: user.email,

        latitude: location.latitude,
        longitude: location.longitude,

        province_id: location.province_id,
        city_id: location.city_id,
        district_id: location.district_id,
        village_id: location.village_id,

        address: location.address,
        profile_photo: null,
    });

    useEffect(() => {
        if (props.flash?.success) {
            showSuccessToast(
                "Berhasil",
                props.flash?.success
            );
        }
    }, [props]);

    return (
        <UnusedNavLayout backHref={home().url}>
            <Head title="Profil Saya" />

            <div className="w-full mb-6">
                {/* heading */}
                <div className="flex flex-col gap-2">
                    <h1 className="text-4xl font-bold">Profil Saya</h1>
                    <p className="text-base text-muted-foreground">Kelola informasi akun Anda</p>
                </div>
                <form
                    onSubmit={(e) => {
                        e.preventDefault();

                        form.patch(
                            ProfileController.update.url(),
                            {
                                preserveScroll: true,
                                forceFormData: true,
                            }
                        );
                    }}
                >
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mt-4">
                        {/* left section */}
                        <div className="col-span-1 p-4">
                            <img
                                src={preview ?? DefaultProfile}
                                alt={form.data.name}
                                className="
                                    w-64 md:w-full aspect-square
                                    rounded-full mx-auto
                                    border-4 border-[#99FF33]
                                    object-cover
                                    shadow-md
                                "
                            />
                            <div className="flex-1 mt-6">
                                <Input
                                    id="profile_photo"
                                    type="file"
                                    name="profile_photo"
                                    accept="image/*"
                                    className="
                                        cursor-pointer
                                        border-white/10
                                        bg-[#272431]
                                        text-white
                                        file:text-white
                                    "
                                    onChange={(e) => {
                                        const file = e.target.files?.[0];
                                        if (file) {
                                            form.setData('profile_photo', file);
                                            setPreview(URL.createObjectURL(file));
                                        }
                                    }}
                                />
                                <p className="mt-2 text-xs md:text-sm text-white/50">
                                    Format JPG, JPEG, PNG
                                    maksimal 2MB
                                </p>
                            </div>
                            <InputError
                                className="mt-2"
                                message={form.errors.profile_photo}
                            />
                        </div>

                        {/* right section */}
                        <div className="col-span-3 space-y-4 p-4">
                            <h2 className="text-base md:text-xl font-semibold text-[#99FF33]">Data diri</h2>
                            <div className="flex flex-col">
                                <Label htmlFor="name" className="text-sm md:text-base">Nama Lengkap</Label>
                                <Input
                                    id="name"
                                    name="name"
                                    defaultValue={form.data.name}
                                    required
                                    autoComplete="name"
                                    placeholder="Masukkan nama lengkap"
                                    className="mt-2 border-gray-500/30 focus-visible:border-[#99FF33] focus-visible:ring-0 transition-all duration-200"
                                />
                                <InputError
                                    className="mt-2"
                                    message={form.errors.name}
                                />
                            </div>
                            <div className="flex flex-col">
                                <Label htmlFor="username" className="text-sm md:text-base">Username</Label>
                                <Input
                                    id="username"
                                    name="username"
                                    defaultValue={user.username}
                                    required
                                    autoComplete="username"
                                    placeholder="Masukkan username Anda"
                                    className="mt-2 border-gray-500/30 focus-visible:border-[#99FF33] focus-visible:ring-0 transition-all duration-200"
                                />
                                <InputError
                                    className="mt-2"
                                    message={form.errors.username}
                                />
                            </div>
                            <div className="flex flex-col">
                                <Label htmlFor="email" className="text-sm md:text-base">Alamat Email</Label>
                                <Input
                                    id="email"
                                    name="email"
                                    defaultValue={form.data.email}
                                    required
                                    autoComplete="email"
                                    placeholder="Masukkan email Anda"
                                    className="mt-2 border-gray-500/30 focus-visible:border-[#99FF33] focus-visible:ring-0 transition-all duration-200"
                                />
                                <InputError
                                    className="mt-2"
                                    message={form.errors.email}
                                />
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
                            </div>
                            <h2 className="text-base md:text-xl font-semibold text-[#99FF33]">Data Lokasi</h2>
                            <UserLocation
                                form={form}
                                provinces={provinces}
                            />
                            <div className="flex items-center gap-2">
                                <Button
                                    type="submit"
                                    disabled={form.processing}
                                    className="
                                        mt-2
                                        bg-[#99FF33]
                                        border border-[#99FF33]
                                        hover:bg-[#1E1B26]
                                        hover:text-[#99FF33]
                                        transition-colors duration-200
                                        hover:cursor-pointer
                                    "
                                >
                                    {form.processing ? 'Menyimpan' : 'Simpan Perubahan'}
                                </Button>
                                <Transition
                                    show={form.recentlySuccessful}
                                    enter="transition ease-in-out"
                                    enterFrom="opacity-0"
                                    leave="transition ease-in-out"
                                    leaveTo="opacity-0"
                                >
                                    <p
                                        className="
                                            text-sm
                                            text-[#99FF33]/60
                                            mt-2
                                        "
                                    >
                                        Berhasil disimpan
                                    </p>
                                </Transition>
                            </div>
                        </div>
                    </div>
                </form>
            </div>
        </UnusedNavLayout>
    );
}