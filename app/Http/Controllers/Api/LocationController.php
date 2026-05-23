<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;

use Laravolt\Indonesia\Models\Province;
use Laravolt\Indonesia\Models\City;
use Laravolt\Indonesia\Models\District;
use Laravolt\Indonesia\Models\Village;

class LocationController extends Controller
{
    public function reverse(Request $request) {
       $response = Http::withHeaders([
            'User-Agent' => 'Khaslana',
        ])->get(
            'https://nominatim.openstreetmap.org/reverse',
            [
                'lat' => $request->lat,
                'lon' => $request->lng,
                'format' => 'json',
            ]
        );

        if (!$response->successful()) {
            return response()->json([
                'message' => 'Gagal reverse geocoding',
            ], 500);
        }

        $data = $response->json();

        $address = $data['address'] ?? [];

        $provinceName = strtoupper(
            $address['state'] ?? ''
        );

        $cityName = strtoupper(
            $address['city'] ??
            $address['county'] ??
            ''
        );

        $districtName = strtoupper(
            $address['suburb'] ??
            $address['city_district'] ??
            $address['borough'] ??
            ''
        );

        $villageName = strtoupper(
            $address['village'] ??
            $address['hamlet'] ??
            ''
        );

        $province = Province::where('name', 'LIKE', "%{$provinceName}%")
            ->first();

        $city = City::query()
            ->where('province_code', $province?->code)
            ->where('name', 'LIKE', "%{$cityName}%")
            ->first();

        $district = District::query()
            ->where('city_code', $city?->code)
            ->whereRaw('UPPER(name) LIKE ?', ["%{$districtName}%"])
            ->first();

        $village = Village::query()
            ->where('district_code', $district?->code)
            ->where('name', 'LIKE', "%{$villageName}%")
            ->first();

        return response()->json([
            'address' => $data['display_name'] ?? null,

            'province_id' => $province?->code,
            'city_id' => $city?->code,
            'district_id' => $district?->code,
            'village_id' => $village?->code,

            'warnings' => [
                'province' => !$province
                    ? 'Provinsi tidak ditemukan'
                    : null,

                'city' => !$city
                    ? 'Kota/Kabupaten tidak ditemukan'
                    : null,

                'district' => !$district
                    ? 'Kecamatan tidak ditemukan'
                    : null,

                'village' => !$village
                    ? 'Kelurahan tidak ditemukan'
                    : null,
            ],
]);
    }
}
