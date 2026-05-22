<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;

use Laravolt\Indonesia\Models\Province;
use Laravolt\Indonesia\Models\City;
use Laravolt\Indonesia\Models\District;
use Laravolt\Indonesia\Models\Village;

class StoreController extends Controller
{
    public function index() {
        return Inertia::render('settings/store', [
            'provinces' => Province::query()
                            ->select('code', 'name')
                            ->orderBy('name')
                            ->get(),
        ]);
    }

    public function store(Request $request) {
        dd($request);
    }

    // api needs
    public function cities($provinceCode) {
        try {
            return City::query()
                ->where('province_code', $provinceCode)
                ->select('code', 'name')
                ->orderBy('name')
                ->get();

        } catch (\Throwable $e) {

            return response()->json([
                'message' => $e->getMessage(),
            ], 500);

        }
    }

    public function districts($cityCode) {
        return District::query()
            ->where('city_code', $cityCode)
            ->select('code', 'name')
            ->orderBy('name')
            ->get();
    }

    public function villages($districtCode) {
        return Village::query()
            ->where('district_code', $districtCode)
            ->select('code', 'name')
            ->orderBy('name')
            ->get();
    }
}
