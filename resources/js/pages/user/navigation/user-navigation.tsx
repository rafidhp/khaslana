import { Head, Link } from '@inertiajs/react';
import axios from 'axios';
import { ChevronLeft } from 'lucide-react';
import React, { useEffect, useState } from 'react';

import UserMapViewer, { type MerchantMapData } from '@/components/khaslana/live-tracking/user-map-viewer';
import type { Umkm } from '@/types/umkm';

interface Props {
    umkm: Umkm; // Menerima data tunggal dari UmkmController@navigasi
}

export default function UserNavigation({ umkm }: Props) {
    const [userLoc, setUserLoc] = useState<[number, number] | null>(null);
    const [routePath, setRoutePath] = useState<[number, number][]>([]);
    
    // Mengambil lokasi statis pertama dari database milik toko TETAP
    const storeLocation = umkm.umkm_locations?.[0];

    // Mengubah data model UMKM menjadi interface spasial yang siap dibaca oleh UserMapViewer
    const merchantMapData: MerchantMapData = {
        id: umkm.id,
        latitude: storeLocation?.latitude ? Number(storeLocation.latitude) : 0,
        longitude: storeLocation?.longitude ? Number(storeLocation.longitude) : 0,
        storeName: umkm.store_name,
        logo: umkm.user?.profile?.logo ?? null,
        isActive: true, // Toko tetap selalu dianggap aktif pin-nya di halaman navigasi internal ini
    };

    // 1. GET GPS USER LOCATION
    useEffect(() => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (pos) => {
                    setUserLoc([pos.coords.latitude, pos.coords.longitude]);
                },
                (err) => {
                    console.error("Akses GPS ditolak atau gagal memuat koordinat:", err);
                },
                { enableHighAccuracy: true }
            );
        }
    }, []);

    // 2. AUTO-FETCH ROUTE VIA OSRM (Fase Perutean Otomatis)
    useEffect(() => {
        if (!userLoc || !storeLocation?.latitude || !storeLocation?.longitude) return;

        const fetchRoute = async () => {
            try {
                // Format OSRM API: driving/lon,lat;lon,lat
                const url = `https://router.project-osrm.org/route/v1/driving/${userLoc[1]},${userLoc[0]};${storeLocation.longitude},${storeLocation.latitude}?overview=full&geometries=geojson`;
                const res = await axios.get(url);
                
                if (res.data.routes && res.data.routes.length > 0) {
                    // Transpose koordinat OSRM [lon, lat] menjadi format Leaflet [lat, lon]
                    const coords = res.data.routes[0].geometry.coordinates.map(
                        (c: [number, number]) => [c[1], c[0]] as [number, number]
                    );
                    
                    // Jahit rute secara utuh dari titik user, aspal OSRM, hingga titik jangkar toko
                    setRoutePath([
                        [userLoc[0], userLoc[1]],
                        ...coords,
                        [Number(storeLocation.latitude), Number(storeLocation.longitude)]
                    ]);
                }
            } catch (error) {
                console.error("Gagal menjahit rute OSRM untuk toko fisik:", error);
            }
        };

        fetchRoute();
    }, [userLoc, storeLocation]);

    return (
        <div className="w-full h-screen overflow-hidden relative bg-[#242424]">
            <Head title={`Navigasi Toko - ${umkm.store_name}`} />
            <Link
                href={`/umkm/detail/${umkm.id}`}
                className="absolute top-6 left-4 z-50 flex items-center gap-2 bg-[#1A1A1A]/90 hover:bg-[#2A2A2A] text-white px-5 py-2.5 rounded-full border border-white/10 shadow-2xl backdrop-blur-md font-bold text-sm transition-all"
            >
                <ChevronLeft className="w-8 h-8 text-[#99FF33]" />
                Kembali
            </Link>

            {/* PETA UTAS FULL-SCREEN */}
            <UserMapViewer 
                userLocation={userLoc}
                merchants={[merchantMapData]}
                routePath={routePath}
                selectedMerchantId={umkm.id} // Dilempar agar auto-focus layout 3/4 bekerja sempurna
            />
        </div>
    );
}