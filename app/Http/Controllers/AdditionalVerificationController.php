<?php

namespace App\Http\Controllers;

use App\Models\UMKM\Umkm;
use Illuminate\Support\Facades\Auth;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;
use App\Models\UMKM\UmkmData;
use Inertia\Inertia;

class AdditionalVerificationController extends Controller
{
    public function index()
    {
        $umkm = Umkm::with([
            'user',
            'umkmData',
            'umkmImages',
            'umkmLocations',
        ])
        ->where('user_id', Auth::id())
        ->first();

        $storeCompletion = $this->checkStoreCompletion($umkm);

        $status = match ($umkm?->umkmData?->is_verified) {
            'PENDING' => 'pending',
            'VERIFIED' => 'verified',
            'REJECT' => 'rejected',
            default => 'not_submitted',
        };

        return Inertia::render('settings/verification', [
            'storeCompletion' => $storeCompletion,

            'verification' => [
                'verification_status' => $status,
                'umkm' => $umkm,
                'admin_review_note' => null,

                'owner_name' => $umkm?->umkmData?->owner_name,
                'nik' => $umkm?->umkmData?->nik,
                'npwp' => $umkm?->umkmData?->npwp,
                'nib' => $umkm?->umkmData?->nib,
                'file_path' => $umkm?->umkmData?->file_path
                ? Storage::url(
                    $umkm->umkmData->file_path
                )
                : null,
            ],
        ]);
    }

    public function store(Request $request)
    {
        $request->validate([
            'owner_name' => ['required', 'string', 'max:255'],
            'nik' => ['required', 'digits:16'],
            'npwp' => ['required', 'string', 'max:30'],
            'nib' => ['required', 'string', 'max:30'],
            'file_path' => ['required', 'image', 'max:4096'],
        ]);

        DB::beginTransaction();

        try {

            $umkm = Umkm::where(
                'user_id',
                Auth::id()
            )->firstOrFail();

            $oldDocument = $umkm->umkmData?->file_path;

            $documentPath = null;
            $hash = null;

            if ($request->hasFile('file_path')) {

                if (
                    $oldDocument &&
                    Storage::disk('public')->exists($oldDocument)
                ) {
                    Storage::disk('public')->delete($oldDocument);
                }

                $documentPath = $request
                    ->file('file_path')
                    ->store(
                        'umkm/verifications',
                        'public'
                    );

                $hash = hash_file(
                    'sha256',
                    storage_path(
                        'app/public/' . $documentPath
                    )
                );
            }

            UmkmData::updateOrCreate(

                [
                    'umkm_id' => $umkm->id,
                ],

                [
                    'owner_name' => $request->owner_name,
                    'nik' => $request->nik,
                    'npwp' => $request->npwp,
                    'nib' => $request->nib,

                    'file_path' => $documentPath,
                    'image_hash' => $hash,

                    'is_verified' => 'PENDING',
                ]

            );

            DB::commit();

            return back()->with(
                'success',
                'Verifikasi berhasil dikirim.'
            );

        } catch (\Throwable $e) {

            DB::rollBack();

            if ($documentPath) {
                Storage::disk('public')
                    ->delete($documentPath);
            }

            report($e);
            return back()->withErrors([
                'verification' =>
                    $e->getMessage(),
            ]);

        }
    }

    private function checkStoreCompletion(?Umkm $umkm): array
    {
        if (!$umkm) {
            return [
                'completed' => false,
                'missing' => [
                    'Informasi',
                    'Alamat',
                    'Operasional',
                    'Foto',
                    'Lokasi',
                    'Fitur',
                ],
            ];
        }

        $missing = [];

        if (
            blank($umkm->store_name) ||
            blank($umkm->description) ||
            blank($umkm->phone_number) ||
            blank($umkm->type) ||
            blank($umkm->status)
        ) {
            $missing[] = 'Informasi';
        }

        if (
            blank($umkm->province_id) ||
            blank($umkm->city_id) ||
            blank($umkm->district_id) ||
            blank($umkm->village_id) ||
            blank($umkm->address)
        ) {
            $missing[] = 'Alamat';
        }

        if (
            blank($umkm->open_days) ||
            blank($umkm->open_time) ||
            blank($umkm->close_time)
        ) {
            $missing[] = 'Operasional';
        }

        if (!$umkm->umkmImages()->exists()) {
            $missing[] = 'Foto';
        }

        // Penting: gunakan exists() saja
        if (!$umkm->umkmLocations()->exists()) {
            $missing[] = 'Lokasi';
        }

        if (
            !$umkm->is_order_feature &&
            !$umkm->is_shipping_feature
        ) {
            $missing[] = 'Fitur';
        }

        return [
            'completed' => empty($missing),
            'missing' => $missing,
        ];
    }
}