import { useForm } from '@inertiajs/react';
import React, { useState } from 'react';

import DefaultLogo from '@/assets/icons/default-store-logo.png';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useAuth } from '@/hooks/use-auth';
import { showErrorToast } from '@/lib/toast';
import { storeLogo } from '@/routes/storeManagement';

export default function StoreLogo() {
    const { user } = useAuth();
    const [preview, setPreview] = useState<string | null>(
        user.logo ?? null
    );
    const form = useForm<{logo: File | null;}>({
        logo: null,
    });
    const [fileErrors, setFileErrors] = useState<string[]>([]);

    const validateLogo = (file: File) => {
        const errors: string[] = [];

        const allowedTypes = [
            'image/jpeg',
            'image/jpg',
            'image/png',
            'image/webp',
            'image/svg+xml',
        ];
        const maxSize = 1024 * 1024;

        if (!allowedTypes.includes(file.type)) {
            errors.push('Format file harus JPG, JPEG, PNG, WEBP, atau SVG');
        }

        if (file.size > maxSize) {
            errors.push('Ukuran file maksimal 1 MB');
        }
        return errors;
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        if (fileErrors.length > 0) {
            return;
        }

        if (!form.data.logo) {
            showErrorToast('Gagal', 'Silakan pilih logo terlebih dahulu');
            return;
        }

        form.post(storeLogo().url, {
            forceFormData: true,
            preserveState: true,
            preserveScroll: true,

            onError: (errors) => {
                showErrorToast('Gagal', errors.logo);
            },
        });
    };

    return (
        <div className="flex flex-col gap-4">
            <div>
                <h3 className="text-lg font-semibold">
                    Logo Toko
                </h3>
                <p className="text-sm text-muted-foreground">
                    Jika Anda memiliki logo toko Anda sendiri, ayo pasang logo tokonya sekarang!
                </p>
            </div>
            <div className='flex items-center gap-4'>
                <img
                    src={preview ?? DefaultLogo}
                    alt="Store Logo"
                    className="
                        w-24 h-24
                        rounded-full
                        object-cover
                        border-2 border-[#99FF33]/80
                    "
                />

                <form
                    onSubmit={handleSubmit}
                    className="space-y-2"
                >
                    <Input
                        id='logo'
                        type="file"
                        accept=".jpg,.jpeg,.png,.webp,.svg,image/*"
                        onChange={(e) => {
                            const file = e.target.files?.[0];

                            if (!file) {
                                setFileErrors([]);
                                return;
                            }

                            const errors = validateLogo(file);

                            if (errors.length > 0) {
                                setFileErrors(errors);
                                form.setData('logo', null);

                                e.target.value = '';
                                return;
                            }

                            setFileErrors([]);

                            form.setData('logo', file);
                            setPreview(URL.createObjectURL(file));
                        }}
                        className='
                            cursor-pointer
                            border-white/10
                            bg-[#272431]
                            text-white
                            file:text-white
                        '
                        required
                    />
                    {fileErrors.length === 1 && (
                        <p className="text-sm text-red-500 ps-1">
                            {fileErrors[0]}
                        </p>
                    )}

                    {fileErrors.length > 1 && (
                        <ul className="text-sm text-red-500 ps-5 list-disc space-y-1">
                            {fileErrors.map((error) => (
                                <li key={error}>
                                    {error}
                                </li>
                            ))}
                        </ul>
                    )}

                    {form.errors.logo && (
                        <p className="text-sm text-red-500 ps-1">
                            {form.errors.logo}
                        </p>
                    )}

                    <Button
                        type="submit"
                        disabled={form.processing}
                        className="
                            mt-2 w-full
                            bg-[#99FF33]
                            border border-[#99FF33]
                            hover:bg-[#1E1B26]
                            hover:text-[#99FF33]
                            transition-colors duration-200
                            hover:cursor-pointer
                        "
                    >
                        {form.processing
                            ? 'Menyimpan...'
                            : 'Simpan Logo'
                        }
                    </Button>
                </form>
            </div>
        </div>
    );
}