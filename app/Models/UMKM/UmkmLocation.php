<?php

namespace App\Models\UMKM;

use Illuminate\Database\Eloquent\Model;

class UmkmLocation extends Model
{
    public $timestamps = false;
    protected $table = 'umkm_locations';
    protected $fillable = [
        'umkm_id',
        'latitude',
        'longitude',
        'is_active',
        'status',
    ];

    public function umkm() {
        return $this->belongsTo(Umkm::class, 'umkm_id');
    }
}
