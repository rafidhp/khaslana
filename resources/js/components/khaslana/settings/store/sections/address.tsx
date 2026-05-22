import type { InertiaFormProps } from "@inertiajs/react";
import { MapPin } from "lucide-react";
import { useState } from "react";
import { type StoreFormData } from "@/components/khaslana/settings/store/types";
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
import { reverseGeocode } from "@/routes";
import { getCities, getDistricts, getVillages } from "@/routes/api";

interface LocationItem {
    code: string;
    name: string;
}

interface Props {
    data: StoreFormData;
    setData: InertiaFormProps<StoreFormData>['setData'];
    provinces: LocationItem[];
}

export default function Address({
    data,
    setData,
    provinces,
}: Props) {
    const [cities, setCities] = useState<LocationItem[]>([]);
    const [districts, setDistricts] = useState<LocationItem[]>([]);
    const [villages, setVillages] = useState<LocationItem[]>([]);
    const [isLoadingLocation, setIsLoadingLocation] = useState(false);

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

    const handleDetectLocation = async () => {
        if (!navigator.geolocation) {
            alert('Browser tidak mendukung geolocation');
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

                    console.log(result);

                    setData('address', result.address);
                    setData('province_id', result.province_id);

                    const citiesData = await fetchCities(result.province_id);
                    setCities(citiesData || []);

                    const districtsData = await fetchDistricts(result.city_id);
                    setDistricts(districtsData || []);

                    const villagesData = await fetchVillages(result.district_id);
                    setVillages(villagesData || []);

                    setData({
                        ...data,
                        address: result.address,
                        province_id: result.province_id,
                        city_id: result.city_id,
                        district_id: result.district_id,
                    });
                    requestAnimationFrame(() => {
                        setData('village_id', result.village_id);
                    });
                } catch (error) {
                    console.error(error);
                } finally {
                    setIsLoadingLocation(false);
                    setTimeout(() => {
                    }, 0);
                }
            },
            (error) => {
                console.error(error);
                alert('Gagal mendeteksi lokasi');
                setIsLoadingLocation(false);
            }
        );
    };

    const handleProvinceChange = async (value: string) => {
        setData("province_id", value);

        setData("city_id", "");
        setData("district_id", "");
        setData("village_id", "");

        setDistricts([]);
        setVillages([]);

        if (value) {
            const citiesData = await fetchCities(value);
            setCities(citiesData || []);
        }
    };

    const handleCityChange = async (value: string) => {
        setData("city_id", value);

        setData("district_id", "");
        setData("village_id", "");

        setVillages([]);

        if (value) {
            const districtsData = await fetchDistricts(value);
            setDistricts(districtsData || []);
        }
    };

    const handleDistrictChange = async (value: string) => {
        setData("district_id", value);

        setData("village_id", "");

        if (value) {
            const villagesData = await fetchVillages(value);
            setVillages(villagesData || []);
        }
    };

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
                    <Label>Provinsi</Label>
                    <Select
                        value={data.province_id}
                        onValueChange={handleProvinceChange}
                    >
                        <SelectTrigger className="mt-2 border-gray-500/30 focus-visible:border-[#99FF33] focus-visible:ring-0 transition-all duration-200">
                            <SelectValue placeholder="Pilih provinsi" />
                        </SelectTrigger>
                        <SelectContent>
                            {provinces.map((province) => (
                                <SelectItem
                                key={province.code}
                                value={province.code}
                                >
                                    {province.name}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>
                <div className="space-y-2">
                    <Label>Kota/Kabupaten</Label>
                    <Select
                        value={data.city_id}
                        onValueChange={handleCityChange}
                        disabled={!data.province_id}
                    >
                        <SelectTrigger className="mt-2 border-gray-500/30 focus-visible:border-[#99FF33] focus-visible:ring-0 transition-all duration-200">
                            <SelectValue placeholder="Pilih kota" />
                        </SelectTrigger>
                        <SelectContent>
                            {cities.map((city) => (
                                <SelectItem
                                    key={city.code}
                                    value={city.code}
                                >
                                    {city.name}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>
                <div className="space-y-2">
                    <Label>Kecamatan</Label>
                    <Select
                        value={data.district_id}
                        onValueChange={handleDistrictChange}
                        disabled={!data.city_id}
                    >
                        <SelectTrigger className="mt-2 border-gray-500/30 focus-visible:border-[#99FF33] focus-visible:ring-0 transition-all duration-200">
                            <SelectValue placeholder="Pilih kecamatan" />
                        </SelectTrigger>
                        <SelectContent>
                            {districts.map((district) => (
                                <SelectItem
                                    key={district.code}
                                    value={district.code}
                                >
                                    {district.name}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>
                <div className="space-y-2">
                    <Label>Kelurahan</Label>
                    <Select
                        value={data.village_id}
                        onValueChange={(value) =>
                            setData('village_id', value)
                        }
                        disabled={!data.district_id}
                    >
                        <SelectTrigger className="mt-2 border-gray-500/30 focus-visible:border-[#99FF33] focus-visible:ring-0 transition-all duration-200">
                            <SelectValue placeholder="Pilih kelurahan" />
                        </SelectTrigger>
                        <SelectContent>
                            {villages.map((village) => (
                                <SelectItem
                                    key={village.code}
                                    value={village.code}
                                >
                                    {village.name}
                                </SelectItem>
                            ))}
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
                        setData('address', e.target.value)
                    }
                    className="mt-2 border-gray-500/30 focus-visible:border-[#99FF33] focus-visible:ring-0 transition-all duration-200 dark:bg-transparent"
                />
            </div>
        </div>
    )
}