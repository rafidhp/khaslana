export interface ProfileFormData {
    name: string;
    username: string;
    email: string;

    latitude: number | null;
    longitude: number | null;

    province_id: string;
    city_id: string;
    district_id: string;
    village_id: string;

    address: string;

    profile_photo: File | null;
}