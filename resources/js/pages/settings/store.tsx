import { Head, useForm } from "@inertiajs/react"
import Heading from '@/components/heading';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { useAuth } from "@/hooks/use-auth";
import AppLayout from "@/layouts/app-layout";
import SettingsLayout from "@/layouts/settings/layout";
import { storeManagement } from "@/routes";
import { store } from "@/routes/storeManagement";
import type { BreadcrumbItem } from "@/types"
import { Textarea } from '@/components/ui/textarea';

export default function Store() {
    const { user } = useAuth();
    const breadcrumbs: BreadcrumbItem[] = [
        {
            title: user.is_umkm ? 'Kelola Toko' : 'Data UMKM',
            href: storeManagement().url,
        },
    ];

    const { data, setData, post, processing, errors } = useForm({
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
        post(store().url);
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Kelola Toko" />

            <SettingsLayout>
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

                                        {/* store info */}
                                        <div className="space-y-4">
                                            <div>
                                                <h3 className="text-lg font-semibold">
                                                    Informasi Toko
                                                </h3>
                                                <p className="text-sm text-muted-foreground">
                                                    Lengkapi informasi utama toko UMKM anda
                                                </p>
                                            </div>
                                            <div className="grid gap-4 md:grid-cols-2">
                                                <div className="space-y-2">
                                                    <Label>
                                                        Nama Toko
                                                    </Label>
                                                    <Input
                                                        placeholder="Contoh: Fajri Cireng"
                                                        value={data.store_name}
                                                        onChange={(e) =>
                                                            setData(
                                                                'store_name',
                                                                e.target.value,
                                                            )
                                                        }
                                                        className="mt-2 border-gray-500/30 focus-visible:border-[#99FF33] focus-visible:ring-0 transition-all duration-200"
                                                    />
                                                    {errors.store_name && (
                                                        <p className="text-sm text-red-500">
                                                            {errors.store_name}
                                                        </p>
                                                    )}
                                                </div>
                                                <div className="space-y-2">
                                                    <Label>No Telepon</Label>
                                                    <Input
                                                        placeholder="08xxxxxxxxxx"
                                                        value={data.phone_number}
                                                        onChange={(e) =>
                                                            setData(
                                                                'phone_number',
                                                                e.target.value,
                                                            )
                                                        }
                                                        className="mt-2 border-gray-500/30 focus-visible:border-[#99FF33] focus-visible:ring-0 transition-all duration-200"
                                                    />
                                                </div>
                                            </div>
                                            <div className="space-y-2">
                                                <Label>Deskripsi</Label>
                                                <Textarea
                                                    placeholder="Ceritakan tentang UMKM anda..."
                                                    value={data.description}
                                                    onChange={(e) =>
                                                        setData(
                                                            'description',
                                                            e.target.value,
                                                        )
                                                    }
                                                    className="mt-2 border-gray-500/30 focus-visible:border-[#99FF33] focus-visible:ring-0 transition-all duration-200 dark:bg-transparent"
                                                />
                                            </div>
                                            <div className="grid gap-4 md:grid-cols-1">
                                                <div className="space-y-2">
                                                    <Label>Tipe UMKM</Label>
                                                    <Select
                                                        onValueChange={(
                                                            value,
                                                        ) =>
                                                            setData(
                                                                'type',
                                                                value,
                                                            )
                                                        }
                                                    >
                                                        <SelectTrigger className="mt-2 border-gray-500/30 focus-visible:border-[#99FF33] focus-visible:ring-0 transition-all duration-200">
                                                            <SelectValue placeholder="Pilih tipe UMKM" />
                                                        </SelectTrigger>
                                                        <SelectContent>
                                                            <SelectItem value="TETAP">
                                                                Tetap
                                                            </SelectItem>
                                                            <SelectItem value="KELILING">
                                                                Keliling
                                                            </SelectItem>
                                                        </SelectContent>
                                                    </Select>
                                                </div>
                                            </div>
                                        </div>

                                        {/* address */}
                                        <div className="space-y-4">
                                            <div>
                                                <h3 className="text-lg font-semibold">
                                                    Alamat
                                                </h3>
                                                <p className="text-sm text-muted-foreground">
                                                    Lokasi UMKM anda
                                                </p>
                                            </div>
                                            <div className="grid gap-4 md:grid-cols-2">
                                                <div className="space-y-2">
                                                    <Label>Provinsi</Label>
                                                    <Select
                                                        onValueChange={(
                                                            value,
                                                        ) =>
                                                            setData(
                                                                'province_id',
                                                                value,
                                                            )
                                                        }
                                                    >
                                                        <SelectTrigger className="mt-2 border-gray-500/30 focus-visible:border-[#99FF33] focus-visible:ring-0 transition-all duration-200">
                                                            <SelectValue placeholder="Pilih provinsi" />
                                                        </SelectTrigger>
                                                        <SelectContent>
                                                            {/* mapping provinces */}
                                                        </SelectContent>
                                                    </Select>
                                                </div>
                                                <div className="space-y-2">
                                                    <Label>Kota/Kabupaten</Label>
                                                    <Select
                                                        onValueChange={(
                                                            value,
                                                        ) =>
                                                            setData(
                                                                'city_id',
                                                                value,
                                                            )
                                                        }
                                                    >
                                                        <SelectTrigger className="mt-2 border-gray-500/30 focus-visible:border-[#99FF33] focus-visible:ring-0 transition-all duration-200">
                                                            <SelectValue placeholder="Pilih kota" />
                                                        </SelectTrigger>
                                                        <SelectContent>
                                                            {/* mapping cities */}
                                                        </SelectContent>
                                                    </Select>
                                                </div>
                                                <div className="space-y-2">
                                                    <Label>Kecamatan</Label>
                                                    <Select
                                                        onValueChange={(
                                                            value,
                                                        ) =>
                                                            setData(
                                                                'district_id',
                                                                value,
                                                            )
                                                        }
                                                    >
                                                        <SelectTrigger className="mt-2 border-gray-500/30 focus-visible:border-[#99FF33] focus-visible:ring-0 transition-all duration-200">
                                                            <SelectValue placeholder="Pilih kecamatan" />
                                                        </SelectTrigger>
                                                        <SelectContent>
                                                            {/* mapping districts */}
                                                        </SelectContent>
                                                    </Select>
                                                </div>
                                                <div className="space-y-2">
                                                    <Label>Kelurahan</Label>
                                                    <Select
                                                        onValueChange={(
                                                            value,
                                                        ) =>
                                                            setData(
                                                                'village_id',
                                                                value,
                                                            )
                                                        }
                                                    >
                                                        <SelectTrigger className="mt-2 border-gray-500/30 focus-visible:border-[#99FF33] focus-visible:ring-0 transition-all duration-200">
                                                            <SelectValue placeholder="Pilih kelurahan" />
                                                        </SelectTrigger>
                                                        <SelectContent>
                                                            {/* mapping villages */}
                                                        </SelectContent>
                                                    </Select>
                                                </div>
                                            </div>
                                            <div className="space-y-2">
                                                <Label>Alamat Lengkap</Label>
                                                <Textarea
                                                    placeholder="Masukkan alamat lengkap"
                                                    value={data.address}
                                                    onChange={(e) =>
                                                        setData(
                                                            'address',
                                                            e.target.value,
                                                        )
                                                    }
                                                    className="mt-2 border-gray-500/30 focus-visible:border-[#99FF33] focus-visible:ring-0 transition-all duration-200 dark:bg-transparent"
                                                />
                                            </div>
                                        </div>

                                        {/* operational hour */}
                                        <div className="space-y-4 mt-8">
                                            <div>
                                                <h3 className="text-lg font-semibold">
                                                    Jam Operasional
                                                </h3>
                                            </div>
                                            <div className="grid gap-4 md:grid-cols-3">
                                                <div className="space-y-2">
                                                    <Label>Hari Buka</Label>
                                                    <Input
                                                        placeholder="Senin - Minggu"
                                                        value={data.open_days}
                                                        onChange={(e) =>
                                                            setData(
                                                                'open_days',
                                                                e.target.value,
                                                            )
                                                        }
                                                        className="mt-2 border-gray-500/30 focus-visible:border-[#99FF33] focus-visible:ring-0 transition-all duration-200"
                                                    />
                                                </div>
                                                <div className="space-y-2">
                                                    <Label>Jam Buka</Label>

                                                    <Input
                                                        type="time"
                                                        value={data.open_time}
                                                        onChange={(e) =>
                                                            setData(
                                                                'open_time',
                                                                e.target.value,
                                                            )
                                                        }
                                                        className="mt-2 border-gray-500/30 focus-visible:border-[#99FF33] focus-visible:ring-0 transition-all duration-200"
                                                    />
                                                </div>
                                                <div className="space-y-2">
                                                    <Label>Jam Tutup</Label>
                                                    <Input
                                                        type="time"
                                                        value={data.close_time}
                                                        onChange={(e) =>
                                                            setData(
                                                                'close_time',
                                                                e.target.value,
                                                            )
                                                        }
                                                        className="mt-2 border-gray-500/30 focus-visible:border-[#99FF33] focus-visible:ring-0 transition-all duration-200"
                                                    />
                                                </div>
                                            </div>
                                        </div>

                                        {/* additional features */}
                                        <div className="space-y-4">
                                            <div>
                                                <h3 className="text-lg font-semibold">
                                                    Fitur Tambahan
                                                </h3>
                                            </div>
                                            <div className="space-y-4">
                                                <div className="flex items-center gap-3">
                                                    <Checkbox
                                                        id="pemesanan"
                                                        checked={
                                                            data.is_order_feature
                                                        }
                                                        onCheckedChange={(
                                                            checked,
                                                        ) =>
                                                            setData(
                                                                'is_order_feature',
                                                                !!checked,
                                                            )
                                                        }
                                                        className="data-[state=checked]:bg-[#99FF33] data-[state=checked]:border-[#99FF33]"
                                                    />
                                                    <Label htmlFor="pemesanan" className="font-normal">
                                                        Aktifkan fitur pemesanan
                                                    </Label>
                                                </div>
                                                <div className="flex items-center gap-3">
                                                    <Checkbox
                                                        id="pengiriman"
                                                        checked={
                                                            data.is_shipping_feature
                                                        }
                                                        onCheckedChange={(
                                                            checked,
                                                        ) =>
                                                            setData(
                                                                'is_shipping_feature',
                                                                !!checked,
                                                            )
                                                        }
                                                        className="data-[state=checked]:bg-[#99FF33] data-[state=checked]:border-[#99FF33]"
                                                    />
                                                    <Label htmlFor="pengiriman" className="font-normal">
                                                        Aktifkan fitur pengiriman
                                                    </Label>
                                                </div>
                                                <div
                                                    className={`
                                                        overflow-hidden
                                                        transition-all
                                                        duration-300
                                                        ease-in-out
                                                        ${
                                                            data.is_shipping_feature
                                                                ? 'max-h-40 opacity-100 mt-4'
                                                                : 'max-h-0 opacity-0'
                                                        }
                                                    `}
                                                >
                                                    <div className="space-y-2">
                                                        <Label htmlFor="ongkir">
                                                            Ongkir
                                                        </Label>

                                                        <Input
                                                            id="ongkir"
                                                            type="number"
                                                            placeholder="10000"
                                                            value={data.shipping_cost}
                                                            onChange={(e) =>
                                                                setData(
                                                                    'shipping_cost',
                                                                    Number(e.target.value),
                                                                )
                                                            }
                                                            className="
                                                                mt-2
                                                                border-gray-500/30
                                                                focus-visible:border-[#99FF33]
                                                                focus-visible:ring-0
                                                                transition-all
                                                                duration-200
                                                                [appearance:textfield]
                                                                [&::-webkit-outer-spin-button]:appearance-none
                                                                [&::-webkit-inner-spin-button]:appearance-none
                                                            "
                                                        />
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <Button
                                            type="submit"
                                            disabled={processing}
                                            className="w-full mt-2 bg-[#99FF33] border-1 border-[#99FF33] hover:bg-[#1E1B26] hover:text-[#99FF33] transition-colors duration-200 hover:cursor-pointer"
                                        >
                                            {processing
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
            </SettingsLayout>
        </AppLayout>
    )
}