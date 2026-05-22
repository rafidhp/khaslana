<?php

use App\Http\Controllers\Api\LocationController;
use App\Http\Controllers\StoreController;
use Illuminate\Support\Facades\Route;

Route::get('/reverse-geocode', [LocationController::class, 'reverse'])->name('reverseGeocode');
Route::get('/cities/{provinceCode}', [StoreController::class, 'cities'])->name('api.getCities');
Route::get('/districts/{cityCode}', [StoreController::class, 'districts'])->name('api.getDistricts');
Route::get('/villages/{districtCode}', [StoreController::class, 'villages'])->name('api.getVillages');
