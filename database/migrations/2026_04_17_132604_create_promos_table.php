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
        Schema::create('promos', function (Blueprint $table) {
            $table->id();
            $table->foreignId('ummkm_id')->constrained('umkms')->onDelete('cascade');
            $table->string('name');
            $table->enum('type', ['DISKON', 'PROMO']);
            $table->text('description');
            $table->text('image')->nullable();
            $table->date('start_date');
            $table->date('end_date');
            $table->enum('status', [
                'SEGERA HADIR',
                'BERLANGSUNG',
                'BERAKHIR',
            ])->default('SEGERA HADIR');
            $table->integer('discount_percent')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('promos');
    }
};
