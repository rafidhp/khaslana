import AboutLocation from "@/components/khaslana/umkm-user/detail-umkm/about-location";
import HeroSection from "@/components/khaslana/umkm-user/detail-umkm/hero-section"
import MenuSection from "@/components/khaslana/umkm-user/detail-umkm/menu-section";
import PromoSection from "@/components/khaslana/umkm-user/detail-umkm/promo-section"
import UnusedNavLayout from "@/layouts/unused-nav-layout"
import { umkm } from "@/routes"
import type { Umkm } from "@/types/umkm";

interface DetailPageProps {
    umkmData: Umkm[];
}

export default function Index({
    umkmData,
}: DetailPageProps) {
    return (
        <UnusedNavLayout backHref={umkm().url}>
            <HeroSection umkmData={umkmData} />
            <PromoSection umkmData={umkmData} />
            <AboutLocation umkmData={umkmData} />
            <MenuSection />
        </UnusedNavLayout>
    )
}