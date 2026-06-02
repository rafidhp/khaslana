<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Product\Product;
use App\Models\Product\ProductVariant;
use Inertia\Inertia;

class OrderController extends Controller
{
    public function index(Request $request) {
        $productId = $request->query('product_id');
        $variantId = $request->query('variant_id');
        $quantity = (int) $request->query('quantity', 1);

        $attributes = $request->query('attributes');
        $warna = $request->query('attributes.Warna');
        $ukuran = $request->query('attributes.Ukuran');

        $product = Product::findOrFail($productId);
        $variant = ProductVariant::findOrFail($variantId);

        return Inertia::render('user/order/index', [
            'checkoutData' => [
                'product' => $product,
                'variant' => $variant,
                'quantity' => $quantity,
                'attributes' => $attributes,
                'total_price' => $variant->price * $quantity,
            ]
        ]);
    }
    
    public function dialogStore($product_id) {
        
    }
}
