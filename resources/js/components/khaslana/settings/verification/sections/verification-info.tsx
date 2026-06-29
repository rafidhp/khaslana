import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ImagePlus } from "lucide-react";
import { useRef } from "react";
import { VerificationData } from "../types";

type VerificationFormData = {
    owner_name: string;
    nik: string;
    npwp: string;
    nib: string;
    file_path: File | null;
};

interface Props {
    verification?: VerificationData;
    data: VerificationFormData;
    setData: (
        key: keyof VerificationFormData,
        value: VerificationFormData[keyof VerificationFormData]
    ) => void;
    errors: Record<string, string>;
    disabled: boolean;
}

export default function VerificationInfo({
    verification,
    data,
    setData,
    errors,
    disabled,
}: Props) {
    const fileInputRef = useRef<HTMLInputElement>(null);
    const previewUrl = data.file_path
        ? URL.createObjectURL(data.file_path)
        : null;
    const submittedPreview = verification?.file_path ?? null;
    const hasSubmitted =
        verification?.verification_status === "pending" ||
        verification?.verification_status === "verified";

    return (
        <div className="space-y-6">
            <div>
                <h3 className="text-lg font-semibold">
                    Informasi Verifikasi
                </h3>
                <p className="text-sm text-muted-foreground">
                    Lengkapi data sesuai identitas resmi pemilik UMKM.
                </p>
            </div>
            <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                    <Label>
                        Nama Pemilik
                        <span className="text-white/40 text-xs"> (Ubah nama Anda di profil)</span>
                    </Label>
                    <Input
                        disabled
                        placeholder="Nama sesuai KTP"
                        value={data.owner_name}
                        onChange={(e) => {
                            const value = e.target.value.replace(
                                /[^A-Za-z\s.]/g,
                                ""
                            );
                            setData(
                                "owner_name",
                                value
                            );
                        }}
                        className="
                            mt-2 disabled:opacity-70
                            border-gray-500/30 disabled:border-gray-500/50
                            focus-visible:border-[#99FF33]
                            focus-visible:ring-0
                            disabled:pointer-events-auto disabled:cursor-not-allowed
                        "
                    />

                    {errors.owner_name && (
                        <p className="text-sm text-red-500">
                            {errors.owner_name}
                        </p>
                    )}
                </div>
                <div className="space-y-2">
                    <Label>
                        NIK
                        <span className="text-red-400"> *</span>
                    </Label>
                    <Input
                        disabled={disabled}
                        placeholder="16 Digit"
                        value={data.nik}
                        onChange={(e) => {
                            const value = e.target.value
                                .replace(/\D/g, "")
                                .slice(0, 16);

                            setData(
                                "nik",
                                value
                            );
                        }}
                        className="
                            mt-2
                            border-gray-500/30
                            focus-visible:border-[#99FF33]
                            focus-visible:ring-0
                        "
                    />

                    {errors.nik && (
                        <p className="text-sm text-red-500">
                            {errors.nik}
                        </p>
                    )}
                </div>
            </div>
            <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                    <Label>
                        NPWP
                        <span className="text-red-400"> *</span>
                    </Label>
                    <Input
                        disabled={disabled}
                        placeholder="NPWP"
                        value={data.npwp}
                        onChange={(e) => {
                            const value = e.target.value
                                .replace(/\D/g, "")
                                .slice(0, 20);

                            setData(
                                "npwp",
                                value
                            );
                        }}
                        className="
                            mt-2
                            border-gray-500/30
                            focus-visible:border-[#99FF33]
                            focus-visible:ring-0
                        "
                    />
                    {errors.npwp && (
                        <p className="text-sm text-red-500">
                            {errors.npwp}
                        </p>
                    )}
                </div>
                <div className="space-y-2">
                    <Label>
                        NIB
                        <span className="text-red-400"> *</span>
                    </Label>
                    <Input
                        disabled={disabled}
                        placeholder="Nomor Induk Berusaha"
                        value={data.nib}
                        onChange={(e) => {
                            const value = e.target.value
                                .replace(/\D/g, "")
                                .slice(0, 20);

                            setData(
                                "nib",
                                value
                            );
                        }}
                        className="
                            mt-2
                            border-gray-500/30
                            focus-visible:border-[#99FF33]
                            focus-visible:ring-0
                        "
                    />
                    {errors.nib && (
                        <p className="text-sm text-red-500">
                            {errors.nib}
                        </p>
                    )}
                </div>
            </div>
            <div className="flex flex-col">
                <Label className="mb-2">
                    Foto KTP
                    <span className="text-red-400"> *</span>
                </Label>
                <div className="space-y-2">
                    <input
                        ref={fileInputRef}
                        hidden
                        type="file"
                        accept="image/png,image/jpeg,image/jpg"
                        disabled={disabled}
                        onChange={(e) => {
                            const file = e.target.files?.[0] ?? null;
                            setData(
                                "file_path",
                                file
                            );
                        }}
                    />
                    <div
                        onClick={() => {
                            if (!disabled) {
                                fileInputRef.current?.click();
                            }
                        }}
                        className={`
                            flex
                            cursor-pointer
                            flex-col
                            items-center
                            justify-center
                            rounded-xl
                            border
                            border-dashed
                            border-[#99FF33]/30
                            bg-[#231F2B]
                            px-6
                            transition
                            ${previewUrl
                                ? "min-h-55 py-4"
                                : "min-h-55 py-6"
                            }
                            ${disabled
                                ? "cursor-not-allowed opacity-60"
                                : "hover:border-[#99FF33] hover:bg-[#2A2534]"
                            }
                        `}
                    >
                        {previewUrl ? (
                            <div className="flex flex-col justify-center items-center">
                                <img
                                    src={previewUrl}
                                    alt="Preview KTP"
                                    className="
                                        h-40
                                        w-auto
                                        max-w-full
                                        rounded-lg
                                        object-contain
                                    "
                                />
                                <p className="mt-3 text-sm font-medium">
                                    Dokumen KTP
                                </p>
                            </div>
                        ) : hasSubmitted ? (
                            <div className="flex flex-col justify-center items-center">
                                <img
                                    src={submittedPreview!}
                                    alt="Preview KTP"
                                    className="
                                        h-40
                                        w-auto
                                        max-w-full
                                        rounded-lg
                                        object-contain
                                    "
                                />
                                <p className="mt-3 text-sm font-medium">
                                    Dokumen KTP
                                </p>
                            </div>
                        ) : (
                            <>
                                <div className="mb-4 rounded-full bg-[#99FF33]/10 p-4">
                                    <ImagePlus
                                        size={30}
                                        className="text-[#99FF33]"
                                    />
                                </div>
                                <p className="font-medium">
                                    Klik untuk upload KTP
                                </p>
                                <p className="mt-2 text-sm text-muted-foreground">
                                    PNG, JPG, JPEG • Maks 1 MB
                                </p>
                            </>
                        )}
                    </div>
                </div>
                {errors.file_path && (
                    <p className="text-sm text-red-500 mt-2">
                        {errors.file_path}
                    </p>
                )}
            </div>
        </div>
    );
}