<?php

use App\Http\Controllers\AdditionalVerificationController;
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
use App\Http\Controllers\PromoController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', [HomeController::class, 'index'])->name('home');

Route::get('/about', function() {
    return Inertia::render('user/about');
})->name('about');

Route::get('/dev-page', function() {
    return view('dev-page');
})->name('devPage');

Route::controller(GoogleController::class)->group(function() {
    Route::get('/auth/google', 'redirect')->name('google-auth');
    Route::get('/auth/google/callback', 'callback')->name('google-auth.callback');
});

// login required routes
Route::middleware(['auth', 'verified'])->group(function () {
    // dashboard route
    Route::controller(DashboardController::class)->group(function() {
        Route::get('/dashboard', 'index')->name('dashboard');
        Route::post('/dashboard/store-status', 'storeStatus')->name('dashboard.storeStatusRoute');
        Route::get('/dashboard/order', 'order')->name('dashboard.order');
        Route::get('/dashboard/order/{order}', 'showOrder')->name('dashboard.order.show');
        Route::patch('/dashboard/order/change-status/{order}', 'changeOrderStatus')->name('dashboard.order.changeStatus');
    });

    // product routes
    Route::controller(ProductController::class)->group(function() {
        Route::get('/product', 'index')->name('product');
        Route::get('/product/create', 'create')->name('product.create');
        Route::post('/product/store', 'store')->name('product.store');
        Route::get('/product/show/{product}', 'show')->name('product.show');
        Route::get('/product/edit/{product}', 'edit')->name('product.edit');
        Route::put('/product/update/{product_id}', 'update')->name('product.update');
        Route::delete('/product/destroy/{product_id}', 'destroy')->name('product.destroy');
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

    // promo management routes
    Route::controller(PromoController::class)->group(function() {
        Route::get('/store-management/promo', 'index')->name('storeManagement.promo.index');
        Route::post('/store-management/promo', 'store')->name('storeManagement.promo.store');
        Route::put('/store-management/promo/{promo}', 'update')->name('storeManagement.promo.update');
        Route::delete('/store-management/promo/{promo}', 'destroy')->name('storeManagement.promo.destroy');
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

    // order routes
    Route::controller(OrderController::class)->group(function () {
        // user
        Route::get('/order/list', 'list')->name('order.list');
        Route::get('/order/{order_id}', 'index')->name('order');
        Route::post('/order/store/{product_id}', 'dialogStore')->name('order.dialogStore');
        Route::post('/order/payment/{order}/generate', 'generatePayment')->name('order.generatePayment');
        Route::patch('/order/checkout/{order}', 'checkout')->name('order.checkout');
        Route::patch('order/complete/{order}', 'complete')->name('order.complete');
        Route::get('/order/show/{order}', 'show')->name('order.show');
    });

    // cart routes
    Route::controller(CartController::class)->prefix('cart')->group(function () {
        Route::get('/', 'index')->name('cart');
        Route::post('/add', 'store')->name('cart.add');
        Route::patch('/update/{id}', 'update')->name('cart.update');
        Route::delete('/remove/{id}', 'destroy')->name('cart.remove');
        // Route::delete('/clear', 'clear')->name('cart.clear');
        Route::post('/checkout-order', 'checkoutToOrder')->name('cart.checkoutToOrder');
    });

    Route::controller(CatalogController::class)->group(function() {
        Route::post('/catalog/{id}/review', 'storeReview')->name('catalog.storeReview');
        Route::delete('/catalog/{product}/review/{review}', 'deleteReview')->name('catalog.deleteReview');
    });

    // verification routes
    Route::controller(AdditionalVerificationController::class)->group(function() {
        Route::get('/additional/verification', 'index')->name('additionalVerification');
    });
});

Route::get('/community', [CommunityController::class, 'index'])->name('community');

// catalog routes
Route::controller(CatalogController::class)->group(function() {
    Route::get('/catalog', 'index')->name('catalog');
    Route::get('/catalog/{id}', 'show')->name('catalog.show');
});

Route::controller(UmkmController::class)->group(function() {
    Route::get('/umkm', 'index')->name('umkm');
    Route::get('/umkm/detail/{umkm_id}', 'detail')->name('umkm.detail');
    Route::get('/umkm/products/{umkm_id}', 'umkmProducts')->name('umkm.products');
    Route::get('/umkm/navigasi/{umkm_id}', 'navigasi')->name('umkm.navigasi');
    Route::get('/umkm/tracking/{umkm_id?}', 'tracking')->name('umkm.tracking');
    Route::get('/umkm/rute/{umkm_id}', 'rute')->name('umkm.rute');
});

Route::get('/promo/{id}', [PromoController::class, 'show'])->name('promo.show');
Route::get('/umkm/{id}/promo', [UmkmController::class, 'showPromo'])->name('umkm.promo');

Route::controller(ChatbotController::class)->group(function () {
    Route::get('/help', 'index')->name('chatbot');
    Route::post('/help/store', 'message')->name('chatbot.store');
});

// midtrans callback, https needs, use ngrok if local dev
Route::post('/midtrans/callback', [OrderController::class, 'callback']);

require __DIR__.'/settings.php';
require __DIR__.'/api.php';
