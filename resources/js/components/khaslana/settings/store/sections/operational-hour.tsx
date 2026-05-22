import { type StoreFormData } from "@/components/khaslana/settings/store/types";
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

export default function OperationalHour({
    data,
    setData,
}: Props) {
    return (
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
    )
}