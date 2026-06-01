<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Laravolt\Indonesia\Models\Province;
use Laravolt\Indonesia\Models\City;
use Laravolt\Indonesia\Models\District;
use Laravolt\Indonesia\Models\Village;

class UserLocation extends Model
{
    protected $table = 'user_locations';
    protected $fillable = [
        'user_id',
        'latitude',
        'longitude',
        'province_id',
        'city_id',
        'district_id',
        'village_id',
        'address',
    ];

    public function user() {
        return $this->belongsTo(User::class, 'user_id');
    }

    // laravolt relations
    public function province() {
        return $this->belongsTo(
            Province::class,
            'province_id',
            'code'
        );
    }

    public function city() {
        return $this->belongsTo(
            City::class,
            'city_id',
            'code'
        );
    }

    public function district() {
        return $this->belongsTo(
            District::class,
            'district_id',
            'code'
        );
    }

    public function village() {
        return $this->belongsTo(
            Village::class,
            'village_id',
            'code'
        );
    }
}
