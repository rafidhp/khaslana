import { Umkm } from "@/types/umkm";

export type VerificationStatus =
    | "not_submitted"
    | "pending"
    | "verified"
    | "rejected";

export interface VerificationData {
    verification_status: VerificationStatus;

    umkm: Umkm;

    admin_review_note?: string | null;

    owner_name: string;

    nik: string;

    npwp: string;

    nib: string;

    file_path?: string | null;
}

export interface StoreCompletionData {
    completed: boolean;

    missing: string[];
}