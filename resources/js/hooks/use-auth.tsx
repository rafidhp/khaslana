import type { PageProps } from "@inertiajs/core";
import { usePage } from "@inertiajs/react";

interface AuthProps extends PageProps {
    auth: {
        user: {
            id: number,
            name: string,
            username: string,
            email: string,
            is_umkm: boolean,
            profile_photo?: string | null,
            logo?: string | null;

            location?: {
                id: number;
                province_id: string;
                city_id: string;
                district_id: string;
                village_id: string;
                latitude: number | null,
                longitude: number | null,
                address: string,
            }

            umkm?: {
                id: number;
                type: string;
            } | null;
        } | null;
    }
}

export function useAuth() {
    const { auth } = usePage<AuthProps>().props;

    return {
        user: auth?.user ?? null,
    }
}