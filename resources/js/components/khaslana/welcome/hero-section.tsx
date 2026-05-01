import HeroImage from '@/assets/images/landing-page/hero-section/hero-image.png';
import { register, about } from '@/routes';

export default function HeroSection() {
    return (
        <section className="flex flex-col lg:flex-row min-h-screen items-center justify-between px-6 lg:px-[55px] pt-28 lg:pt-14 pb-16 md:pb-0 gap-12 lg:gap-64">
            <div className="flex flex-col gap-6 lg:gap-8 flex-1">
                <div className="text-white font-light text-[12px] sm:text-[12px] md:text-[15px] border-2 border-[#99FF33] rounded-full px-6 py-2.5 w-fit tracking-[2px] transition-all duration-200 hover:tracking-[3px] hover:cursor-default">
                    <h3 className="font-light">
                        Marketplace UMKM Indonesia
                    </h3>
                </div>
                <h1 className="text-white font-medium text-4xl sm:text-5xl lg:text-6xl xl:text-[64px] max-w-2xl leading-tight">
                    Bangga Produk Lokal Berkembang Bersama{" "}
                    <i className="text-[#99FF33]">Khaslana.</i>
                </h1>
                <p className="text-white text-sm sm:text-base md:text-[18px] leading-7 sm:leading-[30px] max-w-xl">
                    Temukan ribuan produk karya anak bangsa dari seluruh penjuru negeri.
                    Khaslana hadir untuk menghubungkan kamu dengan keunikan Nusantara,
                    sekaligus mendukung pertumbuhan UMKM Indonesia.
                </p>
                <div className="h-[2px] bg-[#99FF33] w-full max-w-[450px]" />
                <div className="flex flex-col sm:flex-row gap-4 mt-2">
                    <a
                        href={register().url}
                        className="btn-primary-khaslana"
                    >
                        Gabung Sekarang
                    </a>
                    <a
                        href={about().url}
                        className="btn-secondary-khaslana"
                    >
                        Tentang Kami
                    </a>
                </div>
            </div>
            <div className="flex-1 flex justify-center lg:justify-end">
                <img
                    src={HeroImage}
                    alt="Hero Image"
                    className="w-full max-w-[320px] sm:max-w-[420px] md:max-w-[500px] lg:max-w-[550px] xl:max-w-[600px]"
                />
            </div>
        </section>
    );
}