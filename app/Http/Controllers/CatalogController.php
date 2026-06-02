<?php

namespace App\Http\Controllers;

use App\Models\Category;
use App\Models\Product\Product;
use App\Models\UMKM\Umkm;
use Illuminate\Support\Facades\Auth;
use App\Models\Review\Review;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Exception;

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
            'reviews.reviewLikes'
        ])->firstOrFail();

        return Inertia::render('user/catalog/detail', [
            'product' => $product,
        ]);
    }

    public function storeReview(Request $request, $id) {
        $request->validate([
            'comment' => 'required|string|max:1000',
            'rating' => 'required|numeric|min:1|max:5'
        ]);

        $product = Product::findOrFail($id);

        Review::create([
            'user_id' => Auth::id(),
            'product_id' => $product->id,
            'umkm_id' => $product->umkm_id,
            'rating' => $request->rating,
            'comment' => $request->comment,
        ]);

        return redirect()->back();
    }

    public function deleteReview(Request $request, Product $product, Review $review) {
        if ($review->user_id !== Auth::id()) {
            return redirect()->back()->withErrors(['error' => 'Anda tidak memiliki akses untuk menghapus ulasan ini!']);
        }

        try {
            $review->delete();

            return redirect()->back()->with('message', 'Ulasan berhasil dihapus!');
        } catch (Exception $e) {
            return redirect()->back()->withErrors(['error' => 'Gagal menghapus ulasan: ' . $e->getMessage()]);
        }
    }
}
