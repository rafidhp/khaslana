<?php

namespace App\Models;

use Illuminate\Contracts\Auth\MustVerifyEmail;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Fortify\TwoFactorAuthenticatable;
use App\Notifications\VerifyEmailNotification;

use App\Models\UMKM\Umkm;
use App\Models\Review\Review;
use App\Models\Review\ReviewLike;
use App\Models\Cart\Cart;
use App\Models\Order\Order;
use App\Models\Post\Post;
use App\Models\Post\PostLike;
use App\Models\Post\Comment;
use App\Models\Post\CommentLike;

class User extends Authenticatable implements MustVerifyEmail
{
    /** @use HasFactory<\Database\Factories\UserFactory> */
    use HasFactory, Notifiable, TwoFactorAuthenticatable, SoftDeletes;

    /**
     * The attributes that are mass assignable.
     *
     * @var list<string>
     */
    protected $fillable = [
        'name',
        'username',
        'email',
        'email_verified_at',
        'password',
        'is_umkm',
    ];

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var list<string>
     */
    protected $hidden = [
        'password',
        'two_factor_secret',
        'two_factor_recovery_codes',
        'remember_token',
    ];

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
            'two_factor_confirmed_at' => 'datetime',
        ];
    }

    protected $with = ['profile'];

    public function profile() {
        return $this->hasOne(UserProfile::class, 'user_id', 'id');
    }

    public function umkm() {
        return $this->hasOne(Umkm::class);
    }

    public function reviewLikes() {
        return $this->hasMany(ReviewLike::class);
    }

    public function likedReviews() {
        return $this->belongsToMany(Review::class, 'review_likes', 'review_id', 'user_id')
                    ->using(ReviewLike::class)
                    ->withTimestamps();
    }

    public function wishlists() {
        return $this->hasMany(Wishlist::class);
    }

    public function wishlistedUmkm() {
        return $this->belongsToMany(Umkm::class, 'wihslists', 'umkm_id', 'user_id')
                    ->using(Wishlist::class)
                    ->withTimestamps();
    }

    public function cart() {
        return $this->hasOne(Cart::class);
    }

    public function posts() {
        return $this->hasMany(Post::class);
    }

    public function postLikes() {
        return $this->hasMany(PostLike::class);
    }

    public function comments() {
        return $this->hasMany(Comment::class);
    }

    public function commentLikes() {
        return $this->hasMany(CommentLike::class);
    }

    public function orders() {
        return $this->hasMany(Order::class);
    }

    public function sendEmailVerificationNotification(): void
    {
        $this->notify(new VerifyEmailNotification());
    }
}
