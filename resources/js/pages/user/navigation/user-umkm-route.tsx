import { Head } from '@inertiajs/react';
import axios from 'axios';
import { ChevronLeft } from 'lucide-react';
import React, { useState, useEffect } from 'react';
import UserMapViewer from '@/components/khaslana/live-tracking/user-map-viewer';
import type { Umkm } from '@/types/umkm';
interface RouteNode {
    latitude: number;
    longitude: number;
    total_mangkal: number;
}

interface Props {
    umkm: Umkm;
    routeNodes: RouteNode[];
}

export default function UserUmkmRoute({ umkm, routeNodes }: Props) {

    const [activeIndex, setActiveIndex] = useState<number | null>(null);
    const [routePath, setRoutePath] = useState<[number, number][]>([]);
    const [address, setAddress] = useState<string | null>(null);

    const isEmpty = routeNodes.length === 0;

    //OSRM ROUTE
    useEffect(() => {
        const processRoute = async () => {
    
            // kosong
            if (routeNodes.length === 0) {
                setRoutePath([]);
                return;
            }
    
            // 1 titik
            if (routeNodes.length === 1) {
                setRoutePath([
                    [routeNodes[0].latitude, routeNodes[0].longitude]
                ]);
                return;
            }
    
            // >=2 titik
            try {
                const fullPath: [number, number][] = [];
    
                for (let i = 0; i < routeNodes.length - 1; i++) {
                    const start = routeNodes[i];
                    const end = routeNodes[i + 1];
    
                    const url = `https://router.project-osrm.org/route/v1/driving/${start.longitude},${start.latitude};${end.longitude},${end.latitude}?overview=full&geometries=geojson`;
    
                    const res = await axios.get(url);
    
                    if (res.data.routes?.length > 0) {
                        const coords = res.data.routes[0].geometry.coordinates.map(
                            (c: [number, number]) => [c[1], c[0]] as [number, number]
                        );
    
                        if (i === 0) {
                            fullPath.push([start.latitude, start.longitude]);
                        }
    
                        fullPath.push(...coords);
                        fullPath.push([end.latitude, end.longitude]);
                    }
                }
    
                setRoutePath(fullPath);
    
            } catch (err) {
                console.error("OSRM route gagal:", err);
    
                // fallback
                const fallbackPath = routeNodes.map(n => [n.latitude, n.longitude] as [number, number]);
                setRoutePath(fallbackPath);
            }
        };
    
        processRoute();
    
    }, [routeNodes]);

    // REVERSE GEOCODING
    useEffect(() => {
        if (activeIndex === null) return;
    
        const node = routeNodes[activeIndex];
    
        const fetchAddress = async () => {
            try {
                setAddress(null);

                const res = await fetch(
                    `https://nominatim.openstreetmap.org/reverse?format=json&lat=${node.latitude}&lon=${node.longitude}`
                );
    
                const data = await res.json();
    
                setAddress(data.display_name || "Alamat tidak ditemukan");
            } catch (err) {
                console.error("Gagal ambil alamat:", err);
                setAddress("Gagal mengambil alamat");
            }
        };
    
        fetchAddress();
    }, [activeIndex, routeNodes]);

    return (
        <div className="w-full h-screen overflow-hidden relative bg-[#242424]">

            <Head title={`Riwayat Rute - ${umkm.store_name}`} />

            {/* BACK BUTTON */}
            <button
                onClick={() => window.history.back()}
                className="absolute top-6 left-4 z-[1000] flex items-center gap-2 bg-[#1A1A1A]/90 text-white px-5 py-2.5 rounded-full"
            >
                <ChevronLeft className="w-8 h-8 text-[#99FF33]" />
                Kembali
            </button>

            {/* MAP */}
            {!isEmpty && (
                <UserMapViewer
                    userLocation={null}
                    merchants={[]}
                    routePath={routePath}
                    routeNodes={routeNodes}
                    activeNodeIndex={activeIndex}
                    onNodeClick={(i) => setActiveIndex(i)}
                    selectedMerchantId={null}
                />
            )}

            {/* TITLE */}
            <div className="absolute top-20 left-4 z-[1000] bg-[#1A1A1A]/90 text-[#99FF33] px-4 py-2 rounded-lg">
                Rute "{umkm.store_name}"
            </div>

            {/* FLOATING DETAIL */}
            {activeIndex !== null && routeNodes[activeIndex] && (
                <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-[1000] w-[90%] max-w-md">
                    
                    <div className="bg-[#242424] rounded-xl p-5 border border-white/5 shadow-lg backdrop-blur-md">

                        <div className="text-sm mb-3">
                            <span className="text-[#8B8B8B]">Keterangan Mangkal :</span>
                            <span className="text-white font-semibold ml-2">
                                {routeNodes[activeIndex].total_mangkal} kali Mangkal
                            </span>
                        </div>

                        <div className="text-sm">
                            <span className="text-[#8B8B8B]">Detail Lokasi :</span>
                            <div className="mt-2 bg-[#1a1a1a] p-4 rounded-lg border border-white/5 text-[#D1D1D1]">
                                {address ? address : "Memuat alamat..."}
                            </div>
                        </div>

                    </div>

                </div>
            )}

        </div>
    );
}