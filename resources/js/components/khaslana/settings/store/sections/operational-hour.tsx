import { Check, ChevronDown } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { type StoreFormData } from "@/components/khaslana/settings/store/types";
import { Label } from '@/components/ui/label';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";

interface Props {
    data: StoreFormData;
    setData: (
        key: keyof StoreFormData,
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        value: any
    ) => void;
    errors: Record<string, string>;
}

const DAYS = [
    "Senin",
    "Selasa",
    "Rabu",
    "Kamis",
    "Jumat",
    "Sabtu",
    "Minggu",
];

const HOURS = [
    "24 Jam",
    ...Array.from(
        { length: 24 },
        (_, i) =>
            `${String(i).padStart(2, "0")}.00`
    ),
];

export default function OperationalHour({
    data,
    setData,
    errors
}: Props) {
    const [isOpen, setIsOpen] = useState(false);
    const [selectedDays, setSelectedDays] = useState<string[]>([]);
    const dropdownRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (
                dropdownRef.current &&
                !dropdownRef.current.contains(event.target as Node)
            ) {
                setIsOpen(false);
            }
        };
        document.addEventListener(
            "mousedown",
            handleClickOutside
        );

        return () => {
            document.removeEventListener(
                "mousedown",
                handleClickOutside
            );
        };
    }, []);

    const formatOpenDays = (days: string[]) => {
        if (days.length === 7) {
            return "Setiap Hari";
        }

        const workDays = [
            "Senin",
            "Selasa",
            "Rabu",
            "Kamis",
            "Jumat",
        ];
        const weekend = ["Sabtu", "Minggu"];
        const sundayOff = [
            "Senin",
            "Selasa",
            "Rabu",
            "Kamis",
            "Jumat",
            "Sabtu",
        ];
        const mondayToThursDay = [
            "Senin",
            "Selasa",
            "Rabu",
            "Kamis",
        ];

        const isWorkDays =
            JSON.stringify(days) ===
            JSON.stringify(workDays);

        const isWeekend =
            JSON.stringify(days) ===
            JSON.stringify(weekend);

        const isSundayOff =
            JSON.stringify(days) ===
            JSON.stringify(sundayOff);

        const isMondayToThursday =
            JSON.stringify(days) ===
            JSON.stringify(mondayToThursDay);

        if (isWorkDays) {
            return "Senin - Jumat";
        }

        if (isWeekend) {
            return "Sabtu - Minggu";
        }

        if (isSundayOff) {
            return "Senin - Sabtu";
        }

        if (isMondayToThursday) {
            return "Senin - Kamis";
        }

        return days.join(", ");
    };

    const toggleDay = (day: string) => {
        let updatedDays: string[];

        if (selectedDays.includes(day)) {
            updatedDays = selectedDays.filter(
                (d) => d !== day
            );
        } else {
            updatedDays = [...selectedDays, day];
        }

        const sortedDays = DAYS.filter((d) =>
            updatedDays.includes(d)
        );
        setSelectedDays(sortedDays);
        setData(
            "open_days",
            formatOpenDays(sortedDays)
        );
    };

    const handleEveryday = () => {
        const allSelected = selectedDays.length === DAYS.length;

        if (allSelected) {
            setSelectedDays([]);
            setData("open_days", "");
            return;
        }
        setSelectedDays(DAYS);
        setData("open_days", "Setiap Hari");
    };

    const getHourNumber = (time: string) => {
        if (time === "24 Jam") {
            return 24;
        }
        return Number(time.split(".")[0]);
    };

    const filteredCloseHours = HOURS.filter(
        (hour) => {
            if (
                !data.open_time ||
                data.open_time === "24 Jam"
            ) {
                return hour === "24 Jam";
            }

            if (hour === "24 Jam") {
                return false;
            }
            return (
                getHourNumber(hour) >
                getHourNumber(data.open_time)
            );
        }
    );

    return (
        <div className="space-y-4 mt-8">
            <div>
                <h3 className="text-lg font-semibold">
                    Jam Operasional
                </h3>
            </div>
            <div className="grid gap-4 md:grid-cols-3">
                <div className="space-y-2">
                    <Label>
                        Hari Buka
                        <span className="text-red-400"> *</span>
                    </Label>
                    <div
                        ref={dropdownRef}
                        className="relative mt-2"
                    >
                        <button
                            type="button"
                            onClick={() =>
                                setIsOpen(!isOpen)
                            }
                            className="
                                w-full
                                flex items-center justify-between
                                rounded-md
                                border border-gray-500/30
                                bg-transparent
                                px-3 py-2
                                text-sm
                                transition-all duration-200
                                hover:border-[#99FF33]
                                focus:border-[#99FF33]
                                focus:outline-none
                            "
                        >
                            <span className="truncate">
                                {data.open_days || "Pilih hari buka"}
                            </span>
                            <ChevronDown
                                className={`
                                    h-4 w-4 transition-transform duration-200
                                    ${isOpen ? "rotate-180" : ""}
                                `}
                            />
                        </button>

                        {isOpen && (
                            <div
                                className="
                                    absolute z-50 mt-2
                                    w-full
                                    rounded-md
                                    border border-gray-500/30
                                    bg-[#1E1B26]
                                    shadow-lg
                                    overflow-hidden
                                "
                            >
                                <button
                                    type="button"
                                    onClick={handleEveryday}
                                    className="
                                        w-full
                                        flex items-center justify-between
                                        px-3 py-2
                                        text-sm
                                        hover:bg-[#99FF33]/10
                                        transition-colors
                                    "
                                >
                                    <span>Setiap Hari</span>
                                    <div
                                        className={`
                                            h-4 w-4 rounded border
                                            flex items-center justify-center
                                            transition-all
                                            ${
                                                selectedDays.length ===
                                                DAYS.length
                                                    ? "bg-[#99FF33] border-[#99FF33]"
                                                    : "border-gray-500/50"
                                            }
                                        `}
                                    >
                                        {selectedDays.length ===
                                            DAYS.length && (
                                            <Check className="h-3 w-3 text-black" />
                                        )}
                                    </div>
                                </button>

                                <div className="h-px bg-gray-500/20" />

                                {DAYS.map((day) => {
                                    const checked = selectedDays.includes(day);
                                    return (
                                        <button
                                            key={day}
                                            type="button"
                                            onClick={() =>
                                                toggleDay(day)
                                            }
                                            className="
                                                w-full
                                                flex items-center justify-between
                                                px-3 py-2
                                                text-sm
                                                hover:bg-[#99FF33]/10
                                                transition-colors
                                            "
                                        >
                                            <span>{day}</span>
                                            <div
                                                className={`
                                                    h-4 w-4 rounded border
                                                    flex items-center justify-center
                                                    transition-all
                                                    ${
                                                        checked
                                                            ? "bg-[#99FF33] border-[#99FF33]"
                                                            : "border-gray-500/50"
                                                    }
                                                `}
                                            >
                                                {checked && (
                                                    <Check className="h-3 w-3 text-black" />
                                                )}
                                            </div>
                                        </button>
                                    );
                                })}
                            </div>
                        )}
                        {errors.open_days && (
                            <p className="text-sm text-red-500">
                                {errors.open_days}
                            </p>
                        )}
                    </div>
                </div>
                <div className="space-y-2">
                    <Label>
                        Jam Buka
                        <span className="text-red-400"> *</span>
                    </Label>
                    <Select
                        value={data.open_time}
                        onValueChange={(value) => {
                            setData("open_time", value);

                            if (value === "24 Jam") {
                                setData("close_time", "24 Jam");
                                return;
                            }

                            if (
                                data.close_time &&
                                data.close_time !== "24 Jam" &&
                                getHourNumber(data.close_time) <= getHourNumber(value)
                            ) {
                                setData("close_time", "");
                            }
                        }}
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
                            <SelectValue placeholder="Pilih jam buka" />
                        </SelectTrigger>
                        <SelectContent
                            className="
                                border-gray-500/30
                                bg-[#191720]
                                text-white
                                my-2
                            "
                        >
                            {HOURS.map((hour) => (
                                <SelectItem
                                    key={hour}
                                    value={hour}
                                    className="
                                        cursor-pointer
                                        focus:bg-[#99FF33]/10
                                        focus:text-[#99FF33]
                                    "
                                >
                                    {hour}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>
                <div className="space-y-2">
                    <Label>
                        Jam Tutup
                        <span className="text-red-400"> *</span>
                    </Label>
                    <Select
                        value={data.close_time}
                        disabled={
                            !data.open_time ||
                            data.open_time === "24 Jam"
                        }
                        onValueChange={(value) =>
                            setData("close_time", value)
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
                                disabled:cursor-not-allowed
                                disabled:opacity-60
                            "
                        >
                            <SelectValue placeholder="Pilih jam tutup" />
                        </SelectTrigger>
                        <SelectContent
                            className="
                                border-gray-500/30
                                bg-[#191720]
                                text-white
                                my-2
                            "
                        >
                            {filteredCloseHours.map(
                                (hour) => (
                                    <SelectItem
                                        key={hour}
                                        value={hour}
                                        className="
                                            cursor-pointer
                                            focus:bg-[#99FF33]/10
                                            focus:text-[#99FF33]
                                        "
                                    >
                                        {hour}
                                    </SelectItem>
                                )
                            )}
                        </SelectContent>
                    </Select>
                </div>
            </div>
        </div>
    )
}