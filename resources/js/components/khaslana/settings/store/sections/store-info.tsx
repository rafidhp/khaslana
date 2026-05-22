import { type StoreFormData } from "@/components/khaslana/settings/store/types";
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
    Select,
    SelectContent,
    SelectItem,
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
    errors: Record<string, string>;
}

export default function StoreInfo({
    data,
    setData,
    errors,
}: Props) {
    return (
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
    )
}