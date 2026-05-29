<?php

namespace App\Http\Controllers;

use App\Models\Review\Review;
use App\Models\UMKM\Umkm;
use App\Models\Product\Product;
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
        $reviews = Review::where('umkm_id', $umkm_id)->with(
            'reviewLikes',
        )->get();
        $products = Product::where('umkm_id', $umkm_id)
        ->where('is_archived', false)
        ->with(
            'productImages',
            'productVariants',
            'promo',
            'category',
        )->get();

        return Inertia::render('user/umkm-user/detail-umkm/index', [
            'umkmData' => $umkm,
            'reviews' => $reviews,
            'products' => $products,
        ]);
    }

    public function umkmProducts() {
        return Inertia::render('user/umkm-user/umkm-products/index');
    }
}
