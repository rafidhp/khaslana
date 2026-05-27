<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;
use App\Models\Post\Post;
use Illuminate\Support\Facades\Storage;
use Exception;

class CommunityController extends Controller
{
    public function index() {
        $currentUserId = Auth::id();

        $posts = Post::with(['user', 'postImages', 'postLikes', 'comments.user'])
            ->latest()
            ->get()
            ->map(function ($post) use ($currentUserId) {
                $post->is_liked = $post->postLikes->contains('user_id', $currentUserId);
                return $post;
            });

        return Inertia::render('user/community/index', [
            'posts' => $posts,
        ]);
    }

    public function show(Post $post) {
        $post->loadMissing([
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
        return Inertia::render('user/community/create-post/index');
    }

    public function store(Request $request) {
        $request->validate([
            'content'       => 'required',
            'umkm_id'       => 'nullable|exists:umkms,id',
            'product_id'    => 'nullable|exists:products,id',
            'images'        => 'nullable|array',
            'images.*'      => 'image|mimes:jpeg,png,jpg,webp|max:2048',
        ]);

        DB::beginTransaction();

        try {
            $post = Post::create([
                'user_id'       => Auth::id(),
                'umkm_id'       => $request->umkm_id,
                'product_id'    => $request->product_id,
                'content'       => $request->content,
                'post_date'     => now(),
            ]);

            if ($request->hasFile('images')) {
                foreach ($request->file('images') as $imageFile) {
                    if ($imageFile->isValid()) {
                        $path = $imageFile->store('posts/images', 'public');

                        $post->postImages()->create([
                            'image' => $path,
                        ]);
                    }
                }
            }

            DB::commit();

            return redirect()->route('community')->with('message', 'Post berhasil dibagikan!');
        } catch (Exception $e) {
            DB::rollBack();

            return redirect()->back()->withErrors(['error' => 'Gagal membuat postingan: ' . $e->getMessage()]);
        }
    }

    public function toggleLike(Post $post) {
        $userId = Auth::id();

        $existingLike = $post->postLikes()->where('user_id', $userId)->first();

        if ($existingLike) {
            $existingLike->delete();
        } else {
            $post->postLikes()->create([
                'user_id' => $userId
            ]);
        }

        return redirect()->back();
    }

    public function destroy(Post $post) {
        if ($post->user_id !== Auth::id()) {
            return redirect()->back()->withErrors('error', 'Tidak ada akses untuk hapus postingan ini!');
        }

        try {
            $images = $post->postImages;

            foreach ($images as $img) {
                if (Storage::disk('public')->exists($img->image)) {
                    Storage::disk('public')->delete($img->image);
                }
            }

            $post->delete();

            return redirect()->route('community')->with('message', 'Postingan berhasil dihapus!');
        } catch (Exception $e) {
            return redirect()->back()->withErrors(['error' => 'Gagal menghapus postingan: ' . $e->getMessage()]);
        }
    }
}
