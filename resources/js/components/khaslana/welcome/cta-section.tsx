export default function CtaSection() {
    return (
        <section className="relative w-full px-6 lg:px-14 pt-20 lg:pt-30 pb-16 lg:pb-20 flex justify-center items-center
            before:content-[''] before:absolute before:top-0 before:left-1/2 before:-translate-x-1/2
            before:w-[90%] lg:before:w-[82%] before:h-[2px] before:rounded-full before:pointer-events-none
            before:bg-[linear-gradient(90deg,transparent_0%,transparent_6%,rgba(153,255,51,0.9)_30%,#99FF33_50%,rgba(153,255,51,0.9)_82%,transparent_94%,transparent_100%)]"
        >
            <div className="relative w-full max-w-6xl px-6 sm:px-10 lg:px-16 py-12 sm:py-16 lg:py-20 text-center rounded-2xl lg:rounded-[30px] overflow-hidden
                bg-[radial-gradient(circle_at_92%_8%,rgba(153,255,51,0.18)_0%,rgba(153,255,51,0.10)_18%,rgba(153,255,51,0.04)_30%,transparent_45%),linear-gradient(90deg,#0b0b0f_0%,#1a1a1f_60%,#23232b_100%)]
                shadow-[0_20px_50px_rgba(0,0,0,0.45),inset_0_0_40px_rgba(0,0,0,0.6)]"
            >
                <h2 className="text-white font-medium leading-tight mb-6
                    text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-[72px]">
                    Siap Melangkah Lebih Jauh Bersama{" "}
                    <span className="text-[#99FF33]">Khaslana?</span>
                </h2>
                <p className="text-[#bdbdbd] text-sm sm:text-base max-w-xl mx-auto mb-8 sm:mb-10 leading-6 sm:leading-7">
                    Akses mudah, produk berkualitas, dan komunitas yang supportif. 
                    Semua dalam satu genggaman
                </p>
                <a
                    href="#"
                    className="btn-primary-khaslana inline-block font-semibold w-full md:w-fit text-sm sm:text-base md:text-lg px-6 sm:px-10 md:px-32 py-3 sm:py-4"
                >
                    MULAI
                </a>
            </div>
        </section>
    );
}