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
        <div className="space-y-4 mt-8">
            <div>
                <h3 className="text-lg font-semibold">
                    Fitur Tambahan (opsional)
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
                        className="data-[state=checked]:bg-[#99FF33] data-[state=checked]:border-[#99FF33] hover:cursor-pointer"
                    />
                    <Label htmlFor="pemesanan" className="font-normal hover:cursor-pointer">
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
                        className="data-[state=checked]:bg-[#99FF33] data-[state=checked]:border-[#99FF33] hover:cursor-pointer"
                    />
                    <Label htmlFor="pengiriman" className="font-normal hover:cursor-pointer">
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
    )
}