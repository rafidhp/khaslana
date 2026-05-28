import { router } from '@inertiajs/react';
import { Head } from '@inertiajs/react';
import axios from 'axios';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { MapPin } from 'lucide-react';
import { ChevronLeft, Power } from 'lucide-react';
import { useState, useEffect } from 'react';
import { renderToString } from 'react-dom/server';
import { MapContainer, TileLayer, Marker, Popup, CircleMarker, useMap } from 'react-leaflet';
import { ZoomControl } from 'react-leaflet';
import CtaCard from '@/components/khaslana/dashboard/cta-card';
import { useAuth } from '@/hooks/use-auth';
import AppLayout from '@/layouts/app-layout';
import type { BreadcrumbItem } from '@/types';

//MAPPIN
const LucidePinIcon = L.divIcon({
    className: '',
    html: renderToString(
      <MapPin 
        size={42} 
        color="white" 
        fill="#EA4335"
        strokeWidth={2}
      />
    ),
    iconSize: [42, 42],
    iconAnchor: [21, 42],
});

L.Marker.prototype.options.icon = LucidePinIcon;

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Stay Point', href: '/umkm/stay-point' },
];

type StatusType = 'TUTUP' | 'BUKA' | 'MANGKAL' | 'KELILING';

// Komponen pembantu buat bikin peta otomatis pindah ke tengah ngikutin GPS
function ChangeView({ center }: { center: [number, number] }) {
    const map = useMap();
    map.flyTo(center, 16, {duration: 1.5 });
    return null;
}

