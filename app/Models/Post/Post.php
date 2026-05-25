<?php

namespace App\Models\Post;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

use App\Models\User;
use App\Models\UMKM\Umkm;
use App\Models\Product\Product;

class Post extends Model
{
    use SoftDeletes;

    protected $table = 'posts';
    protected $fillable = [
        'user_id',
        'umkm_id',
        'product_id',
        'content',
        'post_date',
    ];

    // from this table
    public function user() {
        return $this->belongsTo(User::class, 'user_id');
    }

    public function umkm() {
        return $this->belongsTo(Umkm::class, 'umkm_id');
    }

    public function product() {
        return $this->belongsTo(Product::class, 'product_id');
    }

    // from other post table
    public function postImages() {
        return $this->hasMany(PostImage::class);
    }

    public function postLikes() {
        return $this->hasMany(PostLike::class);
    }

    public function comments() {
        return $this->hasMany(Comment::class);
    }
}
