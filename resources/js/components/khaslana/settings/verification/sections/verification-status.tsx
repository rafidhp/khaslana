import {
    ShieldCheck,
    Clock3,
    Lock,
    CircleX,
} from "lucide-react";

import VerifiedBadge from "@/components/khaslana/verified-badge";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface Props {
    completed: boolean;
    verificationStatus:
        | "not_submitted"
        | "pending"
        | "verified"
        | "rejected";

    missing: string[];

    adminReviewNote?: string | null;
}

export default function VerificationStatus({
    completed,
    verificationStatus,
    missing,
    adminReviewNote,
}: Props) {

    if (!completed) {
        return (
            <Card className="border-yellow-500 bg-yellow-500/10 p-5">

                <div className="flex gap-4">

                    <Lock className="text-yellow-500 mt-1" />

                    <div>

                        <h3 className="font-semibold">

                            Lengkapi Kelola Toko Terlebih Dahulu

                        </h3>

                        <p className="text-sm text-muted-foreground mt-1">

                            Lengkapi data berikut sebelum melakukan verifikasi.

                        </p>

                        <ul className="mt-3 list-disc pl-5 text-sm">

                            {missing.map(item => (

                                <li key={item}>

                                    {item}

                                </li>

                            ))}

                        </ul>

                    </div>

                </div>

            </Card>
        );
    }

    if (verificationStatus === "not_submitted") {

        return (

            <Card className="border-gray-300 bg-muted/30 p-5">

                <div className="flex gap-4">

                    <Lock className="text-muted-foreground mt-1" />

                    <div>

                        <h3 className="font-semibold">

                            Belum Mengajukan Verifikasi

                        </h3>

                        <p className="text-sm text-muted-foreground mt-1">

                            Lengkapi data di bawah untuk mengajukan
                            verifikasi UMKM.

                        </p>

                    </div>

                </div>

            </Card>

        );

    }

    if (verificationStatus === "pending") {

        return (

            <Card className="border-blue-500 bg-blue-500/10 p-5">

                <div className="flex gap-4">

                    <Clock3 className="text-blue-500 mt-1" />

                    <div>

                        <h3 className="font-semibold">

                            Verifikasi Sedang Ditinjau

                        </h3>

                        <p className="text-sm text-muted-foreground">

                            Data sedang diperiksa oleh Super Admin.

                        </p>

                    </div>

                </div>

            </Card>

        );

    }

    if (verificationStatus === "verified") {

        return (

            <Card className="border-[#99FF33] bg-[#99FF33]/10 p-5">
<div className="flex flex-wrap items-center justify-between gap-3"></div>
                <div className="flex-1">

                    <div className="flex flex-wrap items-center justify-between gap-3">

                        <h3 className="text-lg font-semibold tracking-tight">

                            UMKM Terverifikasi

                        </h3>

                    </div>

                    <p className="mt-2 text-sm text-muted-foreground leading-6">

                        UMKM Anda telah berhasil diverifikasi oleh Super Admin.
                        Badge UMKM telah aktif dan akan ditampilkan pada profil serta halaman toko Anda.

                    </p>

                </div>

            </Card>

        );

    }

    if (verificationStatus === "rejected") {

        return (

            <Card className="border-red-500 bg-red-500/10 p-5">

                <div className="flex gap-4">

                    <CircleX className="text-red-500 mt-1" />

                    <div>

                        <h3 className="font-semibold">

                            Verifikasi Ditolak

                        </h3>

                        <p className="text-sm text-muted-foreground">

                            {adminReviewNote ??
                                "Silakan periksa kembali data yang Anda kirim kemudian ajukan ulang verifikasi."}

                        </p>

                    </div>

                </div>

            </Card>

        );

    }

    return null;

}