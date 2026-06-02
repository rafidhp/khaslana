<?php

use App\Http\Controllers\Auth\GoogleController;
use App\Http\Controllers\ChatbotController;
use App\Http\Controllers\HomeController;
use App\Http\Controllers\OrderController;
use App\Http\Controllers\ProductController;
use App\Http\Controllers\TrackingController;
use App\Http\Controllers\CatalogController;
use App\Http\Controllers\CommunityController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\StoreController;
use App\Http\Controllers\MappingController;
use App\Http\Controllers\UmkmController;
use App\Http\Controllers\CartController;
use Illuminate\Support\Facades\Route;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
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
        Route::post('/dashboard/store-status', 'storeStatus')->name('dashboard.storeStatus');
    });

    // product routes
    Route::controller(ProductController::class)->group(function() {
        Route::get('/product', 'index')->name('product');
        Route::get('/product/create', 'create')->name('product.create');
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


    // store management routes
    Route::controller(StoreController::class)->group(function() {
        Route::get('/store-management', 'index')->name('storeManagement');
        Route::post('/store-management/store', 'store')->name('storeManagement.store');
        Route::put('/store-management/update', 'update')->name('storeManagement.update');
        Route::post('/store-management/store-logo', 'storeLogo')->name('storeManagement.storeLogo');
    });

    // community routes
    Route::controller(CommunityController::class)->group(function() {
        Route::get('/community/create-post', 'create')->name('community.create');
        Route::post('/community', 'store')->name('community.store');

        Route::get('/community/my-posts', 'myPosts')->name('community.myPosts');

        Route::get('/community/{post}', 'show')->name('community.show');
        Route::delete('/community/{post}', 'destroy')->name('community.destroy');
        Route::post('/community/{post}/like', 'toggleLike')->name('community.like');

        Route::post('/community/{post}/comment', 'storeComment')->name('community.comments.store');
        Route::post('/community/{post}/comment/{comment}/like', 'toggleLikeComment')->name('community.comments.like');
        Route::delete('/community/{post}/comment/{comment}', 'deleteComment')->name('community.comments.delete');
    });

    // catalog routes
    Route::controller(OrderController::class)->group(function () {
        Route::post('/order/store/{product_id}')->name('order.store');
    });

    Route::controller(CartController::class)->group(function () {
        Route::get('/cart', 'index')->name('cart');
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

Route::controller(ChatbotController::class)->group(function () {
    Route::get('/help', 'index')->name('chatbot');
    Route::post('/help/store', 'message')->name('chatbot.store');
});

require __DIR__.'/settings.php';
require __DIR__.'/api.php';
