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
        Schema::create('umkms', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained('users')->onDelete('restrict');
            $table->foreignId('province_id')->constrained('indonesia_provinces')->onDelete('restrict');
            $table->foreignId('city_id')->constrained('indonesia_cities')->onDelete('restrict');
            $table->foreignId('ditrict_id')->constrained('indonesia_districts')->onDelete('restrict');
            $table->foreignId('village_id')->constrained('indonesia_villages')->onDelete('restrict');
            $table->string('store_name');
            $table->text('description');
            $table->enum('type', ['TETAP', 'KELILING']);
            $table->text('address');
            $table->char('phone_number', 15);
            $table->string('open_days')->nullable(); //note: dropdown hardcode value
            $table->string('open_time')->nullable();
            $table->string('close_time')->nullable();
            $table->float('average_rating')->default(0);
            $table->boolean('is_order_feature')->default(false);
            $table->boolean('is_shipping_feature')->default(false);
            $table->decimal('shipping_cost', 12)->default(0);
            $table->timestamps();
            $table->softDeletes();
        });

        Schema::create('umkm_datas', function (Blueprint $table) {
            $table->id();
            $table->foreignId('umkm_id')->constrained('umkms')->onDelete('cascade');
            $table->char('npwp', 16)->nullable();
            $table->char('nib', 13)->nullable();
            $table->char('nik', 16)->nullable()->unique();
            $table->string('image_hash')->nullable()->unique(); // ktp verification needs
            $table->text('file_path')->nullable();
            $table->timestamps();
        });

        Schema::create('umkm_images', function (Blueprint $table) {
            $table->id();
            $table->foreignId('umkm_id')->constrained('umkms')->onDelete('cascade');
            $table->text('image');
            $table->timestamps();
        });

        // umkm routes on going schema
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('umkms');
        Schema::dropIfExists('umkm_datas');
        Schema::dropIfExists('umkm_images');
    }
};
