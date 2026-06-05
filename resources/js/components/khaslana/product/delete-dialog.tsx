import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

interface DeleteDialogProps {
    productName: string;
    onDelete: () => void;
    children: React.ReactNode;
}

export default function DeleteDialog({
    productName,
    onDelete,
    children,
}: DeleteDialogProps) {
    return (
        <AlertDialog>
            <AlertDialogTrigger asChild>
                {children}
            </AlertDialogTrigger>
            <AlertDialogContent className="bg-[#1E1B26] border border-[#99FF33]/50">
                <AlertDialogHeader>
                    <AlertDialogTitle>
                        Hapus Produk
                    </AlertDialogTitle>
                    <AlertDialogDescription>
                        Apakah Anda yakin ingin menghapus produk{" "}
                        <span className="font-semibold text-[#99FF33]">
                            {productName}
                        </span>
                        ?

                        <br />

                        Semua gambar, variant, dan relasi produk akan ikut terhapus.
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel className="cursor-pointer">
                        Batal
                    </AlertDialogCancel>
                    <AlertDialogAction
                        onClick={onDelete}
                        className="bg-red-500 hover:bg-red-700 text-white transition-colors duration-300">
                        Hapus
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    )
}