<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

use App\Models\UMKM\Umkm;
use App\Models\Product\Product;

class Promo extends Model
{
    protected $table = 'promos';
    protected $fillable = [
        'umkm_id',
        'name',
        'type',
        'description',
        'image',
        'start_date',
        'end_date',
        'status',
        'discount_percent',
    ];

    // from this table
    public function umkm() {
        return $this->belongsTo(Umkm::class, 'umkm_id');
    }

    // from other table
    public function products() {
        return $this->hasMany(Product::class, 'promo_id');
    }
}
