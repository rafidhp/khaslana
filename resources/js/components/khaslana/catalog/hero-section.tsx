import searchIcon from "@/assets/images/catalog/search-icon.svg";

interface Category {
    name: string;
}

interface HeroSectionProps {
    categories: Category[];

    search: string;
    selectedCategory: string;

    onSearchChange: (value: string) => void;
    onCategoryChange: (value: string) => void;
}

export function HeroSection({
    categories,
    search,
    selectedCategory,
    onSearchChange,
    onCategoryChange,
}: HeroSectionProps) {
    const formatCategory = (text: string) => text
        .toLowerCase()
        .replace(/\b\w/g, (char) => char.toUpperCase());

    return (
        <section className="flex flex-col gap-6 w-full">
            <div className="flex flex-col gap-2.5">
                <h1 className="text-white text-[32px] lg:text-[40px] font-bold leading-[1.2]">
                    <span className="text-[#99FF33]">Katalog Produk</span> Pilihan Kami.
                </h1>
                <p className="text-[#B7B7B7] text-sm lg:text-base max-w-125 leading-relaxed">
                    Mendukung pertumbuhan UMKM lokal melalui teknologi. 
                    Jelajahi karya tangan terbaik dari pengrajin dan produsen 
                    di seluruh Indonesia.
                </p>
            </div>

            <div className="flex items-center bg-[#242424] rounded-full px-6 py-4 gap-4 w-full transition focus-within:ring-2 focus-within:ring-[#99FF33]/40">
                <label htmlFor="catalog-search" className="cursor-pointer shrink-0">
                    <img src={searchIcon} alt="search" className="w-5 h-5 opacity-60" />
                </label>
                <input 
                    type="text" 
                    id="catalog-search" 
                    value={search}
                    onChange={(e) => onSearchChange(e.target.value)}
                    placeholder="Apa yang anda cari?" 
                    className="bg-transparent border-none outline-none text-white text-sm lg:text-base w-full placeholder:text-[#A3A3A3] focus:ring-0 p-0"
                />
            </div>

            <div className="flex items-center md:justify-center gap-3 mt-4 overflow-x-auto [-ms-overflow-style:none] [scrollbar-width:none] pb-2 scrollbar-hide snap-x snap-mandatory w-full">
                <button
                    onClick={() => onCategoryChange('')}
                    className={`
                        shrink-0
                        px-7 py-3
                        rounded-full
                        text-xs md:text-sm
                        whitespace-nowrap
                        transition-transform
                        ${
                            selectedCategory === ''
                                ? 'bg-[#99FF33] text-black font-bold'
                                : 'bg-[#242424] text-[#B7B7B7] hover:cursor-pointer'
                        }
                    `}
                >
                    Semua
                </button>
                {categories.map((category) => (
                    <button
                        key={category.name}
                        onClick={() => onCategoryChange(category.name)}
                        className={`
                            shrink-0
                            font-semibold
                            px-7 py-3
                            rounded-full
                            text-xs md:text-sm
                            whitespace-nowrap
                            transition-all
                             ${
                                selectedCategory === category.name
                                    ? 'bg-[#99FF33] text-black font-bold'
                                    : `
                                        bg-[#242424]
                                        border border-white/5
                                        text-[#B7B7B7]
                                        hover:bg-white/10
                                        hover:text-white hover:cursor-pointer
                                    `
                            }
                        `}
                    >
                        {formatCategory(category.name)}
                    </button>
                ))}
            </div>
        </section>
    );
}