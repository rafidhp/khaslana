<?php

namespace App\Models\UMKM;

use Illuminate\Database\Eloquent\Model;

class UmkmImmage extends Model
{
    protected $table = 'umkm_images';
    protected $fillable = [
        'umkm_id',
        'image',
    ];

    public function umkm() {
        return $this->belongsTo(Umkm::class, 'umkm_id');
    }
}
