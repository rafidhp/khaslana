<?php

namespace App\Http\Controllers;

use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Facades\DB;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

use App\Http\Requests\StoreRequest;
use Laravolt\Indonesia\Models\Province;
use App\Models\UMKM\Umkm;
use App\Models\UMKM\UmkmData;
use App\Models\UMKM\UmkmImage;
use App\Models\UMKM\UmkmLocation;
use App\Models\User;
use App\Models\UserProfile;

class StoreController extends Controller
{
    public function index() {
        $provinces = Province::query()
                        ->select('code', 'name')
                        ->orderBy('name')
                        ->get();
        
        $umkm = Umkm::with([
                    'umkmData',
                    'umkmImages',
                    'umkmLocations',
                ])
                ->where('user_id', Auth::user()->id)
                ->first();

        return Inertia::render('settings/store', [
            'provinces' => $provinces,
            'umkm' => $umkm ? [
                'store_name' => $umkm->store_name,
                'description' => $umkm->description,
                'type' => $umkm->type,
                'status' => $umkm->status,
                'address' => $umkm->address,
                'phone_number' => $umkm->phone_number,

                'province_id' => $umkm->province_id,
                'city_id' => $umkm->city_id,
                'district_id' => $umkm->district_id,
                'village_id' => $umkm->village_id,

                'open_days' => $umkm->open_days,
                'open_time' => $umkm->open_time,
                'close_time' => $umkm->close_time,

                'is_order_feature' => $umkm->is_order_feature,
                'is_shipping_feature' => $umkm->is_shipping_feature,
                'shipping_cost' => $umkm->shipping_cost,

                'npwp' => $umkm->umkmData?->npwp,
                'nib' => $umkm->umkmData?->nib,
                'nik' => $umkm->umkmData?->nik,

                'existing_images' => $umkm->umkmImages
                                ->map(fn ($image) => [
                                    'id' => $image->id,
                                    'image' => asset('storage/' . $image->image),
                                ])
                                ->values(),

                'latitude' => $umkm->umkmLocations->first()?->latitude,
                'longitude' => $umkm->umkmLocations->first()?->longitude,
            ] : null,
        ]);
    }

    public function store(StoreRequest $request): RedirectResponse {
        $user = User::where('id', Auth::user()->id)->first();
        DB::beginTransaction();

        try {
            $filePath = null;
            $imagePaths = [];

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
            ]);

            if ($request->hasFile('images')) {
                foreach ($request->file('images') as $image) {
                    $originalName = pathinfo(
                        $image->getClientOriginalName(),
                        PATHINFO_FILENAME
                    );
                    $extension = $image->getClientOriginalExtension();

                    $fileName = substr(
                        Str::slug($originalName),
                        0,
                        70
                    ) . '-' . time() . '.' . $extension;

                    $path = $image->storeAs(
                        "store_images/{$umkm->id}",
                        $fileName,
                        'public'
                    );
                    $imagePaths[] = $path;

                    UmkmImage::create([
                        'umkm_id' => $umkm->id,
                        'image' => $path,
                    ]);
                }
            }

            if ($request->filled('deleted_existing_images')) {
                $imagesToDelete = UmkmImage::whereIn(
                    'id',
                    $request->deleted_existing_images
                )->get();

                foreach ($imagesToDelete as $image) {
                    if (
                        Storage::disk('public')
                            ->exists($image->image)
                    ) {
                        Storage::disk('public')
                            ->delete($image->image);
                    }
                    $image->delete();
                }
            }

            $user->update(['is_umkm' => true]);

            DB::commit();

