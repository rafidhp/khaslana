<?php

use App\Http\Controllers\Auth\GoogleController;
use App\Http\Controllers\HomeController;
use App\Http\Controllers\ProductController;
use App\Http\Controllers\TrackingController;
use App\Http\Controllers\CatalogController;
use App\Http\Controllers\CommunityController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\StoreController;
use App\Http\Controllers\UmkmController;
// use App\Http\Controllers\StoreStatusController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', [HomeController::class, 'index'])->name('home');

Route::get('/about', function() {
    return Inertia::render('user/about');
})->name('about');

Route::controller(GoogleController::class)->group(function() {
    Route::get('/auth/google', 'redirect')->name('google-auth');
    Route::get('/auth/google/callback', 'callback')->name('google-auth.callback');
});

// login required routes
Route::middleware(['auth', 'verified'])->group(function () {
    // dashboard route
    Route::controller(DashboardController::class)->group(function() {
        Route::get('/dashboard', 'index')->name('dashboard');
    });

    // product routes
    Route::controller(ProductController::class)->group(function() {
        Route::get('/product', 'index')->name('product');
    });

    // tracking routes
    Route::controller(TrackingController::class)->group(function () {
        Route::post('/umkm/update-location', 'updateLocation')->name('umkm.update-location');
        Route::get('/umkm/current-location-status', 'getCurrentStatus');
    });
    
    // TODO: ini contoh sebelum yg di bawah comment ini, route atas comment ini contoh setelahnya, nanti di fe pake route dari wayfinder, import { stayPoint } from '@/routes'; atau kalau mau ambil sub route bisa kaya gini, import { updateLocation } from '@/routes/stayPoint'; kalo si sub route nya namanya updateLocation
    // Route::get('/umkm/current-location-status', [App\Http\Controllers\TrackingController::class, 'getCurrentStatus']);

    Route::get('/umkm/stay-point', function () {
        return inertia('umkm/stay-point');
    })->name('umkm.stay-point');


    // store management
    Route::controller(StoreController::class)->group(function() {
        Route::get('/store-management', 'index')->name('storeManagement');
        Route::post('/store-management/store', 'store')->name('storeManagement.store');
        Route::put('/store-management/update', 'update')->name('storeManagement.update');
        Route::post('/store-management/store-logo', 'storeLogo')->name('storeManagement.storeLogo');
    });

    // Community page
    Route::controller(CommunityController::class)->group(function() {
        Route::get('/community/create-post', [CommunityController::class, 'create'])->name('community.create');
        
        Route::post('/community', [CommunityController::class, 'store'])->name('community.store');

        Route::delete('/community/{post}', [CommunityController::class, 'destroy'])->name('community.destroy');

        Route::post('/community/{post}/like', [CommunityController::class, 'toggleLike'])->name('community.like');
    });
});

Route::get('/community', [CommunityController::class, 'index'])->name('community');

Route::controller(CatalogController::class)->group(function() {
    Route::get('/catalog', 'index')->name('catalog');

    Route::get('/catalog/{id}', 'show')->name('catalog.show');
});

Route::controller(UmkmController::class)->group(function() {
    Route::get('/umkm', 'index')->name('umkm');
    Route::get('/umkm/detail/{umkm_id}', 'detail')->name('umkm.detail');
    Route::get('/umkm/products', 'umkmProducts')->name('umkm.products');
});

// Route::get('/store-status', [StoreStatusController::class, 'index']);

// Route::post('/store-status', [StoreStatusController::class, 'update']);

require __DIR__.'/settings.php';
require __DIR__.'/api.php';
