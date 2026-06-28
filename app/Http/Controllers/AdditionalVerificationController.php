<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;

class AdditionalVerificationController extends Controller
{
    public function index() {
        return Inertia::render('settings/verification');
    }
}
