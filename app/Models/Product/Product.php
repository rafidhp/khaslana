<?php

namespace App\Models\Product;

use Illuminate\Database\Eloquent\Model;

use App\Models\UMKM\Umkm;
use App\Models\Category;
use App\Models\Promo;
use App\Models\Review\Review;

class Product extends Model
{
    protected $table = 'products';
    protected $fillable = [
        'umkm_id',
        'category_id',
        'promo_id',
        'name',
        'description',
        'is_archived',
    ];

    // from this table
    public function umkm() {
        return $this->belongsTo(Umkm::class, 'umkm_id');
    }

    public function category() {
        return $this->belongsTo(Category::class, 'category_id');
    }

    public function promo() {
        return $this->belongsTo(Promo::class, 'promo_id');
    }

    // from other product table
    public function productImages() {
        return $this->hasMany(ProductImage::class);
    }

    public function productVariants() {
        return $this->hasMany(ProductVariant::class);
    }

    // from other table
    public function reviews() {
        return $this->hasMany(Review::class);
    }
}
