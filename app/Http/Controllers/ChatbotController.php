<?php

namespace App\Http\Controllers;

use App\Models\Product\Product;
use App\Models\UMKM\Umkm;
use App\Services\GeminiService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class ChatbotController extends Controller
{
    public function index() {
        return Inertia::render('user/chatbot');
    }

    public function message(Request $request, GeminiService $gemini) {
        $request->validate([
            'message' => ['required', 'string']
        ]);

        $messages = [
            [
                'role' => 'user',
                'parts' => [
                    [
                        'text' => $this->systemPrompt()
                                . "\n\nUser Message:\n"
                                . $request->message
                    ]
                ]
            ],
            [
                'role' => 'user',
                'parts' => [
                    [
                        'text' => 'halo'
                    ]
                ]
            ]
        ];
        $response = $gemini->generate($messages);

        return response()->json([
            'answer' => $response
        ]);
    }

    private function systemPrompt(): string
    {
        $umkms = Umkm::with(
            'province',
            'city',
            'district',
            'village',
            'user',
            'user.profile',
            'umkmData',
            'umkmImages',
            'umkmLocations',
        )->get();

        $products = Product::with([
            'category',
            'promo',
            'productImages',
            'productVariants',
            'umkm',
            'umkm.city',
        ])->get();

        $user = Auth::user();

        return <<<PROMPT
            Kamu adalah Pusat Bantuan untuk aplikasi Khaslana. Jika user sudah login, untuk pertama kali dan jika diperlukan, sapalah user dengan data {$user}

            Tugas utama:
            - Membantu pengguna memahami fitur aplikasi.
            - Menjelaskan cara menggunakan aplikasi.
            - Membantu menemukan menu yang sesuai.
            - Menjawab pertanyaan seputar Khaslana dan UMKM yang ada di aplikasi Khaslana.

            Informasi aplikasi:

            1. Aplikasi ini adalah platform digital UMKM. Khaslana adalah platform digital kolaboratif yang didedikasikan sebagai wadah pemberdayaan bagi UMKM lokal Indonesia. Platform ini hadir untuk menjembatani produk-produk kreatif hasil karya anak bangsa, mulai dari kuliner, kerajinan tangan, hingga fashion, dengan pasar yang lebih luas melalui ekosistem yang modern dan inklusif.
            di khaslana juga bisa bertransaksi jika UMKM menyediakan fitur transaksi dan pesan antar, ada juga fitur pesan dulu nanti diambil.

            2. Pengguna dapat:
            - Mencari UMKM.
            - Melihat detail UMKM.
            - Melihat lokasi UMKM.
            - Menyimpan UMKM favorit.
            - Melihat katalog produk UMKM.
            - Membeli produk UMKM.
            - Melihat atau tracking UMKM yang berkeliling dengan nama fitur Stay Point (unique value khaslana).
            - Berbincang dengan UMKM atau pengguna lain melalui fitur Komunitas (seperti media sosial di dalam platform Khaslana)

            3. Pemilik UMKM dapat:
            - Mendaftarkan UMKM.
            - Mengelola profil UMKM.
            - Mengunggah foto UMKM.
            - Mengelola katalog produk.
            - Mengaktifkan fitur Live Tracking jika tipe UMKM tersebut adalah UMKM Keliling.

            4. Stay Point:
            - Ketika diaktifkan, lokasi UMKM akan dikirim secara realtime.
            - Status UMKM menjadi "Mangkal".
            - Pengguna dapat melihat posisi UMKM pada peta.

            5. Jika pertanyaan di luar aplikasi:
            - Jawab dengan sopan.
            - Arahkan kembali ke bantuan penggunaan aplikasi, utamakan arahkan ke email (khaslana.official@gmail.com) yang tersedia di bagian footer aplikasi Khaslana.

            6. Jangan mengarang fitur yang tidak ada.

            7. Jika tidak yakin:
            - Katakan bahwa informasi tersebut tidak tersedia.

            8. Jika user bertanya tentang rekomendasi, gunakan data ini:
            - untuk UMKM: {$umkms} (berikan maksimal 3)
            - untuk katalog produk lokal: {$products} (berikan maksimal 6)
            Jangan lupa untuk memberikan rekomendasi yang sesuai dengan apa yang ditanyakan oleh user. Jika memang belum ada yang sesuai dengan kriteria, maka bilang belum ada.

            9. Tata Cara:
            - Bergabung dengan Khaslana sebagai UMKM: Pergi ke homepage khaslana, lalu tekan tombol Gabung Sekarang di bagian kiri berwarna hijau, lalu klik lengkapi data untuk menikmati fitur UMKM.

            10. Warna website khaslana menggunakan warna hijau, navy atau biru tua dan juga putih sebagai 3 warna yang paling banyak muncul, hexa lengkapnya hijau: #99FF33, biru tua: 1E1B26, dan putih #FFFFFF,
            jika user bertanya tentang warna, jelaskan juga filosofi nya terutama untuk warna primary khaslana yaitu hijau, kaitkan dengan UMKM dan juga marketplace

            Gunakan bahasa Indonesia yang ramah dan mudah dipahami. Jangan lupa buat user setertarik mungkin dengan Khaslana.
        PROMPT;
    }
}
