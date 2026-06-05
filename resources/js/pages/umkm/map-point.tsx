import { Head } from '@inertiajs/react';
import { ChevronLeft } from 'lucide-react';
import React, { useState } from 'react';
import CtaCard from '@/components/khaslana/dashboard/cta-card';
import EmptyRouteModal from '@/components/khaslana/live-tracking/empty-route-modal';
import MapDetailCard from '@/components/khaslana/live-tracking/map-detail-card';
import MapViewer from '@/components/khaslana/live-tracking/map-viewer';
import { useAuth } from '@/hooks/use-auth';
import AppLayout from '@/layouts/app-layout';
import type { BreadcrumbItem } from '@/types';

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Rute', href: '/rute' },
];

interface RouteNode {
    latitude: number;
    longitude: number;
    total_mangkal: number;
}

interface Props {
    routeNodes: RouteNode[]; // Dapet dari MappingController (Backend)
}

export default function MapPoint({ routeNodes }: Props) {
    const { user } = useAuth();
    // STATE: Nyimpen data pin mana yang baru aja diklik di peta
    const [selectedPin, setSelectedPin] = useState<RouteNode | null>(null);

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title='Rute UMKM' />
            
            {!user.is_umkm ? (
                <CtaCard />
            ) : (
                <div className='flex flex-col p-4 lg:p-6 max-w-4xl mx-auto w-full'>
                    
                    {/* Header: Tombol Kembali */}
                    <div className="flex items-center justify-between mb-4 shrink-0">
                        <button 
                            onClick={() => window.history.back()} 
                            className="flex items-center text-[#99FF33] font-semibold hover:opacity-80 transition"
                        >
                            <ChevronLeft className="w-5 h-5 mr-1" />
                            Kembali
                        </button>
                    </div>

                    {/* Area Peta & Modal (Dibungkus relative biar modal nggak nutupin seluruh page) */}
                    <div className="relative w-full rounded-xl">
                        <MapViewer 
                            nodes={routeNodes} 
                            onPinClick={(node) => setSelectedPin(node)} 
                        />
                        
                        {/* Render Modal cuma kalau data rute kosong */}
                        {routeNodes.length === 0 && <EmptyRouteModal />}
                    </div>

                    {/* Area Detail Kotak Bawah */}
                    <div className="mt-4">
                        <MapDetailCard selectedNode={selectedPin} />
                    </div>
                    
                </div>
            )}
        </AppLayout>
    );
}