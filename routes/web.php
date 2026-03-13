<?php

use App\Http\Controllers\ProductController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use Laravel\Fortify\Features;

Route::get('/', function () {
    return Inertia::render('welcome', [
        'canRegister' => Features::enabled(Features::registration()),
    ]);
})->name('home');

Route::get('dashboard', function () {
    return Inertia::render('dashboard');
})->middleware(['auth', 'verified'])->name('dashboard');

// Route::get('/product', function() {
//     return Inertia::render('product');
// })->name('product');

Route::controller(ProductController::class)->group(function() {
    Route::get('/product', 'index')->name('product');
});

require __DIR__.'/settings.php';
