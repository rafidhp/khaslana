
import searchIcon from "@/assets/images/katalog/search_icon.svg";

export function HeroSection() {
    return (
        <section className="flex flex-col gap-6 pt-[130px] pb-[35px] w-full">
            {/* Teks Hero */}
            <div className="flex flex-col gap-2.5">
                <h1 className="text-white text-[40px] font-semibold leading-[1.2]">
                    <span className="text-[#99FF33]">Katalog Produk</span> Pilihan Kami.
                </h1>
                <p className="text-[#989898] text-[13.5px] max-w-[460px] leading-[1.75]">
                    Mendukung pertumbuhan UMKM lokal melalui teknologi. 
                    Jelajahi karya tangan terbaik dari pengrajin dan produsen 
                    di seluruh Indonesia.
                </p>
            </div>

            {/* Search Bar */}
            <div className="flex items-center bg-[#262626] rounded-full px-[22px] py-[14px] gap-3 w-full">
                <label htmlFor="katalog-search" className="cursor-pointer shrink-0">
                    <img src={searchIcon} alt="search" className="w-[18px] h-[18px] opacity-50" />
                </label>
                <input 
                    type="text" 
                    id="katalog-search" 
                    placeholder="Apa yang anda cari?" 
                    className="bg-transparent border-none outline-none text-white text-sm w-full placeholder-[#c1c1c1] focus:ring-0 p-0"
                />
            </div>

            {/* Filter Buttons */}
            <div className="flex items-center justify-center gap-2.5 mt-2 overflow-x-auto pb-2 scrollbar-hide w-full">
                <button className="bg-[#99FF33] text-[#1E1B26] font-semibold px-6 py-2.5 rounded-full text-[13px] whitespace-nowrap">Semua</button>
                <button className="bg-[#262626] text-[#989898] font-medium px-6 py-2.5 rounded-full text-[13px] whitespace-nowrap hover:text-white transition-colors">Kerajinan</button>
                <button className="bg-[#262626] text-[#989898] font-medium px-6 py-2.5 rounded-full text-[13px] whitespace-nowrap hover:text-white transition-colors">Fashion</button>
                <button className="bg-[#262626] text-[#989898] font-medium px-6 py-2.5 rounded-full text-[13px] whitespace-nowrap hover:text-white transition-colors">FnB</button>
                <button className="bg-[#262626] text-[#989898] font-medium px-6 py-2.5 rounded-full text-[13px] whitespace-nowrap hover:text-white transition-colors">Jasa</button>
            </div>
        </section>
    );
}