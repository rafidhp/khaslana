<?php

namespace App\Http\Controllers;

use App\Models\UserProfile;
use App\Models\UMKM\Umkm;
use Illuminate\Http\Request;
use Inertia\Inertia;

class UmkmController extends Controller
{
    public function index() {
        $umkms = Umkm::with(
            'province',
            'city',
            'district',
            'village',
            'user',
            'user.profile',
            'umkmData',
            'umkmImages',
            'umkmLocations',
        )->get();
        return Inertia::render('user/umkm', [
            'umkms' => $umkms,
        ]);
    }

    public function detail($umkm_id) {
        $umkm = Umkm::where('id', $umkm_id)->with(
            'province',
            'city',
            'district',
            'village',
            'user',
            'user.profile',
            'umkmData',
            'umkmImages',
            'umkmLocations',
        )->firstOrFail();
        return Inertia::render('user/umkm-user/detail-umkm/index', [
            'umkmData' => $umkm,
        ]);
    }

    public function umkmProducts() {
        return Inertia::render('user/umkm-user/umkm-products/index');
    }
}
