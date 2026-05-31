<?php

namespace App\Models\Product;

use App\Models\Cart\CartItem;
use App\Models\Order\OrderItem;
use Illuminate\Database\Eloquent\Model;

class ProductVariant extends Model
{
    protected $table = 'product_variants';
    protected $fillable = [
        'product_id',
        'price',
        'stock',
    ];

    // from this table
    public function product() {
        return $this->belongsTo(Product::class, 'product_id');
    }

    // from other product table
    public function attributeValues() {
        return $this->belongsToMany(AttributeValue::class, 'variant_attributes', 'variant_id', 'attribute_value_id')
                    ->withTimestamps();
    }

    public function variantAttributes() {
        return $this->hasMany(VariantAttribute::class, 'variant_id');
    }

    // from other table
    public function cartItems() {
        return $this->hasMany(CartItem::class, 'variant_id');
    }

    public function orderItems() {
        return $this->hasMany(OrderItem::class, 'variant_id');
    }
}
