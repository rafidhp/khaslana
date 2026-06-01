<?php

use App\Http\Controllers\Auth\GoogleController;
use App\Http\Controllers\HomeController;
use App\Http\Controllers\ProductController;
use App\Http\Controllers\TrackingController;
use App\Http\Controllers\CatalogController;
use App\Http\Controllers\CommunityController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\StoreController;
use App\Http\Controllers\MappingController;
use App\Http\Controllers\UmkmController;
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
    Route::controller(TrackingController::class)->prefix('stay-point')->group(function () {
        Route::get('/', 'index')->name('stayPoint');
        Route::post('/update-location', 'updateLocation')->name('stayPoint.updateLocation');
        Route::get('/current-location-status', 'getCurrentStatus')->name('stayPoint.currentLocation');
    });

    Route::controller(MappingController::class)->prefix('rute')->group(function () {
        Route::get('/api-data', 'getRouteData')->name('rute.data');
    });


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

        Route::get('/community/my-posts', [CommunityController::class, 'myPosts'])->name('community.myPosts');

        Route::get('/community/{post}', [CommunityController::class, 'show'])->name('community.show');

        Route::delete('/community/{post}', [CommunityController::class, 'destroy'])->name('community.destroy');

        Route::post('/community/{post}/like', [CommunityController::class, 'toggleLike'])->name('community.like');

        Route::post('/community/{post}/comment', [CommunityController::class, 'storeComment'])->name('community.comments.store');

        Route::post('/community/{post}/comment/{comment}/like', [CommunityController::class, 'toggleLikeComment'])->name('community.comments.like');

        Route::delete('/community/{post}/comment/{comment}', [CommunityController::class, 'deleteComment'])->name('community.comments.delete');
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
    Route::get('/umkm/navigasi/{umkm_id}', 'navigasi')->name('umkm.navigasi');
    Route::get('/umkm/tracking/{umkm_id?}', 'tracking')->name('umkm.tracking');
    Route::get('/umkm/rute/{umkm_id}', 'rute')->name('umkm.rute');
    
});

require __DIR__.'/settings.php';
require __DIR__.'/api.php';
