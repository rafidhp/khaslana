import { Link } from '@inertiajs/react';
import { ChevronRight, Star, X } from 'lucide-react';
import React from 'react';
export interface SelectedMerchantData {
    id: number;
    storeName: string;
    logoUrl: string | null;
    rating: number;
}

interface Props {
    merchant: SelectedMerchantData | null;
    isTracking: boolean;
    onTrackClick: () => void;
    onCancelClick: () => void;
    onClose: () => void;
}

export default function SelectedMerchantCard({ 
    merchant, 
    isTracking, 
    onTrackClick, 
    onCancelClick, 
    onClose 
}: Props) {
    
    if (!merchant) return null;

    const finalLogo = merchant.logoUrl ? `/storage/${merchant.logoUrl}` : '/images/default-store.png';

    return (
        <div className="w-full shrink-0 bg-[#2A2A2A]/90 backdrop-blur-xl rounded-[24px] border border-white/5 shadow-2xl p-5 animate-in slide-in-from-bottom-6 fade-in duration-300 relative">
            
            <button 
                onClick={onClose}
                className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors z-10"
            >
                <X className="w-4 h-4" />
            </button>

            {/* Area Konten Utama Card */}
            <div className="flex items-center gap-[15px] mb-5 mt-1">
                
                {/* Sisi Kiri: Thumbnail Foto Toko */}
                <div className="w-16 h-16 rounded-[16px] overflow-hidden shrink-0 border border-white/5 bg-[#161616]">
                    <img 
                        src={finalLogo} 
                        alt={merchant.storeName} 
                        className="w-full h-full object-cover"
                        onError={(e) => (e.currentTarget.src = '/images/default-store.png')}
                    />
                </div>
                
                {/* Sisi Kanan: Informasi Detail Toko */}
                <div className="flex flex-col flex-1 min-w-0">
                    
                    {/* Baris Atas: Label Konten & Link Detail */}
                    <div className="flex items-center justify-between w-full">
                        <span className="text-white text-[13px] font-medium opacity-90">Toko Dipilih</span>
                        <Link 
                            href={`/umkm/detail/${merchant.id}`}
                            className="flex items-center text-gray-400 text-[13px] hover:text-white transition-colors pr-5"
                        >
                            Detail <ChevronRight className="w-4 h-4 ml-0.5" />
                        </Link>
                    </div>
                    
                    {/* Baris Bawah: Nama Toko & Rating */}
                    <div className="flex items-end justify-between w-full mt-1">
                        <h3 className="text-[#99FF33] font-bold text-[18px] truncate max-w-[140px] leading-tight">
                            {merchant.storeName}
                        </h3>
                        
                        {/* Blok Rating */}
                        <div className="flex items-center gap-2 pr-5">
                            <span className="text-[#99FF33] text-[22px] font-black leading-none">
                                {merchant.rating.toFixed(1)}
                            </span>
                            <div className="flex flex-col items-start">
                                <div className="flex gap-0.5">
                                    {Array.from({ length: 5 }).map((_, i) => (
                                        <Star 
                                            key={i} 
                                            className={`w-3 h-3 ${
                                                i < Math.round(merchant.rating) 
                                                    ? 'fill-[#99FF33] text-[#99FF33]' 
                                                    : 'fill-gray-600 text-gray-600'
                                            }`} 
                                        />
                                    ))}
                                </div>
                                <span className="text-[9px] text-gray-400 mt-0.5 whitespace-nowrap">
                                    Berdasarkan Ulasan
                                </span>
                            </div>
                        </div>
                    </div>

                </div>
            </div>

            {/* Condotional Action Button */}
            {isTracking ? (
                <button 
                    onClick={onCancelClick}
                    className="w-full py-3 rounded-[14px] font-bold text-[14px] bg-transparent border border-[#99FF33] text-[#99FF33] hover:bg-[#99FF33]/10 transition-all duration-200"
                >
                    Batalkan
                </button>
            ) : (
                <button 
                    onClick={onTrackClick}
                    className="w-full py-3 rounded-[14px] font-bold text-[14px] bg-[#99FF33] text-black shadow-[0_4px_20px_rgba(153,255,51,0.25)] hover:bg-[#8ae62e] transition-all duration-200"
                >
                    Lacak Toko
                </button>
            )}
            
        </div>
    );
}