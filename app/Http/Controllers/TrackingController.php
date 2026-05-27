<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use App\Models\UMKM\UmkmLocation;
use App\Models\UMKM\Umkm;

class TrackingController extends Controller
{
    public function updateLocation(Request $request)
    {
        // 1. Validasi Input dari Frontend
        $request->validate([
            'latitude' => 'nullable|numeric',
            'longitude' => 'nullable|numeric',
            'is_active' => 'required|boolean',
            'status' => 'nullable|string|in:TUTUP,MANGKAL,KELILING'
        ]);

        $userId = Auth::id();

        $umkm = Umkm::query()->where('user_id', $userId)->first();

        if (!$umkm) {
            return response()->json(['message' => 'Data UMKM tidak ditemukan'], 404);
        }

        $umkmId = $umkm->id;

        // 2. Handle State: TUTUP
        if (!$request->is_active || $request->status === 'TUTUP') {
            $lastLocation = UmkmLocation::query()->where('umkm_id', $umkmId)->latest('id')->first();

            if ($lastLocation) {
                $lastLocation->update([
                    'is_active' => false,
                    'status' => 'TUTUP'
                ]);
            }

            return response()->json(['message' => 'Stay Point ditutup.']);
        }

        // 3. Handle State: MANGKAL & KELILING
        $newLat = $request->latitude;
        $newLng = $request->longitude;

        if (!$newLat || !$newLng) {
            return response()->json(['message' => 'Koordinat tidak valid'], 400);
        }

        $lastLocation = UmkmLocation::query()->where('umkm_id', $umkmId)->latest('id')->first();

        if ($lastLocation && $lastLocation->latitude && $lastLocation->longitude) {
            $distance = $this->haversine($lastLocation->latitude, $lastLocation->longitude, $newLat, $newLng);

            // Jika jaraknya masih kurang dari 50 meter, update data terakhir saja
            if ($distance < 50) {
                $lastLocation->update([
                    'is_active' => true,
                    'latitude' => $newLat,
                    'longitude' => $newLng,
                    'status' => $request->status
                ]);

                return response()->json([
                    'status' => 'updated',
                    'message' => 'Status berhasil diubah ke ' . $request->status,
                    'distance' => round($distance, 2) . ' m'
                ]);
            }
        }

        // 4. Jika jarak > 50 meter ATAU belum pernah ada data, buat record baru
        UmkmLocation::create([
            'umkm_id' => $umkmId,
            'latitude' => $newLat,
            'longitude' => $newLng,
            'is_active' => true,
            'status' => $request->status
        ]);

        return response()->json([
            'status' => 'new_record',
            'message' => 'Titik Stay Point baru dicatat (' . $request->status . ')',
            'distance' => isset($distance) ? round($distance, 2) . ' m' : 0
        ]);
    }

    /**
     * Mengambil status terbaru saat halaman di-refresh (Biar UI nggak balik ke TUTUP)
     */
    public function getCurrentStatus()
    {
        $userId = Auth::id();
        $umkm = Umkm::query()->where('user_id', $userId)->first();

        if (!$umkm) {
            return response()->json(['status' => 'TUTUP']);
        }

        $lastLocation = UmkmLocation::query()->where('umkm_id', $umkm->id)->latest('id')->first();

        // Kalau ada data lokasi terakhir dan statusnya masih aktif (MANGKAL / KELILING)
        if ($lastLocation && $lastLocation->is_active) {
            return response()->json([
                'status' => $lastLocation->status,
                'latitude' => $lastLocation->latitude,
                'longitude' => $lastLocation->longitude
            ]);
        }

        // Kalau nggak ada atau is_active false, berarti TUTUP
        return response()->json(['status' => 'TUTUP']);
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
