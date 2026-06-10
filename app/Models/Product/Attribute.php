<?php

namespace App\Models\Product;

use Illuminate\Database\Eloquent\Model;

class Attribute extends Model
{
    protected $table = 'attributes';
    protected $fillable = [
        'product_id',
        'name',
    ];

    public function attributeValues() {
        return $this->hasMany(AttributeValue::class);
    }
}
