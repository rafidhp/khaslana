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
        Schema::create('user_locations', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained('users')->onDelete('cascade');
            $table->char('province_id', 2)->unique();
            $table->char('city_id', 4)->unique();
            $table->char('district_id', 7)->unique();
            $table->char('village_id', 10)->unique();
            $table->decimal('latitude', 10, 8)->nullable();
            $table->decimal('longitude', 11, 8)->nullable();
            $table->text('address');
            $table->timestamps();

            $table->foreign('province_id')
                ->references('code')
                ->on('indonesia_provinces')
                ->onDelete('restrict');

            $table->foreign('city_id')
                ->references('code')
                ->on('indonesia_cities')
                ->onDelete('restrict');

            $table->foreign('district_id')
                ->references('code')
                ->on('indonesia_districts')
                ->onDelete('restrict');

            $table->foreign('village_id')
                ->references('code')
                ->on('indonesia_villages')
                ->onDelete('restrict');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('user_locations');
    }
};
