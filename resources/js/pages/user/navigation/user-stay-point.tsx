import { Head, Link } from '@inertiajs/react';
import { router } from '@inertiajs/react';
import axios from 'axios';
import { ChevronLeft } from 'lucide-react';
import React, { useEffect, useState, useCallback } from 'react';

import KhaslanaLogo from "@/assets/icons/khaslana-logo-green.png";
import MerchantSidebar from '@/components/khaslana/live-tracking/merchant-sidebar';
import SelectedMerchantCard from '@/components/khaslana/live-tracking/selected-merchant-card';
import UserMapViewer, { MerchantMapData } from '@/components/khaslana/live-tracking/user-map-viewer';
import { showErrorToast } from "@/lib/toast";


interface IncomingActiveMerchant {
    id: number;
    storeName: string;
    description: string;
    locationText: string;
    rating: number;
    status: 'MANGKAL' | 'KELILING' | 'TUTUP';
    latitude: number;
    longitude: number;
    isActive: boolean;

    user?: {
        id: number;
        name: string;
        username: string;
        email: string;

        profile?: {
            user_id: number;
            profile_photo: string | null;
            logo: string | null;
        };
    };
}

interface Props {
    activeMerchants: IncomingActiveMerchant[];
    initialSelectedId: number | null;
    hasFiltered: boolean;
}

