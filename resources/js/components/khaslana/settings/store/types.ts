export interface StoreFormData {
    store_name: string;
    description: string;
    type: string;
    status: string;
    address: string;
    phone_number: string;
    province_id: string;
    city_id: string;
    district_id: string;
    village_id: string;
    open_days: string;
    open_time: string;
    close_time: string;
    is_order_feature: boolean;
    is_shipping_feature: boolean;
    shipping_cost: number;

    // umkm datas
    npwp: string;
    nib: string;
    nik: string;
    file_path: File | null;

    // umkm_images
    existing_images: {
        id: number;
        image: string;
    }[];
    deleted_existing_images: number[];
    images: File[];

    // umkm_locations
    latitude: number | null,
    longitude: number | null,
}