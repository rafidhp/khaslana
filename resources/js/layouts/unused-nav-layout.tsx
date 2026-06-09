import { Head, Link, usePage } from "@inertiajs/react"
import { ShoppingCart } from "lucide-react";

import { Breadcrumbs } from '@/components/breadcrumbs';
import Footer from "@/components/khaslana/footer"
import Back from "@/layouts/components/back";
import type { BreadcrumbItem as BreadcrumbItemType } from '@/types';
import { cart } from "@/routes";

type UnusedNavLayoutProps = {
    children: React.ReactNode;
    backHref: string;
    breadcrumbs?: BreadcrumbItemType[];
}

export default function UnusedNavLayout({ children, backHref, breadcrumbs = [] }: UnusedNavLayoutProps) {
    const { pageType } = usePage().props;
    const isCatalogPage = pageType === 'catalogDetail';

    return (
        <div className="w-full overflow-x-hidden">
            <Head>
                <link rel="preconnect" href="https://fonts.bunny.net" />
                <link
                    href="https://fonts.bunny.net/css?family=instrument-sans:400,500,600"
                    rel="stylesheet"
                />
            </Head>
            <div className="min-h-screen h-auto">
                <div className="flex flex-col px-6 lg:px-17.5 pt-12">
                    <div className="flex justify-between">
                        <Back href={backHref} />
                        {isCatalogPage ? (
                            <Link href={cart()}>
                                <ShoppingCart className="h-6 w-6 hover:text-[#99FF33] transition-colors duration-200 hidden min-[970px]:block" />
                            </Link>
                        ) : (
                            <Breadcrumbs breadcrumbs={breadcrumbs} />
                        )}
                    </div>
                    {children}
                </div>
            </div>
            <Footer />
        </div>
    )
}