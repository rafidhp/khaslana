import { useForm } from "@inertiajs/react";

import Heading from "@/components/heading";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { store } from "@/routes/additionalVerification";
import VerificationForm from "./sections/verification-info";
import VerificationStatus from "./sections/verification-status";
import { VerificationData } from "./types";
import VerifiedBadge from "@/components/khaslana/verified-badge";


interface Props {
    storeCompletion: {
        completed: boolean;
        missing: string[];
    };

    verification?: VerificationData;
}

export default function VerificationIndex({
    storeCompletion,
    verification,
}: Props) {

console.log("verification", verification);
    const form = useForm({

        owner_name: verification?.umkm?.user?.name ?? "",

        nik: verification?.nik ?? "",

        npwp: verification?.npwp ?? "",

        nib: verification?.nib ?? "",

        file_path: null as File | null,

    });

    const disabled =
        !storeCompletion.completed ||
        verification?.verification_status === "pending" ||
        verification?.verification_status === "verified";

    const handleSubmit = () => {

        form.post(store().url, {

            forceFormData: true,

            preserveScroll: true,

            onSuccess: () => {

                form.reset("file_path");

            },

        });

    };

    return (

        <div className="space-y-6">

            <div className="flex items-start justify-between gap-6">

                <Heading
                    title="Verifikasi UMKM"
    description="Kelola status verifikasi toko Anda."
                />

                {verification?.verification_status === "verified" && (

                    <VerifiedBadge
                        text="UMKM Terverifikasi"
                        size="md"
                    />

                )}

            </div>

            <VerificationStatus
                completed={storeCompletion.completed}
                verificationStatus={
                    verification?.verification_status ??
                    "not_submitted"
                }
                missing={storeCompletion.missing}
                adminReviewNote={
                    verification?.admin_review_note
                }
            />

            <Card className="border-[#99FF33]/40 bg-[#231F2B] shadow-none">

                <CardContent className="space-y-8 py-8">

                    <VerificationForm
                        verification={verification}
                        data={form.data}
                        setData={form.setData}
                        errors={form.errors}
                        disabled={disabled}
                    />

                    <div className="flex justify-end">

                        <Button
                            type="button"
                            disabled={disabled || form.processing}
                            onClick={handleSubmit}
                            className="
                            mt-2
                             bg-[#99FF33]
                             border border-[#99FF33]
                             hover:bg-[#1E1B26]
                             hover:text-[#99FF33]
                             transition-colors duration-200
                             hover:cursor-pointer"
                        >
                            {form.processing
                                ? "Mengirim..."
                                : verification?.verification_status === "rejected"
                                    ? "Kirim Ulang Verifikasi"
                                    : "Kirim Verifikasi"}
                        </Button>

                    </div>

                </CardContent>

            </Card>

        </div>

    );

}