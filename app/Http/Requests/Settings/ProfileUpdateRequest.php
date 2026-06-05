<?php

namespace App\Http\Requests\Settings;

use App\Concerns\ProfileValidationRules;
use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;

class ProfileUpdateRequest extends FormRequest
{
    use ProfileValidationRules;

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return array_merge(
            $this->profileRules($this->user()->id),
            [
                'latitude' => ['nullable', 'numeric'],
                'longitude' => ['nullable', 'numeric'],

                'province_id' => ['nullable', 'string'],
                'city_id' => ['nullable', 'string'],
                'district_id' => ['nullable', 'string'],
                'village_id' => ['nullable', 'string'],

                'address' => ['nullable', 'string'],
            ]
        );
    }

    public function messages(): array
    {
        return [
            'name.required' => 'Nama wajib diisi.',
            'name.max' => 'Nama maksimal 255 karakter.',

            'username.required' => 'Username wajib diisi.',
            'username.max' => 'Username maksimal 255 karakter.',
            'username.unique' => 'Username sudah digunakan.',
            'username.regex' => 'Format username tidak valid. Hanya boleh menggunaan underscore ( _ ) tidak boleh menggunakan symbol lain ataupun spasi',

            'email.required' => 'Email wajib diisi.',
            'email.email' => 'Format email tidak valid.',
            'email.unique' => 'Email sudah digunakan.',

            'profile_photo.image' => 'File harus berupa gambar.',
            'profile_photo.mimes' => 'Foto profil harus berformat JPG, JPEG, atau PNG.',
            'profile_photo.max' => 'Ukuran foto profil maksimal 2MB.',

            'province_id.string' => 'Provinsi tidak valid.',
            'city_id.string' => 'Kota/Kabupaten tidak valid.',
            'district_id.string' => 'Kecamatan tidak valid.',
            'village_id.string' => 'Kelurahan tidak valid.',

            'latitude.numeric' => 'Latitude tidak valid.',
            'longitude.numeric' => 'Longitude tidak valid.',

            'address.string' => 'Alamat tidak valid.',
        ];
    }
}
