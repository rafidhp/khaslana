import ArrowKananAtasHover from '@/assets/images/landing-page/tracking-section/arrow-kanan-atas-hover.png';
import ArrowKananAtas from '@/assets/images/landing-page/tracking-section/arrow-kanan-atas.png';
import BilungNaruto from '@/assets/images/landing-page/tracking-section/bilung-naruto.png';
import Map from '@/assets/images/landing-page/tracking-section/map.png';

export default function TrackkingSection() {
    return (
        <section className="px-6 lg:px-[55px] pb-20 flex justify-center items-center z-10">
            <div className="max-w-[1400px] w-full flex flex-col lg:flex-row items-center gap-12 lg:gap-20">
                <div className="flex flex-col gap-6 lg:gap-8 order-1 lg:order-2 flex-1 text-left lg:text-left">
                    <h2 className="text-white text-4xl sm:text-4xl lg:text-5xl xl:text-[64px] font-medium leading-tight">
                        Nikmati Fitur <br className="block" />
                        <span className="text-[#99ff33]">
                            Live Tracking{" "}
                            <br className="hidden lg:block" />
                            Merchant.
                        </span>
                    </h2>
                    <p className="text-white text-sm sm:text-base leading-7 max-w-lg">
                        Pernahkah Anda mencari penjual langganan, namun tidak tahu keberadaannya hari ini? 
                        Dengan fitur Live Tracking, lokasi penjual dapat dipantau secara langsung melalui 
                        aplikasi — kapan saja, di mana saja.
                    </p>
                    <a
                        href="#"
                        className="btn-secondary-khaslana flex items-center gap-2 w-full md:w-fit py-4 px-24 text-sm group"
                    >
                        Selengkapnya
                        <div className="relative w-5 h-5">
                            <img
                                src={ArrowKananAtas}
                                alt="arrow"
                                className="absolute inset-0 w-5 h-5 transition-opacity duration-200 group-hover:opacity-0"
                            />
                            <img
                                src={ArrowKananAtasHover}
                                alt="arrow"
                                className="absolute inset-0 w-5 h-5 opacity-0 transition-opacity duration-200 group-hover:opacity-100"
                            />
                        </div>
                    </a>
                </div>
                <div className="flex-1 order-2 lg:order-1 w-full">
                    <div className="relative rounded-[18px] overflow-hidden border border-[#99ff33] shadow-[0_20px_60px_rgba(0,0,0,0.45)]">
                        <img
                            src={Map}
                            alt="Live Tracking Merchant"
                            className="w-full h-full object-cover"
                        />
                        <div className="absolute top-2 left-2 w-40 sm:w-48 p-3 rounded-md bg-[rgba(30,30,30,0.75)] backdrop-blur-md text-white text-xs sm:text-sm">
                            <h4 className="mb-2 text-sm">Toko Terdekat</h4>
                            <div className="flex justify-between items-center p-2 rounded-md mb-2 bg-white/5">
                                <div>
                                    <strong>Bilung Naruto</strong>
                                    <p className="opacity-70 text-[10px] sm:text-xs">
                                        Jajanan Lokal
                                    </p>
                                </div>
                                <span className="bg-[#99ff33] text-black text-[10px] px-2 py-1 rounded-full">
                                    Stay
                                </span>
                            </div>
                            <div className="flex justify-between items-center p-2 rounded-md bg-white/5">
                                <div>
                                    <strong>Kopi Keliling</strong>
                                    <p className="opacity-70 text-[10px] sm:text-xs">
                                        Kopi dan Teh
                                    </p>
                                </div>
                                <span className="border border-[#777] text-[#aaa] text-[10px] px-2 py-1 rounded-full">
                                    Closed
                                </span>
                            </div>
                        </div>
                        <div className="absolute top-2 right-2 w-36 sm:w-44 p-3 rounded-md bg-[rgba(30,30,30,0.8)] backdrop-blur-md text-white text-xs sm:text-sm">
                            <div className="flex gap-2 items-center mb-2">
                                <img
                                    src={BilungNaruto}
                                    alt="merchant"
                                    className="w-8 h-8 rounded-sm"
                                />
                                <div>
                                    <strong>Toko Dipilih</strong>
                                    <p className="text-[10px] sm:text-xs">
                                        Bilung Naruto
                                    </p>
                                </div>
                            </div>
                            <div className="flex gap-2 mb-3">
                                <div className="flex-1 bg-[#111] p-2 rounded-md">
                                    <span className="text-[10px] opacity-60 block">
                                        Revenue
                                    </span>
                                    <strong>Rp 2.4M</strong>
                                </div>
                                <div className="flex-1 bg-[#111] p-2 rounded-md">
                                    <span className="text-[10px] opacity-60 block">
                                        Orders
                                    </span>
                                    <strong>48</strong>
                                </div>
                            </div>
                            <button className="w-full p-2 rounded-md bg-[#222] text-white text-xs">
                                Lihat Toko
                            </button>
                        </div>
                        <div className="absolute bottom-[31%] left-[47%] -translate-x-1/2 translate-y-1/2 w-3 h-3 sm:w-4 sm:h-4 bg-[#99ff33] rounded-full shadow-[0_0_15px_#99ff33]" />
                    </div>
                </div>
            </div>
        </section>
    );
}