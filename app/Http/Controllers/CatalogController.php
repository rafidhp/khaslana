<?php

namespace App\Http\Controllers;

use App\Models\Product\Product;
use Illuminate\Http\Request;
use Inertia\Inertia;

class CatalogController extends Controller
{
    public function index() {
        $products = Product::all();

        return Inertia::render('user/catalog', [
            'products' => $products,
        ]);
    }
}
