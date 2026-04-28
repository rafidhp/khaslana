import type { PageProps } from "@inertiajs/core";
import { usePage, Head } from "@inertiajs/react";
import AppLayout from "@/layouts/app-layout";
import { catalog } from '@/routes';

import type { BreadcrumbItem } from "@/types";

interface ProductDatas {
    name: string;
    description: string;
}

interface CatalogProps extends PageProps {
    'products': ProductDatas[],
}

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Discovery Center',
        href: catalog().url,
    },
]

export default function Catalog() {
    const { products } = usePage<CatalogProps>().props;
    console.log(products);

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="test test" />
        </AppLayout>
    )
}