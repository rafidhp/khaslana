import searchIcon from "@/assets/images/catalog/search-icon.svg";

export function HeroSection() {
    return (
        <section className="flex flex-col gap-6 pt-[130px] pb-[35px] w-full">
            {/* Teks Hero */}
            <div className="flex flex-col gap-2.5">
                <h1 className="text-white text-[32px] lg:text-[40px] font-bold leading-[1.2]">
                    <span className="text-[#99FF33]">Katalog Produk</span> Pilihan Kami.
                </h1>
                <p className="text-[#B7B7B7] text-sm lg:text-base max-w-[500px] leading-relaxed">
                    Mendukung pertumbuhan UMKM lokal melalui teknologi. 
                    Jelajahi karya tangan terbaik dari pengrajin dan produsen 
                    di seluruh Indonesia.
                </p>
            </div>

            {/* Search Bar (Style disamakan dengan UMKM Filter) */}
            <div className="flex items-center bg-[#242424] rounded-full px-6 py-4 gap-4 w-full transition focus-within:ring-2 focus-within:ring-[#99FF33]/40">
                <label htmlFor="katalog-search" className="cursor-pointer shrink-0">
                    <img src={searchIcon} alt="search" className="w-5 h-5 opacity-60" />
                </label>
                <input 
                    type="text" 
                    id="katalog-search" 
                    placeholder="Apa yang anda cari?" 
                    className="bg-transparent border-none outline-none text-white text-sm lg:text-base w-full placeholder:text-[#A3A3A3] focus:ring-0 p-0"
                />
            </div>

            {/* Filter Buttons */}
            <div className="flex items-center md:justify-center gap-3 mt-4 overflow-x-auto pb-2 scrollbar-hide -mx-4 px-4 md:mx-0 md:px-0">
                <button className="bg-[#99FF33] text-black font-bold px-7 py-3 rounded-full text-sm whitespace-nowrap transition-transform hover:scale-105">Semua</button>
                <button className="bg-[#242424] border border-white/5 text-[#B7B7B7] font-semibold px-7 py-3 rounded-full text-sm whitespace-nowrap hover:bg-white/10 hover:text-white transition-all">Kerajinan</button>
                <button className="bg-[#242424] border border-white/5 text-[#B7B7B7] font-semibold px-7 py-3 rounded-full text-sm whitespace-nowrap hover:bg-white/10 hover:text-white transition-all">Fashion</button>
                <button className="bg-[#242424] border border-white/5 text-[#B7B7B7] font-semibold px-7 py-3 rounded-full text-sm whitespace-nowrap hover:bg-white/10 hover:text-white transition-all">FnB</button>
                <button className="bg-[#242424] border border-white/5 text-[#B7B7B7] font-semibold px-7 py-3 rounded-full text-sm whitespace-nowrap hover:bg-white/10 hover:text-white transition-all">Jasa</button>
            </div>
        </section>
    );
}