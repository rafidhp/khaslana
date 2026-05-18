import { Head } from "@inertiajs/react"
import Heading from '@/components/heading';
import AppLayout from "@/layouts/app-layout";
import SettingsLayout from "@/layouts/settings/layout";
import { store } from "@/routes";
import type { BreadcrumbItem } from "@/types"

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Kelola Toko',
        href: store().url,
    },
];

export default function Store() {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Kelola Toko" />
            <SettingsLayout>
                <div className="space-y-6">
                    <Heading
                        variant="small"
                        title="Kelola Toko"
                        description="kelola toko nya disini bang"
                    />
                </div>
            </SettingsLayout>
        </AppLayout>
    )
}