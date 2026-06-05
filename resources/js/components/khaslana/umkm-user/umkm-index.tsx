import FilterSection from "@/components/khaslana/umkm-user/filter-section";
import HeroSection from "@/components/khaslana/umkm-user/hero-section";
import UmkmSection from "@/components/khaslana/umkm-user/umkm-section";
import type { Umkm } from "@/types/umkm";

interface UmkmIndexProps {
    umkms: Umkm[];
}

export default function UmkmIndex({
    umkms,
}: UmkmIndexProps) {
    return (
        <div className="flex flex-col items-center px-6 lg:px-17.5 pt-32 pb-20 lg:justify-center">
            <HeroSection />
            <FilterSection />
            <UmkmSection umkms={umkms} />
        </div>
    )
}