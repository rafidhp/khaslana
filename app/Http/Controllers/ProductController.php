<?php

namespace App\Http\Controllers;

use App\Models\Category;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

use App\Models\Product\Product;

class ProductController extends Controller
{
    public function index() {
        $products = collect();
        $categories = collect();
        $user = Auth::user();

        if($user->is_umkm) {
            $umkm = $user->umkm;
    
            $products = Product::where('umkm_id', $umkm->id)->with([
                'category',
                'promo',
                'productImages',
                'productVariants',
                'productVariants.attributeValues',
                'productVariants.attributeValues.attribute',
                'umkm',
                'umkm.city',
            ])->get();
            $categories = Category::all();
        }

        return Inertia::render('umkm/product', [
            'products' => $products,
            'categories' => $categories,
        ]);
    }

    public function create() {
        $categories = Category::all();
        return Inertia::render('umkm/product/product-create', [
            'categories' => $categories,
        ]);
    }
}
