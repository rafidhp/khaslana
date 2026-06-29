import { usePage, router } from '@inertiajs/react';
import { LogIn, Lock } from 'lucide-react';
import { login } from '@/routes';

interface LoginRequiredDialogProps {
    open: boolean;
    onClose: () => void;
    title?: string;
    description?: string;
}

export default function LoginRequiredDialog({
    open,
    onClose,
    title = 'Login Diperlukan',
    description = 'Silakan login terlebih dahulu untuk menggunakan fitur ini dan menikmati seluruh layanan Khaslana.',
}: LoginRequiredDialogProps) {
    const { pageType } = usePage().props;
    if (!open) return null;

    const isUmkmDetailPage = pageType === 'umkmDetail';

    const handleLogin = () => {
        router.visit(login());
    }

    return (
        <div
            className={`
                fixed inset-0
                flex items-center justify-center
                bg-black/80
                backdrop-blur-sm
                px-4
                ${isUmkmDetailPage ? 'z-[999]' : 'z-50'}
            `}
        >
            <div
                className="
                    w-full max-w-md
                    rounded-3xl
                    border border-[#99ff33]/20
                    bg-[#131313]
                    p-8
                    shadow-[0_0_40px_rgba(153,255,51,0.15)]
                "
            >
                <div className="flex flex-col items-center text-center gap-4">
                    <div
                        className="
                            flex h-16 w-16 items-center justify-center
                            rounded-full
                            bg-[#99ff33]/10
                        "
                    >
                        <Lock className="h-8 w-8 text-[#99ff33]" />
                    </div>

                    <h3 className="text-xl font-semibold text-white">
                        {title}
                    </h3>

                    <p className="text-sm text-[#a1a1a1]">
                        {description}
                    </p>

                    <div className="mt-2 flex w-full gap-3">
                        <button
                            onClick={onClose}
                            className="
                                flex-1
                                rounded-xl
                                border border-[#444]
                                py-3
                                text-white
                                transition-all
                                hover:bg-[#222]
                                cursor-pointer
                            "
                        >
                            Kembali
                        </button>

                        <button
                            onClick={handleLogin}
                            className="
                                flex-1
                                rounded-xl
                                border border-[#99FF33]
                                bg-[#99FF33]
                                py-3
                                text-black
                                font-medium
                                transition-all
                                hover:bg-transparent
                                hover:text-[#99FF33]
                                cursor-pointer
                                flex items-center justify-center gap-2
                            "
                        >
                            <LogIn className="h-4 w-4" />
                            Login
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}