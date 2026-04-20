<?php

namespace App\Models\Review;

use Illuminate\Database\Eloquent\Model;

use App\Models\User;

class ReviewLike extends Model
{
    protected $table = 'review_likes';
    protected $fillable = [
        'review_id',
        'user_id',
    ];

    public function review() {
        return $this->belongsTo(Review::class, 'review_id');
    }

    public function user() {
        return $this->belongsTo(User::class, 'user_id');
    }
}
