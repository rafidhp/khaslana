import AboutLocation from "@/components/khaslana/umkm-user/detail-umkm/about-location";
import HeroSection from "@/components/khaslana/umkm-user/detail-umkm/hero-section"
import PromoSection from "@/components/khaslana/umkm-user/detail-umkm/promo-section"
import UnusedNavLayout from "@/layouts/unused-nav-layout"
import type { Umkm } from "@/pages/user/umkm";
import { umkm } from "@/routes"

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
            <AboutLocation />
        </UnusedNavLayout>
    )
}