import CommunitySection from "@/components/khaslana/welcome/community-section";
import CtaSection from "@/components/khaslana/welcome/cta-section";
import HeroSection from "@/components/khaslana/welcome/hero-section";
import TrackkingSection from "@/components/khaslana/welcome/tracking-section";
import UmkmSection from "@/components/khaslana/welcome/umkm-section";

export default function WelcomeIndex() {
    return (
        <div className="flex flex-col items-center p-6 lg:justify-center lg:p-8">
            <HeroSection />
            <UmkmSection />
            <CommunitySection />
            // TODO: bagusin lagi 2 section terakhir
            <TrackkingSection />
            <CtaSection />
        </div>
    )
}