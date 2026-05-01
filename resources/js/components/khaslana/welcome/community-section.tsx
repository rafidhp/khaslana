import CommunityImg from '@/assets/images/landing-page/community-section/community-img.png';
import RightArrowDark from '@/assets/images/landing-page/right-arrow-dark.png';
import RightArrowGreen from '@/assets/images/landing-page/right-arrow-green.png';

export default function CommunitySection() {
    return (
        <section className="flex flex-col lg:flex-row items-center justify-center relative w-full min-h-[100vh] px-6 my-12 lg:px-[55px] gap-12 lg:gap-64">
            <div className="flex flex-col flex-1 text-white gap-6 lg:gap-8 relative z-10">
                <div className="text-white font-light text-[12px] sm:text-[12px] md:text-[15px] border-2 border-[#99FF33] rounded-full px-6 py-2.5 w-fit tracking-[2px] transition-all duration-200 hover:tracking-[3px] hover:cursor-default">
                    <h3 className="font-light">
                        Marketplace UMKM Indonesia
                    </h3>
                </div>
                <h2 className="text-white font-medium text-4xl sm:text-5xl lg:text-6xl xl:text-[64px] max-w-2xl leading-tight">
                    Bergabung Dengan{" "}
                    <i className="text-[#99FF33]">Komunitas</i>{" "}
                    Untuk Berbagi Informasi.
                </h2>
                <div className="flex mt-2">
                    <a
                        href="#"
                        className="btn-primary-khaslana flex items-center gap-2 group"
                    >
                        Eksplor Disini
                        <div className="relative w-5 h-5">
                            <img
                                src={RightArrowDark}
                                alt="arrow"
                                className="absolute inset-0 w-5 h-5 transition-opacity duration-200 group-hover:opacity-0"
                            />
                            <img
                                src={RightArrowGreen}
                                alt="arrow"
                                className="absolute inset-0 w-5 h-5 opacity-0 transition-opacity duration-200 group-hover:opacity-100"
                            />
                        </div>
                    </a>
                </div>
            </div>
            <div className="flex flex-1 relative z-10 w-full h-[400px] lg:h-auto">
                <div className="relative w-full h-full">
                    <img
                        src={CommunityImg}
                        alt="Community"
                        className="
                            absolute 
                            top-1/2 
                            -translate-y-1/2 
                            left-[-280px] sm:left-[-320px] md:left-[0] lg:left-[-380px] 
                            w-[800px] lg:w-[1400px]
                            max-w-none
                        "
                    />
                </div>
            </div>
        </section>
    )
}