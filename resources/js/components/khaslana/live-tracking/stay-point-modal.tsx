import { Power } from 'lucide-react';
import React from 'react';

interface ModalConfig {
    title: string;
    desc: string;
    type: 'success' | 'danger' | string;
}

interface Props {
    isOpen: boolean;
    config: ModalConfig;
    isLoading: boolean;
    onClose: () => void;
    onConfirm?: () => void;
}

export default function StayPointModal({ isOpen, config, isLoading, onClose, onConfirm }: Props) {
    if (!isOpen) return null;

    const isSuccess = config.type === 'success';

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm px-4">
            <div className="bg-[#242424] border border-[#99FF33]/10 rounded-3xl p-8 max-w-sm w-full flex flex-col items-center text-center shadow-2xl scale-100 animate-in zoom-in-95 duration-200">
                <div className={`w-16 h-16 rounded-full flex items-center justify-center mb-5 ${isSuccess ? 'bg-[#99FF33]' : 'bg-transparent border-2 border-white/20'}`}>
                    <Power className={`w-8 h-8 ${isSuccess ? 'text-black' : 'text-white'}`} />
                </div>
                <h3 className="text-white font-bold text-xl mb-2">{config.title}</h3>
                <p className="text-[#8B8B8B] text-sm mb-8">{config.desc}</p>
                
                {isSuccess ? (
                    <button 
                        onClick={onClose} 
                        className="w-full bg-[#99FF33] text-black font-bold py-3.5 rounded-xl hover:bg-[#8ae62e] transition"
                    >
                        Oke!
                    </button>
                ) : (
                    <div className="flex gap-3 w-full">
                        <button 
                            onClick={onClose} 
                            disabled={isLoading}
                            className="flex-1 bg-transparent text-white font-semibold py-3.5 rounded-xl hover:bg-white/10 transition disabled:opacity-50"
                        >
                            Tidak, kembali
                        </button>
                        <button 
                            onClick={onConfirm} 
                            disabled={isLoading}
                            className="flex-1 bg-red-600 text-white font-bold py-3.5 rounded-xl hover:bg-red-700 transition disabled:opacity-50"
                        >
                            {isLoading ? 'Menutup...' : 'Ya, Tutup'}
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}