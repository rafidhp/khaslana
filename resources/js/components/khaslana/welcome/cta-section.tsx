export default function CtaSection() {
    return (
        <section className="cta-section w-screen relative px-13.75 max-sm:6 pt-30 pb-13.75 flex justify-center items-center
            before:content-[''] before:absolute before:top-0 before:left-1/2 before:-translate-x-1/2
            before:w-[82%] before:h-1 before:rounded-full before:pointer-events-none
            before:bg-[linear-gradient(90deg,transparent_0%,transparent_6%,rgba(153,255,51,0.9)_30%,#99FF33_50%,rgba(153,255,51,0.9)_82%,transparent_94%,transparent_100%)]"
        >
            <div className="cta-card relative w-full max-w-275 px-15 py-22.5 text-center rounded-[30px] overflow-hidden
                bg-[radial-gradient(circle_at_92%_8%,rgba(153,255,51,0.18)_0%,rgba(153,255,51,0.10)_18%,rgba(153,255,51,0.04)_30%,transparent_45%),linear-gradient(90deg,#0b0b0f_0%,#1a1a1f_60%,#23232b_100%)]
                shadow-[0_40px_80px_rgba(0,0,0,0.45),inset_0_0_60px_rgba(0,0,0,0.6)]"
            >
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
    )
}