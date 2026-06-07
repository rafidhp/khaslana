<?php

namespace Database\Seeders;

use App\Models\User;
// use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;
use Laravolt\Indonesia\Seeds\DatabaseSeeder as IndonesiaSeeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        if(app()->environment('production')) {
            User::firstOrCreate([
                'name' => 'Admin',
                'username' => 'admin',
                'email' => 'admin@khaslana.com',
                'email_verified_at' => now(),
                'password' => Hash::make('password'),
            ]);

            $this->call([
                IndonesiaSeeder::class,
                CategorySeeder::class,
            ]);
        } else {
            User::factory()->create([
                'name' => 'Test User',
                'username' => 'test',
                'email' => 'test@example.com',
            ]);

            $this->call([
                IndonesiaSeeder::class,
                CategorySeeder::class,
                AttributeSeeder::class,
                ProductSeeder::class,
            ]);
        }

    }
}
