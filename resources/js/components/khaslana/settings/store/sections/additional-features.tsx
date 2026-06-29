import { type StoreFormData } from "@/components/khaslana/settings/store/types";
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface Props {
    data: StoreFormData;
    setData: (
        key: keyof StoreFormData,
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        value: any
    ) => void;
}

export default function AdditionalFeatures({
    data,
    setData,
}: Props) {
    return (
        <div className="space-y-4">
            <div>
                <h3 className="text-lg font-semibold">
                    Aktifkan Fitur Tambahan (opsional)
                </h3>
            </div>
            <div className="space-y-4">
                <div className="flex items-center gap-3">
                    <Checkbox
                        id="pemesanan"
                        checked={data.is_order_feature}
                        onCheckedChange={(checked) =>
                            setData('is_order_feature', !!checked)
                        }
                        className="
                            border-gray-500/40
                            data-[state=checked]:bg-[#99FF33] data-[state=checked]:border-[#99FF33]
                            data-[state=checked]:text-black
                            hover:cursor-pointer
                        "
                    />
                    <Label htmlFor="pemesanan" className="font-normal hover:cursor-pointer">
                        Fitur pemesanan
                    </Label>
                </div>
                <div className="flex items-center gap-3">
                    <Checkbox
                        id="pengiriman"
                        checked={data.is_shipping_feature}
                        onCheckedChange={(checked) =>
                            setData('is_shipping_feature', !!checked)
                        }
                        className="
                            border-gray-500/40
                            data-[state=checked]:bg-[#99FF33]
                            data-[state=checked]:border-[#99FF33]
                            data-[state=checked]:text-[#1E1B26]
                            hover:cursor-pointer
                        "
                    />
                    <Label htmlFor="pengiriman" className="font-normal hover:cursor-pointer">
                        Fitur pengiriman
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
                        <div
                            className="
                                mt-2
                                flex items-center
                                rounded-md
                                border border-gray-500/30
                                transition-all duration-200
                                focus-within:border-[#99FF33]
                            "
                        >
                            <div
                                className="
                                    px-3
                                    text-sm
                                    text-muted-foreground
                                    border-r border-gray-500/20
                                "
                            >
                                Rp
                            </div>
                            <Input
                                id="ongkir"
                                type="text"
                                inputMode="numeric"
                                placeholder="0"
                                value={
                                    data.shipping_cost
                                        ? Number(
                                            data.shipping_cost
                                        ).toLocaleString(
                                            "id-ID"
                                        )
                                        : "0"
                                }
                                onChange={(e) => {
                                    const numericValue =
                                        e.target.value.replace(
                                            /\D/g,
                                            ""
                                        );
                                    setData(
                                        "shipping_cost", Number(numericValue || 0)
                                    );
                                }}
                                className="
                                    border-0
                                    focus-visible:ring-0
                                    focus-visible:border-0
                                    bg-transparent
                                    shadow-none
                                    [appearance:textfield]
                                    [&::-webkit-outer-spin-button]:appearance-none
                                    [&::-webkit-inner-spin-button]:appearance-none
                                "
                            />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}