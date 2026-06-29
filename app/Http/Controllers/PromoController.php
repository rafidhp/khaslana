<?php

namespace App\Http\Controllers;

use App\Models\Promo;
use App\Models\Product\Product;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class PromoController extends Controller {
    
    public function index() {
        $umkm_id = Auth::user()->umkm->id;
        
        // get promo data & relations
        $promos = Promo::where('umkm_id', $umkm_id)->with('products')->get();
        
        // get data product umkm
        $products = Product::where('umkm_id', $umkm_id)->where('is_archived', false)->get();

        return Inertia::render('umkm/promo', [ 
            'promos' => $promos,
            'products' => $products,
        ]);
    }

    public function store(Request $request) {
        $request->validate([
            'name' => 'required|string',
            'type' => 'required|in:DISKON,PROMO',
            'description' => 'required|string',
            'start_date' => 'required|date',
            'end_date' => 'required|date|after_or_equal:start_date',
            'status' => 'required|string',
            'discount_percent' => 'nullable|numeric|min:1|max:100',
            'product_ids' => 'nullable|array',
            'product_ids.*' => 'exists:products,id'
        ]);

        $promo = Promo::create([
            'umkm_id' => Auth::user()->umkm->id,
            'name' => $request->name,
            'type' => $request->type,
            'description' => $request->description,
            'start_date' => $request->start_date,
            'end_date' => $request->end_date,
            'status' => $request->status,
            'discount_percent' => $request->discount_percent,
        ]);

        // patch promo_id to products
        if ($request->has('product_ids') && !empty($request->product_ids)) {
            Product::whereIn('id', $request->product_ids)
                   ->where('umkm_id', Auth::user()->umkm->id)
                   ->update(['promo_id' => $promo->id]);
        }

        return redirect()->back();
    }

    public function update(Request $request, Promo $promo) {
        $request->validate([
            'name' => 'required|string',
            'type' => 'required|in:DISKON,PROMO',
            'description' => 'required|string',
            'start_date' => 'required|date',
            'end_date' => 'required|date|after_or_equal:start_date',
            'status' => 'required|string',
            'discount_percent' => 'nullable|numeric|min:1|max:100',
            'product_ids' => 'nullable|array',
            'product_ids.*' => 'exists:products,id'
        ]);

        // umkm protect (non-editable)
        if ($promo->umkm_id !== Auth::user()->umkm->id) {
            abort(403);
        }

        $promo->update([
            'name' => $request->name,
            'type' => $request->type,
            'description' => $request->description,
            'start_date' => $request->start_date,
            'end_date' => $request->end_date,
            'status' => $request->status,
            'discount_percent' => $request->discount_percent,
        ]);

        Product::where('promo_id', $promo->id)->update(['promo_id' => null]);

        // patch promo_id to products
        if ($request->has('product_ids') && !empty($request->product_ids)) {
            Product::whereIn('id', $request->product_ids)
                   ->where('umkm_id', Auth::user()->umkm->id)
                   ->update(['promo_id' => $promo->id]);
        }

        return redirect()->back();
    }

    public function destroy(Promo $promo) {
        // protect
        if ($promo->umkm_id !== Auth::user()->umkm->id) {
            abort(403);
        }
        
        Product::where('promo_id', $promo->id)->update(['promo_id' => null]);
        
        $promo->delete();
        
        return redirect()->back();
    }

    public function show($id) {
        $promo = Promo::with('umkm')->findOrFail($id);

        return Inertia::render('user/promo/show', [
            'promo' => $promo,
        ]);
    }
}