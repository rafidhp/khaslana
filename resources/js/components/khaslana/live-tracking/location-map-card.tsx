import L from 'leaflet';
import { MapPin } from 'lucide-react';
import { useState } from 'react';
import { renderToString } from 'react-dom/server';
import { MapContainer, TileLayer, Marker } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';

import { useAuth } from '@/hooks/use-auth';
import LoginRequiredDialog from '@/components/khaslana/login-required-dialog';
import type { Umkm } from '@/types/umkm';
import { router } from '@inertiajs/react';
import ConfirmationDialog from '@/components/khaslana/confirmation-dialog';

interface Props {
    umkmData: Umkm;
    locationData: NonNullable<Umkm['umkm_locations']>[number] | null;
}

const NeonPinIcon = L.divIcon({
    className: 'bg-transparent',
    html: renderToString(
        <MapPin size={42} color="#325E00" fill="#99FF33" strokeWidth={2} />
    ),
    iconSize: [42, 42],
    iconAnchor: [21, 42],
});

export default function LocationMapCard({ umkmData, locationData }: Props) {
    const { user } = useAuth();
    const [showLoginDialog, setShowLoginDialog] = useState(false);
    const [showConfirmationDialog, setShowConfirmationDialog] = useState(false);
    const [distance, setDistance] = useState<number>(0);
    const [userCoords, setUserCoords] = useState<{lat: number, lng: number} | null>(null);
    
    // Get Data Umkm keliling aktif
    const activeLocation = umkmData.umkm_locations?.find(loc => loc.is_active === true);
    // Get Data Terakhir, Klo Gak ada data UMKM Yang Aktif
    const latestLocation = umkmData.umkm_locations?.[umkmData.umkm_locations.length - 1 ] ?? null;
    
    // Priority : Lokasi Aktif -> Lokasi Terbaru -> Prop bawaan 
    const realLocationData =
    umkmData.type === 'KELILING'
        ? latestLocation?.status === null
            ? null
            : activeLocation ?? latestLocation
        : locationData;

    // Validasi pake realLocationData
    if (!realLocationData || realLocationData.latitude === null || realLocationData.longitude === null) {
        return (
            <div className="w-full h-[300px] bg-[#2A2A2A] rounded-3xl flex items-center justify-center border border-white/10 text-gray-400">
                Waduh, UMKM Belum Pernah Mangkal!
            </div>
        );
    }

    const lat = realLocationData.latitude;
    const lng = realLocationData.longitude;

    const getNavUrl = () => {
        if (umkmData.type === 'TETAP') {
            return `/umkm/navigasi/${umkmData.id}`;
        }
    
        if (umkmData.type === 'KELILING') {
    
            // Belum pernah membuka Stay Point
            if (!realLocationData) {
                return '#';
            }
    
            // Sedang aktif
            if (realLocationData.is_active) {
                return `/umkm/tracking/${umkmData.id}`;
            }
    
            // Sudah pernah mangkal tetapi sedang tutup
            return `/umkm/rute/${umkmData.id}`;
        }
    
        return '#';
    };

    const shouldValidateDistance = () => {
        // UValidasi UMKM Tetap
        if (umkmData.type === "TETAP") {
            return true;
        }
    
        // Validasi UMKM Keliling
        if (umkmData.type === "KELILING") {
            return Boolean(realLocationData?.is_active);
        }
    
        return false;
    };

    const calculateDistance = (
        lat1: number,
        lon1: number,
        lat2: number,
        lon2: number
    ): number => {
        const R = 6371;
    
        const dLat = ((lat2 - lat1) * Math.PI) / 180;
        const dLon = ((lon2 - lon1) * Math.PI) / 180;
    
        const a =
            Math.sin(dLat / 2) * Math.sin(dLat / 2) +
            Math.cos((lat1 * Math.PI) / 180) *
            Math.cos((lat2 * Math.PI) / 180) *
            Math.sin(dLon / 2) *
            Math.sin(dLon / 2);
    
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    
        return R * c;
    };

    const validateNavigation = () => {
        navigator.geolocation.getCurrentPosition(
            (position) => {
                const userLat = position.coords.latitude;
                const userLng = position.coords.longitude;

                setUserCoords({ lat: userLat, lng: userLng });
    
                const distance = calculateDistance(
                    userLat,
                    userLng,
                    Number(lat),
                    Number(lng)
                );
    
                // Simpan jarak untuk ditampilkan pada dialog
                setDistance(distance);
    
                // Radius
                if (distance <= 10) {
                    router.visit(getNavUrl());
                    return;
                }
    
                // Show confirmation dialog
                setShowConfirmationDialog(true);
            },
            (error) => {
                console.error("Gagal mendapatkan lokasi user:", error);
            },
            {
                enableHighAccuracy: true,
                timeout: 10000,
                maximumAge: 0,
            }
        );
    };


    const handleNavigationClicked = () => {
        if (!user) {
            setShowLoginDialog(true);
            return;
        }
    
        // Tidak perlu validasi jarak
        if (!shouldValidateDistance()) {
            router.visit(getNavUrl());
            return;
        }
    
        validateNavigation();
    };

    return (
        <div className="relative w-full h-[300px] md:h-[350px] rounded-3xl overflow-hidden border-2 border-white/5 group">
            
            <MapContainer 
                center={[lat, lng]} 
                zoom={16} 
                scrollWheelZoom={false} 
                zoomControl={false}
                dragging={false}
                className="w-full h-full"
                attributionControl={false}
            >
                <TileLayer
                    url="https://{s}.google.com/vt/lyrs=m&x={x}&y={y}&z={z}"
                    subdomains={['mt0', 'mt1', 'mt2', 'mt3']}
                />
                <Marker position={[lat, lng]} icon={NeonPinIcon} />
            </MapContainer>

            <div className="absolute bottom-4 left-4 right-4 z-[400]">
                <div className="bg-[#2A2A2A]/95 backdrop-blur-md border border-white/10 p-4 md:px-6 rounded-2xl flex items-center justify-between shadow-2xl">
                    <div className="flex flex-col truncate pr-4">
                        <h3 className="text-white font-bold text-lg truncate">
                            {umkmData.store_name}
                        </h3>
                        <p className="text-gray-400 text-sm truncate">
                            Lihat rute dari lokasi Anda
                        </p>
                    </div>

                    <div
                        onClick={handleNavigationClicked}
                        className="
                            shrink-0 border border-[#99FF33]
                            bg-[#99FF33] hover:bg-[#1E1B26]
                            text-black font-bold
                            py-2.5 px-6
                            rounded-[999px] hover:text-[#99FF33]
                            transition shadow-[0_4px_15px_rgba(153,255,51,0.2)]
                            cursor-pointer"
                    >
                        Navigasi
                    </div>
                </div>
            </div>

            <LoginRequiredDialog
                open={showLoginDialog}
                onClose={() => setShowLoginDialog(false)}
            />
            <ConfirmationDialog
                open={showConfirmationDialog}
                title="Lokasi UMKM Cukup Jauh"
                description={`UMKM tersebut berjarak sekitar ${distance.toFixed(1)} KM dari lokasi Anda. Apakah Anda ingin tetap melanjutkan navigasi?`}
                confirmText="Lanjut"
                onCancel={() => setShowConfirmationDialog(false)}
                onConfirm={() => {
                    setShowConfirmationDialog(false);
                
                    const url = getNavUrl();
                
                    // Bypass validasi radius backend, pastikan userCoords tidak null
                    if (url.includes("/tracking") && userCoords) {
                        router.get(
                            url,
                            {
                                lat: userCoords.lat, // <-- Panggil dari state
                                lng: userCoords.lng, // <-- Panggil dari state
                                force: true,
                            },
                            {
                                preserveScroll: true,
                            }
                        );
                        return;
                    }
                
                    router.visit(url);
                }}
            />
        </div>
    );
}