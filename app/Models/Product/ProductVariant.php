<?php

namespace App\Models\Product;

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
    public function attributeValue() {
        return $this->belongsToMany(AttributeValue::class, 'variant_attributes', 'variant_id', 'attribute_value_id')
                    ->using(VariantAttribute::class)
                    ->withTimestamps();
    }

    public function variantAttributes() {
        return $this->hasMany(VariantAttribute::class, 'variant_id');
    }
}
