import FilterSection from "@/components/khaslana/umkm-user/filter-section";
import HeroSection from "@/components/khaslana/umkm-user/hero-section";
import UmkmSection from "@/components/khaslana/umkm-user/umkm-section";
import type { Umkm } from "@/types/umkm";
import { useMemo, useState, useEffect } from "react";

interface UmkmIndexProps {
    umkms: Umkm[];
}

const calculateDistance = (
    lat1: number,
    lon1: number,
    lat2: number,
    lon2: number
) => {
    const R = 6371;

    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;

    const a =
        Math.sin(dLat / 2) *
        Math.sin(dLat / 2) +
        Math.cos(lat1 * Math.PI / 180) *
        Math.cos(lat2 * Math.PI / 180) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);

    const c = 2 * Math.atan2(
        Math.sqrt(a),
        Math.sqrt(1 - a)
    );

    return R * c;
};

export default function UmkmIndex({
    umkms,
}: UmkmIndexProps) {
    const [search, setSearch] = useState('');
    const [selectedSort, setSelectedSort] = useState('Terdekat');
    const [userCoords, setUserCoords] = useState<{ latitude: number; longitude: number } | null>(null);

    useEffect(() => {
        navigator.geolocation.getCurrentPosition(
            (position) => {
                setUserCoords({
                    latitude: position.coords.latitude,
                    longitude: position.coords.longitude,
                });
            },
            (error) => console.error("Gagal mengambil lokasi: ", error)
        );
    }, []);

    const processedUmkms = useMemo(() => {
        let items = umkms.map((umkm) => {
            let calculatedKm: number | null = null;
            const location = umkm.umkm_locations?.[0];

            if (userCoords && location?.latitude && location?.longitude) {
                calculatedKm = calculateDistance(
                    userCoords.latitude,
                    userCoords.longitude,
                    Number(location.latitude),
                    Number(location.longitude)
                );
            }

            return {
                ...umkm,
                computedDistance: calculatedKm,
            };
        });

        items = items.filter((umkm) => {
            const keyword = search.toLowerCase();
            return (
                umkm.store_name?.toLowerCase().includes(keyword) ||
                umkm.description?.toLowerCase().includes(keyword)
            );
        });

        if (selectedSort === 'Terdekat') {
            items.sort((a, b) => {
                if (a.computedDistance === null) return 1;
                if (b.computedDistance === null) return -1;
                return a.computedDistance - b.computedDistance;
            });
        } else if (selectedSort === 'Terbaru') {
            items.sort((a, b) => {
                const dateA = a.created_at ? new Date(a.created_at).getTime() : 0;
                const dateB = b.created_at ? new Date(b.created_at).getTime() : 0;
                return dateB - dateA;
            })
        } else if (selectedSort === 'Terpopuler') {
            items.sort((a, b) => Number(b.average_rating || 0) - Number(a.average_rating || 0))
        }

        return items;
    }, [umkms, search, selectedSort, userCoords]);

    return (
        <div className="flex flex-col items-center px-6 lg:px-17.5 pt-32 pb-20 lg:justify-center">
            <HeroSection />
            <FilterSection 
                search={search}
                onSearchChange={setSearch}
                selectedSort={selectedSort}
                onSortChange={setSelectedSort}
            />
            <UmkmSection umkms={processedUmkms} />
        </div>
    )
}