<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class StoreRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            // umkms
            'store_name' => ['required', 'string', 'max:255'],
            'description' => ['required', 'string'],
            'type' => ['required', 'in:TETAP,KELILING'],
            'status' => ['required', 'in:BUKA,TUTUP'],
            'address' => ['required', 'string'],

            'phone_number' => [
                'required',
                'string',
                'max:15',
            ],

            'province_id' => [
                'required',
                'exists:indonesia_provinces,code',
            ],

            'city_id' => [
                'required',
                'exists:indonesia_cities,code',
            ],

            'district_id' => [
                'required',
                'exists:indonesia_districts,code',
            ],

            'village_id' => [
                'required',
                'exists:indonesia_villages,code',
            ],

            'open_days' => ['nullable', 'string'],
            'open_time' => ['nullable'],
            'close_time' => ['nullable'],

            'is_order_feature' => ['required', 'boolean'],
            'is_shipping_feature' => ['required', 'boolean'],

            'shipping_cost' => [
                'nullable',
                'numeric',
                'min:0',
            ],

            // umkm_datas
            'npwp' => [
                'nullable',
                'string',
                'size:16',
            ],

            'nib' => [
                'nullable',
                'string',
                'size:13',
            ],

            'nik' => [
                'nullable',
                'string',
                'size:16',
                'unique:umkm_datas,nik',
            ],

            'file_path' => [
                'nullable',
                'file',
                'mimes:jpg,jpeg,png,pdf',
                'max:5120',
            ],

            // umkm_images
            'images' => [
                Rule::requiredIf(
                    !$this->existing_images ||
                    count($this->existing_images) === 0
                ),
                'array',
            ],
            
            'images.*' => [
                'image',
                'mimes:jpg,jpeg,png',
                'max:10240',
            ],

            // umkm_locations
            'latitude' => [
                'nullable',
                'numeric',
            ],

            'longitude' => [
                'nullable',
                'numeric',
            ],
        ];
    }

    public function messages(): array {
        return [
            'store_name.required' => 'Nama toko wajib diisi.',
            'type.in' => 'Tipe UMKM tidak valid.',
            'status.in' => 'Status UMKM tidak valid.',
            'nik.unique' => 'NIK sudah digunakan.',
            'province_id.exists' => 'Provinsi tidak valid.',
            'city_id.exists' => 'Kota tidak valid.',
            'district_id.exists' => 'Kecamatan tidak valid.',
            'village_id.exists' => 'Desa tidak valid.',
        ];
    }
}