export default function UserStayPoint({ activeMerchants, initialSelectedId, hasFiltered }: Props) {
    const [userLoc, setUserLoc] = useState<[number, number] | null>(null);
    const [selectedId, setSelectedId] = useState<number | null>(initialSelectedId);
    const [routePath, setRoutePath] = useState<[number, number][]>([]);
    const [isTracking, setIsTracking] = useState(false);
    const hasAutoRoutedRef = React.useRef(false);
    const selectedMerchant = activeMerchants.find(m => m.id === selectedId);
    const [dataReady, setDataReady] = useState(false);

    // GPS
    const [hasFetched, setHasFetched] = useState(false);
    useEffect(() => {
        if (hasFetched) return;

        if (!navigator.geolocation) return;

        navigator.geolocation.getCurrentPosition(
            (pos) => {
                const lat = pos.coords.latitude;
                const lng = pos.coords.longitude;

                setUserLoc([lat, lng]);
                router.get('/umkm/tracking', {
                    lat,
                    lng
                }, {
                    preserveState: true,
                    replace: true,
                    preserveScroll: true,
                    onSuccess: () => {
                        setDataReady(true);
                    }
                });

                setHasFetched(true);
            },
            (err) => {
                console.error("Akses GPS bermasalah:", err);
            },
            { enableHighAccuracy: true }
        );
    }, [hasFetched]);

    useEffect(() => {
        if (!dataReady) return;
    
        if (hasFiltered && activeMerchants.length === 0) {
            showErrorToast("Tidak ada UMKM di sekitar Anda");
        }
    }, [dataReady, activeMerchants, hasFiltered]);

    // FETCH ROUTE
    const handleFetchRoute = useCallback(async (targetLat: number, targetLng: number) => {
        if (!userLoc) return;

        try {
            const url = `https://router.project-osrm.org/route/v1/driving/${userLoc[1]},${userLoc[0]};${targetLng},${targetLat}?overview=full&geometries=geojson`;
            const res = await axios.get(url);

            if (res.data.routes?.length > 0) {
                const coords = res.data.routes[0].geometry.coordinates.map(
                    (c: [number, number]) => [c[1], c[0]] as [number, number]
                );

                setRoutePath([
                    [userLoc[0], userLoc[1]],
                    ...coords,
                    [targetLat, targetLng]
                ]);

                setIsTracking(true);
            }
        } catch (error) {
            console.error("Gagal menjahit rute OSRM:", error);
        }
    }, [userLoc]);

    // AUTO ROUTE (FROM DETAIL)
    useEffect(() => {
        if (
            initialSelectedId &&
            userLoc &&
            selectedMerchant &&
            !isTracking &&
            !hasAutoRoutedRef.current
        ) {
            hasAutoRoutedRef.current = true;
    
            (async () => {
                await handleFetchRoute(
                    selectedMerchant.latitude,
                    selectedMerchant.longitude
                );
            })();
        }
    }, [initialSelectedId, userLoc, selectedMerchant, isTracking, handleFetchRoute]);

    const resetRouteOnly = () => {
        setRoutePath([]);
        setIsTracking(false);
    };

    // cancel tracking
    const handleCancelTracking = () => {
        setRoutePath([]);
        setIsTracking(false);
        setSelectedId(null);
    };

    // close card
    const handleCloseCard = () => {
        setSelectedId(null);
        setRoutePath([]);
        setIsTracking(false);
    };

    // DATA ADAPTER
    const sidebarMerchantsData = activeMerchants.map(m => ({
        id: m.id,
        storeName: m.storeName,
        description: m.description,
        locationText: m.locationText,
        rating: m.rating,
        status: m.status
    }));

    const mapMerchantsData: MerchantMapData[] = activeMerchants.map((merchant) => ({
        id: merchant.id,
        latitude: merchant.latitude,
        longitude: merchant.longitude,
        storeName: merchant.storeName,
        logo: merchant.user?.profile?.logo ?? null,
        isActive: merchant.isActive
    }));

    return (
        <div className="w-full h-screen overflow-hidden relative bg-[#242424]">
            <Head title="Live Tracking - Pedagang Keliling" />

            {/* BACK BUTTON */}
            {initialSelectedId ? (
                <Link
                    href={`/umkm/detail/${initialSelectedId}`}
                    className="absolute top-6 left-4 z-50 flex items-center gap-2 bg-[#1A1A1A]/90 hover:bg-[#2A2A2A] text-white px-5 py-2.5 rounded-full border border-white/10 shadow-2xl backdrop-blur-md font-bold text-sm transition-all"
                >
                    <ChevronLeft className="w-8 h-8 text-[#99FF33]" />
                    Kembali
                </Link>
            ) : (
                <button
                    onClick={() =>
                        window.history.length > 1 ?
                        window.history.back() :
                        window.location.replace('/umkm')
                    }
                    className="
                        group
                        absolute top-6 left-4 z-50
                        flex items-center gap-2
                        bg-[#1A1A1A]/90 hover:bg-[#232323]
                        text-white hover:text-[#99FF33]
                        px-5 py-2.5 rounded-full
                        border border-white/10 hover:border-[#99FF33]/40
                        shadow-2xl hover:shadow-[0_0_25px_rgba(153,255,51,0.25)]
                        backdrop-blur-md
                        font-bold text-sm
                        hover:-translate-y-0.5
                        hover:scale-105 active:scale-95
                        cursor-pointer
                        transition-all duration-300
                    "
                >
                    <ChevronLeft
                        className="
                            w-6 h-6
                            text-[#99FF33]
                            transition-all duration-300
                            group-hover:-translate-x-0.5
                            group-hover:scale-105
                        "
                    />
                    Kembali
                </button>
            )}

            <div className='absolute top-4 right-4 z-50 rounded-full p-2 bg-[#262626]'>
                <img
                    src={KhaslanaLogo}
                    alt="Khaslana Logo"
                    className='h-12 w-12 aspect-square shrink-0 hover:-rotate-25 transition-all duration-300'
                />
            </div>

            {/* MAP */}
            <UserMapViewer 
                userLocation={userLoc}
                merchants={mapMerchantsData}
                routePath={routePath}
                selectedMerchantId={selectedId}
                onMerchantClick={(id) => {
                    if (id !== selectedId) {
                        resetRouteOnly();   // 🔥 penting
                        setSelectedId(id);
                    }
                }}
            />

            {/* OVERLAY */}
            <div className="absolute top-24 left-4 z-[1000] flex flex-col gap-[15px] w-[calc(100%-32px)] max-w-[360px] max-h-[calc(100vh-120px)] pointer-events-none">
                
                <div className="pointer-events-auto flex flex-col overflow-hidden min-h-0">
                    <MerchantSidebar 
                        merchants={sidebarMerchantsData}
                        selectedMerchantId={selectedId}
                        onSelectMerchant={(id) => {
                            if (id !== selectedId) {
                                resetRouteOnly(); // 🔥 penting
                                setSelectedId(id);
                            }
                        }}
                    />
                </div>

                {selectedMerchant && (
                    <div className="pointer-events-auto shrink-0 transition-all duration-300">
                        <SelectedMerchantCard 
                            merchant={{
                                id: selectedMerchant.id,
                                storeName: selectedMerchant.storeName,
                                logo: selectedMerchant.user?.profile?.logo ?? null,
                                rating: selectedMerchant.rating
                            }}
                            isTracking={isTracking}
                            onTrackClick={() => handleFetchRoute(selectedMerchant.latitude, selectedMerchant.longitude)}
                            onCancelClick={handleCancelTracking}
                            onClose={handleCloseCard}
                        />
                    </div>
                )}
            </div>
        </div>
    );
}