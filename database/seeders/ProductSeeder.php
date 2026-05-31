<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

use App\Models\Category;
use App\Models\Product\Product;
use App\Models\Product\ProductImage;
use App\Models\Product\ProductVariant;
use App\Models\UMKM\Umkm;
use App\Models\Product\Attribute;

class ProductSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $categories = Category::all();
        $umkms = Umkm::all();

         $colorValues = Attribute::where('name', 'Warna')
            ->first()
            ->attributeValues;

        $sizeValues = Attribute::where('name', 'Ukuran')
            ->first()
            ->attributeValues;

        $conditionValues = Attribute::where('name', 'Kondisi')
            ->first()
            ->attributeValues;

        $productNames = [
            'Ayam Geprek',
            'Nasi Goreng',
            'Mie Ayam',
            'Bakso Spesial',
            'Es Teh Manis',
            'Kopi Susu',
            'Jaket Hoodie',
            'Kaos Polos',
            'Tas Handmade',
            'Sepatu Casual',
            'Kerajinan Rotan',
            'Souvenir Kayu',
            'Paket Wisata Alam',
            'Jasa Desain Logo',
            'Jasa Fotografi',
            'Keripik Pisang',
            'Brownies Coklat',
            'Sambal Rumahan',
            'Parfum Lokal',
            'Dompet Kulit',
        ];

        foreach ($umkms as $umkm) {
            $productCount = rand(16, 30);

            for ($i = 0; $i < $productCount; $i++) {
                $product = Product::create([
                    'umkm_id' => $umkm->id,
                    'category_id' => $categories->random()->id,
                    'promo_id' => null,
                    'name' => fake()->randomElement($productNames),
                    'description' => fake()->paragraph(),
                    'is_archived' => false,
                ]);

                for ($j = 0; $j < rand(1, 3); $j++) {
                    ProductImage::create([
                        'product_id' => $product->id,
                        'image' => 'products/default-product.png',
                    ]);
                }

                for ($j = 0; $j < rand(2, 5); $j++) {
                    $color = $colorValues->random();
                    $size = $sizeValues->random();
                    $condition = $conditionValues->random();

                    $basePrice = rand(10000, 100000);

                    $finalPrice =
                        $basePrice +
                        $color->additional_price +
                        $size->additional_price +
                        $condition->additional_price;

                    $variant = ProductVariant::create([
                        'product_id' => $product->id,
                        'price' => $finalPrice,
                        'stock' => rand(0, 100),
                    ]);

                    $variant->attributeValues()->attach([
                        $color->id,
                        $size->id,
                        $condition->id,
                    ]);
                }
            }
        }
    }
}
