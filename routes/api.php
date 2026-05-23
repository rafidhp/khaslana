<?php

use App\Http\Controllers\Api\LocationController;
use App\Http\Controllers\StoreController;
use Illuminate\Support\Facades\Route;

Route::get('/reverse-geocode', [LocationController::class, 'reverse'])->name('reverseGeocode');
Route::get('/cities/{provinceCode}', [LocationController::class, 'cities'])->name('api.getCities');
Route::get('/districts/{cityCode}', [LocationController::class, 'districts'])->name('api.getDistricts');
Route::get('/villages/{districtCode}', [LocationController::class, 'villages'])->name('api.getVillages');
