import ArrowKananAtasHover from '@/assets/images/landing-page/tracking-section/arrow-kanan-atas-hover.png';
import ArrowKananAtas from '@/assets/images/landing-page/tracking-section/arrow-kanan-atas.png';
import BilungNaruto from '@/assets/images/landing-page/tracking-section/bilung-naruto.png';
import Map from '@/assets/images/landing-page/tracking-section/map.png';

export default function TrackkingSection() {
    return (
        <section className="tracking-section px-13.75 pb-30 flex max-lg:flex-col justify-center items-center">
            <div className="tracking-container max-w-300 w-full flex max-lg:flex-col items-center gap-17.5">
                <div className="tracking-left flex-3">
                    <div className="tracking-map relative rounded-[22px] overflow-hidden border border-[#99ff33] shadow-[0_25px_70px_rgba(0,0,0,0.45)]">
                        <img
                            src={Map}
                            alt="Live Tracking Merchant"
                            className='w-full h-full object-cover block'
                        />
                        <div className="map-panel-left absolute top-2.5 left-2.5 w-47.5 p-4.5 rounded-md bg-[rgba(30,30,30,0.75)] backdrop-blur-md text-white">
                            <h4 className='mb-3.75 text-[16px]'>
                                Toko Terdekat
                            </h4>
                            <div className="store-item flex justify-between items-center p-2.5 rounded-[10px] mb-2.5 bg-[rgba(255,255,255,0.05)]">
                                <div>
                                    <strong>
                                        Bilung Naruto
                                    </strong>
                                    <p className='text-[12px] opacity-70'>
                                        Jajanan Lokal
                                    </p>
                                </div>
                                <span className="status open bg-[#99ff33] text-black text-[11px] py-1 px-2.5 rounded-full">
                                    Stay
                                </span>
                            </div>
                            <div className="store-item flex justify-between items-center p-2.5 rounded-[10px] mb-2.5 bg-[rgba(255,255,255,0.05)]">
                                <div>
                                    <strong>
                                        Kopi Keliling
                                    </strong>
                                    <p className='text-[12px] opacity-70'>
                                        Kopi dan Teh
                                    </p>
                                </div>
                                <span className="status closed border border-[#777] text-[#aaa] text-[11px] py-1 px-2.5 rounded-full">
                                    Closed
                                </span>
                            </div>
                        </div>
                        <div className="map-panel-right absolute top-2.5 right-2.5 w-45 p-4.5 rounded-md bg-[rgba(30,30,30,0.8)] backdrop-blur-md text-white">
                            <div className="merchant-header flex gap-2.5 items-center mb-3.75">
                                <img
                                    src={BilungNaruto}
                                    alt="bilung naruto"
                                    className='w-9.5 h-9.5 rounded-sm'
                                />
                                <div>
                                    <strong>
                                        Toko Dipilih
                                    </strong>
                                    <p>
                                        Bilung Naruto
                                    </p>
                                </div>
                            </div>
                            <div className="merchant-stats flex gap-2.5 mb-4.75
                                [&>div]:flex-1
                                [&>div]:bg-[#111]
                                [&>div]:p-2.5
                                [&>div]:rounded-[8px]
                                [&>div>span]:text-[11px]
                                [&>div>span]:opacity-60
                                [&>div>span]:block">
                                <div>
                                    <span>Revenue</span>
                                    <strong>Rp 2.4M</strong>
                                </div>
                                <div>
                                    <span>Orders</span>
                                    <strong>48</strong>
                                </div>
                            </div>
                            <button className='w-full p-2.5 rounded-[8px] border-0 bg-[#222] text-white cursor-pointer'>
                                Lihat Toko
                            </button>
                        </div>
                        <div className="map-marker absolute bottom-[31%] left-[47%] -translate-x-1/2 translate-y-1/2 w-4.5 h-4.5 bg-[#99ff33] rounded-full shadow-[0_0_20px_#99ff33]" />
                    </div>
                </div>
                <div className="tracking-right flex-1 flex flex-col gap-7.5">
                    <h2 className='text-white text-[64px] font-medium leading-[1.2]'>
                        Nikmati<br />
                        Fitur<br />
                        <span className='text-[#99ff33]'>
                            Live Tracking Merchant.
                        </span>
                    </h2>
                    <a href="#" className="btn-secondary-khaslana tracking-btn flex items-center justify-center gap-2 w-fit py-4 px-9.5 text-[16px] group">
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
            </div>
        </section>
    )
}