            return redirect()
                ->back()
                ->with('success', 'Selamat!! Akun UMKM anda berhasil dibuat.');
        } catch (\Throwable $th) {
            DB::rollBack();

            if ($filePath && Storage::disk('public')->exists($filePath)) {
                Storage::disk('public')->delete($filePath);
            }
            foreach ($imagePaths as $path) {
                if (Storage::disk('public')->exists($path)) {
                    Storage::disk('public')->delete($path);
                }
            }

            return redirect()
                ->back()
                ->withErrors([
                    'message' => $th->getMessage(),
                ]);
        }
    }

    public function storeLogo(Request $request) {
        $request->validate([
            'logo' => [
                'required',
                'mimetypes:image/jpeg,image/jpg,image/png,image/webp,image/svg+xml',
                'max:1024',
            ],
        ], [
            'logo' => 'Logo gagal di upload',
            'logo.required' => 'Logo wajib diisi.',
            'logo.mimetypes' => 'Logo harus JPG, JPEG, PNG, WEBP atau SVG.',
            'logo.max' => 'Ukuran logo maksimal 1MB.',
        ]);

        $user = $request->user();
        $profile = UserProfile::firstOrCreate([
            'user_id' => $user->id,
        ]);

        if (
            $profile->logo &&
            Storage::disk('public')->exists(
                $profile->logo
            )
        ) {
            Storage::disk('public')->delete(
                $profile->logo
            );
        }

        $image = $request->file('logo');

        $originalName = pathinfo(
            $image->getClientOriginalName(),
            PATHINFO_FILENAME
        );

        $extension = $image->getClientOriginalExtension();

        $fileName = substr(
            Str::slug($originalName),
            0,
            70
        ) . '-' . time() . '.' . $extension;

        $path = $image->storeAs(
            "store_logos/{$user->id}",
            $fileName,
            'public'
        );

        $profile->logo = $path;
        $profile->save();

        return back()->with([
            'success' => 'Logo toko berhasil diperbarui.',
        ]);
    }

    public function update(StoreRequest $request): RedirectResponse {
        DB::beginTransaction();

        $newDocumentPath = null;
        $uploadedImagePaths = [];

        try {
            $umkm = Umkm::with([
                'umkmData',
                'umkmLocations',
            ])
            ->where('user_id', Auth::id())
            ->firstOrFail();

            $oldDocumentPath = $umkm->umkmData?->file_path;

            if ($request->hasFile('file_path')) {
                $newDocumentPath = $request
                    ->file('file_path')
                    ->store('umkm/documents', 'public');

                if (
                    $oldDocumentPath &&
                    Storage::disk('public')->exists($oldDocumentPath)
                ) {
                    Storage::disk('public')->delete($oldDocumentPath);
                }
            }

            $umkm->update([
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

            $umkm->umkmData()->update([
                'npwp' => $request->npwp,
                'nib' => $request->nib,
                'nik' => $request->nik,
                'file_path' =>
                    $newDocumentPath
                        ? $newDocumentPath
                        : $oldDocumentPath,
            ]);

            $umkm->umkmLocations()
                ->first()
                ?->update([
                    'latitude' => $request->latitude,
                    'longitude' => $request->longitude,
                ]);

            if ($request->hasFile('images')) {
                foreach ($request->file('images') as $image) {
                    $originalName = pathinfo(
                        $image->getClientOriginalName(),
                        PATHINFO_FILENAME
                    );
                    $extension = $image->getClientOriginalExtension();

                    $fileName = substr(
                        Str::slug($originalName),
                        0,
                        70
                    ) . '-' . time() . '.' . $extension;

                    $path = $image->storeAs(
                        "store_images/{$umkm->id}",
                        $fileName,
                        'public'
                    );
                    $uploadedImagePaths[] = $path;

                    UmkmImage::create([
                        'umkm_id' => $umkm->id,
                        'image' => $path,
                    ]);
                }
            }

            if ($request->filled('deleted_existing_images')) {
                $imagesToDelete = UmkmImage::whereIn(
                    'id',
                    $request->deleted_existing_images
                )->get();

                foreach ($imagesToDelete as $image) {
                    if (
                        Storage::disk('public')
                            ->exists($image->image)
                    ) {
                        Storage::disk('public')
                            ->delete($image->image);
                    }
                    $image->delete();
                }
            }

            DB::commit();

            return redirect()
                ->back()
                ->with(
                    'success',
                    'Data UMKM berhasil diperbarui.'
                );
        } catch (\Throwable $th) {
            DB::rollBack();

            if (
                $newDocumentPath &&
                Storage::disk('public')->exists($newDocumentPath)
            ) {
                Storage::disk('public')
                    ->delete($newDocumentPath);
            }

            foreach ($uploadedImagePaths as $path) {
                if (
                    Storage::disk('public')->exists($path)
                ) {
                    Storage::disk('public')
                        ->delete($path);
                }
            }

            return redirect()
                ->back()
                ->withErrors([
                    'message' => $th->getMessage(),
                ]);
        }
    }
}
