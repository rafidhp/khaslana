<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;

class CommunityController extends Controller
{
    public function index() {
        return Inertia::render('user/community');
    }
}
