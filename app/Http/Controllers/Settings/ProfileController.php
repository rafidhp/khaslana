<?php

namespace App\Http\Controllers\Settings;

use App\Http\Controllers\Controller;
use App\Http\Requests\Settings\ProfileDeleteRequest;
use App\Http\Requests\Settings\ProfileUpdateRequest;
use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use App\Models\User;
use Inertia\Inertia;
use Inertia\Response;
use Throwable;
use RuntimeException;

use App\Models\UserProfile;
use Laravolt\Indonesia\Models\Province;
use App\Models\UserLocation;

class ProfileController extends Controller
{
    public function index(Request $request): Response {
        $provinces = Province::query()
                        ->select('code', 'name')
                        ->orderBy('name')
                        ->get();

        return Inertia::render('user/profile', [
            'mustVerifyEmail' => $request->user() instanceof MustVerifyEmail,
            'status' => $request->session()->get('status'),
            'provinces' => $provinces,
            'location' => $request->user()->location()->first() ?? [
                'latitude' => null,
                'longitude' => null,
                'province_id' => '',
                'city_id' => '',
                'district_id' => '',
                'village_id' => '',
                'address' => '',
            ],
        ]);
    }

    /**
     * Show the user's profile settings page.
     */
    public function edit(Request $request): Response
    {
        return Inertia::render('settings/profile', [
            'mustVerifyEmail' => $request->user() instanceof MustVerifyEmail,
            'status' => $request->session()->get('status'),
        ]);
    }

    /**
     * Update the user's profile information.
     */
    public function update(ProfileUpdateRequest $request): RedirectResponse
    {
        $newPhotoPath = null;
        DB::beginTransaction();

        try {
            $user = $request->user();

            $this->updateUser(
                $user,
                $request
            );
            $newPhotoPath = $this->updateProfilePhoto(
                $user,
                $request
            );

            if (
                $request->filled('province_id') ||
                $request->filled('address')
            ) {
                $this->updateLocation(
                    $user,
                    $request
                );
            }
            DB::commit();

            return back()->with([
                'success' => 'Profil berhasil diperbarui.',
            ]);
        } catch (Throwable $th) {
            DB::rollBack();

            if (
                $newPhotoPath &&
                Storage::disk('public')->exists(
                    $newPhotoPath
                )
            ) {
                Storage::disk('public')->delete(
                    $newPhotoPath
                );
            }
            report($th);

            return back()->withErrors([
                'message' => config('app.debug')
                    ? $th->getMessage()
                    : 'Terjadi kesalahan saat memperbarui profil.',
            ]);
        }
        
        // $newFilePath = null;

        // try {
        //     $user = $request->user();
        //     $user->fill(
        //         $request->safe()->only([
        //             'name',
        //             'username',
        //             'email',
        //         ])
        //     );

        //     if ($user->isDirty('email')) {
        //         $user->email_verified_at = null;
        //     }
        //     $user->save();

        //     if ($request->hasFile('profile_photo')) {
        //         $image = $request->file('profile_photo');

        //         $originalName = pathinfo(
        //             $image->getClientOriginalName(),
        //             PATHINFO_FILENAME
        //         );
        //         $extension = $image->getClientOriginalExtension();

        //         $fileName = substr(
        //             Str::slug($originalName),
        //             0,
        //             70
        //         ) . '-' . time() . '.' . $extension;

        //         $profile = UserProfile::firstOrNew([
        //             'user_id' => $user->id,
        //         ]);

        //         if (
        //             $profile->profile_photo &&
        //             Storage::disk('public')->exists(
        //                 $profile->profile_photo
        //             )
        //         ) {
        //             Storage::disk('public')->delete(
        //                 $profile->profile_photo
        //             );
        //         }

        //         $newFilePath = $image->storeAs(
        //             "user_profiles/{$user->id}",
        //             $fileName,
        //             'public'
        //         );

        //         $profile->profile_photo = $newFilePath;
        //         $profile->save();
        //     }

        //     return back()
        //         ->with([
        //             'success' => 'Profil berhasil diperbarui.',
        //         ]);
        // } catch (Throwable $th) {
        //     if (
        //         $newFilePath &&
        //         Storage::disk('public')->exists($newFilePath)
        // ) {
        //     Storage::disk('public')->delete($newFilePath);
        // }

        // return redirect()
        //     ->back()
        //     ->withErrors([
        //         'message' => 'Terjadi kesalahan saat memperbarui profil.',
        //     ]);
        // }
    }

    /**
     * Delete the user's profile.
     */
    public function destroy(ProfileDeleteRequest $request): RedirectResponse
    {
        $user = $request->user();

        Auth::logout();

        $user->delete();

        $request->session()->invalidate();
        $request->session()->regenerateToken();

        return redirect('/');
    }

    private function updateUser(User $user, Request $request): void {
        $user->fill(
            $request->safe()->only([
                'name',
                'username',
                'email',
            ])
        );

        if ($user->isDirty('email')) {
            $user->email_verified_at = null;
        }
        $user->save();
    }

    private function updateLocation(User $user, ProfileUpdateRequest $request): void {
        UserLocation::updateOrCreate(
            [
                'user_id' => $user->id,
            ],
            [
                'latitude' => $request->latitude,
                'longitude' => $request->longitude,
                'province_id' => $request->province_id,
                'city_id' => $request->city_id,
                'district_id' => $request->district_id,
                'village_id' => $request->village_id,
                'address' => $request->address,
            ]
        );
    }

    private function updateProfilePhoto(User $user, Request $request): ?string {
        if (!$request->hasFile('profile_photo')) {
            return null;
        }
        $image = $request->file('profile_photo');

        if (!$image->isValid()) {
            throw new RuntimeException(
                'File foto profil tidak valid.'
            );
        }

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

        $profile = UserProfile::firstOrNew([
            'user_id' => $user->id,
        ]);
        $oldPhotoPath = $profile->profile_photo;

        $newPhotoPath = $image->storeAs(
            "user_profiles/{$user->id}",
            $fileName,
            'public'
        );

        if (!$newPhotoPath) {
            throw new RuntimeException(
                'Gagal mengunggah foto profil.'
            );
        }
        $profile->profile_photo = $newPhotoPath;

        if (!$profile->save()) {
            throw new RuntimeException(
                'Gagal menyimpan foto profil.'
            );
        }

        if (
            $oldPhotoPath &&
            Storage::disk('public')->exists(
                $oldPhotoPath
            )
        ) {
            Storage::disk('public')->delete(
                $oldPhotoPath
            );
        }
        return $newPhotoPath;
    }
}
