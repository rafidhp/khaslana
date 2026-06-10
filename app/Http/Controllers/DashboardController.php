<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use App\Models\Order\Order;
use App\Models\Order\OrderItem;
use App\Models\Product\Product;
use Illuminate\Support\Carbon;
use Inertia\Inertia;

class DashboardController extends Controller
{
    public function index() {
        $user = Auth::user();
        $umkmId = $user->umkm?->id;

        $umkmStat = Order::query()
            ->where('umkm_id', $umkmId)
            ->where('payment_status', 'DIBAYAR')
            ->selectRaw('
                COUNT(*) as total_pesanan,
                SUM(total_price) as total_pendapatan,
                COUNT(DISTINCT user_id) as total_pembeli
            ')
            ->first();

        $activeProduct = Product::query()
            ->where('umkm_id', $umkmId)
            ->where('is_archived', false)
            ->count();
        
        $storeRating = Product::query()
            ->where('umkm_id', $umkmId)
            ->withAvg('reviews', 'rating')
            ->get();

        $topProducts = Product::query()
            ->where('umkm_id', $umkmId)
            ->with([
                'category',
                'productImages',
            ])
            ->withSum([
                'orderItems as total_terjual' => function ($query) {
                    $query->whereHas('order', function ($order) {
                        $order->where('payment_status', 'DIBAYAR');
                    });
                }
            ], 'quantity')
            ->orderByDesc('total_terjual')
            ->limit(3)
            ->get();

        $startOfWeek = Carbon::now()->startOfWeek();
        $endOfWeek = Carbon::now()->endOfWeek();

        $salesData = OrderItem::query()
            ->whereHas('order', function ($query) use ($umkmId) {
                $query
                    ->where('umkm_id', $umkmId)
                    ->where('payment_status', 'DIBAYAR');
            })
            ->join('orders', 'orders.id', '=', 'order_items.order_id')
            ->whereBetween(
                'orders.created_at',
                [$startOfWeek, $endOfWeek]
            )
            ->selectRaw('
                DAYOFWEEK(orders.created_at) as day_num,
                SUM(order_items.quantity) as total_terjual
            ')
            ->groupBy('day_num')
            ->get();

        $daysMapping = [
            2 => 'Sen',
            3 => 'Sel',
            4 => 'Rab',
            5 => 'Kam',
            6 => 'Jum',
            7 => 'Sab',
            1 => 'Min',
        ];

        $formattedChartData = [];
        foreach ($daysMapping as $num => $dayName) {
            $daySale = $salesData->firstWhere('day_num', $num);

            $formattedChartData[] = [
                'label' => $dayName,
                'penjualan' => $daySale ? (int) $daySale->total_terjual : 0
            ];
        }

        $latestOrders = Order::query()
            ->where('umkm_id', $umkmId)
            ->with([
                'user',
                'orderItems',
            ])
            ->latest()
            ->take(3)
            ->get();

        return Inertia::render('umkm/dashboard', [
            'status' => $user->umkm?->status ?? 'TUTUP',
            'umkm_stat' => $umkmStat,
            'active_product' => $activeProduct,
            'store_rating' => $storeRating,
            'top_products' => $topProducts,
            'sales_chart' => $formattedChartData,
            'latest_orders' => $latestOrders
        ]);
    }

    public function storeStatus(Request $request) {
        $request->validate([
            'statusLokasi' => 'nullable|in:TUTUP,MANGKAL,KELILING',
        ]);

        $umkm = $request->user()->umkm;

        if ($request->has('status')) {
            $isOpen = $umkm->status === 'BUKA';
            $umkm->update([
                'status' => $isOpen ? 'TUTUP' : 'BUKA',
            ]);
            // $umkm->umkmLocations()
            //     ->latest('id')
            //     ->first()
            //     ?->update([
            //         'is_active' => true,
            //         'status' => $isOpen ? 'TUTUP' : 'MANGKAL',
            //     ]);
        }

        if ($request->filled('statusLokasi')) {
            $umkm->umkmLocations()
                ->latest('id')
                ->first()
                ?->update([
                    'status' => $request->statusLokasi,
                ]);
        }

        return back();
    }

    public function order() {
        $orders = collect();

        if (Auth::user()->umkm) {
            $orders = Order::where('umkm_id', Auth::user()->umkm->id)->with([
                'umkm',
                'orderItems',
                'user'
            ])->orderBy('created_at', 'desc')
              ->paginate(20);
        }

        return Inertia::render('umkm/order/index', ['orders' => $orders]);
    }

    public function changeOrderStatus(Request $request, Order $order) {
        $request->validate([
            'status' => 'required'
        ]);

        $updateData = ['status' => $request->status];

        if ($request->status === 'DIKIRIM') {
            $updateData['shipped_at'] = now();
        } elseif ($request->status === 'SELESAI') {
            $updateData['completed_at'] = now();
        }

        $order->update($updateData);

        return redirect()->back()->with('success', 'Status order berhasil diubah!');
    }

    public function showOrder(Order $order) {
        $order->loadMissing([
            'user',
            'orderItems.variant',
            'orderItems.product.productImages',
            'payment',
            'umkm'
        ]);

        return Inertia::render('umkm/order/show', [
            'order' => $order
        ]);
    }
}
