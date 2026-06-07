<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use App\Models\Order\Order;
use App\Models\Product\Product;
use App\Models\UMKM\Umkm;
use Illuminate\Support\Carbon;
use Inertia\Inertia;

class DashboardController extends Controller
{
    public function index() {
        $user = Auth::user();
        $umkmId = $user->umkm?->id;

        $umkmStat = Order::selectRaw('umkm_id, SUM(total_price) as total_pendapatan, COUNT(user_id) as total_pembeli')
            ->groupBy('umkm_id')
            ->get();

        $activeProduct = Product::selectRaw('umkm_id, COUNT(id) as total_produk')
            ->groupBy('umkm_id')
            ->get();
        
        $storeRating = Umkm::with(['products' => function($query) {
            $query->withAvg('reviews', 'rating');
        }])->get();

        $topProducts = Product::where('umkm_id', $umkmId)
            ->with(['category', 'productImages'])
            ->withSum('orderItems as total_terjual', 'quantity')
            ->orderByDesc('total_terjual')
            ->limit(3)
            ->get();

        $startOfWeek = Carbon::now()->startOfWeek();
        $endOfWeek = Carbon::now()->endOfWeek();

        $salesData = Order::where('umkm_id', $umkmId)
            ->whereBetween('created_at', [$startOfWeek, $endOfWeek])
            ->selectRaw('DAYOFWEEK(created_at) as day_num, COUNT(id)as total_terjual')
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

        $latestOrders = Order::with(['user', 'orderItems'])
            ->orderBy('created_at', 'desc')
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
        'status' => 'required|in:BUKA,TUTUP',
    ]);
    
    $user = Auth::user();

    $umkm = $user->umkm;
    
    $umkm->status = $request->status;
    
    $umkm->save();

    return back();
    }

    public function order() {
        $orders = Order::where('umkm_id', Auth::user()->umkm->id)->with([
            'umkm',
            'orderItems',
            'user'
        ])->orderBy('created_at', 'desc')
          ->paginate(20);

        return Inertia::render('umkm/order', ['orders' => $orders]);
    }
}
