<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Models\Post\Post;

class CommunityController extends Controller
{
    public function index() {
        $posts = Post::with(['user', 'postImages', 'postLikes'])
            ->latest()
            ->paginate(10);

        return Inertia::render('user/community/index', [
            'posts' => $posts,
        ]);
    }

    public function show(Post $post) {
        $post->load([
            'user',
            'postImages',
            'postLikes',
            'comments.user',
        ]);

        return Inertia::render('user/community/show', [
            'post' => $post,
        ]);
    }

    public function create() {
        return inertia('user/community/create');
    }

    public function store(Request $request) {
        $request->validate([

        ]);
    }
}
