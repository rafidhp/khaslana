import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
    DialogTrigger,
} from "@/components/ui/dialog";
import { ScrollText } from "lucide-react";

interface Props {
    notes: string | null;
}

export default function NotesDialog({ notes }: Props) {
    return (
        <Dialog>
            <DialogTrigger asChild>
                <button
                    className="
                        flex items-center gap-1
                        text-sm
                        hover:text-[#99FF33]
                        transition-colors
                        cursor-pointer
                    "
                >
                    <ScrollText size={16} />
                    Catatan
                </button>
            </DialogTrigger>

            <DialogContent
                className="
                    w-full max-w-md
                    bg-[#131313]
                    border border-[#99ff33]/20
                    rounded-2xl py-6
                    shadow-[0_0_40px_rgba(153,255,51,0.15)]
                    flex flex-col items-start gap-4
                "
            >
                <DialogHeader className="w-full flex flex-row items-center gap-4">
                    <div
                        className="
                            w-16 h-16
                            rounded-full
                            bg-[#99ff33]/10
                            flex items-center justify-center
                        "
                    >
                        <ScrollText className="w-8 h-8 text-[#99FF33]" />
                    </div>
                    <div className="flex flex-col gap-1">
                        <DialogTitle className="text-xl font-semibold text-white">
                            Catatan Pembeli
                        </DialogTitle>
                        <DialogDescription className="text-sm text-[#a1a1a1]">
                            Catatan yang diberikan pembeli untuk pesanan ini.
                        </DialogDescription>
                    </div>
                </DialogHeader>

                <div className="mt-2 w-full rounded-lg border border-[#444] bg-[#1a1a1a] p-4 text-sm leading-relaxed whitespace-pre-wrap">
                    {notes || "Pembeli tidak memberikan catatan."}
                </div>
            </DialogContent>
        </Dialog>
    );
}