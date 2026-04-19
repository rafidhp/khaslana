<?php

namespace App\Models\UMKM;

use Illuminate\Database\Eloquent\Model;

class UmkmData extends Model
{
    protected $table = 'umkm_datas';
    protected $fillable = [
        'umkm_id',
        'npwp',
        'nib',
        'nik',
        'image_hash',
        'file_path',
    ];

    public function umkm() {
        return $this->belongsTo(Umkm::class, 'umkm_id');
    }
}
