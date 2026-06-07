import { MapPin, Star } from 'lucide-react';
import React from 'react';

export interface MerchantSidebarData {
    id: number;
    storeName: string;
    description: string;  
    locationText: string; 
    rating: number;
    status: 'MANGKAL' | 'KELILING' | 'TUTUP';
}

interface Props {
    merchants: MerchantSidebarData[];
    selectedMerchantId: number | null;
    onSelectMerchant: (id: number) => void;
}

export default function MerchantSidebar({ merchants, selectedMerchantId, onSelectMerchant }: Props) {
    // Sidebar hilang jika tidak ada data merchant
    if (merchants.length === 0) return null;

    return (
        <div className="flex flex-col w-full bg-[#2A2A2A]/80 backdrop-blur-xl rounded-[24px] border border-white/5 shadow-2xl overflow-hidden animate-in fade-in slide-in-from-left-4 duration-300">
            
            {/* Header */}
            <div className="flex items-center justify-between p-5 shrink-0">
                <h2 className="text-white font-bold text-xl tracking-wide">Toko Terdekat</h2>
                <div className="bg-[#2F3E1F]/60 border border-[#99FF33]/20 text-[#99FF33] px-3 py-1.5 rounded-full text-[11px] font-bold tracking-wider">
                    {merchants.length} DISEKITARMU
                </div>
            </div>

            {/* List Toko */}
            <div className="flex-1 overflow-y-auto px-5 pb-5 flex flex-col gap-[15px] custom-scrollbar min-h-0">
                {merchants.map((merchant) => {
                    const isSelected = selectedMerchantId === merchant.id;
                    
                    let statusColor = "text-gray-400 border-gray-600";
                    let statusText = "Closed";
                    
                    if (merchant.status === 'MANGKAL') {
                        statusColor = "text-[#99FF33] border-[#99FF33]";
                        statusText = "Mangkal";
                    } else if (merchant.status === 'KELILING') {
                        statusColor = "text-[#F5A623] border-[#F5A623]"; 
                        statusText = "Keliling";
                    }

                    return (
                        <button
                            key={merchant.id}
                            onClick={() => onSelectMerchant(merchant.id)}
                            className={`w-full text-left p-4 rounded-[16px] transition-all duration-300 group bg-[#161616] border ${
                                isSelected 
                                ? "border-[#99FF33]/50 shadow-[0_0_15px_rgba(153,255,51,0.1)]" 
                                : "border-transparent hover:border-white/10"
                            }`}
                        >
                            {/* Baris Atas: Nama Toko & Status */}
                            <div className="flex items-start justify-between mb-1">
                                <h3 className="font-bold text-[16px] text-white">
                                    {merchant.storeName}
                                </h3>
                                <div className={`px-3 py-0.5 rounded-full border text-[10px] font-bold tracking-wide ${statusColor}`}>
                                    {statusText}
                                </div>
                            </div>

                            <p className="text-gray-400 text-[13px] mb-4 line-clamp-1">
                                {merchant.description}
                            </p>

                            {/* Baris Bawah: Lokasi & Rating */}
                            <div className="flex items-center justify-between text-sm mt-auto">
                                
                                <div className="flex items-center text-gray-400">
                                    <MapPin className="w-4 h-4 mr-1.5" />
                                    <span className="text-[13px] truncate max-w-[150px]">
                                        {merchant.locationText}
                                    </span>
                                </div>
                                
                                <div className="flex items-center text-white font-bold text-[14px]">
                                    <Star className="w-4 h-4 fill-[#99FF33] text-[#99FF33] mr-1.5" />
                                    {merchant.rating.toFixed(1)}
                                </div>
                                
                            </div>
                        </button>
                    );
                })}
            </div>
        </div>
    );
}