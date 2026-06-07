import { Head, router } from '@inertiajs/react';
import { ChevronLeft } from 'lucide-react';
import React, { useState, useEffect, useRef } from 'react';
import CtaCard from '@/components/khaslana/dashboard/cta-card';
import MapDetailCard from '@/components/khaslana/live-tracking/map-detail-card';
import MapViewer from '@/components/khaslana/live-tracking/map-viewer';
import { useAuth } from '@/hooks/use-auth';
import AppLayout from '@/layouts/app-layout';
import { showErrorToast } from "@/lib/toast";
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
    routeNodes: RouteNode[];
}

export default function MapPoint({ routeNodes }: Props) {
    const { user } = useAuth();
    const [selectedPin, setSelectedPin] = useState<RouteNode | null>(null);
    const hasShownToast = useRef(false);

    // HANDLE EMPTY ROUTE
    useEffect(() => {
        if (routeNodes.length === 0 && !hasShownToast.current) {
            hasShownToast.current = true;

            showErrorToast("Belum ada data rute, arahkan ke Stay Point 🚶");

            setTimeout(() => {
                router.visit('/stay-point');
            }, 1500);
        }
    }, [routeNodes]);

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title='Rute UMKM' />
            
            {!user.is_umkm ? (
                <CtaCard />
            ) : (
                <div className='flex flex-col p-4 lg:p-6 max-w-4xl mx-auto w-full'>
                    
                    {/* Backbtn */}
                    <div className="flex items-center justify-between mb-4 shrink-0">
                        <button 
                            onClick={() => window.history.back()} 
                            className="flex items-center text-[#99FF33] font-semibold hover:opacity-80 transition"
                        >
                            <ChevronLeft className="w-5 h-5 mr-1" />
                            Kembali
                        </button>
                    </div>

                    {/* Area Maps */}
                    <div className="relative w-full rounded-xl">
                        <MapViewer 
                            nodes={routeNodes} 
                            onPinClick={(node) => setSelectedPin(node)} 
                        />
                    </div>

                    {/* Map Detail Card */}
                    <div className="mt-4">
                        <MapDetailCard selectedNode={selectedPin} />
                    </div>
                    
                </div>
            )}
        </AppLayout>
    );
}