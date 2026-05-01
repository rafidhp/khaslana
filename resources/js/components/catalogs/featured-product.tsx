import batikImg from "@/assets/images/katalog/batik solo.png";
import cartMainIcon from "@/assets/images/katalog/cartmain.svg";
import cartSideIcon from "@/assets/images/katalog/cartside.svg";
import sambalImg from "@/assets/images/katalog/sambal.png";

export function FeaturedProduct() {
    return (
        <section className="grid grid-cols-1 lg:grid-cols-[2fr_1fr] gap-4 w-full h-auto lg:h-[533px] mb-6">
            {/* Main Featured (Batik Solo) */}
            <div className="relative rounded-2xl overflow-hidden cursor-pointer group h-[400px] lg:h-full">
                <img 
                    src={batikImg} 
                    alt="Batik Tulis Premium Solo" 
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-x-0 bottom-0 p-6 bg-gradient-to-t from-black/90 via-black/40 to-transparent flex flex-col gap-1.5">
                    <span className="bg-[#99FF33]/20 text-[#99FF33] text-[10px] font-bold tracking-widest uppercase px-3 py-1.5 rounded-full w-fit mb-1.5">
                        Best Seller
                    </span>
                    <div className="flex justify-between items-end">
                        <div>
                            <h3 className="text-white text-2xl font-semibold">Batik Tulis Premium Solo</h3>
                            <p className="text-[#99FF33] text-base font-semibold mt-1">Rp 1.250.000</p>
                        </div>
                        <button className="flex items-center justify-center w-12 h-12 bg-[#1E1B26]/60 backdrop-blur-sm border-2 border-[#99FF33] rounded-xl hover:bg-[#99FF33]/20 transition-colors">
                            <img src={cartMainIcon} alt="add to cart" className="w-5 h-5" />
                        </button>
                    </div>
                </div>
            </div>

            {/* Side Featured (Sambal) */}
            <div className="flex flex-col bg-[#252231] rounded-2xl border border-white/5 overflow-hidden cursor-pointer group h-[280px] lg:h-full">
                <div className="relative flex-1 overflow-hidden">
                    <span className="absolute top-4 right-4 bg-[#252231] text-white border border-white/15 text-[11px] font-semibold px-3 py-1 rounded-full z-10">
                        New
                    </span>
                    <img 
                        src={sambalImg} 
                        alt="Sambal Bajak Ibu Risma" 
                        className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                </div>
                <div className="p-4 flex flex-col gap-1">
                    <h4 className="text-white text-[15px] font-semibold">Sambal Bajak Ibu Risma</h4>
                    <p className="text-[#6a6a7e] text-xs">Resep tradisional autentik 250gr</p>
                    <div className="flex items-center justify-between mt-2">
                        <span className="text-[#99FF33] text-[15px] font-semibold">Rp 45.000</span>
                        <button className="flex items-center justify-center w-9 h-9 bg-transparent border border-white/10 rounded-lg hover:bg-white/10 transition-colors">
                            <img src={cartSideIcon} alt="add to cart" className="w-4 h-4" />
                        </button>
                    </div>
                </div>
            </div>
        </section>
    );
}