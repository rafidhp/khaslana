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
                $baseUsername = explode('@', $googleUser->getEmail())[0];
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
            return redirect()->route('login')->with('error', 'Login Google gagal');
        }
    }
}