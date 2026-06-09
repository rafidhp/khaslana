import AboutLocation from "@/components/khaslana/umkm-user/detail-umkm/about-location";
import GallerySection from "@/components/khaslana/umkm-user/detail-umkm/gallery-section";
import HeroSection from "@/components/khaslana/umkm-user/detail-umkm/hero-section"
import MenuSection from "@/components/khaslana/umkm-user/detail-umkm/menu-section";
import PromoSection from "@/components/khaslana/umkm-user/detail-umkm/promo-section"
import ReviewSection from "@/components/khaslana/umkm-user/detail-umkm/review-section";
import UnusedNavLayout from "@/layouts/unused-nav-layout"
import { umkm } from "@/routes"
import type { Product } from "@/types/product";
import type { Umkm } from "@/types/umkm";

interface Review {
    id: number;
    product_id: number;
    rating: number;
    comment: string;
}

interface DetailPageProps {
    umkmData: Umkm;
    reviews: Review[];
    products: Product[];
}

export default function Index({
    umkmData,
    reviews,
    products,
}: DetailPageProps) {
    return (
        <UnusedNavLayout backHref={umkm().url}>
            <HeroSection umkmData={umkmData} reviews={reviews} />
            <PromoSection umkmData={umkmData} />
            <AboutLocation umkmData={umkmData} />
            <MenuSection umkmData={umkmData} products={products} />
            <GallerySection umkmData={umkmData} />
            <ReviewSection umkmData={umkmData} reviews={reviews} />
        </UnusedNavLayout>
    )
}