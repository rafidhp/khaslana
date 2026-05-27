export interface Umkm {
    id: number;
    user_id: number;

    province_id: string;
    city_id: string;
    district_id: string;
    village_id: string;

    store_name: string;
    description: string;

    type: 'TETAP' | 'KELILING';
    status: 'BUKA' | 'TUTUP';

    address: string;
    phone_number: string;

    open_days: string | null;
    open_time: string | null;
    close_time: string | null;

    average_rating: number;

    is_order_feature: boolean;
    is_shipping_feature: boolean;

    shipping_cost: number;

    created_at: string;
    updated_at: string;

    province?: {
        code: string;
        name: string;
    };

    city?: {
        code: string;
        name: string;
    };

    district?: {
        code: string;
        name: string;
    };

    village?: {
        code: string;
        name: string;
    };

    user?: {
        id: number;
        name: string;
        username: string;
        email: string;

        profile?: {
            user_id: number;
            profile_photo: string | null;
            logo: string | null;
        };
    };

    umkm_data?: {
        id: number;
        npwp: string | null;
        nib: string | null;
        nik: string | null;
        image_hash: string | null;
        file_path: string | null;
    };

    umkm_images?: {
        id: number;
        image: string;
    }[];

    umkm_locations?: {
        id: number;
        latitude: number | null;
        longitude: number | null;
        is_active: boolean;

        status:
            | 'TUTUP'
            | 'MANGKAL'
            | 'KELILING'
            | null;
    }[];
}