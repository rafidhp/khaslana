import { Link } from '@inertiajs/react';

export function PaginationSection() {
    return (
        <div className="flex justify-center items-center gap-2 pt-2.5 mt-8">
            <Link href="#" className="flex items-center justify-center w-[38px] h-[38px] rounded-full bg-transparent border border-white/5 text-[#989898] text-xs font-medium hover:bg-white/10 transition-colors">
                &lt;
            </Link>
            
            {/* Page Active */}
            <Link href="#" className="flex items-center justify-center w-[38px] h-[38px] rounded-full bg-[#99FF33] border border-[#99FF33] text-[#1E1B26] text-sm font-bold">
                1
            </Link>
            
            <Link href="#" className="flex items-center justify-center w-[38px] h-[38px] rounded-full bg-transparent border border-white/5 text-[#989898] text-sm font-medium hover:bg-white/10 transition-colors">
                2
            </Link>
            <Link href="#" className="flex items-center justify-center w-[38px] h-[38px] rounded-full bg-transparent border border-white/5 text-[#989898] text-sm font-medium hover:bg-white/10 transition-colors">
                3
            </Link>
            
            <span className="flex items-center justify-center w-[38px] h-[38px] text-[#989898] text-sm font-medium tracking-[1px]">
                ...
            </span>
            
            <Link href="#" className="flex items-center justify-center w-[38px] h-[38px] rounded-full bg-transparent border border-white/5 text-[#989898] text-sm font-medium hover:bg-white/10 transition-colors">
                12
            </Link>
            
            <Link href="#" className="flex items-center justify-center w-[38px] h-[38px] rounded-full bg-transparent border border-white/5 text-[#989898] text-xs font-medium hover:bg-white/10 transition-colors">
                &gt;
            </Link>
        </div>
    );
}