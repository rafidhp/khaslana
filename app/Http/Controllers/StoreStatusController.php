<?php

namespace App\Http\Controllers;

use App\Models\StoreSetting;
use Illuminate\Http\Request;
use Inertia\Inertia;

class StoreStatusController extends Controller
{
    public function index()
    {
        $store = StoreSetting::firstOrCreate(
            [],
            ['is_open' => true]
        );

        return Inertia::render('umkm/storeStatus', [
            'isOpen' => $store->is_open
        ]);
    }

    public function update(Request $request)
    {
        $store = StoreSetting::firstOrCreate(
            [],
            ['is_open' => true]
        );

        $store->update([
            'is_open' => $request->is_open
        ]);

        return back();
    }
}
