<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;

class TrackingController extends Controller
{
    public function updateLocation(Request $request)
    {
        // 1. Validasi Input dari Frontend
        $request->validate([
            'latitude' => 'nullable|numeric',
            'longitude' => 'nullable|numeric',
            'is_active' => 'required|boolean'
        ]);

        $user = Auth::user();

        // Cari ID UMKM yang nyambung sama user yang lagi login
        $umkm = DB::table('umkms')->where('user_id', $user->id)->first();

        if (!$umkm) {
            return response()->json(['message' => 'Data UMKM tidak ditemukan'], 404);
        }

        $umkmId = $umkm->id;

        // 2. Handle jika UMKM menekan tombol "Berhenti Mangkal"
        if (!$request->is_active) {
            DB::table('umkm_locations')
                ->where('umkm_id', $umkmId)
                ->latest('id')
                ->limit(1)
                ->update(['is_active' => false, 'updated_at' => now()]);

            return response()->json(['message' => 'Sedang mangkal. Lokasi disembunyikan.']);
        }

        // 3. Handle jika UMKM mulai/sedang "Mangkal"
        $newLat = $request->latitude;
        $newLng = $request->longitude;

        if (!$newLat || !$newLng) {
            return response()->json(['message' => 'Koordinat tidak valid'], 400);
        }

        // Ambil riwayat lokasi terakhir dari UMKM ini
        $lastLocation = DB::table('umkm_locations')
            ->where('umkm_id', $umkmId)
            ->latest('id')
            ->first();

        if ($lastLocation) {
            // Panggil fungsi Haversine
            $distance = $this->haversine($lastLocation->latitude, $lastLocation->longitude, $newLat, $newLng);

            // Jika jaraknya masih kurang dari 50 meter
            if ($distance < 50) {
                DB::table('umkm_locations')
                    ->where('id', $lastLocation->id)
                    ->update([
                        'is_active' => true,
                        // Update koordinat ke yang paling baru biar makin presisi
                        'latitude' => $newLat,
                        'longitude' => $newLng,
                        'updated_at' => now()
                    ]);

                return response()->json([
                    'status' => 'updated',
                    'message' => 'Lokasi masih sama (< 50m)',
                    'distance' => round($distance, 2) . ' meter'
                ]);
            }
        }

        // 4. Jika jarak > 50 meter ATAU UMKM ini belum pernah mangkal sama sekali
        DB::table('umkm_locations')->insert([
            'umkm_id' => $umkmId,
            'latitude' => $newLat,
            'longitude' => $newLng,
            'is_active' => true,
            'created_at' => now(),
            'updated_at' => now()
        ]);

        return response()->json([
            'status' => 'new_record',
            'message' => 'Titik mangkal baru berhasil dicatat',
            'distance' => isset($distance) ? round($distance, 2) . ' meter' : 0
        ]);
    }

    /**
     * Private Method: Haversine Formula
     * Untuk menghitung jarak lurus dua titik di permukaan bumi yang melengkung.
     */
    private function haversine($lat1, $lon1, $lat2, $lon2)
    {
        $earthRadius = 6371000; // Radius bumi dalam satuan meter

        // Konversi derajat ke radian
        $dLat = deg2rad($lat2 - $lat1);
        $dLon = deg2rad($lon2 - $lon1);

        $a = sin($dLat / 2) * sin($dLat / 2) +
            cos(deg2rad($lat1)) * cos(deg2rad($lat2)) *
            sin($dLon / 2) * sin($dLon / 2);

        $c = 2 * atan2(sqrt($a), sqrt(1 - $a));

        return $earthRadius * $c; // Mengembalikan hasil dalam meter
    }
}
