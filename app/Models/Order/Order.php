<?php

namespace App\Models\Order;

use Illuminate\Database\Eloquent\Model;

use App\Models\User;
use App\Models\UMKM\Umkm;

class Order extends Model
{
    protected $table = 'orders';
    protected $fillable = [
        'user_id',
        'umkm_id',
        'invoice_number',
        'type',
        'total_price',
        'status',
        'payment_status',
        'address',
        'notes',
        'shipping_cost',
        'shipping_courier',
        'shipping_service',
        'paid_at',
        'tracking_number',
        'shipped_at',
        'completed_at',
    ];

    public function user() {
        return $this->belongsTo(User::class, 'user_id');
    }

    public function umkm() {
        return $this->belongsTo(Umkm::class, 'umkm_id');
    }

    public function orderItems() {
        return $this->hasMany(OrderItem::class);
    }

    public function payment() {
        return $this->hasOne(Payment::class);
    }
}
