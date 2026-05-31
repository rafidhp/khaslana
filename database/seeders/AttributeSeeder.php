<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

use App\Models\Product\Attribute;
use App\Models\Product\AttributeValue;

class AttributeSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $color = Attribute::create([
            'name' => 'Warna',
        ]);
        AttributeValue::insert([
            [
                'attribute_id' => $color->id,
                'value' => 'Merah',
                'additional_price' => 0,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'attribute_id' => $color->id,
                'value' => 'Kuning',
                'additional_price' => 0,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'attribute_id' => $color->id,
                'value' => 'Hijau',
                'additional_price' => 0,
                'created_at' => now(),
                'updated_at' => now(),
            ],
        ]);

        $size = Attribute::create([
            'name' => 'Ukuran',
        ]);
        AttributeValue::insert([
            [
                'attribute_id' => $size->id,
                'value' => 'Kecil',
                'additional_price' => 0,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'attribute_id' => $size->id,
                'value' => 'Sedang',
                'additional_price' => 5000,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'attribute_id' => $size->id,
                'value' => 'Besar',
                'additional_price' => 10000,
                'created_at' => now(),
                'updated_at' => now(),
            ],
        ]);

        $condition = Attribute::create([
            'name' => 'Kondisi',
        ]);
        AttributeValue::insert([
            [
                'attribute_id' => $condition->id,
                'value' => 'Biasa',
                'additional_price' => 0,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'attribute_id' => $condition->id,
                'value' => 'Baik',
                'additional_price' => 10000,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'attribute_id' => $condition->id,
                'value' => 'Super Baik',
                'additional_price' => 20000,
                'created_at' => now(),
                'updated_at' => now(),
            ],
        ]);
    }
}
