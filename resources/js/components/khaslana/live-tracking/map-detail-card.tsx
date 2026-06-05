import axios from 'axios';
import React, { useState, useEffect } from 'react';

interface RouteNode {
    latitude: number;
    longitude: number;
    total_mangkal: number;
}

interface Props {
    selectedNode: RouteNode | null;
}

export default function MapDetailCard({ selectedNode }: Props) {
    const [address, setAddress] = useState<string>('-');
    const [isLoading, setIsLoading] = useState<boolean>(false);

    // Effect: Nembak API Geocoding HANYA saat ada pin yang diklik
    useEffect(() => {
        if (!selectedNode) {
            setAddress('-');
            return;
        }

        const fetchAddress = async () => {
            setIsLoading(true);
            try {
                // Nominatim API: Translasi koordinat ke teks
                const res = await axios.get(
                    `https://nominatim.openstreetmap.org/reverse?format=json&lat=${selectedNode.latitude}&lon=${selectedNode.longitude}&zoom=18&addressdetails=1&accept-language=id`
                );
                
                if (res.data && res.data.display_name) {
                    setAddress(res.data.display_name);
                } else {
                    setAddress(`Lat: ${selectedNode.latitude}, Lng: ${selectedNode.longitude}`);
                }
            } catch {
                setAddress(`Gagal memuat jalan. Lat: ${selectedNode.latitude}, Lng: ${selectedNode.longitude}`);
            } finally {
                setIsLoading(false);
            }
        };

        fetchAddress();
    }, [selectedNode]);

    return (
        <div className="mt-4 bg-[#242424] rounded-xl p-5 border border-white/5 shrink-0 shadow-lg">
            <div className="flex flex-col gap-3">
                <div className="text-sm">
                    <span className="text-[#8B8B8B] font-medium mr-2">Keterangan Mangkal :</span>
                    <span className="text-white font-semibold">
                        {selectedNode ? `${selectedNode.total_mangkal} kali Mangkal` : ''}
                    </span>
                </div>
                
                <div className="flex flex-col gap-2">
                    <span className="text-[#8B8B8B] font-medium text-sm">
                        Detail Lokasi :
                    </span>
                    <div className="bg-[#1a1a1a] p-4 rounded-lg border border-white/5 text-[#D1D1D1] min-h-[60px] text-sm leading-relaxed w-full">
                        {isLoading ? 'Mencari detail jalan...' : address}
                    </div>
                </div>
            </div>
        </div>
    );
}