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

    public function show($id) {
        $product = Product::where('id', $id)->firstOrFail();

        return Inertia::render('user/catalog/index', [
            'product' => $product,
        ]);
    }
}
