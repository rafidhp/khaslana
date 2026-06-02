import React from 'react';

interface Props {
    status: string;
    address: string;
    prevAddress: string;
    hasPrevPosition: boolean;
    showLastPin: boolean;
    onToggleLastPin: () => void;
}

export default function StayPointInfoCard({ status, address, prevAddress, hasPrevPosition, showLastPin, onToggleLastPin }: Props) {
    return (
        <div className="mt-4 bg-[#1C1A24] rounded-[24px] p-5 lg:p-6 border border-white/5 shrink-0">
            <div className="flex flex-col gap-3 lg:gap-4">
                
                <div className="flex items-center text-sm lg:text-base">
                    <span className="text-[#8B8B8B] w-20 font-medium">Status :</span>
                    <span className={`font-semibold ${status === 'TUTUP' ? 'text-red-500' : 'text-[#99FF33]'}`}>
                        {status === 'BUKA' ? 'Standby' : status.charAt(0) + status.slice(1).toLowerCase()}
                    </span>
                </div>
                
                <div className="flex flex-col text-sm lg:text-base gap-2">
                    <span className="text-[#8B8B8B] font-medium">
                        {status === 'KELILING' ? 'Lokasi Mangkal Sebelumnya :' : 'Lokasi Saat Ini :'}
                    </span>
                    <div className="bg-[#242424] p-3.5 lg:p-4 rounded-xl border border-white/5 text-[#D1D1D1] min-h-[50px] leading-relaxed w-full">
                        {status === 'KELILING' ? (prevAddress || 'Memuat data sebelumnya...') : address}
                    </div>
                    
                    {hasPrevPosition && (
                        <div className="flex justify-end mt-1">
                            <button 
                                onClick={onToggleLastPin}
                                className="bg-[#99FF33] text-black px-6 py-2 rounded-xl font-bold text-sm hover:bg-[#8ae62e] transition shadow-[0_2px_10px_rgba(153,255,51,0.2)]"
                            >
                                {showLastPin ? 'Tutup Lokasi Sebelumnya' : 'Lihat Lokasi Sebelumnya'}
                            </button>
                        </div>
                    )}
                </div>
                
            </div>
        </div>
    );
}