<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\Rule;
use Illuminate\Support\Str;

use App\Models\Product\Product;
use App\Models\Product\ProductVariant;
use App\Models\Order\Order;
use App\Models\Order\Payment;

use Inertia\Inertia;
use Midtrans\Config;
use Midtrans\Snap;

class OrderController extends Controller
{
    public function index($order_id) {
        $order = Order::with([
            'umkm',
            'orderItems.product.productImages',
            'orderItems.variant.attributeValues.attribute',
            'payment',
        ])
        ->where('user_id', Auth::id())
        ->findOrFail($order_id);

        return Inertia::render('user/order/index', [
            'order' => $order,
        ]);
    }
    
    public function dialogStore(Request $request, $product_id) {
        $request->validate([
            'variant_id' => ['required', 'exists:product_variants,id'],
            'quantity' => ['required', 'integer', 'min:1'],
        ]);
        $product = Product::with([
            'productVariants.attributeValues.attribute',
            'umkm',
        ])->findOrFail($product_id);
        $variant = ProductVariant::with([
            'attributeValues.attribute',
        ])
        ->where('product_id', $product->id)
        ->findOrFail($request->variant_id);

        if ($variant->stock < $request->quantity) {
            return back()->with(
                'error',
                'Stok tidak mencukupi.'
            );
        }
        if ($product->umkm_id === Auth::user()->umkm?->id) {
            return back()->withErrors(
                'error',
                'Anda tidak dapat membeli produk sendiri.'
            );
        }

        $order = null;

        DB::transaction(function () use ($product, $variant, $request, &$order) {
            $invoiceNumber =
                'INV-' .
                now()->format('YmdHis') .
                '-' .
                Str::upper(Str::random(5));

            $subtotal = $variant->price * $request->quantity;
            $variantDetail = $variant->attributeValues
                ->map(function ($attributeValue) {
                    return
                        $attributeValue->attribute->name
                        . ': ' .
                        $attributeValue->value;
                })
                ->join(', ');

            $order = Order::create([
                'user_id' => Auth::id(),
                'umkm_id' => $product->umkm_id,

                'invoice_number' => $invoiceNumber,
                'type' => 'DIAMBIL',
                'total_price' => $subtotal,
                'status' => 'TERTUNDA',
                'payment_status' => 'BELUM DIBAYAR',

                'address' => '',
                'shipping_cost' => $product->umkm->shipping_cost,
            ]);

            $order->orderItems()->create([
                'product_id' => $product->id,
                'variant_id' => $variant->id,

                'product_name' => $product->name,
                'variant_detail' => $variantDetail,
                'price' => $variant->price,
                'quantity' => $request->quantity,
                'subtotal' => $subtotal,
            ]);
        });
        return redirect()->route('order', $order->id);
    }

    public function generatePayment(Order $order) {
        Config::$serverKey = config('services.midtrans.server_key');
        Config::$isProduction = config('services.midtrans.is_production');
        Config::$isSanitized = true;
        Config::$is3ds = true;

        $params = [
            'transaction_details' => [
                'order_id' => $order->invoice_number,
                'gross_amount' => $order->total_price,
            ],

            'customer_details' => [
                'first_name' => Auth::user()->name,
                'email' => Auth::user()->email,
            ],
        ];
        $snapToken = Snap::getSnapToken($params);

        $payment = Payment::updateOrCreate(
            [
                'order_id' => $order->id,
            ],
            [
                'midtrans_order_id' => $order->invoice_number,
                'payment_type' => 'SNAP',
                'transaction_status' => 'pending',
                'gross_amount' => $order->total_price,
                'snap_token' => $snapToken,
            ]
        );

        return response()->json(['snap_token' => $snapToken]);
    }

    public function checkout(Request $request, Order $order) {
        $request->validate([
            'type' => [
                'required',
                Rule::in(['DIAMBIL','DIANTAR']),
            ],
            'notes' => ['nullable', 'string'],
            'address' => ['required', 'string'],
        ]);

        $shippingCost = $request->type === 'DIANTAR'
            ? $order->umkm->shipping_cost
            : 0;

        $subtotal = $order->orderItems->sum('subtotal');
        $serviceFee = 2000;
        $totalPrice = $subtotal + $serviceFee + $shippingCost;

        $order->update([
            'type' => $request->type,
            'notes' => $request->notes,
            'address' => $request->type === 'DIANTAR'
                ? $request->address
                : '',

            'shipping_cost' => $shippingCost,
            'total_price' => $totalPrice,
            'status' => 'MENUNGGU PEMBAYARAN',
        ]);

        return response()->json([
            'success' => true,
        ]);
    }

    public function ngrokTest() {
        dd('BERHASIL');
    }
}
