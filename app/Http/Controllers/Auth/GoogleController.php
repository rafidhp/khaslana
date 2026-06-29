<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use Laravel\Socialite\Facades\Socialite;
use App\Models\User;
use Illuminate\Support\Facades\Auth;

class GoogleController extends Controller
{
    public function redirect() {
        return Socialite::driver('google')->redirect();
    }

    public function callback() {
        try {
            $googleUser = Socialite::driver('google')->stateless()->user();

            $user = User::where('email', $googleUser->getEmail())->first();

            if (!$user) {
                $rawBaseUsername = explode('@', $googleUser->getEmail())[0];
                $baseUsername = preg_replace('/[^a-zA-Z0-9_]/', '_', $rawBaseUsername);

                if (preg_match('/^_+$/', $baseUsername)) {
                    $baseUsername = 'user_' . str()->random(5);
                }

                if (empty($baseUsername) || preg_match('/^_+$/', $baseUsername)) {
                    $baseUsername = 'user_' . str()->random(5);
                }

                if (strlen($baseUsername) < 3) {
                    $baseUsername = str_pad($baseUsername, 3, '_');
                }

                $username = $baseUsername;
                $i = 1;

                while (User::where('username', $username)->exists()) {
                    $username = $baseUsername . $i;
                    $i++;
                }

                $user = User::create([
                    'name' => $googleUser->getName() ?? 'User Google',
                    'username' => $username,
                    'email' => $googleUser->getEmail(),
                    'email_verified_at' => now(),
                    'password' => bcrypt(str()->random(16)),
                ]);
            }
            Auth::login($user);

            return redirect()->route('home');
        } catch (\Exception $e) {
            return redirect()->route('login')->with('error', 'Login Google gagal: ' . $e->getMessage());
        }
    }
}