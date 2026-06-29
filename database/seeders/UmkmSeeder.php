<?php

namespace Database\Seeders;

use App\Models\UMKM\Umkm;
use App\Models\UMKM\UmkmImage;
use App\Models\UMKM\UmkmLocation;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class UmkmSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $umkms = [
            [
                'user_id' => 2,
                'province_id' => 32,
                'city_id' => 3215,
                'district_id' => 321501,
                'village_id' => 3215011001,
                'store_name' => 'Toko Fajri',
                'description' => 'Semua barang di toko ini dijamin asli 1000%. Bagus bagus semua, jangan lupa beli di Toko Fajri SEKARANG JUGA!!!',
                'type' => 'TETAP',
                'address' => 'Jl. K.H. Ahmad Dahlan, Karawang Kulon, Kec. Karawang Barat, Karawang, Jawa Barat 41311',
                'phone_number' => '081212345678',
                'open_days' => 'SETIAP HARI',
                'open_time' => '08.00',
                'close_time' => '20.00',
                'is_order_feature' => true,
            ],
        ];

        $umkmImages = [
            [
                'umkm_id' => 1,
                'image' => 'products/default-product.png',
            ],
        ];

        $umkmLocations = [
            [
                'umkm_id' => 1,
                'latitude' => -6.310077614809147,
                'longitude' => 107.29311577115588,
            ],
        ];

        foreach ($umkms as $umkm) {
            Umkm::create($umkm);
        }

        foreach ($umkmImages as $umkmImage) {
            UmkmImage::create($umkmImage);
        }

        foreach ($umkmLocations as $umkmLocation) {
            UmkmLocation::create($umkmLocation);
        }
    }
}
