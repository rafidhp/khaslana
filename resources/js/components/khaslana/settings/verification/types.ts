import { Umkm } from "@/types/umkm";

export type VerificationStatus =
    | "not_submitted"
    | "pending"
    | "verified"
    | "rejected";

export interface VerificationData {
    admin_review_note?: string | null;
    nik: string;
    npwp: string;
    nib: string;
    file_path?: string | null;

    verification_status: VerificationStatus;
    umkm: Umkm;
}

export interface StoreCompletionData {
    completed: boolean;
    missing: string[];
}