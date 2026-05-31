<?php

namespace App\Models\Product;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\Pivot;

class VariantAttribute extends Pivot
{
    protected $table = 'variant_attributes';
    protected $fillable = [
        'variant_id',
        'attribute_value_id',
    ];

    public function variant() {
        return $this->belongsTo(ProductVariant::class, 'variant_id');
    }

    public function attributeValue() {
        return $this->belongsTo(AttributeValue::class, 'attribute_value_id');
    }
}
