<?php

namespace App\Models\UMKM;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

use App\Models\User;
use App\Models\Promo;
use App\Models\Product\Product;
use App\Models\Review\Review;

class Umkm extends Model
{
    use SoftDeletes;

    protected $table = 'ummkms';
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

    // from this table
    public function user() {
        return $this->belongsTo(User::class, 'user_id');
    }

    // from other umkm table
    public function umkmData() {
        return $this->hasOne(UmkmData::class);
    }

    public function umkmImages() {
        return $this->hasMany(UmkmImmage::class);
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
}
