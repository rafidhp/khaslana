<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class DashboardController extends Controller
{
    public function index() {
        $user = Auth::user();

        return Inertia::render('umkm/dashboard', [
            'status' => $user->umkm?->status ?? 'TUTUP',
        ]);
    }

    public function storeStatus(Request $request) {
        $request->validate([
            'status' => 'required|in:BUKA,TUTUP',
        ]);
        $user = Auth::user();

        $user->umkm()->update([
            'status' => $request->status,
        ]);

        return back();
    }
}
