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
            'promos',
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
     * Navigasi Rute Statis untuk UMKM TETAP
     */
    public function navigasi($umkm_id)
    {

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
     * Live Tracking untuk UMKM KELILING
     */
    public function tracking(Request $request, $umkm_id = null)
    {
        $userLat = $request->lat;
        $userLng = $request->lng;
        $radius = 200;
        $activeMerchants = Umkm::where('type', 'KELILING')
            ->whereHas('umkmLocations', function ($q) {
                $q->where('is_active', true);
                $q->where('status', 'MANGKAL');
            })
            ->with(['user.profile', 'umkmLocations' => function ($q) {
                $q->where('is_active', true)->latest('id');
            }])
            ->get()
            ->map(function ($umkm) use ($userLat, $userLng, $radius) {
                $latestLocation = $umkm->umkmLocations->first();
                if (!$latestLocation || !$userLat || !$userLng) return null;

                $distance = $this->haversine(
                    $userLat,
                    $userLng,
                    $latestLocation->latitude,
                    $latestLocation->longitude
                ) / 1000;

                if ($distance > $radius) return null;

                $cleanAddress = $umkm->address ?? 'Lokasi Tidak Diketahui';
                $shortLocation = trim(explode(',', $cleanAddress)[0]);

                return [
                    'id' => $umkm->id,
                    'storeName' => $umkm->store_name,
                    'description' => $umkm->description, 
                    'locationText' => str($shortLocation)->limit(22, '...'), 
                    'rating' => (float) $umkm->average_rating,
                    'status' => $latestLocation ? $latestLocation->status : 'MANGKAL',
                    'logoUrl' => $umkm->user?->profile?->logo ?? null,
                    'latitude' => $latestLocation ? (float) $latestLocation->latitude : 0,
                    'longitude' => $latestLocation ? (float) $latestLocation->longitude : 0,
                    'distance' => $distance,
                    'isActive' => true,
                ];
            })
            ->filter()
            ->sortBy('distance')
            ->values();
            

        return Inertia::render('user/navigation/user-stay-point', [
            'activeMerchants' => $activeMerchants,
            'initialSelectedId' => $umkm_id ? (int) $umkm_id : null,
            'hasFiltered' => true,
        ]);
        
    }

    /**
     * Histori Rute untuk UMKM KELILING yang sedang TUTUP
     */
    public function rute($umkm_id)
    {
        $umkm = Umkm::where('id', $umkm_id)
            ->where('type', 'KELILING')
            ->with(['user.profile'])
            ->firstOrFail();

        $routeNodes = UmkmLocation::selectRaw('latitude, longitude, COUNT(*) as total_mangkal, MIN(created_at) as first_visit')
            ->where('umkm_id', $umkm->id)
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
            })
            ->values();

        return Inertia::render('user/navigation/user-umkm-route', [
            'umkm' => $umkm,
            'routeNodes' => $routeNodes
        ]);
    }

    // Haversine
    private function haversine($lat1, $lon1, $lat2, $lon2)
    {
        $earthRadius = 6371000;

        $dLat = deg2rad($lat2 - $lat1);
        $dLon = deg2rad($lon2 - $lon1);

        $a = sin($dLat / 2) * sin($dLat / 2) +
            cos(deg2rad($lat1)) * cos(deg2rad($lat2)) *
            sin($dLon / 2) * sin($dLon / 2);

        $c = 2 * atan2(sqrt($a), sqrt(1 - $a));

        return $earthRadius * $c;
    }
}
