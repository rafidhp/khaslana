<?php

namespace App\Services;

use Illuminate\Support\Facades\Http;

class GeminiService
{
    public function generate($messages)
    {
        $apiKey = config('services.gemini.key');

        $response = Http::post(
            "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key={$apiKey}",
            [
                "contents" => $messages
            ]
        );

        // debug temporary
        if ($response->failed()) {
            logger('Gemini Error', [
                'status' => $response->status(),
                'body' => $response->body()
            ]);
            return null;
        }

        return data_get(
            $response->json(),
            'candidates.0.content.parts.0.text',
            null
        );
    }
}