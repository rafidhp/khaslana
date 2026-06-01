import { Head, router } from '@inertiajs/react';
import axios from 'axios';
import { ChevronLeft, Power, Map as MapIcon } from 'lucide-react';
import React, { useState, useEffect } from 'react';
import CtaCard from '@/components/khaslana/dashboard/cta-card';
import MapDetailCard from '@/components/khaslana/live-tracking/map-detail-card';
import StayPointActions from '@/components/khaslana/live-tracking/stay-point-actions';
import StayPointInfoCard from '@/components/khaslana/live-tracking/stay-point-info-card';
import StayPointMap from '@/components/khaslana/live-tracking/stay-point-map';
import StayPointModal from '@/components/khaslana/live-tracking/stay-point-modal';

import { useAuth } from '@/hooks/use-auth';
import AppLayout from '@/layouts/app-layout';
import type { BreadcrumbItem } from '@/types';

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Stay Point', href: '/umkm/stay-point' },
];

type StatusType = 'TUTUP' | 'BUKA' | 'MANGKAL' | 'KELILING';

export interface RouteNode {
    latitude: number;
    longitude: number;
    total_mangkal: number;
}

export default function StayPoint() {
    // 1. STATE MANAGEMENT
    const [status, setStatus] = useState<StatusType>('TUTUP');
    const [position, setPosition] = useState<[number, number] | null>(null);
    const [address, setAddress] = useState<string>('-');
    const [isLoading, setIsLoading] = useState(false);
    
    const [prevPosition, setPrevPosition] = useState<[number, number] | null>(null);
    const [prevAddress, setPrevAddress] = useState<string>('');
    const [showLastPin, setShowLastPin] = useState(false);
    
    const [showModal, setShowModal] = useState(false);
    const [modalConfig, setModalConfig] = useState({ title: '', desc: '', type: 'success' });
    
    // STATE BARU KHUSUS FITUR LAYER RUTE
    const [showRouteLayer, setShowRouteLayer] = useState(false);
    const [routeNodes, setRouteNodes] = useState<RouteNode[]>([]);
    const [selectedRoutePin, setSelectedRoutePin] = useState<RouteNode | null>(null);
    
    const { user } = useAuth();

    // 2. FUNGSI LOGIKA (API & GPS)
    const handleBuka = () => {
        setIsLoading(true);
        if (!navigator.geolocation) {
            alert("Browser lu nggak support Geolocation.");
            setIsLoading(false);
            return;
        }

        navigator.geolocation.getCurrentPosition(
            (pos) => {
                setPosition([pos.coords.latitude, pos.coords.longitude]);
                setStatus('BUKA');
                setPrevPosition(null);
                setPrevAddress('');
                setIsLoading(false);
            },
            (err) => {
                alert(`Izinkan akses lokasi GPS lu ya Bre! (${err.message})`);
                setIsLoading(false);
            },
            { enableHighAccuracy: true }
        );
    };

    const fetchAddress = async (lat: number, lng: number, isPrev: boolean = false) => {
        try {
            const res = await axios.get(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&zoom=18&addressdetails=1&accept-language=id`);
            if (res.data && res.data.display_name) {
                const finalAddress = res.data.display_name;
                
                if (isPrev) {
                    setPrevAddress(finalAddress);
                } else {
                    setAddress(finalAddress);
                }
            }
        } catch {
            const fallback = `Lat: ${lat}, Lng: ${lng}`;
            if (!isPrev) setAddress(fallback);
        }
    };

    const handleMangkal = () => {
        setIsLoading(true);
        navigator.geolocation.getCurrentPosition(
            (pos) => {
                const currentLat = pos.coords.latitude;
                const currentLng = pos.coords.longitude;
                
                if (status === 'MANGKAL' && position && address !== '-') {
                    setPrevPosition(position);
                    setPrevAddress(address);
                }
                
                setPosition([currentLat, currentLng]); 

                axios.post('/stay-point/update-location', {
                    latitude: currentLat,
                    longitude: currentLng,
                    is_active: true,
                    status: 'MANGKAL'
                }).then(() => {
                    setStatus('MANGKAL');
                    setShowLastPin(false); 
                    fetchAddress(currentLat, currentLng); 
                    setModalConfig({
                        title: 'Yeay Stay Point Sudah Aktif!',
                        desc: 'Costumer dapat melacak lokasi anda',
                        type: 'success'
                    });
                    setShowModal(true);
                }).catch(() => alert("Gagal nyambung ke server!")).finally(() => setIsLoading(false));
            },
            (err) => {
                alert(`Gagal ambil lokasi baru: ${err.message}`);
                setIsLoading(false);
            },
            { enableHighAccuracy: true }
        );
    };

    const handleKeliling = () => {
        setIsLoading(true);
        navigator.geolocation.getCurrentPosition(
            (pos) => {
                const currentLat = pos.coords.latitude;
                const currentLng = pos.coords.longitude;

                if (status === 'MANGKAL' && position && address !== '-') {
                    setPrevPosition(position);
                    setPrevAddress(address);
                }

                setPosition([currentLat, currentLng]); 

                axios.post('/stay-point/update-location', {
                    latitude: currentLat,
                    longitude: currentLng,
                    is_active: true,
                    status: 'KELILING'
                }).then(() => {
                    setStatus('KELILING');
                    setShowLastPin(false);
                }).catch(() => alert("Gagal update status!")).finally(() => setIsLoading(false));
            },
            (err) => {
                alert(`Gagal ambil lokasi baru: ${err.message}`);
                setIsLoading(false);
            },
            { enableHighAccuracy: true }
        );
    };

    const handleTutup = () => {
        setModalConfig({
            title: 'Yakin Menutup Stay Point?',
            desc: 'Costumer tidak akan mengetahui lokasi anda',
            type: 'danger'
        });
        setShowModal(true);
    };

    const confirmTutup = () => {
        setIsLoading(true);
        axios.post('/stay-point/update-location', {
            is_active: false,
            status: 'TUTUP'
        }).then(() => {
            setStatus('TUTUP');
            setPosition(null);
            setAddress('-');
            setPrevPosition(null);
            setPrevAddress('');
            setShowModal(false);
            
            // Reset overlay rute juga kalau lagi nutup toko
            setShowRouteLayer(false);
            setSelectedRoutePin(null);
        }).catch(() => alert("Gagal matiin Stay Point!")).finally(() => setIsLoading(false));
    };

    // FUNGSI TOGGLE RUTE LAYER
    const toggleRouteLayer = async () => {
        if (!showRouteLayer) {
            setIsLoading(true);
            try {
                const res = await axios.get('/rute/api-data');
                if (res.data.length === 0) {
                    setModalConfig({
                        title: 'Waduh!',
                        desc: 'Anda Belum Memiliki Data Mangkal!',
                        type: 'danger' // Pakai style danger buat warning
                    });
                    setShowModal(true);
                } else {
                    setRouteNodes(res.data);
                    setShowRouteLayer(true);
                }
            } catch {
                alert("Gagal memuat data rute.");
            } finally {
                setIsLoading(false);
            }
        } else {
            setShowRouteLayer(false);
            setSelectedRoutePin(null); // Kembali ke Info Card biasa
        }
    };

    useEffect(() => {
        const checkInitialStatus = async () => {
            setIsLoading(true);
            try {
                const res = await axios.get('/stay-point/current-location-status');
                const currentStatus = res.data.status;
                setStatus(currentStatus);
                
                if (currentStatus === 'MANGKAL' || currentStatus === 'KELILING') {
                    const lat = res.data.latitude;
                    const lng = res.data.longitude;
                    setPosition([lat, lng]);
                    
                    if (currentStatus === 'KELILING') {
                        setPrevPosition([lat, lng]);
                        fetchAddress(lat, lng, true); 
                    } else {
                        fetchAddress(lat, lng);
                    }
                }
            } catch (err) {
                console.error("Gagal get status awal", err);
            } finally {
                setIsLoading(false);
            }
        };

        checkInitialStatus();
    }, []);

    // 3. RENDER UI TERPUSAT
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title='Stay Point' />
            {!user.is_umkm ? (
                <CtaCard />
            ) : (
                <>
                    <div className='flex h-full max-h-full flex-1 flex-col p-4 lg:p-6 max-w-4xl mx-auto w-full relative overflow-hidden'>
                        
                        {/* Header & Tombol Power */}
                        <div className="flex items-center justify-between mb-4 shrink-0">
                            <button onClick={() => router.visit('/dashboard')} className="flex items-center text-[#99FF33] font-semibold hover:opacity-80 transition">
                                <ChevronLeft className="w-5 h-5 mr-1" />
                                Kembali
                            </button>
                            
                            {status === 'TUTUP' ? (
                                <button onClick={handleBuka} disabled={isLoading} className="flex items-center gap-2 bg-[#99FF33] text-black px-6 py-2.5 rounded-xl font-bold hover:bg-[#8ae62e] transition disabled:opacity-50">
                                    <Power className="w-5 h-5" />
                                    {isLoading ? 'Mencari...' : 'Buka'}
                                </button>
                            ) : (
                                <button onClick={handleTutup} disabled={isLoading} className="flex items-center gap-2 bg-red-600 text-white px-6 py-2.5 rounded-xl font-bold hover:bg-red-700 transition disabled:opacity-50 shadow-lg shadow-red-600/20">
                                    <Power className="w-5 h-5" />
                                    Tutup
                                </button>
                            )}
                        </div>

                        {/* Komponen Peta (Ubah jadi Relatif karena nampung tombol overlay) */}
                        <div className="w-full h-full flex-1 min-h-[200px] bg-[#242424] rounded-[24px] overflow-hidden border-2 border-[#99FF33]/10 relative z-0">
                            
                            {/* Tombol Overlay Rute (Muncul kalau status gak TUTUP) */}
                            {status !== 'TUTUP' && position && (
                                <button 
                                    onClick={toggleRouteLayer}
                                    className={`absolute top-4 right-4 z-[999] p-3 rounded-xl shadow-lg border border-white/10 transition-all ${showRouteLayer ? 'bg-[#99FF33] text-black' : 'bg-[#1C1A24] text-white hover:bg-[#2A2A2A]'}`}
                                    title="Tampilkan Rute Mangkal"
                                >
                                    <MapIcon className="w-6 h-6" strokeWidth={2} />
                                </button>
                            )}

                            <StayPointMap 
                                status={status} 
                                position={position} 
                                prevPosition={prevPosition} 
                                showLastPin={showLastPin} 
                                showRouteLayer={showRouteLayer}
                                routeNodes={routeNodes}
                                onPinClick={(node) => setSelectedRoutePin(node)}
                            />
                        </div>

                        {/* Komponen Tombol Aksi Utama */}
                        <StayPointActions 
                            status={status} 
                            isLoading={isLoading} 
                            onMangkal={handleMangkal} 
                            onKeliling={handleKeliling} 
                        />

                        {/* LOGIKA SWAPPING INFO CARD */}
                        {selectedRoutePin ? (
                            // Panggil komponen MapDetailCard yang udah punya efek loading & API Geocoding
                            <div className="animate-in fade-in duration-300">
                                <MapDetailCard selectedNode={selectedRoutePin} />
                            </div>
                        ) : (
                            // Info Card Default
                            <StayPointInfoCard 
                                status={status} 
                                address={address} 
                                prevAddress={prevAddress} 
                                hasPrevPosition={!!prevPosition} 
                                showLastPin={showLastPin} 
                                onToggleLastPin={() => setShowLastPin(!showLastPin)} 
                            />
                        )}
                        
                    </div>

                    {/* Komponen Modal Global */}
                    <StayPointModal 
                        isOpen={showModal} 
                        config={modalConfig} 
                        isLoading={isLoading} 
                        onClose={() => setShowModal(false)} 
                        onConfirm={confirmTutup} 
                    />
                </>
            )}
        </AppLayout>
    );
}