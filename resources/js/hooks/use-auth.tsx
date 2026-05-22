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
        } | null;
    }
}

export function useAuth() {
    const { auth } = usePage<AuthProps>().props;

    return {
        user: auth?.user ?? null,
    }
}