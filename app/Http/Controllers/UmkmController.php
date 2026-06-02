<?php

namespace App\Http\Controllers;

use App\Models\Review\Review;
use App\Models\UMKM\Umkm;
use App\Models\Product\Product;
use Illuminate\Http\Request;
use App\Models\UMKM\UmkmLocation;
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
        )->take(4)
        ->get();

        $latestLocation = $umkm->umkmLocations->sortByDesc('id')->first();
        
        return Inertia::render('user/umkm-user/detail-umkm/index', [
            'umkmData' => $umkm,
            'reviews' => $reviews,
            'products' => $products,
            'locationData' => $latestLocation,
        ]);

    }

    public function umkmProducts() {
        return Inertia::render('user/umkm-user/umkm-products/index');
    }

    /**
     * Skenario A: Navigasi Rute Statis untuk UMKM TETAP
     */
    public function navigasi($umkm_id)
    {
        // Tarik lokasi terakhir untuk mendapatkan titik koordinat toko fisik yang valid
        $umkm = Umkm::where('type', 'TETAP')
            ->with(['user.profile', 'umkmLocations' => function ($q) {
                $q->latest('id');
            }])
            ->findOrFail($umkm_id);

        return Inertia::render('user/navigation/user-navigation', [
            'umkm' => $umkm
        ]);
    }

    /**
     * Skenario B: Live Tracking Radius Terdekat untuk UMKM KELILING (is_active = true)
     */
    public function tracking($umkm_id = null)
    {
        // Tarik UMKM Keliling yang status lokasinya saat ini sedang AKTIF lapak
        $activeMerchants = Umkm::where('type', 'KELILING')
            ->whereHas('umkmLocations', function ($q) {
                $q->where('is_active', true);
            })
            ->with(['user.profile', 'umkmLocations' => function ($q) {
                $q->where('is_active', true)->latest('id');
            }])
            ->get()
            ->map(function ($umkm) {
                $latestLocation = $umkm->umkmLocations->first();

                // REBUILD LOGIC: Ambil potongan jalan terdepan sebelum tanda koma (e.g. "Jl. Pendidikan")
                $cleanAddress = $umkm->address ?? 'Lokasi Tidak Diketahui';
                $shortLocation = trim(explode(',', $cleanAddress)[0]);

                // Satukan format data agar langsung match dengan Prop TypeScript di Frontend
                return [
                    'id' => $umkm->id,
                    'storeName' => $umkm->store_name,
                    'description' => $umkm->description, // Passing deskripsi asli untuk subtitle card
                    'locationText' => str($shortLocation)->limit(22, '...'), // Menggunakan helper bawaan Laravel, anti-bentrok namespace
                    'rating' => (float) $umkm->average_rating,
                    'status' => $latestLocation ? $latestLocation->status : 'MANGKAL', // 'MANGKAL' atau 'KELILING'
                    'logoUrl' => $umkm->user?->profile?->logo ?? null,
                    'latitude' => $latestLocation ? (float) $latestLocation->latitude : 0,
                    'longitude' => $latestLocation ? (float) $latestLocation->longitude : 0,
                    'isActive' => true,
                ];
            });

        return Inertia::render('user/navigation/user-stay-point', [
            'activeMerchants' => $activeMerchants,
            'initialSelectedId' => $umkm_id ? (int) $umkm_id : null,
        ]);
    }

    /**
     * Skenario C: Histori Rute OSRM untuk UMKM KELILING yang sedang TUTUP
     */
    public function rute($umkm_id)
    {
        $umkm = Umkm::where('type', 'KELILING')->with(['user.profile'])->findOrFail($umkm_id);

        // Ambil rangkaian titik mangkal untuk dijahit menjadi garis aspal histori rute
        $routeNodes = UmkmLocation::selectRaw('latitude, longitude, COUNT(*) as total_mangkal, MIN(created_at) as first_visit')
            ->where('umkm_id', $umkm_id)
            ->where('status', 'MANGKAL')
            ->groupBy('latitude', 'longitude')
            ->orderBy('first_visit', 'asc')
            ->get()
            ->map(function ($node) {
                return [
                    'latitude' => (float) $node->latitude,
                    'longitude' => (float) $node->longitude,
                    'total_mangkal' => (int) $node->total_mangkal,
                ];
            });

        return Inertia::render('user/navigation/user-umkm-route', [
            'umkm' => $umkm,
            'routeNodes' => $routeNodes
        ]);
    }
}
