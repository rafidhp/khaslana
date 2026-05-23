import { useForm } from "@inertiajs/react"
import Heading from '@/components/heading';
import AdditionalFeatures from "@/components/khaslana/settings/store/sections/additional-features";
import Address from "@/components/khaslana/settings/store/sections/address";
import OperationalHour from "@/components/khaslana/settings/store/sections/operational-hour";
import StoreInfo from "@/components/khaslana/settings/store/sections/store-info";
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { useAuth } from "@/hooks/use-auth";
import { store } from "@/routes/storeManagement";

interface Props {
    provinces: {
        code: string;
        name: string;
    }[];
}

export default function StoreIndex({
    provinces,
}: Props) {
    const { user } = useAuth();
    const form = useForm({
        store_name: '',
        description: '',
        type: '',
        status: 'TUTUP',
        address: '',
        phone_number: '',
        province_id: '',
        city_id: '',
        district_id: '',
        village_id: '',
        open_days: '',
        open_time: '',
        close_time: '',
        is_order_feature: false,
        is_shipping_feature: false,
        shipping_cost: 0,

        // umkm_datas
        npwp: '',
        nib: '',
        nik: '',
        file_path: null as File | null,
    });
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        form.post(store().url);
    };

    return (
        <div className="space-y-6">
            {!user.is_umkm ? (
                <>
                    <Heading
                        variant="default"
                        title="Data UMKM"
                        description="Lengkapi data UMKM anda terlebih dahulu untuk membuka fitur!"
                    />
                    <Card className="bg-transparent border-2 border-[#99FF33]/50">
                        <CardContent>
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
                                <AdditionalFeatures
                                    data={form.data}
                                    setData={form.setData}
                                />

                                <Button
                                    type="submit"
                                    disabled={form.processing}
                                    className="w-full mt-2 bg-[#99FF33] border-1 border-[#99FF33] hover:bg-[#1E1B26] hover:text-[#99FF33] transition-colors duration-200 hover:cursor-pointer"
                                >
                                    {form.processing
                                        ? 'Menyimpan...'
                                        : 'Simpan Data UMKM'}
                                </Button>
                            </form>
                        </CardContent>
                    </Card>
                </>
            ) : (
                <Heading
                    variant="default"
                    title="Kelola Toko"
                    description="kelola toko nya disini bang"
                />
            )}
        </div>
    )
}