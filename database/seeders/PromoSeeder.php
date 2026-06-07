<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Promo;
use App\Models\UMKM\Umkm;
use Carbon\Carbon;

class PromoSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Cari UMKM pertama yang ada di database untuk dijadikan pemilik promo
        // Jika belum ada UMKM sama sekali, seeder ini akan error. Pastikan UMKM sudah ada.
        $umkm = Umkm::first(); 

        if ($umkm) {
            $promos = [
                [
                    'umkm_id' => $umkm->id,
                    'name' => 'Diskon Spesial Kemerdekaan',
                    'type' => 'DISKON',
                    'description' => "Nikmati diskon spesial 17% untuk semua produk pilihan dari toko kami. \n\nSyarat dan ketentuan berlaku.",
                    'image' => null,
                    'start_date' => Carbon::now()->format('Y-m-d'),
                    'end_date' => Carbon::now()->addDays(14)->format('Y-m-d'),
                    'status' => 'BERLANGSUNG',
                    'discount_percent' => 17,
                ],
                [
                    'umkm_id' => $umkm->id,
                    'name' => 'Promo Bundling Akhir Tahun',
                    'type' => 'PROMO',
                    'description' => 'Beli 2 Gratis 1 untuk produk unggulan kami. Sangat cocok untuk hadiah akhir tahun keluarga Anda!',
                    'image' => null,
                    'start_date' => Carbon::now()->addDays(20)->format('Y-m-d'),
                    'end_date' => Carbon::now()->addDays(30)->format('Y-m-d'),
                    'status' => 'SEGERA HADIR',
                    'discount_percent' => null, // Karena tipenya promo, bukan diskon persen
                ]
            ];

            foreach ($promos as $promo) {
                Promo::create($promo);
            }

            $this->command->info('Data dummy Promo berhasil ditambahkan!');
        } else {
            $this->command->error('Gagal: Tidak ada data UMKM di database. Silakan seed/buat UMKM terlebih dahulu.');
        }
    }
}