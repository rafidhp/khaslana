import React from 'react';

interface Props {
    status: string;
    isLoading: boolean;
    onMangkal: () => void;
    onKeliling: () => void;
}

export default function StayPointActions({ status, isLoading, onMangkal, onKeliling }: Props) {
    if (status === 'TUTUP') return null;

    return (
        <div className="mt-4 shrink-0">
            {status === 'BUKA' || status === 'KELILING' ? (
                <button 
                    onClick={onMangkal} 
                    disabled={isLoading} 
                    className="w-full bg-[#99FF33] text-black py-4 rounded-[16px] font-bold text-lg hover:bg-[#8ae62e] transition disabled:opacity-50 shadow-[0_4px_20px_rgba(153,255,51,0.2)]"
                >
                    {isLoading ? 'Menyimpan...' : 'Mangkal'}
                </button>
            ) : (
                <button 
                    onClick={onKeliling} 
                    disabled={isLoading} 
                    className="w-full bg-[#2F3E1F] border-2 border-[#99FF33]/30 text-[#99FF33] py-4 rounded-[16px] font-bold text-lg hover:bg-[#3a4d26] transition disabled:opacity-50"
                >
                    {isLoading ? 'Menyimpan...' : 'Keliling'}
                </button>
            )}
        </div>
    );
}