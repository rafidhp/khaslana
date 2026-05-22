import { Link } from "@inertiajs/react"
import { Store, ArrowRight } from "lucide-react"
import { storeManagement } from "@/routes"

export default function CtaCard() {
    return (
        <div className="flex min-h-[70vh] items-center justify-center">
            <div className="w-full max-w-2xl rounded-3xl border border-sidebar-border/70 bg-background p-8 shadow-sm dark:border-sidebar-border">
                <div className="flex flex-col items-center text-center">
                    <div className="mb-5 flex size-20 items-center justify-center rounded-full bg-primary/10">
                        <Store className="size-10 text-primary" />
                    </div>

                    <h1 className="text-3xl font-bold tracking-tight">
                        Lengkapi Data UMKM Anda
                    </h1>

                    <p className="mt-3 max-w-lg text-muted-foreground">
                        Untuk membuka seluruh fitur dashboard, silakan
                        lengkapi terlebih dahulu data diri dan informasi
                        UMKM Anda.
                    </p>

                    <div className="mt-8 grid w-full gap-4 md:grid-cols-3">
                        <div className="rounded-2xl border border-sidebar-border/70 p-4 dark:border-sidebar-border">
                            <h3 className="font-semibold">
                                Profil UMKM
                            </h3>
                            <p className="mt-2 text-sm text-muted-foreground">
                                Isi identitas dan informasi usaha Anda.
                            </p>
                        </div>

                        <div className="rounded-2xl border border-sidebar-border/70 p-4 dark:border-sidebar-border">
                            <h3 className="font-semibold">
                                Akses Fitur
                            </h3>
                            <p className="mt-2 text-sm text-muted-foreground">
                                Buka seluruh fitur dashboard dan layanan.
                            </p>
                        </div>

                        <div className="rounded-2xl border border-sidebar-border/70 p-4 dark:border-sidebar-border">
                            <h3 className="font-semibold">
                                Tingkatkan Kredibilitas
                            </h3>
                            <p className="mt-2 text-sm text-muted-foreground">
                                Buat usaha Anda terlihat lebih profesional.
                            </p>
                        </div>
                    </div>

                    <Link
                        href={storeManagement().url}
                        className="mt-8 inline-flex items-center gap-2 rounded-xl bg-primary px-6 py-3 text-sm font-medium text-primary-foreground transition hover:opacity-90"
                    >
                        Lengkapi Sekarang
                        <ArrowRight className="size-4" />
                    </Link>
                </div>
            </div>
        </div>
    )
}