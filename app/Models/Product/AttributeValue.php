<?php

namespace App\Models\Product;

use Illuminate\Database\Eloquent\Model;

class AttributeValue extends Model
{
    protected $table = 'attribute_values';
    protected $fillable = [
        'attribute_id',
        'value',
        'additional_price',
    ];

    // from this table
    public function attribute() {
        return $this->belongsTo(Attribute::class, 'attribute_id');
    }

    // from other product table
    public function variants() {
        return $this->belongsToMany(ProductVariant::class, 'variant_attributes', 'attribute_value_id', 'variant_id')
                    ->withTimestamps();
    }

    public function variantAttributes() {
        return $this->hasMany(VariantAttribute::class, 'attribute_value_id');
    }
}
