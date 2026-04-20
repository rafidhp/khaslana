<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('orders', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained('users')->onDelete('restrict');
            $table->foreignId('umkm_id')->constrained('umkms')->onDelete('restrict');
            $table->string('invoice_number')->unique();
            $table->enum('type', ['DIAMBIL', 'DIANTAR']);
            $table->decimal('total_price', 12);
            $table->enum('status', [
                'TERTUNDA',
                'MENUNGGU PEMBAYARAN',
                'DIBAYAR',
                'DALAM PROSES',
                'DIKIRIM',
                'SELESAI',
                'DIBATALKAN',
            ])->default('MENUNGGU PEMBAYARAN');
            $table->enum('payment_status', [
                'BELUM DIBAYAR',
                'DIBAYAR',
                'GAGAL',
                'KADALUWARSA',
            ])->default('BELUM DIBAYAR');
            $table->text('address');
            $table->text('notes')->nullable();
            $table->decimal('shipping_cost')->default(0);
            $table->string('shipping_courier')->nullable();
            $table->string('shipping_service')->nullable();
            $table->timestamp('paid_at')->nullable();
            $table->string('tracking_number')->nullable(); // no resi
            $table->timestamp('shipped_at')->nullable();
            $table->timestamp('completed_at')->nullable();
            $table->timestamps();
        });

        Schema::create('order_items', function (Blueprint $table) {
            $table->id();
            $table->foreignId('order_id')->constrained('orders')->onDelete('cascade');
            $table->foreignId('product_id')->constrained('products')->onDelete('no action');
            $table->foreignId('variant_id')->constrained('product_variants')->onDelete('no action');
            $table->string('product_name');
            $table->string('variant_detail');
            $table->decimal('price', 12);
            $table->integer('quantity');
            $table->decimal('subtotal', 12); // price * quantity
            $table->timestamps();
        });

        Schema::create('payments', function (Blueprint $table) {
            $table->id();
            $table->foreignId('order_id')->constrained('orders')->onDelete('restrict');
            $table->string('midtrans_order_id')->unique();
            $table->string('payment_type');
            $table->string('transaction_status');
            $table->string('fraud_status')->nullable(); // hanya untuk credit card
            $table->decimal('gross_amount', 12);
            $table->text('snap_token')->nullable();
            $table->json('raw_response')->nullable();
            $table->timestamp('paid_at')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('orders');
        Schema::dropIfExists('order_items');
        Schema::dropIfExists('payments');
    }
};
