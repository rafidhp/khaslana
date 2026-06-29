<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use App\Models\UMKM\UmkmLocation;
use App\Models\UMKM\Umkm;
use Inertia\Inertia;

class TrackingController extends Controller
{

    public function index()
    {
        $user = Auth::user();
        return Inertia::render('umkm/stay-point', [
            'statusToko' => $user->umkm?->status ?? 'TUTUP',
            'statusLokasi' => $user->umkm?->umkmLocations()->latest('id')->first()?->status ?? 'TUTUP',
        ]);
    }

    public function updateLocation(Request $request)
    {
        $request->validate([
            'latitude' => 'nullable|numeric',
            'longitude' => 'nullable|numeric',
            'is_active' => 'required|boolean',
            'statusLokasi' => 'nullable|in:TUTUP,MANGKAL,KELILING',
        ]);

        $userId = Auth::id();
        $umkm = Umkm::query()->where('user_id', $userId)->first();

        if (!$umkm) {
            return response()->json(['message' => 'Data UMKM tidak ditemukan'], 404);
        }

        $umkmId = $umkm->id;

        $lastLocation = UmkmLocation::query()
            ->where('umkm_id', $umkmId)
            ->latest('id')
            ->first();

        UmkmLocation::query()
            ->where('umkm_id', $umkmId)
            ->where('is_active', true)
            ->update(['is_active' => false]);

        if (!$request->is_active || $request->statusLokasi === 'TUTUP') {
            $finalLatTutup = $request->latitude ?? ($lastLocation ? $lastLocation->latitude : null);
            $finalLngTutup = $request->longitude ?? ($lastLocation ? $lastLocation->longitude : null);

            UmkmLocation::create([
                'umkm_id' => $umkmId,
                'latitude' => $finalLatTutup,
                'longitude' => $finalLngTutup,
                'is_active' => false,
                'status' => 'TUTUP'
            ]);
            return response()->json(['message' => 'Stay Point ditutup.']);
        }

        $newLat = $request->latitude;
        $newLng = $request->longitude;

        if (!$newLat || !$newLng) {
            return response()->json(['message' => 'Koordinat tidak valid'], 400);
        }

        $lastMangkal = UmkmLocation::query()
            ->where('umkm_id', $umkmId)
            ->where('status', 'MANGKAL')
            ->whereBetween('created_at', [now()->startOfDay(), now()->endOfDay()], 'and')
            ->latest('id')
            ->first();

        $finalLat = $newLat;
        $finalLng = $newLng;
        $distance = null;
        $msg = 'Titik Stay Point baru dicatat';

        if ($lastMangkal && $lastMangkal->latitude && $lastMangkal->longitude) {
            $distance = $this->haversine($lastMangkal->latitude, $lastMangkal->longitude, $newLat, $newLng);

            if ($request->statusLokasi === 'MANGKAL' && $distance < 50) {
                $finalLat = $lastMangkal->latitude;
                $finalLng = $lastMangkal->longitude;
                $msg = 'Kembali ke Jangkar sebelumnya';
            }
        }

        UmkmLocation::create([
            'umkm_id' => $umkmId,
            'latitude' => $finalLat,
            'longitude' => $finalLng,
            'is_active' => true, // Ini SATU-SATUNYA yang true sekarang
            'status' => $request->statusLokasi
        ]);

        return response()->json([
            'status' => 'success',
            'message' => $msg . ' (' . $request->statusLokasi . ')',
            'distance' => isset($distance) ? round($distance, 2) . ' m' : '0 m'
        ]);
    }

    public function getCurrentStatus()
    {
        $userId = Auth::id();
        $umkm = Umkm::query()->where('user_id', $userId)->first();

        if (!$umkm) {
            return response()->json([
                'statusToko' => 'TUTUP',
                'statusLokasi' => 'TUTUP',
            ]);
        }

        $lastLocation = UmkmLocation::query()->where('umkm_id', $umkm->id)->latest('id')->first();

        // Kalau ada data lokasi terakhir dan statusnya masih aktif (MANGKAL / KELILING)
        if ($lastLocation && $lastLocation->is_active) {
            return response()->json([
                'statusToko' => $umkm->status,
                'statusLokasi' => $lastLocation?->status ?? 'TUTUP',
                'latitude' => $lastLocation->latitude,
                'longitude' => $lastLocation->longitude
            ]);
        }

        return response()->json(['statusToko' => 'TUTUP', 'statusLokasi' => 'TUTUP']);
    }

    /**
     * Private Method: Haversine Formula
     */
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
