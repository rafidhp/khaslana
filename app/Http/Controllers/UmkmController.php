<?php

namespace App\Http\Controllers;

use App\Models\UserProfile;
use Illuminate\Http\Request;
use Inertia\Inertia;

class UmkmController extends Controller
{
    public function index() {
        return Inertia::render('user/umkm');
    }

    public function detail($umkm_id) {
        $profile = UserProfile::where('user_id', $umkm_id)->first();
        return Inertia::render('user/umkm-user/detail-umkm/index', [
            'profile' => $profile,
        ]);
    }

    public function umkmProducts() {
        return Inertia::render('user/umkm-user/umkm-products/index');
    }
}
