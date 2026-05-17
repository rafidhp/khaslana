import { Head, Link } from '@inertiajs/react';
import { motion } from 'framer-motion';
import Illustration from '@/pages/errors/components/illustration';

export default function NotFound() {
    return (
        <>
            <Head title="404 - Halaman Tidak Ditemukan" />

            <div className="relative h-screen w-screen overflow-hidden bg-[#1E1B26] font-sans">
                {/* 2D Illustration Background */}
                <div className="absolute inset-0 z-0 flex items-center justify-center pb-20">
                    <Illustration />
                </div>

                {/* UI Overlay */}
                <div className="pointer-events-none absolute inset-0 z-10 flex flex-col items-center justify-end pb-12 text-center sm:pb-24">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, ease: 'easeOut', delay: 0.2 }}
                        className="px-6"
                    >
                        <motion.h2 
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ duration: 1, delay: 0.4 }}
                            className="text-5xl font-bold tracking-tight text-white md:text-7xl drop-shadow-md"
                        >
                            <span className="text-[#99FF33]">404</span>
                        </motion.h2>

                        <motion.p 
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ duration: 1, delay: 0.6 }}
                            className="mt-4 max-w-md text-lg text-gray-300 drop-shadow-sm font-medium"
                        >
                            Halaman yang kamu tuju tidak dapat ditemukan.
                        </motion.p>

                        <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 0.5, delay: 0.8 }}
                            className="pointer-events-auto mt-8"
                        >
                            <Link
                                href="/"
                                className="inline-flex items-center justify-center gap-2 rounded-full bg-[#99FF33] px-8 py-3.5 text-sm font-bold text-[#1E1B26] transition-all hover:scale-105 hover:bg-[#aaff4d] shadow-[0_4px_20px_rgba(153,255,51,0.2)] hover:shadow-[0_4px_25px_rgba(153,255,51,0.4)]"
                            >
                                Kembali ke Beranda
                            </Link>
                        </motion.div>
                    </motion.div>
                </div>
            </div>
        </>
    );
}