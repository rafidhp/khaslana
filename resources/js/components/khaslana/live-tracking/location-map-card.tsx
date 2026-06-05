import { Link } from '@inertiajs/react';
import L from 'leaflet';
import { MapPin } from 'lucide-react';
import React from 'react';
import { renderToString } from 'react-dom/server';
import { MapContainer, TileLayer, Marker } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';

import type { Umkm } from '@/types/umkm';

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
    // ==========================================
    // THE GOLDEN FIX: Bypass prop yang salah
    // ==========================================
    // 1. Cari apakah ada lokasi yang sedang aktif (MANGKAL/KELILING)
    const activeLocation = umkmData.umkm_locations?.find(loc => loc.is_active === true);
    // 2. Jika tidak ada yang aktif, ambil lokasi yang didaftarkan paling terakhir (terbaru)
    const latestLocation = umkmData.umkm_locations?.[umkmData.umkm_locations.length - 1];
    
    // Prioritas: Lokasi Aktif -> Lokasi Terbaru -> Prop bawaan temanmu
    const realLocationData = activeLocation || latestLocation || locationData;

    // Validasi menggunakan realLocationData
    if (!realLocationData || realLocationData.latitude === null || realLocationData.longitude === null) {
        return (
            <div className="w-full h-[300px] bg-[#2A2A2A] rounded-3xl flex items-center justify-center border border-white/10 text-gray-400">
                Data lokasi belum tersedia
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
            // Gunakan realLocationData untuk mengecek status aktif
            if (realLocationData.is_active) {
                return `/umkm/tracking/${umkmData.id}`;
            }
            return `/umkm/rute/${umkmData.id}`;
        }

        return '#';
    };

    return (
        <div className="relative w-full h-[300px] md:h-[350px] rounded-3xl overflow-hidden border-2 border-white/5 z-0 group">
            
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

            <div className="absolute bottom-4 left-4 right-4 z-[999]">
                <div className="bg-[#2A2A2A]/95 backdrop-blur-md border border-white/10 p-4 md:px-6 rounded-2xl flex items-center justify-between shadow-2xl">
                    <div className="flex flex-col truncate pr-4">
                        <h3 className="text-white font-bold text-lg truncate">
                            {umkmData.store_name}
                        </h3>
                        <p className="text-gray-400 text-sm truncate">
                            Lihat rute dari lokasi Anda
                        </p>
                    </div>

                    <Link 
                        href={getNavUrl()}
                        className="shrink-0 bg-[#99FF33] text-black font-bold py-2.5 px-6 rounded-[999px] hover:bg-[#8ae62e] transition shadow-[0_4px_15px_rgba(153,255,51,0.2)]"
                    >
                        Navigasi
                    </Link>
                </div>
            </div>
        </div>
    );
}