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
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'attribute_id' => $color->id,
                'value' => 'Kuning',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'attribute_id' => $color->id,
                'value' => 'Hijau',
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
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'attribute_id' => $size->id,
                'value' => 'Sedang',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'attribute_id' => $size->id,
                'value' => 'Besar',
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
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'attribute_id' => $condition->id,
                'value' => 'Baik',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'attribute_id' => $condition->id,
                'value' => 'Super Baik',
                'created_at' => now(),
                'updated_at' => now(),
            ],
        ]);
    }
}
