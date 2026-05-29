<?php

namespace Database\Seeders;

use App\Models\Category;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class CategorySeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $categories = [
            [
                'name' => 'MAKANAN',
            ],
            [
                'name' => 'MINUMAN',
            ],
            [
                'name' => 'JASA',
            ],
            [
                'name' => 'BARANG',
            ],
            [
                'name' => 'WISATA',
            ],
            [
                'name' => 'BUDAYA',
            ],
        ];

        foreach ($categories as $key => $value) {
            Category::create($value);
        }
    }
}
