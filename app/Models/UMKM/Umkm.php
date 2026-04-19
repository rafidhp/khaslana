<?php

namespace App\Models\UMKM;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

use App\Models\User;

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

    // from other table
    public function umkmData() {
        return $this->hasOne(UmkmData::class);
    }

    public function umkmImages() {
        return $this->hasMany(UmkmImmage::class);
    }
}
