<?php

namespace App\Models\UMKM;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

use App\Models\User;
use App\Models\Promo;
use App\Models\Product\Product;
use App\Models\Review\Review;
use App\Models\Wishlist;
use App\Models\Post\Post;
use App\Models\Order\Order;

use Laravolt\Indonesia\Models\Province;
use Laravolt\Indonesia\Models\City;
use Laravolt\Indonesia\Models\District;
use Laravolt\Indonesia\Models\Village;

class Umkm extends Model
{
    use SoftDeletes;

    protected $table = 'umkms';
    protected $fillable = [
        'user_id',
        'province_id',
        'city_id',
        'district_id',
        'village_id',
        'store_name',
        'description',
        'type',
        'address',
        'phone_number',
        'open_days',
        'open_time',
        'close_time',
        'average_rating',
        'is_order_feature',
        'is_shipping_feature',
        'shipping_cost',
    ];

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

    // from this table
    public function user() {
        return $this->belongsTo(User::class, 'user_id');
    }

    // from other umkm table
    public function umkmData() {
        return $this->hasOne(UmkmData::class);
    }

    public function umkmImages() {
        return $this->hasMany(UmkmImage::class);
    }

    public function umkmLocations() {
        return $this->hasMany(UmkmLocation::class);
    }

    // from other table
    public function promos() {
        return $this->hasMany(Promo::class);
    }

    public function products() {
        return $this->hasMany(Product::class);
    }

    public function reviews() {
        return $this->hasMany(Review::class);
    }

    public function wishlists() {
        return $this->hasMany(Wishlist::class);
    }

    public function wishlistedByUser() {
        return $this->belongsToMany(User::class, 'wishlists', 'umkm_id', 'user_id')
                    ->using(Wishlist::class)
                    ->withTimestamps();
    }

    public function posts() {
        return $this->hasMany(Post::class);
    }

    public function orders() {
        return $this->hasMany(Order::class);
    }
}
