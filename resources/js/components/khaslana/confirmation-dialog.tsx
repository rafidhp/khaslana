import { motion } from 'framer-motion';
import { AlertCircle, Hand } from "lucide-react";

interface ConfirmationDialogProps {
    open: boolean;
    title?: string;
    description?: string;
    onConfirm: () => void;
    onCancel: () => void;
    confirmText?: string;
}

export default function ConfirmationDialog({
    open,
    title,
    description,
    onConfirm,
    onCancel,
    confirmText
}: ConfirmationDialogProps) {
    if (!open) return null;

    return (
        <div
            className="
                fixed inset-0
                bg-black/80
                backdrop-blur-sm
                z-50
                flex items-center justify-center
                px-4
            "
        >
            <div
                className="
                    w-full max-w-md
                    bg-[#131313]
                    border border-[#99ff33]/20
                    rounded-3xl
                    p-8
                    shadow-[0_0_40px_rgba(153,255,51,0.15)]
                "
            >
                <div className="flex flex-col items-center text-center gap-4">
                    <div
                        className={`
                            w-16 h-16
                            rounded-full
                            flex items-center justify-center
                            ${confirmText === 'Buat Toko' ? '' : 'bg-red-500/10'}
                        `}
                    >
                        {confirmText === 'Buat Toko' ? (
                            <motion.div
                                initial={{ opacity: 0, y: 10, scale: 0.9 }}
                                animate={{ opacity: 1, y: 0, scale: 1 }}
                                transition={{
                                    duration: 0.5,
                                    ease: [0.22, 1, 0.36, 1],
                                }}
                                className="flex items-center justify-center z-50"
                            >
                                <motion.div
                                    animate={{
                                        rotate: [0, 20, -12, 20, -6, 0],
                                        y: [0, -2, 0],
                                    }}
                                    transition={{
                                        rotate: {
                                            duration: 1.6,
                                            repeat: Infinity,
                                            repeatDelay: 1.5,
                                            ease: 'easeInOut',
                                        },
                                        y: {
                                            duration: 2.5,
                                            repeat: Infinity,
                                            ease: 'easeInOut',
                                        },
                                    }}
                                    style={{
                                        transformOrigin: '75% 85%',
                                    }}
                                >
                                    <Hand
                                        size={56}
                                        strokeWidth={2.2}
                                        className='text-[#99FF33]'
                                    />
                                </motion.div>
                            </motion.div>
                        ) : (
                            <AlertCircle className="w-8 h-8 text-red-500" />
                        )}
                    </div>
                    <h3 className="text-xl font-semibold text-white">
                        {title}
                    </h3>
                    <p className="text-sm text-[#a1a1a1]">
                        {description}
                    </p>
                    <div className="flex gap-3 w-full mt-2">
                        <button
                            onClick={onCancel}
                            className="
                                flex-1
                                py-2.5 md:py-3
                                text-sm md:text-base
                                rounded-xl
                                border border-[#444]
                                text-white
                                hover:bg-[#222]
                                transition-all
                                cursor-pointer
                            "
                        >
                            Batal
                        </button>
                        <button
                            onClick={onConfirm}
                            className={`
                                flex-1
                                py-2.5 md:py-3
                                text-sm md:text-base
                                rounded-xl
                                border
                                transition-all duration-200
                                cursor-pointer
                                ${confirmText === 'Logout' ?
                                    'border-red-700 bg-red-400 hover:bg-red-700 text-white' :
                                    'border-[#99FF33] hover:bg-transparent bg-[#99ff33] text-black hover:text-[#99ff33]'
                                }
                            `}
                        >
                            {confirmText}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}