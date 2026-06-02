import { Head, router } from '@inertiajs/react';
import { useState } from 'react';
import CtaCard from '@/components/khaslana/dashboard/cta-card';
import { useAuth } from '@/hooks/use-auth';
import AppLayout from '@/layouts/app-layout';
import { dashboard } from '@/routes';
import type { BreadcrumbItem } from '@/types';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
        href: dashboard().url,
    },
];

type Props = {
    status: 'BUKA' | 'TUTUP';
};

export default function Dashboard({
    status,
}: Props) {

    const { user } = useAuth();

    const [storeStatus, setStoreStatus] = useState(status);

    const toggleStore = () => {
        const newStatus =
            storeStatus === 'BUKA'
                ? 'TUTUP'
                : 'BUKA';

        router.post('/dashboard/store-status', {
            status: newStatus,
        });

        setStoreStatus(newStatus);
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Dashboard" />
            {!user.is_umkm ? (
                <CtaCard />
            ) : (
                <>
                    <div>
                        <div className="rounded-xl border border-sidebar-border/70 p-6 dark:border-sidebar-border">
                            <h2 className="text-xl font-bold">
                                Status Toko
                            </h2>

                            <p className="mt-2 text-sm text-muted-foreground">Atur status operasional toko Anda</p>

                            <div className="mt-6 flex items-center justify-between">
                                <span
                                    className={`font-semibold ${storeStatus === 'BUKA'
                                        ? 'text-green-500'
                                        : 'text-red-500'
                                        }`}
                                >
                                    {storeStatus}
                                </span>

                                <button
                                    onClick={toggleStore}
                                    className={`rounded-lg px-4 py-2 text-white ${storeStatus === 'BUKA'
                                            ? 'bg-green-500'
                                            : 'bg-red-500'
                                        }`}
                                >
                                    {storeStatus === 'BUKA'
                                        ? 'Tutup Toko'
                                        : 'Buka Toko'}
                                </button>
                            </div>
                        </div>
                    </div>
                </>
            )}
        </AppLayout>
    );
}
