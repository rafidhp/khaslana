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
import {
    Tabs,
    TabsContent,
    TabsList,
    TabsTrigger,
} from '@/components/ui/tabs';
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
    const [activeTab, setActiveTab] = useState('informasi');

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

    const requiredTabs = [
        {
            tab: 'Informasi',
            isValid: () =>
                !!form.data.store_name &&
                !!form.data.description &&
                !!form.data.type &&
                !!form.data.phone_number,
        },
        {
            tab: 'Alamat',
            isValid: () =>
                !!form.data.province_id &&
                !!form.data.city_id &&
                !!form.data.district_id &&
                !!form.data.village_id &&
                !!form.data.address,
        },
        {
            tab: 'Operasional',
            isValid: () =>
                !!form.data.open_days &&
                !!form.data.open_time &&
                !!form.data.close_time,
        },
        {
            tab: 'Foto',
            isValid: () =>
                form.data.images.length > 0 ||
                form.data.existing_images.length > 0,
        },
    ];

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        const tabMap = {
            Informasi: 'informasi',
            Alamat: 'alamat',
            Operasional: 'operasional',
            Foto: 'foto',
        } as const;
        type TabLabel = keyof typeof tabMap;

        const invalidTabs = requiredTabs
            .filter(tab => !tab.isValid())
            .map(tab => tab.tab as TabLabel);

        if (invalidTabs.length > 0) {
            setActiveTab(tabMap[invalidTabs[0]]);

            showErrorToast(
                'Data belum lengkap',
                `Data di dalam Tab ${invalidTabs.join(', ')} harus dilengkapi!`
            );

            return;
        }

        if (!isValidImages) {
            showErrorToast('Foto toko wajib diisi');
            return;
        }
        if (user.is_umkm) {
            form.put(update().url);
        } else {
            form.post(store().url);
        }
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
                        : 'Lengkapi data UMKM anda terlebih dahulu untuk membuka fitur! Tab Informasi, Alamat, Operasional dan Foto wajib di isi!'
                }
            />
            <Tabs
                className="w-full"
                value={activeTab}
                onValueChange={setActiveTab}
            >
                <div className="w-full overflow-x-auto scrollbar-none [-ms-overflow-style:none] [scrollbar-width:1px]">
                    <TabsList
                        className="
                            w-max
                            min-w-full
                            flex-nowrap
                            gap-2
                            bg-[#1E1B26]
                            p-1
                        "
                    >
                        <TabsTrigger
                            value="informasi"
                            className="
                                shrink-0 px-4!
                                whitespace-nowrap
                                data-[state=active]:bg-[#99FF33]!
                                data-[state=active]:text-black!
                                data-[state=active]:hover:cursor-default!
                                hover:text-[#99FF33]!
                                hover:cursor-pointer!
                            "
                        >
                            Informasi
                            <span className="text-red-400"> *</span>
                        </TabsTrigger>

                        <TabsTrigger
                            value="logo"
                            className="
                                shrink-0 px-4!
                                whitespace-nowrap
                                data-[state=active]:bg-[#99FF33]!
                                data-[state=active]:text-black!
                                data-[state=active]:hover:cursor-default!
                                hover:text-[#99FF33]!
                                hover:cursor-pointer!
                            "
                        >
                            Logo
                        </TabsTrigger>

                        <TabsTrigger
                            value="alamat"
                            className="
                                shrink-0 px-4!
                                whitespace-nowrap
                                data-[state=active]:bg-[#99FF33]!
                                data-[state=active]:text-black!
                                data-[state=active]:hover:cursor-default!
                                hover:text-[#99FF33]!
                                hover:cursor-pointer!
                            "
                        >
                            Alamat
                            <span className="text-red-400"> *</span>
                        </TabsTrigger>

                        <TabsTrigger
                            value="operasional"
                            className="
                                shrink-0 px-4!
                                whitespace-nowrap
                                data-[state=active]:bg-[#99FF33]!
                                data-[state=active]:text-black!
                                data-[state=active]:hover:cursor-default!
                                hover:text-[#99FF33]!
                                hover:cursor-pointer!
                            "
                        >
                            Operasional
                            <span className="text-red-400"> *</span>
                        </TabsTrigger>

                        <TabsTrigger
                            value="foto"
                            className="
                                shrink-0 px-4!
                                whitespace-nowrap
                                data-[state=active]:bg-[#99FF33]!
                                data-[state=active]:text-black!
                                data-[state=active]:hover:cursor-default!
                                hover:text-[#99FF33]!
                                hover:cursor-pointer!
                            "
                        >
                            Foto
                            <span className="text-red-400"> *</span>
                        </TabsTrigger>

                        <TabsTrigger
                            value="fitur"
                            className="
                                shrink-0 px-4!
                                whitespace-nowrap
                                data-[state=active]:bg-[#99FF33]!
                                data-[state=active]:text-black!
                                data-[state=active]:hover:cursor-default!
                                hover:text-[#99FF33]!
                                hover:cursor-pointer!
                            "
                        >
                            Fitur
                        </TabsTrigger>
                    </TabsList>
                </div>

                <Card className="bg-transparent border-2 border-[#99FF33]/50">
                    <CardContent>
                        {/* <StoreLogo /> */}
                        <form
                            onSubmit={handleSubmit}
                            className="space-y-4"
                        >
                            <TabsContent value="informasi">
                                <StoreInfo
                                    data={form.data}
                                    setData={form.setData}
                                    errors={form.errors}
                                />
                            </TabsContent>

                            <TabsContent value="logo">
                                <StoreLogo />
                            </TabsContent>

                            <TabsContent value="alamat">
                                <Address
                                    data={form.data}
                                    setData={form.setData}
                                    errors={form.errors}
                                    provinces={provinces}
                                />
                            </TabsContent>

                            <TabsContent value="operasional">
                                <OperationalHour
                                    data={form.data}
                                    setData={form.setData}
                                    errors={form.errors}
                                />
                            </TabsContent>

                            <TabsContent value="foto">
                                <StoreImages
                                    data={form.data}
                                    setData={form.setData}
                                    errors={form.errors}
                                    setIsValidImages={setIsValidImages}
                                />
                            </TabsContent>

                            <TabsContent value="fitur">
                                <AdditionalFeatures
                                    data={form.data}
                                    setData={form.setData}
                                />
                            </TabsContent>

                            {activeTab != 'logo' && (
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
                            )}
                        </form>
                    </CardContent>
                </Card>
            </Tabs>
        </div>
    )
}