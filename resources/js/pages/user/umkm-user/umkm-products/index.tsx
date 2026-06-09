import HeroSection from "@/components/khaslana/umkm-user/detail-umkm/hero-section";
import MenuSection from "@/components/khaslana/umkm-user/detail-umkm/menu-section";
import UnusedNavLayout from "@/layouts/unused-nav-layout";
import { detail } from "@/routes/umkm";
import type { Umkm } from "@/types/umkm";
import type { Product } from "@/types/product";

interface Review {
    id: number;
    product_id: number;
    rating: number;
    comment: string;
}

interface UmkmProductProps {
    umkmData: Umkm;
    reviews: Review[];
    products: Product[];
}

export default function Index({
    umkmData,
    reviews,
    products,
}: UmkmProductProps) {
    return (
        <UnusedNavLayout backHref={detail(umkmData.id).url}>
            <HeroSection umkmData={umkmData} reviews={reviews} />
            <MenuSection umkmData={umkmData} products={products} />
        </UnusedNavLayout>
    )
}