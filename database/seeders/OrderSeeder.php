<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Order\Order;
use App\Models\Order\OrderItem;
use App\Models\Order\Payment;
use App\Models\User;
use App\Models\UMKM\Umkm;
use App\Models\Product\Product;
use App\Models\Product\ProductVariant;
use Illuminate\Support\Str;
use Carbon\Carbon;

class OrderSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // 1. Ambil semua ID yang dibutuhkan untuk relasi
        $userIds = User::pluck('id')->toArray();
        $umkmIds = Umkm::pluck('id')->toArray();
        $products = Product::all();

        // Validasi master data wajib ada dulu
        if (empty($userIds) || empty($umkmIds) || $products->isEmpty()) {
            $this->command->warn('Harap isi seeder User, UMKM, dan Product terlebih dahulu!');
            return;
        }

        // Setup variabel dummy
        $statuses = ['pending', 'processing', 'shipped', 'completed', 'cancelled'];
        $couriers = ['jne', 'jnt', 'sicepat'];
        
        // Gunakan faker bawaan Laravel untuk data teks acak
        $faker = \Faker\Factory::create('id_ID'); // set lokal Indonesia biar alamatnya lokal

        // 2. Mulai perulangan untuk membuat 15 Order
        for ($i = 1; $i <= 15; $i++) {
            
            $status = $statuses[array_rand($statuses)];
            $shippingCost = rand(10000, 30000);
            
            // Tentukan status payment berdasarkan status order
            $paymentStatus = 'unpaid';
            if (in_array($status, ['processing', 'shipped', 'completed'])) {
                $paymentStatus = 'paid';
            } elseif ($status === 'cancelled') {
                $paymentStatus = fake()->randomElement(['unpaid', 'expired']);
            }

            $paidAt = ($paymentStatus === 'paid') ? Carbon::now()->subHours(rand(1, 24)) : null;

            $order = new Order();
    
            // ISI SATU PER SATU BIAR TIDAK TERGANTUNG URUTAN ARRAY MIGRATION
            $order->user_id          = $userIds[array_rand($userIds)];
            $order->umkm_id          = $umkmIds[array_rand($umkmIds)];
            $order->invoice_number   = 'INV/' . date('Ymd') . '/' . Str::upper(Str::random(6));
            $order->type             = 'delivery'; 
            $order->total_price      = 0; // isi 0 dulu nanti diupdate setelah item dihitung
            $order->status           = $status;
            $order->payment_status   = $paymentStatus;
            $order->address          = Str::limit($faker->address(), 150);
            $order->notes            = 'Notes dummy';
            $order->shipping_cost    = $shippingCost;
            $order->shipping_courier = 'jne';
            $order->shipping_service = 'REG';
            $order->paid_at          = $paidAt;
            $order->tracking_number  = in_array($status, ['shipped', 'completed']) ? 'TRK' . rand(100000, 999999) : null;
            $order->shipped_at       = in_array($status, ['shipped', 'completed']) ? Carbon::now()->subHours(5) : null;
            $order->completed_at     = $status === 'completed' ? Carbon::now() : null;
            
            // SIMPAN KE DATABASE
            $order->save();

            // 3. Buat Order Item (Acak antara 1 sampai 3 item per order)
            $totalItemSubtotal = 0;
            $itemCount = rand(1, 3);

            for ($j = 0; $j < $itemCount; $j++) {
                $product = $products->random();
                
                // Cari apakah produk punya varian
                $variant = ProductVariant::where('product_id', $product->id)->inRandomOrder()->first();
                
                $price = $product->price;
                $quantity = rand(1, 3);
                $subtotal = $price * $quantity;
                $totalItemSubtotal += $subtotal;

                OrderItem::create([
                    'order_id'       => $order->id,
                    'product_id'     => $product->id,
                    'variant_id'     => $variant ? $variant->id : null,
                    'product_name'   => $product->name,
                    'variant_detail' => $variant ? "Warna: {$variant->color}, Ukuran: {$variant->size}" : null,
                    'price'          => $price,
                    'quantity'       => $quantity,
                    'subtotal'       => $subtotal,
                ]);
            }

            // 4. Hitung Total Pembayaran Akhir (Subtotal Item + Ongkir)
            $grandTotal = $totalItemSubtotal + $shippingCost;

            // Update kembali total_price di order tadi
            $order->update(['total_price' => $grandTotal]);

            // 5. Buat log Payment jika orderannya sudah diproses/dibayar/batal lewat Midtrans
            if ($status !== 'pending') {
                
                $midtransStatus = 'pending';
                if ($paymentStatus === 'paid') {
                    $midtransStatus = 'settlement';
                } elseif ($status === 'cancelled') {
                    $midtransStatus = 'expire';
                }

                Payment::create([
                    'order_id'           => $order->id,
                    'midtrans_order_id'  => 'MID-' . Str::upper(Str::random(10)),
                    'payment_type'       => $faker->randomElement(['gopay', 'bank_transfer', 'qris']),
                    'transaction_status' => $midtransStatus,
                    'fraud_status'       => 'accept',
                    'gross_amount'       => $grandTotal, // Jumlahnya sinkron dengan order
                    'snap_token'         => Str::random(32),
                    'raw_response'       => json_encode(['status_message' => 'Success dummy response']),
                    'paid_at'            => $paidAt,
                ]);
            }
        }
    }
}