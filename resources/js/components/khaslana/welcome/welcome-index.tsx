import CommunitySection from "@/components/khaslana/welcome/community-section";
import CtaSection from "@/components/khaslana/welcome/cta-section";
import HeroSection from "@/components/khaslana/welcome/hero-section";
import TrackkingSection from "@/components/khaslana/welcome/tracking-section";
import UmkmSection from "@/components/khaslana/welcome/umkm-section";
import type { Product } from "@/types/product";

interface WelcomeIndexProps {
    products: Product[];
}

export default function WelcomeIndex({
    products,
}: WelcomeIndexProps) {
    return (
        <div className="flex flex-col items-center lg:justify-center">
            <HeroSection />
            <UmkmSection products={products} />
            <CommunitySection />
            <TrackkingSection />
            <CtaSection />
        </div>
    )
}