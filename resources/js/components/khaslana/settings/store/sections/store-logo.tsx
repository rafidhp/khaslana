import { useForm } from '@inertiajs/react';
import React from 'react';
import DefaultLogo from '@/assets/icons/default-store-logo.png';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useAuth } from '@/hooks/use-auth';
import { showErrorToast } from '@/lib/toast';
import { storeLogo } from '@/routes/storeManagement';

export default function StoreLogo() {
    const { user } = useAuth();
    const [preview, setPreview] = React.useState<string | null>(
        user.logo ?? null
    );
    const form = useForm<{logo: File | null;}>({
        logo: null,
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        form.post(storeLogo().url, {
            forceFormData: true,

            onError: (errors) => {
                showErrorToast(
                    'Gagal',
                    errors.logo
                );
            },
        });
    };

    return (
        <div className="flex items-center gap-4 mb-6">
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
                    type="file"
                    accept="image/*"
                    onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (!file) return;

                        form.setData(
                            'logo',
                            file
                        );
                        setPreview(
                            URL.createObjectURL(file)
                        );
                    }}
                    className='cursor-pointer'
                />

                {form.errors.logo && (
                    <p className="text-sm text-red-500 ps-1">
                        {form.errors.logo}
                    </p>
                )}

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
                    {form.processing
                        ? 'Menyimpan...'
                        : 'Simpan Logo'
                    }
                </Button>
            </form>
        </div>
    );
}