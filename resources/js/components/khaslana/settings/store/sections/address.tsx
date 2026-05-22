import { type StoreFormData } from "@/components/khaslana/settings/store/types";
import { Label } from '@/components/ui/label';
import {
    Select,
    SelectContent,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';

interface Props {
    data: StoreFormData;
    setData: (
        key: keyof StoreFormData,
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        value: any
    ) => void;
}

export default function Address({
    data,
    setData,
}: Props) {
    return (
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
    )
}