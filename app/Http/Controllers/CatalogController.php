<?php

namespace App\Http\Controllers;

use App\Models\Category;
use App\Models\Product\Product;
use App\Models\UMKM\Umkm;
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
            'productVariants.attributeValues.attribute',
            'umkm',
            'umkm.city',
            'reviews' => function($query) {
                $query->latest();
            },
            'reviews.user',
            'reviews.review_likes'
        ])->firstOrFail();

        return Inertia::render('user/catalog/detail', [
            'product' => $product,
        ]);
    }

    public function dialogStore($product_id) {
        
    }
}
