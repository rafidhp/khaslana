<?php

namespace App\Http\Controllers;

use App\Models\Promo;
use Inertia\Inertia;

class PromoController extends Controller {
    public function show($id) {
        $promo = Promo::with('umkm')->findOrFail($id);

        return Inertia::render('user/promo/show', [
            'promo' => $promo,
        ]);
    }
}