<?php

use App\Http\Controllers\ProductController;
use App\Http\Controllers\CatalogController;
use App\Http\Controllers\CommunityController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\UmkmController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use Laravel\Fortify\Features;

Route::get('/', function () {
    return Inertia::render('welcome', [
        'canRegister' => Features::enabled(Features::registration()),
    ]);
})->name('home');

Route::get('/about', function() {
    return Inertia::render('user/about');
})->name('about');

Route::middleware(['auth', 'verified'])->group(function () {
    // dashboard route
    Route::controller(DashboardController::class)->group(function() {
        Route::get('/dashboard', 'index')->name('dashboard');
    });

    // product routes
    Route::controller(ProductController::class)->group(function() {
        Route::get('/product', 'index')->name('product');
    });
});


Route::controller(CatalogController::class)->group(function() {
    Route::get('/catalog', 'index')->name('catalog');
});

Route::controller(CommunityController::class)->group(function() {
    Route::get('/community', 'index')->name('community');
});

Route::controller(UmkmController::class)->group(function() {
    Route::get('/umkm', 'index')->name('umkm');
});

require __DIR__.'/settings.php';
