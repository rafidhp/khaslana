import { Link } from "@inertiajs/react"
import { ChevronRight } from "lucide-react"

export default function MenuSection() {
    return (
        <div className="flex items-center w-full mt-18">
            <div className="flex flex-col w-full gap-2">
                <h2 className="text-xl md:text-2xl font-bold">Menu Unggulan</h2>
                <div className="flex justify-between items-center w-full">
                    <h3 className="text-muted-foreground text-sm md:text-base">Koleksi produk produk unggulan dari toko kami.</h3>
                    <Link
                        href=""
                        className="flex gap-1 text-[#99FF33]"
                    >
                        Lihat semua menu
                        <ChevronRight className="w-5 h-5 transition-transform duration-300 group-hover:-translate-x-2 font-semibold" />
                    </Link>
                </div>
            </div>
        </div>
    )
}