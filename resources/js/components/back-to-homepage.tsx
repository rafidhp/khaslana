import { ChevronLeft } from "lucide-react"

import { home } from "@/routes"

export default function BackToHomepage() {
    return (
        <div className="flex justify-center items-center mb-1 w-full" onClick={() => sessionStorage.removeItem('has_seen_welcome')}>
            <a
                href={home().url}
                className="
                    flex items-center justify-center
                    border-1 border-[#99FF33] rounded-md
                    py-1.5 pe-2 group-data-[collapsible=icon]:pe-0 gap-1 w-full
                    bg-[#99FF33]
                    text-[#1E1B26] text-sm md:text-base font-medium
                    hover:bg-[#1E1B26] hover:text-[#99FF33]
                    transition-colors duration-200
                "
            >
                <ChevronLeft className="h-5 w-5 shrink-0" />
                <span className="group-data-[collapsible=icon]:hidden">
                    Kembali ke Beranda
                </span>
            </a>
        </div>
    )
}