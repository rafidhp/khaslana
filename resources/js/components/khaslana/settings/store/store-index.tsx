import { useForm, usePage } from "@inertiajs/react"
import { useEffect, useState } from "react";
import Heading from '@/components/heading';
import AdditionalFeatures from "@/components/khaslana/settings/store/sections/additional-features";
import Address from "@/components/khaslana/settings/store/sections/address";
import OperationalHour from "@/components/khaslana/settings/store/sections/operational-hour";
import StoreImages from "@/components/khaslana/settings/store/sections/store-images";
import StoreInfo from "@/components/khaslana/settings/store/sections/store-info";
import StoreLogo from "@/components/khaslana/settings/store/sections/store-logo";
import type { StoreFormData } from "@/components/khaslana/settings/store/types";
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { useAuth } from "@/hooks/use-auth";
import { showErrorToast, showSuccessToast } from "@/lib/toast";
import { store, update } from "@/routes/storeManagement";

interface Props {
    provinces: {
        code: string;
        name: string;
    }[];

    umkm?: {
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

        npwp: string | null;
        nib: string | null;
        nik: string | null;

        existing_images: {
            id: number;
            image: string;
        }[];
        images: File[];

        latitude: number | null;
        longitude: number | null;
    };
}

export default function StoreIndex({
    provinces,
}: Props) {
    const { user } = useAuth();
    const { props } = usePage<{
        provinces: Props['provinces'];
        umkm: Props['umkm'];
        flash: {
            success?: string;
            error?: string;
        };
    }>();
    const [isValidImages, setIsValidImages] = useState(true);

    const umkm = props.umkm;
    const form = useForm<StoreFormData>({
        store_name: umkm?.store_name ?? '',
        description: umkm?.description ?? '',
        type: umkm?.type ?? '',
        status: umkm?.status ?? 'TUTUP',
        address: umkm?.address ?? '',
        phone_number: umkm?.phone_number ?? '',
        province_id: umkm?.province_id ?? '',
        city_id: umkm?.city_id ?? '',
        district_id: umkm?.district_id ?? '',
        village_id: umkm?.village_id ?? '',
        open_days: umkm?.open_days ?? '',
        open_time: umkm?.open_time ?? '',
        close_time: umkm?.close_time ?? '',
        is_order_feature: Boolean(umkm?.is_order_feature),
        is_shipping_feature: Boolean(umkm?.is_shipping_feature),
        shipping_cost: umkm?.shipping_cost ?? 0,

        npwp: umkm?.npwp ?? '',
        nib: umkm?.nib ?? '',
        nik: umkm?.nik ?? '',
        file_path: null,

        existing_images: umkm?.existing_images ?? [],
        deleted_existing_images: [],
        images: [],

        latitude: umkm?.latitude ?? null,
        longitude: umkm?.longitude ?? null,
    });
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!isValidImages) {
            showErrorToast('Foto toko wajib diisi');
            return;
        }
        if (user.is_umkm) {
            form.put(update().url);
        } else {
            form.post(store().url);
        }
        // const handleError = (
        //     errors: Record<string, string>
        // ) => {
        //     const uniqueErrors = [...new Set(Object.values(errors))];

        //     uniqueErrors.forEach((message) => {
        //         showErrorToast(
        //             'Validasi gagal',
        //             message
        //         );
        //     });
        // };

        // if (user.is_umkm) {
        //     form.put(update().url, {
        //         onError: handleError,
        //     });
        // } else {
        //     form.post(store().url, {
        //         onError: handleError,
        //     });
        // }
    };

    useEffect(() => {
        if (props.flash?.success) {
            showSuccessToast(
                'Berhasil',
                props.flash.success,
            );
        }

        if (props.flash?.error) {
            showErrorToast(
                'Gagal menyimpan data UMKM',
                props.flash.error,
            );
        }
    }, [props.flash]);

    return (
        <div className="space-y-6">
            <Heading
                variant="default"
                title={
                    user.is_umkm
                        ? 'Kelola Toko'
                        : 'Data UMKM'
                }
                description={
                    user.is_umkm
                        ? 'Kelola informasi toko anda'
                        : 'Lengkapi data UMKM anda terlebih dahulu untuk membuka fitur!'
                }
            />
            <Card className="bg-transparent border-2 border-[#99FF33]/50">
                <CardContent>
                    <StoreLogo />
                    <form
                        onSubmit={handleSubmit}
                        className="space-y-4"
                    >
                        <StoreInfo
                            data={form.data}
                            setData={form.setData}
                            errors={form.errors}
                        />

                        <Address
                            data={form.data}
                            setData={form.setData}
                            errors={form.errors}
                            provinces={provinces}
                        />

                        <OperationalHour
                            data={form.data}
                            setData={form.setData}
                            errors={form.errors}
                        />

                        <StoreImages
                            data={form.data}
                            setData={form.setData}
                            errors={form.errors}
                            setIsValidImages={setIsValidImages}
                        />

                        <AdditionalFeatures
                            data={form.data}
                            setData={form.setData}
                        />

                        <Button
                            type="submit"
                            disabled={form.processing}
                            className={`
                                mt-2
                                bg-[#99FF33]
                                border border-[#99FF33]
                                hover:bg-[#1E1B26]
                                hover:text-[#99FF33]
                                transition-colors duration-200
                                hover:cursor-pointer
                                ${!user.is_umkm && 'w-full'}
                            `}
                        >
                            {form.processing
                                ? 'Menyimpan...'
                                : user.is_umkm
                                    ? 'Simpan Perubahan'
                                    : 'Simpan Data UMKM'}
                        </Button>
                    </form>
                </CardContent>
            </Card>
        </div>
    )
}