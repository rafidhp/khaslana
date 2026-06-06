<?php

namespace App\Http\Controllers;

use App\Models\Cart\Cart;
use App\Models\Cart\CartItem;
use App\Models\Product\ProductVariant;
use App\Models\Order\Order;
use App\Models\Order\OrderItem;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

class CartController extends Controller
{
    public function index()
    {
        $userId = Auth::id();

        $cart = Cart::with([
            // 🔥 FIX: relation name
            'cartItems.variant.product.umkm',
            'cartItems.variant.attributeValues.attribute'
        ])->where('user_id', $userId)->first();

        return Inertia::render('user/cart', [
            'cart' => $cart
        ]);
    }

    public function store(Request $request)
    {
        $request->validate([
            'product_variant_id' => 'required|exists:product_variants,id',
            'quantity' => 'required|integer|min:1',
        ]);

        $variant = ProductVariant::with('product.umkm')->findOrFail($request->product_variant_id);
        $userId = Auth::id();

        if ($variant->product->umkm->user_id === $userId) {
            return redirect()->back()->withErrors([
                'message' => 'Anomali Sistem: Anda tidak dapat menambahkan produk dari UMKM milik Anda sendiri ke keranjang.'
            ]);
        }

        $cart = Cart::firstOrCreate(['user_id' => $userId]);

        // 🔥 FIX: variant_id
        $cartItem = CartItem::where('cart_id', $cart->id)
            ->where('variant_id', $request->product_variant_id)
            ->first();

        if ($cartItem) {
            $newQuantity = $cartItem->quantity + $request->quantity;

            if ($variant->stock < $newQuantity) {
                return redirect()->back()->withErrors(['message' => 'Stok produk tidak mencukupi.']);
            }

            $cartItem->update(['quantity' => $newQuantity]);
        } else {
            if ($variant->stock < $request->quantity) {
                return redirect()->back()->withErrors(['message' => 'Stok produk tidak mencukupi.']);
            }

            CartItem::create([
                'cart_id' => $cart->id,
                'variant_id' => $request->product_variant_id, // 🔥 FIX
                'quantity' => $request->quantity,
            ]);
        }

        return redirect()->back()->with('success', 'Produk berhasil dimasukkan ke keranjang.');
    }

    public function update(Request $request, $id)
    {
        $request->validate([
            'quantity' => 'required|integer|min:1',
        ]);

        $cartItem = CartItem::whereHas('cart', function ($query) {
            $query->where('user_id', Auth::id());
        })->findOrFail($id);

        // 🔥 FIX
        $variant = ProductVariant::findOrFail($cartItem->variant_id);

        if ($variant->stock < $request->quantity) {
            return redirect()->back()->withErrors(['message' => 'Aksi ditolak: Jumlah melebihi stok yang tersedia.']);
        }

        $cartItem->update(['quantity' => $request->quantity]);

        return redirect()->back()->with('success', 'Kuantitas berhasil diperbarui.');
    }

    public function destroy($id)
    {
        $cartItem = CartItem::whereHas('cart', function ($query) {
            $query->where('user_id', Auth::id());
        })->findOrFail($id);

        $cartItem->delete();

        return redirect()->back()->with('success', 'Item berhasil dihapus dari keranjang.');
    }

    public function checkoutToOrder(Request $request)
    {
        $request->validate([
            'cart_item_ids' => 'required|array',
            'cart_item_ids.*' => 'required|exists:cart_items,id',
        ]);

        $userId = Auth::id();

        $selectedItems = CartItem::whereHas('cart', function ($query) use ($userId) {
            $query->where('user_id', $userId);
        })
            // 🔥 FIX relation
            ->with('variant.product.umkm', 'variant.attributeValues.attribute')
            ->whereIn('id', $request->cart_item_ids)
            ->get();

        if ($selectedItems->isEmpty()) {
            return redirect()->back()->withErrors(['message' => 'Pilih minimal satu produk untuk melakukan checkout.']);
        }

        $umkmIds = $selectedItems->pluck('variant.product.umkm_id')->unique();

        if ($umkmIds->count() > 1) {
            return redirect()->back()->withErrors([
                'message' => 'Batas Aturan Transaksi: Anda hanya bisa melakukan checkout produk dari satu UMKM yang sama dalam satu pesanan.'
            ]);
        }

        $targetUmkmId = $umkmIds->first();

        DB::beginTransaction();

        try {
            $totalPrice = 0;

            foreach ($selectedItems as $item) {
                $price = $item->variant->price; // 🔥 FIX
                $totalPrice += $price * $item->quantity;
            }

            // 🔥 FIX ENUM + REQUIRED FIELD
            $order = Order::create([
                'user_id' => $userId,
                'umkm_id' => $targetUmkmId,
                'invoice_number' => 'INV-' . time() . rand(100, 999),
                'type' => 'DIAMBIL',
                'total_price' => $totalPrice,
                'status' => 'MENUNGGU PEMBAYARAN',
                'payment_status' => 'BELUM DIBAYAR',
                'address' => '-',
                'shipping_cost' => 0,
            ]);

            foreach ($selectedItems as $item) {
                $variant = ProductVariant::lockForUpdate()->findOrFail($item->variant_id);

                if ($variant->stock < $item->quantity) {
                    throw new \Exception("Stok untuk produk {$variant->product->name} tidak mencukupi.");
                }

                // 🔥 BUILD VARIANT DETAIL
                $variantDetail = $variant->attributeValues
                    ->map(fn($attr) => $attr->attribute->name . ': ' . $attr->value)
                    ->implode(', ');

                OrderItem::create([
                    'order_id' => $order->id,
                    'product_id' => $variant->product->id,
                    'variant_id' => $variant->id,
                    'product_name' => $variant->product->name,
                    'variant_detail' => $variantDetail,
                    'price' => $variant->price,
                    'quantity' => $item->quantity,
                    'subtotal' => $variant->price * $item->quantity,
                ]);

                $variant->decrement('stock', $item->quantity);
                $item->delete();
            }

            DB::commit();

            return redirect()->route('order.show', $order->id)
                ->with('success', 'Pesanan berhasil dibuat, silakan selesaikan pembayaran.');
        } catch (\Exception $e) {
            DB::rollBack();
            return redirect()->back()->withErrors([
                'message' => 'Gagal memproses checkout: ' . $e->getMessage()
            ]);
        }
    }
}
