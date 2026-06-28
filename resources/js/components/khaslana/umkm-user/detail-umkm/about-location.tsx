import LocationMapCard from "@/components/khaslana/live-tracking/location-map-card";
import type { Umkm } from "@/types/umkm";

interface AboutLocationProps {
    umkmData: Umkm;
}

export default function AboutLocation({
    umkmData,
}: AboutLocationProps) {
    const locationData = umkmData.umkm_locations?.[0] ?? null;
    
    return (
        <div className="flex justify-between items-start gap-12 mt-12">
            {/* left section */}
            <div className="flex flex-col w-full">
                <div>
                    <h2 className="text-xl md:text-2xl font-bold">Tentang Kami</h2>
                </div>
                <div className="flex flex-col mt-2 w-full">
                    <span className="font-normal text-wrap">
                        {umkmData.description}
                    </span>
                </div>
            </div>

            {/* right section */}
            <div className="flex flex-col w-full">
                <div>
                    <h2 className="text-xl md:text-2xl font-bold">Lokasi</h2>
                </div>
                <div className="flex mt-2">
                    <LocationMapCard
                        umkmData={umkmData}
                        locationData={locationData}
                    />
                </div>
            </div>
        </div>
    )
}