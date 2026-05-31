<?php

namespace App\Http\Controllers;

use App\Models\Category;
use App\Models\Product\Product;
use Illuminate\Http\Request;
use Inertia\Inertia;

class CatalogController extends Controller
{
    public function index() {
        $products = Product::with([
            'category',
            'promo',
            'productImages',
            'productVariants',
            'umkm',
            'umkm.city',
        ])->paginate(12);
        $categories = Category::all();

        return Inertia::render('user/catalog', [
            'products' => $products,
            'categories' => $categories,
        ]);
    }

    public function show($id) {
        $product = Product::where('id', $id)->with([
            'category',
            'promo',
            'productImages',
            'productVariants',
            'umkm',
            'umkm.city',
        ])->first();

        return Inertia::render('user/catalog/detail', [
            'product' => $product,
        ]);
    }
}
