<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use App\Models\UMKM\UmkmLocation;
use App\Models\UMKM\Umkm;

class TrackingController extends Controller
{

    public function index()
    {
        return inertia('umkm/stay-point');
    }

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

        $lastLocation = UmkmLocation::query()
            ->where('umkm_id', $umkmId)
            ->latest('id')
            ->first();

        // ==========================================
        // THE GOLDEN RULE: MATIKAN SEMUA STATUS AKTIF LAMA!
        // ==========================================
        UmkmLocation::query()
            ->where('umkm_id', $umkmId)
            ->where('is_active', true)
            ->update(['is_active' => false]);

            // 2. Handle State: TUTUP
            if (!$request->is_active || $request->status === 'TUTUP') {

                // Gunakan koordinat dari Request JIKA ADA. 
                // Kalau NULL, fallback (??) ambil dari $lastLocation->latitude/longitude.
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

        // 3. Handle State: MANGKAL & KELILING
        $newLat = $request->latitude;
        $newLng = $request->longitude;

        if (!$newLat || !$newLng) {
            return response()->json(['message' => 'Koordinat tidak valid'], 400);
        }

        // CARI JANGKAR MANGKAL TERAKHIR BUAT PATOKAN (Batas Hari Ini Saja)
        // Note: Array 2 param biar Intelephense nggak rewel
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

        // LOGIKA ANCHOR SNAPPING
        if ($lastMangkal && $lastMangkal->latitude && $lastMangkal->longitude) {
            $distance = $this->haversine($lastMangkal->latitude, $lastMangkal->longitude, $newLat, $newLng);

            if ($request->status === 'MANGKAL' && $distance < 50) {
                // KUNCI KOORDINAT! Timpa GPS baru pakai koordinat Jangkar dari shift sebelumnya
                $finalLat = $lastMangkal->latitude;
                $finalLng = $lastMangkal->longitude;
                $msg = 'Kembali ke Jangkar sebelumnya';
            }
        }

        // 4. EKSEKUSI FINAL: BIKIN RECORD BARU
        UmkmLocation::create([
            'umkm_id' => $umkmId,
            'latitude' => $finalLat,
            'longitude' => $finalLng,
            'is_active' => true, // Ini SATU-SATUNYA yang true sekarang
            'status' => $request->status
        ]);

        // 5. KEMBALIKAN RESPONSE KE FRONTEND
        return response()->json([
            'status' => 'success',
            'message' => $msg . ' (' . $request->status . ')',
            'distance' => isset($distance) ? round($distance, 2) . ' m' : '0 m'
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
