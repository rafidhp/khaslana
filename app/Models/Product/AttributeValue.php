<?php

namespace App\Models\Product;

use Illuminate\Database\Eloquent\Model;

class AttributeValue extends Model
{
    protected $table = 'attribute_values';
    protected $fillable = [
        'attribute_id',
        'value',
    ];

    // from this table
    public function attribute() {
        return $this->belongsTo(Attribute::class, 'attribute_id');
    }

    // from other product table
    public function variant() {
        return $this->belongsToMany(ProductVariant::class, 'variant_attributes', 'variant_id', 'attribute_value_id')
                    ->using(VariantAttribute::class)
                    ->withTimestamps();
    }

    public function variantAttributes() {
        return $this->hasMany(VariantAttribute::class, 'attribute_value_id');
    }
}
