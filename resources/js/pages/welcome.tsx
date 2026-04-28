import { Head } from '@inertiajs/react';
import AntingPerak from '@/assets/images/landing-page/anting-perak.png';
import ArrowKananAtas from '@/assets/images/landing-page/arrow-kanan-atas.png';
import BilungNaruto from '@/assets/images/landing-page/bilung-naruto.png';
import CommunityImg from '@/assets/images/landing-page/community-img.png';
import HeroImage from '@/assets/images/landing-page/hero-images.png';
import KopiGayo from '@/assets/images/landing-page/kopi-gayo.png';
import Map from '@/assets/images/landing-page/map.png';
import RightArrowDark from '@/assets/images/landing-page/right-arrow-dark.png';
import SendalGarut from '@/assets/images/landing-page/sendal-garut.png';
import VaseKeramik from '@/assets/images/landing-page/vase-keramik.png';
import UserLayout from '@/layouts/user-layout';
// import { dashboard, login, register } from '@/routes';

export default function Welcome() {
    // const { auth } = usePage().props;

    return (
        <>
            <UserLayout>
                <Head>
                    <link rel="preconnect" href="https://fonts.bunny.net" />
                    <link
                        href="https://fonts.bunny.net/css?family=instrument-sans:400,500,600"
                        rel="stylesheet"
                    />
                </Head>

                <div className="flex flex-col items-center p-6 lg:justify-center lg:p-8">
                    <section className="hero-section flex min-h-screen h-auto justify-between items-center px-13.75 gap-7.5">
                        <div className="hero-left flex flex-col gap-6.5 flex-1">
                            <div className="tag text-white font-extralight text-2.5 border-2 border-[#99ff33] rounded-[100px] py-2.5 px-5 w-fit transition-all duration-200 tracking-[2px] hover:tracking-[3px]">
                                <h3>Marketplace UMKM Indonesia</h3>
                            </div>

                            <h1 className='font-medium text-white text-[48px] w-full max-w-150'>
                                Bangga Produk Lokal Berkembang Bersama <i className='text-[#99FF33]'>Khaslana.</i>
                            </h1>

                            <p className='text-white text-[15px] max-w-142.5 w-full leading-7.5'>
                                Temukan ribuan produk karya anak bangsa dari seluruh penjuru negeri. Khaslana hadir untuk menghubungkan kamu dengan keunikan Nusantara, sekaligus mendukung pertumbuhan UMKM Indonesia.
                            </p>

                            <div className="separator bg-[#99FF33] h-0.5 w-full min-w-10"></div>

                            <div className="hero-btn flex gap-3 mt-5">
                                <a href="#" className="btn-primary py-3.5 px-7.25 font-medium rounded-[100px] flex items-center justify-center text-[#1e1b26] bg-[#99ff33] border border-[#99ff33] transition-all duration-300 hover:text-[#99ff33] hover:bg-transparent">Gabung Sekarang</a>
                                <a href="#" className="btn-secondary py-3.5 px-7.25 font-medium rounded-[100px] text-[#99ff33] border border-[#99ff33] transition-all duration-200 hover:text-[#1e1b26] hover:bg-[#99ff33]">Tentang Kami</a>
                            </div>
                        </div>

                        <div className="hero-right">
                            <img
                                src={HeroImage}
                                alt="Gambar Hero Section"
                                className="hero-img w-full max-w-100"
                            />
                        </div>
                    </section>

                    <section className="umkm-section flex flex-col items-center justify-center min-h-screen h-auto py-5 px-13.75 gap-7.5">
                        <h2 className='font-medium text-[40px] text-center text-white'>Bersama Kami Menjadi Gerbang Digital <span className='text-[#99ff33]'>UMKM Indonesia</span></h2>

                        <div className="umkm-cards grid grid-cols-4 gap-6.25
                            [&>.umkm-card]:flex
                            [&>.umkm-card]:flex-col
                            [&>.umkm-card]:bg-[#3d3c3b]
                            [&>.umkm-card]:rounded-[8px]
                            [&>.umkm-card]:w-full
                            [&>.umkm-card]:max-w-125
                            [&>.umkm-card>img]:rounded-t-[8px]
                            [&>.umkm-card>img]:w-62.5
                            [&>.umkm-card>.umkm-data]:flex
                            [&>.umkm-card>.umkm-data]:flex-col
                            [&>.umkm-card>.umkm-data]:gap-1
                            [&>.umkm-card>.umkm-data]:p-5
                            [&>.umkm-card>.umkm-data>.umkm-name]:text-white
                            [&>.umkm-card>.umkm-data>.umkm-price]:text-[#99ff33]
                            [&>.umkm-card>.umkm-data>.umkm-cart]:text-white
                            [&>.umkm-card>.umkm-data>.umkm-cart]:flex
                            [&>.umkm-card>.umkm-data>.umkm-cart]:items-center
                            [&>.umkm-card>.umkm-data>.umkm-cart]:justify-center
                            [&>.umkm-card>.umkm-data>.umkm-cart]:text-center
                            [&>.umkm-card>.umkm-data>.umkm-cart]:border-[1.5px]
                            [&>.umkm-card>.umkm-data>.umkm-cart]:border-[#494847]
                            [&>.umkm-card>.umkm-data>.umkm-cart]:py-2.75
                            [&>.umkm-card>.umkm-data>.umkm-cart]:w-full
                            [&>.umkm-card>.umkm-data>.umkm-cart]:rounded-[8px]
                            [&>.umkm-card>.umkm-data>.umkm-cart]:mt-2
                            [&>.umkm-card>.umkm-data>.umkm-cart>p]:w-full
                            [&>.umkm-card>.umkm-data>.umkm-cart>p]:text-[12px]">
                            <div className="umkm-card">
                                <img src={VaseKeramik} alt="Vase Keramik Kasongan" />
                                <div className="umkm-data">
                                    <h4 className="umkm-name">Vase Keramik Kasongan</h4>
                                    <h4 className="umkm-price">Rp 185.000</h4>
                                    <div className="umkm-cart">
                                        <p>+ Add to Cart</p>
                                    </div>
                                </div>
                            </div>

                            <div className="umkm-card">
                                <img src={SendalGarut} alt="Sandalias Kulit Garut" />
                                <div className="umkm-data">
                                    <h4 className="umkm-name">Sandalias Kulit Garut</h4>
                                    <h4 className="umkm-price">Rp 320.000</h4>
                                    <div className="umkm-cart">
                                        <p>+ Add to Cart</p>
                                    </div>
                                </div>
                            </div>

                            <div className="umkm-card">
                                <img src={KopiGayo} alt="Kopi Arabica Gayo" />
                                <div className="umkm-data">
                                    <h4 className="umkm-name">Kopi Arabica Gayo</h4>
                                    <h4 className="umkm-price">Rp 85.000</h4>
                                    <div className="umkm-cart">
                                        <p>+ Add to Cart</p>
                                    </div>
                                </div>
                            </div>

                            <div className="umkm-card">
                                <img src={AntingPerak} alt="Anting Perak Kotagede" />
                                <div className="umkm-data">
                                    <h4 className="umkm-name">Anting Perak Kotagede</h4>
                                    <h4 className="umkm-price">Rp 450.000</h4>
                                    <div className="umkm-cart">
                                        <p>+ Add to Cart</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="umkm-outline flex justify-between items-center w-full gap-7.5">
                            <div className="umkm-separator h-px w-full bg-[#99ff33] flex-1"></div>
                            <a href="#" className="btn-secondary">Lihat Semua</a>
                            <div className="umkm-separator h-px w-full bg-[#99ff33] flex-1"></div>
                        </div>
                    </section>

                    <section className="community-section flex items-center relative justify-between w-full min-h-[130vh] h-auto py-5 px-13.75 gap-7.5 overflow-hidden">
                        <div className="community-left flex flex-1 relative flex-col text-white gap-3.75
                            [&>h2]:text-[45px]
                            [&>h2]:font-medium">
                            <div className="tag text-white font-extralight text-2.5 border-0.5 border-[#99ff33] rounded-[100px] py-2.5 px-5 w-fit transition-all duration-200 tracking-[2px] hover:tracking-[3px]">
                                <h3>Marketplace UMKM Indonesia</h3>
                            </div>
                            <h2>
                                Bergabung Dengan <i className='text-[#99ff33]'>Komunitas</i> Untuk Berbagi Informasi.
                            </h2>
                            <div className="hero-btn">
                                <a href="#" className="btn-primary community-link flex items-center gap-2.5">
                                    Eksplor Disini
                                    <img src={RightArrowDark} alt="arrow right" width="30px" />
                                </a>
                            </div>
                        </div>

                        <div className="community-right flex flex-1 relative z-10">
                            <div className="community-img relative w-full h-full">
                                <img src={CommunityImg} alt="Community Image" className='absolute w-250 top-1/2 -left-50 z-1 -translate-y-1/2'/>
                            </div>
                        </div>
                    </section>

                    <section className="tracking-section px-13.75 pb-30 flex justify-center items-center">
                        <div className="tracking-container max-w-300 w-full flex items-center gap-17.5">
                            <div className="tracking-left flex-3">
                                <div className="tracking-map relative rounded-[22px] overflow-hidden border border-[#99ff33] shadow-[0_25px_70px_rgba(0,0,0,0.45)]">
                                    <img src={Map} alt="Live Tracking Merchant"
                                        className='w-full h-full object-cover block'/>

                                    <div className="map-panel-left absolute top-2.5 left-2.5 w-47.5 p-4.5 rounded-md bg-[rgba(30,30,30,0.75)] backdrop-blur-md text-white">
                                        <h4 className='mb-3.75 text-[16px]'>Toko Terdekat</h4>

                                        <div className="store-item flex justify-between items-center p-2.5 rounded-[10px] mb-2.5 bg-[rgba(255,255,255,0.05)]">
                                            <div>
                                                <strong>Bilung Naruto</strong>
                                                <p className='text-[12px] opacity-70'>Jajanan Lokal</p>
                                            </div>
                                            <span className="status open bg-[#99ff33] text-black text-[11px] py-1 px-2.5 rounded-full">Stay</span>
                                        </div>

                                        <div className="store-item flex justify-between items-center p-2.5 rounded-[10px] mb-2.5 bg-[rgba(255,255,255,0.05)]">
                                            <div>
                                                <strong>Kopi Keliling</strong>
                                                <p className='text-[12px] opacity-70'>Kopi dan Teh</p>
                                            </div>
                                            <span className="status closed border border-[#777] text-[#aaa] text-[11px] py-1 px-2.5 rounded-full">Closed</span>
                                        </div>
                                    </div>

                                    <div className="map-panel-right absolute top-2.5 right-2.5 w-45 p-4.5 rounded-md bg-[rgba(30,30,30,0.8)] backdrop-blur-md text-white">
                                        <div className="merchant-header flex gap-2.5 items-center mb-3.75">
                                            <img src={BilungNaruto} alt="bilung naruto"
                                                className='w-9.5 h-9.5 rounded-sm'/>
                                            <div>
                                                <strong>Toko Dipilih</strong>
                                                <p>Bilung Naruto</p>
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

                                        <button className='w-full p-2.5 rounded-[8px] border-0 bg-[#222] text-white cursor-pointer'>Lihat Toko</button>
                                    </div>

                                    <div className="map-marker absolute bottom-[31%] left-[47%] -translate-x-1/2 translate-y-1/2 w-4.5 h-4.5 bg-[#99ff33] rounded-full shadow-[0_0_20px_#99ff33]"></div>
                                </div>
                            </div>

                            <div className="tracking-right flex-1 flex flex-col gap-7.5">
                                <h2 className='text-white text-[64px] font-medium leading-[1.2]'>
                                    Nikmati<br />
                                    Fitur<br />
                                    <span className='text-[#99ff33]'>Live Tracking Merchant.</span>
                                </h2>

                                <a href="#" className="btn-secondary tracking-btn flex items-center justify-center gap-2 w-fit py-4 px-9.5 text-[16px]">
                                    Selengkapnya
                                    <img src={ArrowKananAtas} alt="arrow" className='w-4'/>
                                </a>
                            </div>
                        </div>
                    </section>

                    <section className="cta-section relative px-13.75 pt-30 pb-13.75 flex justify-center items-center
                        before:content-[''] before:absolute before:top-0 before:left-1/2 before:-translate-x-1/2
                        before:w-[82%] before:h-1 before:rounded-full before:pointer-events-none
                        before:bg-[linear-gradient(90deg,transparent_0%,transparent_6%,rgba(153,255,51,0.9)_30%,#99FF33_50%,rgba(153,255,51,0.9)_82%,transparent_94%,transparent_100%)]">

                        <div className="cta-card relative w-full max-w-275 px-15 py-22.5 text-center rounded-[30px] overflow-hidden
                            bg-[radial-gradient(circle_at_92%_8%,rgba(153,255,51,0.18)_0%,rgba(153,255,51,0.10)_18%,rgba(153,255,51,0.04)_30%,transparent_45%),linear-gradient(90deg,#0b0b0f_0%,#1a1a1f_60%,#23232b_100%)]
                            shadow-[0_40px_80px_rgba(0,0,0,0.45),inset_0_0_60px_rgba(0,0,0,0.6)]">

                            <h2 className="text-white text-[80px] font-medium leading-[1.2] mb-6.25 [&>span]:text-[#99FF33]">
                                Siap Melangkah Lebih Jauh Bersama <span>Khaslana?</span>
                            </h2>

                            <p className="text-[#bdbdbd] text-[16px] max-w-155 mx-auto mb-10 leading-7">
                                Akses mudah, produk berkualitas, dan komunitas yang supportif. Semua dalam satu genggaman
                            </p>

                            <a href="#" className="btn-primary cta-btn btn-primary-khaslana text-[16px] px-11.25 py-4">
                                Mulai!
                            </a>
                        </div>
                    </section>
                </div>
            </UserLayout>
        </>
    );
}
