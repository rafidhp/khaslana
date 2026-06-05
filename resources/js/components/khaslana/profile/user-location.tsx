import { type InertiaFormProps } from "@inertiajs/react";
import { MapPin } from "lucide-react";
import { useState, useCallback, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Label } from '@/components/ui/label';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { showErrorToast } from "@/lib/toast";
import { reverseGeocode } from "@/routes";
import { getCities, getDistricts, getVillages } from "@/routes/api";
import type { ProfileFormData } from "@/types/profile-data";

interface LocationItem {
    code: string;
    name: string;
}

interface UserLocationProps {
    form: InertiaFormProps<ProfileFormData>;
    provinces: LocationItem[];
}

export default function UserLocation({
    form,
    provinces,
}: UserLocationProps) {
    const [cities, setCities] = useState<LocationItem[]>([]);
    const [districts, setDistricts] = useState<LocationItem[]>([]);
    const [villages, setVillages] = useState<LocationItem[]>([]);
    const [isLoadingLocation, setIsLoadingLocation] = useState(false);
    const [locationWarnings, setLocationWarnings] = useState<{
        province?: string;
        city?: string;
        district?: string;
        village?: string;
    }>({});

    const fetchCities = async (provinceCode: string) => {
        try {
            const response = await fetch(getCities(provinceCode).url);

            if (!response.ok) {
                throw new Error("Gagal mengambil kota");
            }
            const result: LocationItem[] = await response.json();
            return result;
        } catch (error) {
            console.error(error);
        }
    };

    const fetchDistricts = async (cityCode: string) => {
        try {
            const response = await fetch(getDistricts(cityCode).url);

            if (!response.ok) {
                throw new Error("Gagal mengambil kecamatan");
            }
            const result: LocationItem[] = await response.json();
            return result;
        } catch (error) {
            console.error(error);
        }
    };

    const fetchVillages = async (districtCode: string) => {
        try {
            const response = await fetch(getVillages(districtCode).url);

            if (!response.ok) {
                throw new Error("Gagal mengambil kelurahan");
            }
            const result: LocationItem[] = await response.json();
            return result;
        } catch (error) {
            console.error(error);
        }
    };

    const initializeLocation = useCallback(async () => {
        try {
            // load cities
            if (
                form.data.province_id &&
                cities.length === 0
            ) {
                const citiesData = await fetchCities(form.data.province_id);
                setCities(citiesData || []);
            }

            // load districts
            if (
                form.data.city_id &&
                districts.length === 0
            ) {
                const districtsData = await fetchDistricts(form.data.city_id);
                setDistricts(districtsData || []);
            }

            // load villages
            if (
                form.data.district_id &&
                villages.length === 0
            ) {
                const villagesData = await fetchVillages(form.data.district_id);
                setVillages(villagesData || []);
            }
        } catch (error) {
            console.error(error);
        }
    }, [
        form.data.province_id,
        form.data.city_id,
        form.data.district_id,

        cities.length,
        districts.length,
        villages.length,
    ]);

    useEffect(() => {
        initializeLocation();
    }, [initializeLocation]);

    const handleDetectLocation = async () => {
        if (!navigator.geolocation) {
            showErrorToast('Browser tidak mendukung geolocation');
            return;
        }
        setIsLoadingLocation(true);

        navigator.geolocation.getCurrentPosition(
            async (position) => {
                const latitude = position.coords.latitude;
                const longitude = position.coords.longitude;

                try {
                    const url =
                        reverseGeocode().url +
                        `?lat=${latitude}&lng=${longitude}`;

                    console.log(url);

                    const response = await fetch(url);

                    console.log("Respon: ", response);

                    if (!response.ok) {
                        throw new Error('Gagal mengambil lokasi');
                    }

                    const result = await response.json();

                    setLocationWarnings({
                        province: result.warnings?.province,
                        city: result.warnings?.city,
                        district: result.warnings?.district,
                        village: result.warnings?.village,
                    });

                    console.log(result);

                    const citiesData = await fetchCities(result.province_id);
                    setCities(citiesData || []);

                    const districtsData = await fetchDistricts(result.city_id);
                    setDistricts(districtsData || []);

                    const villagesData = await fetchVillages(result.district_id);
                    setVillages(villagesData || []);

                    form.setData('latitude', latitude);
                    form.setData('longitude', longitude);
                    form.setData(
                        'address',
                        result.address ?? ''
                    );
                    form.setData(
                        'province_id',
                        result.province_id ?? ''
                    );
                    form.setData(
                        'city_id',
                        result.city_id ?? ''
                    );
                    form.setData(
                        'district_id',
                        result.district_id ?? ''
                    );
                    requestAnimationFrame(() => {
                        form.setData('village_id', result.village_id);
                    });
                } catch (error) {
                    console.error(error);
                } finally {
                    setIsLoadingLocation(false);
                }
            },
            (error) => {
                console.error(error);
                showErrorToast('Gagal mendeteksi lokasi');
                setIsLoadingLocation(false);
            }
        );
    };

    const handleProvinceChange = async (value: string) => {
        form.setData("province_id", value);

        form.setData("city_id", "");
        form.setData("district_id", "");
        form.setData("village_id", "");

        setDistricts([]);
        setVillages([]);

        if (value) {
            const citiesData = await fetchCities(value);
            setCities(citiesData || []);
        }
    };

    const handleCityChange = async (value: string) => {
        form.setData("city_id", value);

        form.setData("district_id", "");
        form.setData("village_id", "");

        setVillages([]);

        if (value) {
            const districtsData = await fetchDistricts(value);
            setDistricts(districtsData || []);
        }
    };

    const handleDistrictChange = async (value: string) => {
        form.setData("district_id", value);

        form.setData("village_id", "");

        if (value) {
            const villagesData = await fetchVillages(value);
            setVillages(villagesData || []);
        }
    };

    return (
        <div className="space-y-4">
            <Button
                type="button"
                onClick={handleDetectLocation}
                disabled={isLoadingLocation}
                className="
                    bg-[#99FF33]
                    border border-[#99FF33]
                    transition-colors duration-200
                    cursor-pointer
                    hover:bg-[#1E1B26]
                    hover:text-[#99FF33]

                    disabled:pointer-events-auto
                    disabled:cursor-not-allowed
                    disabled:opacity-70
                "
            >
                <MapPin className="h-5 w-5 shrink-0" />
                {isLoadingLocation
                    ? "Mendeteksi lokasi..."
                    : "Gunakan Lokasi Saat Ini"}
            </Button>
            <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                    <Label>
                        Provinsi
                        <span className="text-red-400"> *</span>
                    </Label>
                    <Select
                        value={form.data.province_id}
                        onValueChange={handleProvinceChange}
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
                            <SelectValue placeholder="Pilih provinsi" />
                        </SelectTrigger>
                        <SelectContent
                            className="
                                border-gray-500/30
                                bg-[#191720]
                                text-white
                                my-2
                            "
                        >
                            {provinces.map((province) => (
                                <SelectItem
                                    key={province.code}
                                    value={province.code}
                                    className="
                                        cursor-pointer
                                        focus:bg-[#99FF33]/10
                                        focus:text-[#99FF33]
                                    "
                                >
                                    {province.name}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                    {form.errors.province_id && (
                        <p className="text-xs text-red-500">
                            {form.errors.province_id}
                        </p>
                    )}
                    {locationWarnings.province && (
                        <p className="text-xs text-red-500/80">
                            {locationWarnings.province}
                        </p>
                    )}
                </div>
                <div className="space-y-2">
                    <Label>
                        Kota/Kabupaten
                        <span className="text-red-400"> *</span>
                    </Label>
                    <Select
                        value={form.data.city_id}
                        onValueChange={handleCityChange}
                        disabled={!form.data.province_id}
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
                            <SelectValue placeholder="Pilih kota" />
                        </SelectTrigger>
                        <SelectContent>
                            {cities.map((city) => (
                                <SelectItem
                                    key={city.code}
                                    value={city.code}
                                    className="
                                        cursor-pointer
                                        focus:bg-[#99FF33]/10
                                        focus:text-[#99FF33]
                                    "
                                >
                                    {city.name}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                    {form.errors.city_id && (
                        <p className="text-xs text-red-500">
                            {form.errors.city_id}
                        </p>
                    )}
                    {locationWarnings.city && (
                        <p className="text-xs text-red-500/80">
                            {locationWarnings.city}
                        </p>
                    )}
                </div>
                <div className="space-y-2">
                    <Label>
                        Kecamatan
                        <span className="text-red-400"> *</span>
                    </Label>
                    <Select
                        value={form.data.district_id}
                        onValueChange={handleDistrictChange}
                        disabled={!form.data.city_id}
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
                            <SelectValue placeholder="Pilih kecamatan" />
                        </SelectTrigger>
                        <SelectContent>
                            {districts.map((district) => (
                                <SelectItem
                                    key={district.code}
                                    value={district.code}
                                    className="
                                        cursor-pointer
                                        focus:bg-[#99FF33]/10
                                        focus:text-[#99FF33]
                                    "
                                >
                                    {district.name}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                    {form.errors.district_id && (
                        <p className="text-xs text-red-500">
                            {form.errors.district_id}
                        </p>
                    )}
                    {locationWarnings.district && (
                        <p className="text-xs text-red-500/80">
                            {locationWarnings.district}
                        </p>
                    )}
                </div>
                <div className="space-y-2">
                    <Label>
                        Kelurahan
                        <span className="text-red-400"> *</span>
                    </Label>
                    <Select
                        value={form.data.village_id}
                        onValueChange={(value) =>
                            form.setData('village_id', value)
                        }
                        disabled={!form.data.district_id}
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
                            <SelectValue placeholder="Pilih kelurahan" />
                        </SelectTrigger>
                        <SelectContent>
                            {villages.map((village) => (
                                <SelectItem
                                    key={village.code}
                                    value={village.code}
                                    className="
                                        cursor-pointer
                                        focus:bg-[#99FF33]/10
                                        focus:text-[#99FF33]
                                    "
                                >
                                    {village.name}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                    {form.errors.village_id && (
                        <p className="text-xs text-red-500">
                            {form.errors.village_id}
                        </p>
                    )}
                    {locationWarnings.village && (
                        <p className="text-xs text-red-500/80">
                            {locationWarnings.village}
                        </p>
                    )}
                </div>
            </div>
            <div className="space-y-2">
                <Label>
                    Alamat Lengkap
                    <span className="text-red-400"> *</span>
                </Label>
                <Textarea
                    placeholder="Masukkan alamat lengkap"
                    value={form.data.address}
                    onChange={(e) =>
                        form.setData('address', e.target.value)
                    }
                    className="mt-2 border-gray-500/30 focus-visible:border-[#99FF33] focus-visible:ring-0 transition-all duration-200 dark:bg-transparent"
                    required
                />
                {form.errors.address && (
                    <p className="text-xs text-red-500">
                        {form.errors.address}
                    </p>
                )}
            </div>
        </div>   
    )
}