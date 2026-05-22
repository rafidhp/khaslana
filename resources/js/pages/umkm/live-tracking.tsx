import axios from 'axios';
import { useState, useEffect, useRef } from 'react';
import AppLayout from '@/layouts/app-layout';
import type { BreadcrumbItem } from '@/types';

const breadcrumbs: BreadcrumbItem[] = [
  {
    title: 'Live Tracking',
    href: '/umkm/live-tracking', 
  },
];

export default function LiveTracking() {
    const [isTracking, setIsTracking] = useState(false);
    const [location, setLocation] = useState<{lat: number, lng: number} | null>(null);
    const [logMessage, setLogMessage] = useState<string>("Menunggu instruksi...");

    const trackingInterval = useRef<number | null>(null);

    const startTracking = () => {
        if (!navigator.geolocation) {
            setLogMessage("Browser lu nggak support Geolocation, Bre.");
            return;
        }

        setIsTracking(true);
        setLogMessage("Mencari lokasi akurat...");

        sendLocationToBackend();

        trackingInterval.current = setInterval(() => {
            sendLocationToBackend();
        }, 15000); 
    };

    const stopTracking = () => {
        setIsTracking(false);
        
        if (trackingInterval.current) {
            clearInterval(trackingInterval.current);
        }

        axios.post('/umkm/update-location', {
            is_active: false
        }).then(res => {
            setLogMessage("Berhenti mangkal. " + res.data.message);
            setLocation(null);
        }).catch(err => {
            setLogMessage("Error pas matiin tracking.");
        });
    };

    const sendLocationToBackend = () => {
        navigator.geolocation.getCurrentPosition(
            (position) => {
                const lat = position.coords.latitude;
                const lng = position.coords.longitude;
                setLocation({ lat, lng });

                axios.post('/umkm/update-location', {
                    latitude: lat,
                    longitude: lng,
                    is_active: true
                }).then(res => {
                    setLogMessage(`[Sukses] ${res.data.message} | Jarak terdeteksi: ${res.data.distance || 0}`);
                }).catch(err => {
                    setLogMessage(`[Error] Gagal ngirim data ke server.`);
                    console.error(err);
                });
            },
            (error) => {
                setLogMessage(`[GPS Error] Tolong izinkan akses lokasi di browser: ${error.message}`);
            },
            { enableHighAccuracy: true } 
        );
    };

    useEffect(() => {
        return () => {
            if (trackingInterval.current) {
                clearInterval(trackingInterval.current);
            }
        };
    }, []);

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <div className='flex h-full flex-1 flex-col gap-4 overflow-x-auto p-4'>
                <div className="flex flex-col align-items-center gap-2">
                    <h1 className="text-3xl font-bold">Live Tracking UMKM</h1>
                    <p className="text-muted-foreground">Pancarkan lokasi lu biar pembeli gampang nyari.</p>
                </div>

                <div className="mt-4 p-6 border border-gray-700/50 rounded-xl shadow-sm bg-card text-card-foreground max-w-2xl">
                    <h2 className="text-xl font-bold mb-6">Kontrol Siaran Lokasi</h2>

                    <div className="flex flex-col gap-6">
                        <div className="flex items-center gap-6">
                            {isTracking ? (
                                <button 
                                    onClick={stopTracking} 
                                    className="px-6 py-3 bg-red-600 text-white rounded-lg font-bold hover:bg-red-700 transition-all shadow-lg"
                                >
                                    Berhenti Mangkal
                                </button>
                            ) : (
                                <button 
                                    onClick={startTracking} 
                                    className="px-6 py-3 bg-[#99FF33] text-black rounded-lg font-bold hover:bg-[#88e62e] transition-all shadow-lg"
                                >
                                    Mulai Mangkal
                                </button>
                            )}

                            <div className="flex items-center gap-2 text-lg">
                                <span className="font-semibold text-gray-400">Status:</span>
                                {isTracking ? (
                                    <span className="text-green-500 font-bold animate-pulse">Sedang Mangkal!</span>
                                ) : (
                                    <span className="text-gray-500 font-bold">Offline</span>
                                )}
                            </div>
                        </div>

                        <div className="p-4 bg-black/40 rounded-lg text-sm font-mono flex flex-col gap-3 border border-gray-800">
                            <p className="text-gray-300">
                                <strong className="text-white">Console Server:</strong> <br/>
                                <span className="text-blue-400">{logMessage}</span>
                            </p>
                            <p className="text-gray-300">
                                <strong className="text-white">Titik Koordinat:</strong> <br/>
                                <span className="text-yellow-400">
                                    {location ? `${location.lat}, ${location.lng}` : 'Belum mendapatkan satelit...'}
                                </span>
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}