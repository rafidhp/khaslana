<?php

namespace App\Models\Review;

use Illuminate\Database\Eloquent\Model;

use App\Models\UMKM\Umkm;
use App\Models\Product\Product;
use App\Models\User;

class Review extends Model
{
    protected $table = 'reviews';
    protected $fillable = [
        'umkm_id',
        'product_id',
        'rating',
        'comment',
    ];

    public function umkm() {
        return $this->belongsTo(Umkm::class, 'umkm_id');
    }

    public function product() {
        return $this->belongsTo(Product::class, 'product_id');
    }

    public function reviewLikes() {
        return $this->hasMany(ReviewLike::class);
    }

    public function likedByUser() {
        return $this->belongsToMany(User::class, 'review_likes', 'review_id', 'user_id')
                    ->using(ReviewLike::class)
                    ->withTimestamps();
    }
}
