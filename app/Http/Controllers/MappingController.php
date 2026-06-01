<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\UMKM\Umkm;
use App\Models\UMKM\UmkmLocation;
use Illuminate\Support\Facades\Auth;

class MappingController extends Controller
{
    public function getRouteData()
    {
        $userId = Auth::id();
        $umkm = Umkm::query()->where('user_id', $userId)->first();

        if (!$umkm) {
            return response()->json(['error' => 'Data UMKM tidak ditemukan.'], 404);
        }

        // THE GOLDEN QUERY: Ambil titik unik & jumlah mangkal
        $routeNodes = UmkmLocation::selectRaw('latitude, longitude, COUNT(*) as total_mangkal, MIN(created_at) as first_visit')
            ->where('umkm_id', $umkm->id)
            ->where('status', 'MANGKAL')
            ->groupBy('latitude', 'longitude')
            ->orderBy('first_visit', 'asc')
            ->get();

        // Lempar data ke Frontend dalam format JSON murni
        return response()->json($routeNodes);
    }
}
