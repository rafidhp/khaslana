import { Head } from "@inertiajs/react"
import StoreIndex from "@/components/khaslana/settings/store/store-index";
import { useAuth } from "@/hooks/use-auth";
import AppLayout from "@/layouts/app-layout";
import SettingsLayout from "@/layouts/settings/layout";
import { storeManagement } from "@/routes";
import type { BreadcrumbItem } from "@/types"

interface Props {
    provinces: {
        code: string;
        name: string;
    }[];
}

export default function Store({
    provinces,
}: Props) {
    const { user } =  useAuth();
    const breadcrumbs: BreadcrumbItem[] = [
        {
            title: user.is_umkm ? 'Kelola Toko' : 'Data UMKM',
            href: storeManagement().url,
        },
    ];

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Kelola Toko" />

            <SettingsLayout>
                <StoreIndex provinces={provinces} />
            </SettingsLayout>
        </AppLayout>
    )
}