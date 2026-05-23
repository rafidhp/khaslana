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
                        <span className="text-red-400"> *</span>
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
                        required
                    />
                    {errors.store_name && (
                        <p className="text-sm text-red-500">
                            {errors.store_name}
                        </p>
                    )}
                </div>
                <div className="space-y-2">
                    <Label>
                        No Telepon
                        <span className="text-red-400"> *</span>
                    </Label>
                    <Input
                        placeholder="08xxxxxxxxxx"
                        value={data.phone_number}
                        onChange={(e) =>
                            setData(
                                'phone_number',
                                e.target.value,
                            )
                        }
                        type="number"
                        className="
                            mt-2 border-gray-500/30 
                            focus-visible:border-[#99FF33] focus-visible:ring-0 
                            transition-all duration-200
                            [appearance:textfield]
                            [&::-webkit-outer-spin-button]:appearance-none
                            [&::-webkit-inner-spin-button]:appearance-none
                        "
                        required
                    />
                    {errors.phone_number && (
                        <p className="text-sm text-red-500">
                            {errors.phone_number}
                        </p>
                    )}
                </div>
            </div>
            <div className="space-y-2">
                <Label>
                    Deskripsi
                    <span className="text-red-400"> *</span>
                </Label>
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
                    required
                />
                {errors.description && (
                    <p className="text-sm text-red-500">
                        {errors.description}
                    </p>
                )}
            </div>
            <div className="grid gap-4 md:grid-cols-1">
                <div className="space-y-2">
                    <Label>
                        Tipe UMKM
                        <span className="text-red-400"> *</span>
                    </Label>
                    <Select
                        onValueChange={(value) =>
                            setData('type', value)
                        }
                        required
                    >
                        <SelectTrigger
                            className="
                                mt-2
                                border-gray-500/30
                                bg-transparent
                                transition-all duration-200
                                focus:ring-0
                                focus:border-[#99FF33]
                                data-[state=open]:border-[#99FF33]
                                hover:border-[#99FF33]
                            "
                        >
                            <SelectValue placeholder="Pilih tipe UMKM" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem
                                className="
                                    cursor-pointer
                                    focus:bg-[#99FF33]/10
                                    focus:text-[#99FF33]
                                "
                                value="TETAP"
                            >
                                Tetap
                            </SelectItem>
                            <SelectItem
                                className="
                                    cursor-pointer
                                    focus:bg-[#99FF33]/10
                                    focus:text-[#99FF33]
                                "
                                value="KELILING"
                            >
                                Keliling
                            </SelectItem>
                        </SelectContent>
                    </Select>
                    {errors.type && (
                        <p className="text-sm text-red-500">
                            {errors.type}
                        </p>
                    )}
                </div>
            </div>
        </div>
    )
}