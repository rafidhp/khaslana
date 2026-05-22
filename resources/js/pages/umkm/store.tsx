import { Head } from '@inertiajs/react';
import CtaCard from '@/components/khaslana/dashboard/cta-card';
import { useAuth } from "@/hooks/use-auth";
import AppLayout from "@/layouts/app-layout";
import { store } from "@/routes";
import type { BreadcrumbItem } from '@/types';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Store',
        href: store().url,
    },
];

export default function Store() {
    const { user } = useAuth();

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title='Store' />
            {!user.is_umkm ? (
                <CtaCard />
            ) : (
                <>
                    {/* header */}
                    <div className="flex flex-col align-items-center gap-2">
                        <h1 className="text-3xl font-bold">
                            Store
                        </h1>
                        <p className="text-muted-foreground">
                            Manage your store
                        </p>
                    </div>
        
                    {/* content */}
                    <div>ini content</div>
                </>
            )}
        </AppLayout>
    )
}