export default function StayPoint() {
    const [status, setStatus] = useState<StatusType>('TUTUP');
    const [position, setPosition] = useState<[number, number] | null>(null);
    const [address, setAddress] = useState<string>('-');
    const [isLoading, setIsLoading] = useState(false);
    const { user } = useAuth();
    
    // State buat nyimpen jejak lokasi dan alamat mangkal sebelumnya
    const [prevPosition, setPrevPosition] = useState<[number, number] | null>(null);
    const [prevAddress, setPrevAddress] = useState<string>('');
    const [showLastPin, setShowLastPin] = useState(false);
    
    // State buat Modal
    const [showModal, setShowModal] = useState(false);
    const [modalConfig, setModalConfig] = useState({ title: '', desc: '', type: 'success' });

    // 1. Fungsi Klik BUKA (Minta Izin GPS, Peta Muncul)
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

    // 2. Fungsi Ambil Alamat (Reverse Geocoding via OpenStreetMap) - Versi Full Address
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
            if (!isPrev) setAddress(`Lat: ${lat}, Lng: ${lng}`); 
        }
    };

    // 3. Fungsi Klik MANGKAL (Kirim ke API, Fix Pin, Muncul Modal)
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
                }).then((res) => {
                    setStatus('MANGKAL');
                    setShowLastPin(false); 
                    fetchAddress(currentLat, currentLng); 
                    
                    console.log(res.data.message); 
                    
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

    // 4. Fungsi Klik KELILING (Kirim ke API, Ubah UI)
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
                }).then((res) => {
                    setStatus('KELILING');
                    setShowLastPin(false);
                    console.log(res.data.message);
                }).catch(() => alert("Gagal update status!")).finally(() => setIsLoading(false));
            },
            (err) => {
                alert(`Gagal ambil lokasi baru: ${err.message}`);
                setIsLoading(false);
            },
            { enableHighAccuracy: true }
        );
    };

    // 5. Fungsi Klik TUTUP (Kirim ke API, Reset UI)
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
        }).catch(() => alert("Gagal matiin Stay Point!")).finally(() => setIsLoading(false));
    };

    // 6. Cek status pas halaman pertama kali dibuka (Anti-Refresh Bug)
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

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title='Stay Point' />
            {!user.is_umkm ? (
                <CtaCard />
            ) : (
                <>
                    <div className='flex h-full max-h-full flex-1 flex-col p-4 lg:p-6 max-w-4xl mx-auto w-full relative overflow-hidden'>
                        
                        {/* Header Section */}
                        <div className="flex items-center justify-between mb-4 shrink-0">
                            <button onClick={() => router.visit('/dashboard')} className="flex items-center text-[#99FF33] font-semibold hover:opacity-80 transition">
                                <ChevronLeft className="w-5 h-5 mr-1" />
                                Kembali
                            </button>
                            
                            {/* Tombol BUKA / TUTUP di Kanan Atas */}
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
        
                        {/* Map Container */}
                        <div className="w-full h-full flex-1 min-h-[200px] bg-[#242424] rounded-[24px] overflow-hidden border-2 border-[#99FF33]/10 relative z-0">
                            {position ? (
                                <MapContainer 
                                    center={position} 
                                    zoom={16} 
                                    scrollWheelZoom={true} 
                                    zoomControl={false}
                                    className="w-full h-full"
                                    attributionControl={false}
                                    dragging={true}
                                    touchZoom={true}
                                    doubleClickZoom={true}
                                >
                                    <TileLayer
                                        url="https://{s}.google.com/vt/lyrs=m&x={x}&y={y}&z={z}"
                                        subdomains={['mt0', 'mt1', 'mt2', 'mt3']}
                                    />
        
                                    <ZoomControl position="bottomright" />  
        
                                    <ChangeView center={showLastPin && prevPosition ? prevPosition : position} />
                                    
                                    {/* Visualisasi Pin Berdasarkan Status */}
                                    {status === 'MANGKAL' && (
                                        <Marker position={position} icon={LucidePinIcon}>
                                            <Popup>Lokasi Mangkal Saat Ini</Popup>
                                        </Marker>
                                    )}
                                    
                                    {/* Munculin pin lama (pakai koordinat prevPosition) */}
                                    {showLastPin && prevPosition && (
                                        <Marker position={prevPosition} icon={LucidePinIcon}>
                                            <Popup>Lokasi Mangkal Sebelumnya</Popup>
                                        </Marker>
                                    )}
                                    
                                    {/* REVISI: CircleMarker keliling sudah dihapus bersih biar map polosan pas ngider */}
                                    {status === 'BUKA' && (
                                        <CircleMarker center={position} pathOptions={{ color: '#99FF33', fillColor: '#99FF33', fillOpacity: 0.2 }} radius={30}>
                                            <Popup>Lokasi GPS Anda</Popup>
                                        </CircleMarker>
                                    )}
                                </MapContainer>
                            ) : (
                                <div className="w-full h-full flex flex-col items-center justify-center text-gray-500">
                                    <Power className="w-12 h-12 mb-3 opacity-20" />
                                    <p>Klik "Buka" untuk menyalakan Stay Point</p>
                                </div>
                            )}
                        </div>
        
                        {/* Tombol Aksi Utama (Bawah Map) */}
                        <div className="mt-4 shrink-0">
                            {status !== 'TUTUP' && (
                                <>
                                    {status === 'BUKA' || status === 'KELILING' ? (
                                        <button onClick={handleMangkal} disabled={isLoading} className="w-full bg-[#99FF33] text-black py-4 rounded-[16px] font-bold text-lg hover:bg-[#8ae62e] transition disabled:opacity-50 shadow-[0_4px_20px_rgba(153,255,51,0.2)]">
                                            {isLoading ? 'Menyimpan...' : 'Mangkal'}
                                        </button>
                                    ) : (
                                        <button onClick={handleKeliling} disabled={isLoading} className="w-full bg-[#2F3E1F] border-2 border-[#99FF33]/30 text-[#99FF33] py-4 rounded-[16px] font-bold text-lg hover:bg-[#3a4d26] transition disabled:opacity-50">
                                            {isLoading ? 'Menyimpan...' : 'Keliling'}
                                        </button>
                                    )}
                                </>
                            )}
                        </div>
        
                        {/* Status & Lokasi Card */}
                        <div className="mt-4 bg-[#1C1A24] rounded-[24px] p-5 lg:p-6 border border-white/5 shrink-0">
                            <div className="flex flex-col gap-3 lg:gap-4">
                                
                                <div className="flex items-center text-sm lg:text-base">
                                    <span className="text-[#8B8B8B] w-20 font-medium">Status :</span>
                                    <span className={`font-semibold ${status === 'TUTUP' ? 'text-red-500' : 'text-[#99FF33]'}`}>
                                        {status === 'BUKA' ? 'Standby' : status.charAt(0) + status.slice(1).toLowerCase()}
                                    </span>
                                </div>
                                
                                {/* Baris 2: Lokasi & Tombol */}
                                <div className="flex flex-col text-sm lg:text-base gap-2">
                                    <span className="text-[#8B8B8B] font-medium">
                                        {status === 'KELILING' ? 'Lokasi Mangkal Sebelumnya :' : 'Lokasi Saat Ini :'}
                                    </span>
                                    <div className="bg-[#242424] p-3.5 lg:p-4 rounded-xl border border-white/5 text-[#D1D1D1] min-h-[50px] leading-relaxed w-full">
                                        {status === 'KELILING' ? (prevAddress || 'Memuat data sebelumnya...') : address}
                                    </div>
                                    
                                    {/* Tombol Lihat Lokasi */}
                                    {prevPosition && (
                                        <div className="flex justify-end mt-1">
                                            <button 
                                                onClick={() => setShowLastPin(!showLastPin)}
                                                className="bg-[#99FF33] text-black px-6 py-2 rounded-xl font-bold text-sm hover:bg-[#8ae62e] transition shadow-[0_2px_10px_rgba(153,255,51,0.2)]"
                                            >
                                                {showLastPin ? 'Tutup Lokasi Sebelumnya' : 'Lihat Lokasi Sebelumnya'}
                                            </button>
                                        </div>
                                    )}
                                </div>
                                
                            </div>
                        </div>
                    </div>
        
                    {/* Custom Modal Overlay */}
                    {showModal && (
                        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm px-4">
                            <div className="bg-[#242424] border border-[#99FF33]/10 rounded-3xl p-8 max-w-sm w-full flex flex-col items-center text-center shadow-2xl scale-100 animate-in zoom-in-95 duration-200">
                                <div className={`w-16 h-16 rounded-full flex items-center justify-center mb-5 ${modalConfig.type === 'success' ? 'bg-[#99FF33]' : 'bg-transparent border-2 border-white/20'}`}>
                                    <Power className={`w-8 h-8 ${modalConfig.type === 'success' ? 'text-black' : 'text-white'}`} />
                                </div>
                                <h3 className="text-white font-bold text-xl mb-2">{modalConfig.title}</h3>
                                <p className="text-[#8B8B8B] text-sm mb-8">{modalConfig.desc}</p>
                                
                                {modalConfig.type === 'success' ? (
                                    <button onClick={() => setShowModal(false)} className="w-full bg-[#99FF33] text-black font-bold py-3.5 rounded-xl hover:bg-[#8ae62e] transition">
                                        Oke!
                                    </button>
                                ) : (
                                    <div className="flex gap-3 w-full">
                                        <button onClick={() => setShowModal(false)} className="flex-1 bg-transparent text-white font-semibold py-3.5 rounded-xl hover:bg-white/10 transition">
                                            Tidak, kembali
                                        </button>
                                        <button onClick={confirmTutup} className="flex-1 bg-red-600 text-white font-bold py-3.5 rounded-xl hover:bg-red-700 transition">
                                            Ya, Tutup
                                        </button>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}
                </>
            )}
        </AppLayout>
    );
}