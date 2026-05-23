<?php

namespace App\Http\Controllers;

use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

use App\Http\Requests\StoreRequest;
use Laravolt\Indonesia\Models\Province;
use App\Models\UMKM\Umkm;
use App\Models\UMKM\UmkmData;
use App\Models\UMKM\UmkmLocation;
use App\Models\User;

class StoreController extends Controller
{
    public function index() {
        return Inertia::render('settings/store', [
            'provinces' => Province::query()
                            ->select('code', 'name')
                            ->orderBy('name')
                            ->get(),
        ]);
    }

    public function store(StoreRequest $request): RedirectResponse {
        $user = User::where('id', Auth::user()->id)->first();
        DB::beginTransaction();

        try {
            // upload file
            $filePath = null;

            if ($request->hasFile('file_path')) {
                $filePath = $request
                    ->file('file_path')
                    ->store('umkm/documents', 'public');
            }

            // create umkm
            $umkm = Umkm::create([
                'user_id' => auth()->id(),

                'province_id' => $request->province_id,
                'city_id' => $request->city_id,
                'district_id' => $request->district_id,
                'village_id' => $request->village_id,

                'store_name' => $request->store_name,
                'description' => $request->description,
                'type' => $request->type,
                'status' => $request->status,
                'address' => $request->address,
                'phone_number' => $request->phone_number,

                'open_days' => $request->open_days,
                'open_time' => $request->open_time,
                'close_time' => $request->close_time,

                'is_order_feature' => $request->boolean('is_order_feature'),
                'is_shipping_feature' => $request->boolean('is_shipping_feature'),

                'shipping_cost' => $request->shipping_cost ?? 0,
            ]);

            // create umkm data
            UmkmData::create([
                'umkm_id' => $umkm->id,

                'npwp' => $request->npwp,
                'nib' => $request->nib,
                'nik' => $request->nik,

                'file_path' => $filePath,
            ]);

            // create umkm location
            UmkmLocation::create([
                'umkm_id' => $umkm->id,

                'latitude' => $request->latitude,
                'longitude' => $request->longitude,

                'is_active' => false,

                'status' => $request->type === 'KELILING'
                    ? 'MANGKAL'
                    : 'TUTUP',
            ]);

            $user->update(['is_umkm' => true]);

            DB::commit();

            return redirect()
                ->back()
                ->with('success', 'Selamat!! Akun UMKM anda berhasil dibuat.');
        } catch (\Throwable $th) {

            DB::rollBack();

            // hapus file jika gagal
            if ($filePath && Storage::disk('public')->exists($filePath)) {
                Storage::disk('public')->delete($filePath);
            }

            return redirect()
                ->back()
                ->withErrors([
                    'message' => $th->getMessage(),
                ]);
        }
    }
}
