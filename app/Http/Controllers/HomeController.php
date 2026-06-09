<?php

namespace App\Http\Controllers;

use App\Models\Product\Product;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Laravel\Fortify\Features;

class HomeController extends Controller
{
    public function index(Request $request) {
        $products = Product::with([
            'category',
            'promo',
            'productImages',
            'productVariants.attributeValues.attribute',
        ])
        ->take(4)
        ->get();

        $data = [
            'products' => $products,
        ];

        if (! $request->user()) {
            $data['canRegister'] = Features::enabled(
                Features::registration()
            );
        }

        return Inertia::render('welcome', $data);
    }
}
