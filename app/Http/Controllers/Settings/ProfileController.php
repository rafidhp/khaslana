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
use Inertia\Inertia;
use Inertia\Response;
use Throwable;

use App\Models\UserProfile;

class ProfileController extends Controller
{
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
        $newFilePath = null;

        try {
            $user = $request->user();
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

            if ($request->hasFile('profile_photo')) {
                $image = $request->file('profile_photo');

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

                if (
                    $profile->profile_photo &&
                    Storage::disk('public')->exists(
                        $profile->profile_photo
                    )
                ) {
                    Storage::disk('public')->delete(
                        $profile->profile_photo
                    );
                }

                $newFilePath = $image->storeAs(
                    "user_profiles/{$user->id}",
                    $fileName,
                    'public'
                );

                $profile->profile_photo = $newFilePath;
                $profile->save();
            }

            return redirect()
                ->route('profile.edit')
                ->with([
                    'success' => 'Profil berhasil diperbarui.',
                ]);
        } catch (Throwable $th) {
            dd($th->getMessage());
            if (
                $newFilePath &&
                Storage::disk('public')->exists($newFilePath)
        ) {
            Storage::disk('public')->delete($newFilePath);
        }

        return redirect()
            ->back()
            ->withErrors([
                'message' => 'Terjadi kesalahan saat memperbarui profil.',
            ]);
        }
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
}
